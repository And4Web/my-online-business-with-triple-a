import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import type { IInvoice } from "../models/Invoice";
import { LUT_FOOTER_TEXT } from "./lut-config";

type InvoiceDocumentProps = {
  invoice: IInvoice;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 46,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  brand: {
    fontSize: 23,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 9,
    color: "#64748b",
  },
  invoiceHeading: {
    fontSize: 25,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 9,
    color: "#64748b",
    textAlign: "right",
    marginTop: 6,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 22,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  section: {
    width: "48%",
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    marginBottom: 9,
    letterSpacing: 0.5,
  },
  strongText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    color: "#0f172a",
  },
  normalText: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 4,
    lineHeight: 1.5,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  detailsLabel: {
    fontSize: 9,
    color: "#64748b",
  },
  detailsValue: {
    fontSize: 9,
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
  table: {
    marginTop: 12,
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 3,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
  },
  productRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  productName: {
    width: "65%",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  productPrice: {
    width: "35%",
    fontSize: 10,
    textAlign: "right",
    color: "#0f172a",
  },
  totals: {
    alignItems: "flex-end",
    marginTop: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 190,
    marginBottom: 9,
  },
  totalLabel: {
    fontSize: 9,
    color: "#64748b",
  },
  totalValue: {
    fontSize: 9,
    color: "#0f172a",
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingTop: 11,
    marginTop: 3,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  paymentBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    color: "#166534",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 3,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginTop: 18,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 8,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 5,
    lineHeight: 1.5,
  },
  lutFooterText: {
    fontSize: 7,
    color: "#475569",
    textAlign: "center",
    marginBottom: 7,
    lineHeight: 1.5,
  },
});

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function InvoiceDocument({ invoice }: InvoiceDocumentProps) {
  const amount = formatCurrency(
    invoice.payment.amount,
    invoice.payment.currency,
  );

  const total = formatCurrency(
    invoice.tax.totalAmount,
    invoice.payment.currency,
  );

  return (
    <Document
      title={`Invoice ${invoice.invoiceNumber}`}
      author={invoice.seller.name}
      subject={`Purchase invoice for ${invoice.product.title}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Invoice heading */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>{invoice.seller.name}</Text>

            <Text style={styles.subtitle}>
              Ready-made Software & Web Applications
            </Text>

            <Text style={styles.subtitle}>{invoice.seller.website}</Text>
          </View>

          <View>
            <Text style={styles.invoiceHeading}>INVOICE</Text>

            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Seller and customer details */}
        <View style={styles.sectionRow}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SELLER</Text>

            <Text style={styles.strongText}>{invoice.seller.name}</Text>

            <Text style={styles.normalText}>{invoice.seller.website}</Text>

            <Text style={styles.normalText}>
              Managed by {invoice.seller.managedBy}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>BILL TO</Text>

            <Text style={styles.strongText}>{invoice.customer.name}</Text>

            <Text style={styles.normalText}>{invoice.customer.email}</Text>

            {invoice.customer.billingAddress ? (
              <Text style={styles.normalText}>
                {invoice.customer.billingAddress}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Invoice dates and payment reference */}
        <View style={styles.sectionRow}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>INVOICE DATE</Text>

            <Text style={styles.normalText}>
              {formatDate(invoice.generatedAt ?? invoice.createdAt)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PAYMENT DATE</Text>

            <Text style={styles.normalText}>
              {formatDate(invoice.payment.paidAt)}
            </Text>

            {invoice.payment.transactionId ? (
              <Text style={styles.normalText}>
                Reference: {invoice.payment.transactionId}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Purchased product */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>DESCRIPTION</Text>

            <Text
              style={[
                styles.tableHeaderText,
                { width: "35%", textAlign: "right" },
              ]}
            >
              AMOUNT
            </Text>
          </View>

          <View style={styles.productRow}>
            <Text style={styles.productName}>{invoice.product.title}</Text>

            <Text style={styles.productPrice}>{amount}</Text>
          </View>
        </View>

        {/* Payment totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>

            <Text style={styles.totalValue}>{amount}</Text>
          </View>

          {invoice.tax.applicable ? (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {invoice.tax.taxName || "Tax"}
                {invoice.tax.taxRate !== undefined
                  ? ` (${invoice.tax.taxRate}%)`
                  : ""}
              </Text>

              <Text style={styles.totalValue}>
                {formatCurrency(
                  invoice.tax.taxAmount ?? 0,
                  invoice.payment.currency,
                )}
              </Text>
            </View>
          ) : null}

          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Total Paid</Text>

            <Text style={styles.grandTotalValue}>{total}</Text>
          </View>
        </View>

        <Text style={styles.paymentBadge}>PAYMENT RECEIVED</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing {invoice.seller.name}.
          </Text>

          <Text style={styles.footerText}>
            {invoice.seller.name} is managed by {invoice.seller.managedBy}.
          </Text>

          <Text style={styles.footerText}>
            This document records the payment and purchase details associated
            with this invoice.
          </Text>

          <Text style={styles.lutFooterText}>{LUT_FOOTER_TEXT}</Text>
        </View>
      </Page>
    </Document>
  );
}
