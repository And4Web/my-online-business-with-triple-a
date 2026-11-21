import InvoiceSequence from "@/app/lib/models/InvoiceSequence";

function getIndianFinancialYear(date: Date) {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);

  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;

  return {
    financialYear: `${startYear}-${String(endYear).slice(-2)}`,
    shortFinancialYear: `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`,
  };
}

export async function createInvoiceNumber(): Promise<string> {
  const { financialYear, shortFinancialYear } = getIndianFinancialYear(
    new Date(),
  );

  let sequence;

  try {
    sequence = await InvoiceSequence.findOneAndUpdate(
      { financialYear },
      { $inc: { lastNumber: 1 } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  } catch (error) {
    // Handle simultaneous first-time creation of this financial-year counter.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      sequence = await InvoiceSequence.findOneAndUpdate(
        { financialYear },
        { $inc: { lastNumber: 1 } },
        { new: true },
      );
    } else {
      throw error;
    }
  }

  if (!sequence) {
    throw new Error("Unable to allocate an invoice number.");
  }

  const serialNumber = String(sequence.lastNumber).padStart(4, "0");

  if (sequence.lastNumber > 9999) {
    throw new Error(
      `Invoice sequence limit reached for financial year ${financialYear}.`,
    );
  }

  const invoiceNumber = `INV/${shortFinancialYear}/${serialNumber}`;

  if (invoiceNumber.length > 16) {
    throw new Error("Invoice number exceeds the GST 16-character limit.");
  }

  return invoiceNumber;
}
