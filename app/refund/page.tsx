
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Nexora",
  description:
    "Read the refund, cancellation, and digital product support policy for Nexora, operated by Divine flame IT Solutions.",
};

const lastUpdated = "November 11, 2026";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Legal Information
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Refund &amp; Cancellation Policy
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            This policy explains how refund requests, order
            cancellations, payment issues, and digital product
            delivery concerns are handled by Nexora.
          </p>

          <p className="mt-4 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl space-y-12">

          <div>
            <h2 className="text-2xl font-semibold">
              1. About This Policy
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Nexora is a digital marketplace operated by Divine flame
              IT Solutions. We offer ready-made software projects and
              related digital products that customers can purchase
              and access electronically.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              This policy applies to purchases made through the
              Nexora website. It should be read together with our
              Terms &amp; Conditions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              2. Nature of Our Digital Products
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Nexora primarily offers downloadable digital products,
              including software project source-code packages.
              These products are supplied electronically rather
              than through physical shipment.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Product descriptions, listed features, supported
              technologies, and stated requirements should be
              reviewed before placing an order.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Where a product includes specific technical
              requirements or limitations, those details should
              be considered when evaluating whether the product
              is suitable for your intended use.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              3. When You May Request a Refund
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Customers may contact us to request a refund review
              in circumstances such as:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6 leading-8 text-gray-600">
              <li>
                A duplicate payment was successfully charged for
                the same purchase.
              </li>

              <li>
                A payment was debited but the order was not
                successfully created or confirmed.
              </li>

              <li>
                The purchased digital product was not delivered
                or cannot be accessed because of a verified
                technical problem on our side.
              </li>

              <li>
                The delivered product materially differs from
                its description or stated specifications.
              </li>

              <li>
                The product contains a verified defect that
                prevents it from functioning substantially as
                described and cannot reasonably be resolved
                through support.
              </li>

              <li>
                A refund is otherwise required under applicable
                consumer protection laws.
              </li>
            </ul>

            <p className="mt-4 leading-8 text-gray-600">
              Each request will be reviewed according to the
              circumstances, available evidence, product
              description, and applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              4. Digital Product Delivery Issues
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              If your order is marked as paid but the download
              is unavailable, the download link does not work,
              or the delivered file appears incomplete or
              corrupted, please contact our support team.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              We will investigate the issue and, where appropriate,
              attempt to restore access, provide a corrected file,
              or offer another suitable resolution.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              If the problem cannot reasonably be resolved,
              a refund may be considered in accordance with
              applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              5. Order Cancellation
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              If you wish to cancel an order, please contact us
              as soon as possible and provide your order details.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Cancellation requests will be reviewed based on
              the order status, whether digital delivery or
              access has already been provided, and applicable
              consumer protection requirements.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              We will not use this policy to exclude cancellation
              or refund rights that consumers have under applicable
              law. We will also not impose cancellation charges
              contrary to applicable legal requirements.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              6. Situations Requiring Individual Review
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Some requests may require additional investigation.
              For example:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6 leading-8 text-gray-600">
              <li>
                The customer purchased a product but has difficulty
                installing or configuring it.
              </li>

              <li>
                The customer&apos;s development environment does not
                meet the product&apos;s stated technical requirements.
              </li>

              <li>
                The product is being used in a way that differs
                from its documented purpose or specifications.
              </li>

              <li>
                The customer changes their mind after purchase
                or requests a refund for reasons unrelated to
                a product or delivery issue.
              </li>
            </ul>

            <p className="mt-4 leading-8 text-gray-600">
              These circumstances do not automatically determine
              whether a refund will be accepted or rejected.
              Requests will be assessed individually, taking
              account of the facts and applicable consumer rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              7. How to Submit a Refund Request
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              To request a refund or report a payment or delivery
              issue, contact us using the business contact details
              provided below.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Please include the following information where
              available:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6 leading-8 text-gray-600">
              <li>Your registered account email address.</li>
              <li>Your order ID.</li>
              <li>The product name.</li>
              <li>The payment date and amount.</li>
              <li>
                A description of the issue and relevant screenshots
                or transaction references, if available.
              </li>
            </ul>

            <p className="mt-4 leading-8 text-gray-600">
              Please do not send passwords, authentication codes,
              private keys, or other confidential credentials
              when contacting support.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              8. Review and Refund Processing
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              We may review order records, payment confirmation,
              delivery status, and relevant technical information
              to assess a refund request.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              If a refund is approved, it will be processed through
              the applicable payment method or payment provider,
              subject to the provider&apos;s procedures and applicable
              requirements.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Refunds will be handled within the reasonable
              period or timeframe prescribed by applicable law.
              The time taken for the amount to appear in the
              customer&apos;s account may also depend on the payment
              provider or financial institution.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              We may request additional information when reasonably
              necessary to verify a transaction or investigate
              a reported problem.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              9. Payment Provider Disputes
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              If a payment provider is involved in processing
              your purchase, its payment terms and dispute
              procedures may also apply.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Customers may contact us to resolve order-related
              concerns. Any rights or remedies available through
              the payment provider or under applicable law remain
              unaffected by this policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              10. Consumer Rights
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Nothing in this policy is intended to limit,
              exclude, or waive any consumer rights or remedies
              that cannot legally be excluded under applicable
              law, including applicable Indian consumer protection
              and e-commerce laws.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              If any part of this policy conflicts with a
              mandatory legal requirement, the applicable
              legal requirement will prevail.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              11. Contact and Grievance Information
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              For refund requests, order cancellations,
              payment concerns, or consumer grievances,
              please contact:
            </p>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-7">
              <div className="space-y-3 leading-8 text-gray-600">
                <p>
                  <strong>Business Name:</strong> Divine flame IT Solutions
                </p>

                <p>
                  <strong>Marketplace:</strong> Nexora
                </p>

                <p>
                  <strong>Owner:</strong> XXXX
                </p>

                <p>
                  <strong>Business Address:</strong> XXXX
                </p>

                <p>
                  <strong>Customer Support Email:</strong> XXXX
                </p>

                <p>
                  <strong>Phone Number:</strong> XXXX
                </p>

                <p>
                  <strong>Grievance Officer:</strong> XXXX
                </p>

                <p>
                  <strong>Grievance Officer Email:</strong> XXXX
                </p>

                <p>
                  <strong>Grievance Officer Designation:</strong> XXXX
                </p>
              </div>
            </div>

            <p className="mt-5 leading-8 text-gray-600">
              Consumer complaints will be acknowledged within
              the timeframe required by applicable law and
              addressed through our grievance redressal process.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              12. Changes to This Policy
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              We may update this policy when our products,
              payment arrangements, business operations,
              or legal requirements change.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              The latest version will be published on this
              page with its updated date.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="leading-8 text-gray-600">
              You may also review the following information:
            </p>

            <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold">
              <Link
                href="/about"
                className="text-blue-600 hover:text-blue-800"
              >
                About Us
              </Link>

              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-800"
              >
                Terms &amp; Conditions
              </Link>

              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-800"
              >
                Privacy Policy
              </Link>

              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800"
              >
                Back to Home
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
