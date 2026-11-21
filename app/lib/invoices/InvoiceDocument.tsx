
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

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
    marginBottom: 28,
  },
  brand: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 3,
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
    marginBottom: 20,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  section: {
    width: "48%",
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  strongText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#0f172a",
  },
  normalText: {
    fontSize: 8,
    color: "#475569",
    marginBottom: 3,
    lineHeight: 1.5,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  table: {
    marginTop: 8,
    marginBottom: 22,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
  },
  productRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    alignItems: "flex-start",
  },
  productName: {
    width: "48%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  sacColumn: {
    width: "20%",
    fontSize: 8,
    color: "#475569",
    textAlign: "center",
  },
  productPrice: {
    width: "32%",
    fontSize: 9,
    textAlign: "right",
    color: "#0f172a",
  },
  totals: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 210,
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
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 7,
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

function formatCurrency(
  amount: number,
  currency: string
): string {
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
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}

export default function InvoiceDocument({
  invoice,
}: InvoiceDocumentProps) {
  const currency = invoice.payment.currency;

  // Final amount is the amount actually paid.
  const total = formatCurrency(
    invoice.payment.amount,
    currency
  );

  const taxAmount = invoice.tax.taxAmount ?? 0;

  // Checkout already includes applicable tax in the final amount.
  const subtotal =
    invoice.tax.subtotal ??
    Math.round((invoice.payment.amount - taxAmount) * 100) / 100;

  const formattedSubtotal = formatCurrency(subtotal, currency);

  // Support both new multi-item and old single-product invoices.
  const items =
    invoice.items && invoice.items.length > 0
      ? invoice.items
      : [
          {
            title: invoice.product.title,
            slug: invoice.product.slug,
            price: subtotal,
          },
        ];

  const subject = items.map((item) => item.title).join(", ");

  return (
    <Document
      title={`Invoice ${invoice.invoiceNumber}`}
      author={invoice.seller.name}
      subject={`Purchase invoice for ${subject}`}
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Invoice heading */}
        <View style={styles.header}>
          <View style={{ width: "62%" }}>
            <Text style={styles.brand}>
              {invoice.seller.name}
            </Text>

            <Text style={styles.subtitle}>
              Ready-made Software & Web Applications
            </Text>

            <Text style={styles.subtitle}>
              {invoice.seller.website}
            </Text>
          </View>

          <View style={{ width: "38%" }}>
            <Text style={styles.invoiceHeading}>
              INVOICE
            </Text>

            <Text style={styles.invoiceNumber}>
              {invoice.invoiceNumber}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Seller and customer details */}
        <View style={styles.sectionRow}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              SELLER DETAILS
            </Text>

            <Text style={styles.strongText}>
              {invoice.seller.legalName ||
                invoice.seller.managedBy}
            </Text>

            <Text style={styles.normalText}>
              Trade Name: {invoice.seller.name}
            </Text>

            {invoice.seller.gstin ? (
              <Text style={styles.normalText}>
                GSTIN: {invoice.seller.gstin}
              </Text>
            ) : null}

            {invoice.seller.registeredAddress ? (
              <Text style={styles.normalText}>
                Registered Address: {invoice.seller.registeredAddress}
              </Text>
            ) : null}

            <Text style={styles.normalText}>
              Website: {invoice.seller.website}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              BILL TO
            </Text>

            <Text style={styles.strongText}>
              {invoice.customer.name}
            </Text>

            <Text style={styles.normalText}>
              {invoice.customer.email}
            </Text>

            {invoice.customer.billingAddress ? (
              <Text style={styles.normalText}>
                {invoice.customer.billingAddress}
              </Text>
            ) : null}

            {invoice.customer.country ? (
              <Text style={styles.normalText}>
                Country: {invoice.customer.country}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Invoice and payment dates */}
        <View style={styles.sectionRow}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              INVOICE DATE
            </Text>

            <Text style={styles.normalText}>
              {formatDate(
                invoice.generatedAt ?? invoice.createdAt
              )}
            </Text>

            <Text style={styles.normalText}>
              SAC Code: {invoice.seller.sacCode || "998434"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              PAYMENT DETAILS
            </Text>

            <Text style={styles.normalText}>
              Payment Date: {formatDate(invoice.payment.paidAt)}
            </Text>

            <Text style={styles.normalText}>
              Currency: {currency.toUpperCase()}
            </Text>

            {invoice.payment.transactionId ? (
              <Text style={styles.normalText}>
                Transaction Reference: {invoice.payment.transactionId}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Supply and tax classification */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.sectionLabel}>
            SUPPLY DETAILS
          </Text>

          <Text style={styles.normalText}>
            Supply Type:{" "}
            {invoice.tax.treatment === "domestic"
              ? "Domestic"
              : invoice.tax.treatment === "international"
                ? "International"
                : "As recorded"}
          </Text>

          {invoice.tax.country ? (
            <Text style={styles.normalText}>
              Destination Country: {invoice.tax.country}
            </Text>
          ) : null}
        </View>

        {/* Purchased products */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { width: "48%" }]}>
              DESCRIPTION
            </Text>

            <Text style={[styles.tableHeaderText, { width: "20%", textAlign: "center" }]}>
              SAC
            </Text>

            <Text style={[styles.tableHeaderText, { width: "32%", textAlign: "right" }]}>
              AMOUNT
            </Text>
          </View>

          {items.map((item, index) => (
            <View style={styles.productRow} key={`${item.slug}-${index}`}>
              <Text style={styles.productName}>
                {item.title}
              </Text>

              <Text style={styles.sacColumn}>
                {invoice.seller.sacCode || "998434"}
              </Text>

              <Text style={styles.productPrice}>
                {formatCurrency(item.price, currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Tax and payment totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Subtotal
            </Text>

            <Text style={styles.totalValue}>
              {formattedSubtotal}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {invoice.tax.taxName || "GST / Tax"}
              {invoice.tax.taxRate !== undefined
                ? ` (${invoice.tax.taxRate}%)`
                : ""}
            </Text>

            <Text style={styles.totalValue}>
              {formatCurrency(taxAmount, currency)}
            </Text>
          </View>

          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>
              Total Paid
            </Text>

            <Text style={styles.grandTotalValue}>
              {total}
            </Text>
          </View>
        </View>

        <Text style={styles.paymentBadge}>
          PAYMENT RECEIVED
        </Text>

        {/* Footer */}
        <View style={styles.footer} wrap={false}>
          <Text style={styles.footerText}>
            Thank you for choosing {invoice.seller.name}.
          </Text>

          <Text style={styles.footerText}>
            {invoice.seller.name} is managed by{" "}
            {invoice.seller.managedBy}.
          </Text>

          <Text style={styles.footerText}>
            This document records the payment and purchase details
            associated with this invoice.
          </Text>

          {invoice.tax.lutApplied ? (
            <Text style={styles.lutFooterText}>
              {LUT_FOOTER_TEXT}
            </Text>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
