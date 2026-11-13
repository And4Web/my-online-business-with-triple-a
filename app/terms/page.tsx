
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions governing the use of Nexora, including customer accounts, digital software purchases, payments, downloads, licensing and refunds.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Nexora",
    description:
      "Review the terms governing access to Nexora and purchases made through our digital software marketplace.",
    url: "/terms",
    siteName: "Nexora",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions | Nexora",
    description:
      "Read the terms governing the use of Nexora and purchases through our marketplace.",
  },
};

const lastUpdated = "November 11, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Link
            href="/"
            className="text-lg font-bold text-blue-400"
          >
            Nexora
          </Link>

          <p className="mt-12 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Legal Information
          </p>

          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-slate-400">
            Please read these terms carefully before accessing
            Nexora, creating an account, or purchasing any
            digital product through our marketplace.
          </p>

          <p className="mt-6 text-sm text-slate-500">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <article className="mx-auto max-w-5xl space-y-12 px-6 py-16">
        <section>
          <h2 className="text-2xl font-bold">
            1. Business Information
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              Nexora is a digital software marketplace operated
              by Divine flame IT Solutions, an IT venture
              registered under the name stated below.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p>
                <strong className="text-white">Business Name:</strong>{" "}
                Divine flame IT Solutions
              </p>
              <p>
                <strong className="text-white">Owner:</strong> XXXX
              </p>
              <p>
                <strong className="text-white">UDYAM Registration:</strong>{" "}
                XXXX
              </p>
              <p>
                <strong className="text-white">GSTIN:</strong> XXXX
              </p>
              <p>
                <strong className="text-white">Business Address:</strong>{" "}
                XXXX
              </p>
              <p>
                <strong className="text-white">Email:</strong> XXXX
              </p>
              <p>
                <strong className="text-white">Phone:</strong> XXXX
              </p>
            </div>

            <p>
              In these terms, the words &quot;Nexora&quot;, &quot;we&quot;, &quot;our&quot;,
and &quot;us&quot; refer to the Nexora marketplace and its
operator, Divine flame IT Solutions.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            2. Acceptance of These Terms
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              By accessing or using the Nexora website, creating
              an account, placing an order, or purchasing a
              product, you acknowledge that you have read and
              agree to these Terms & Conditions.
            </p>

            <p>
              If you do not agree with these terms, please do
              not use the marketplace or purchase products
              through it.
            </p>

            <p>
              We may update these terms from time to time.
              Updated terms will be published on this page
              with a revised effective or update date.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            3. Eligibility and Customer Accounts
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              You must have the legal capacity to enter into
              a binding agreement under the laws applicable
              to you to make purchases through Nexora.
            </p>

            <p>
              Customers are responsible for providing accurate
              registration information and maintaining the
              confidentiality of their account credentials.
            </p>

            <p>
              You are responsible for activities carried out
              through your account. Please notify us promptly
              if you suspect unauthorized access or misuse.
            </p>

            <p>
              We reserve the right to restrict or suspend
              accounts involved in fraud, abuse, unauthorized
              access, or violations of these terms, subject
              to applicable law.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            4. Products and Digital Deliverables
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              Nexora offers digital software projects,
              application source code, and related development
              resources. Product categories and availability
              may change over time.
            </p>

            <p>
              Each product listing should describe its features,
              technologies, price, and other relevant information.
              Customers should review the product description
              before placing an order.
            </p>

            <p>
              Unless a product listing expressly states otherwise,
              purchases provide access to digital files and do
              not include hosting, domain registration, third-party
              subscriptions, ongoing maintenance, or custom
              development services.
            </p>

            <p>
              Optional deployment or implementation assistance
              may be offered separately where available.
              Any applicable fees and scope will be communicated
              before the customer agrees to that service.
            </p>

            <p>
              Software projects may require configuration,
              dependencies, external services, API credentials,
              or additional infrastructure before they can
              operate in a customer&apos;s environment.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            5. Pricing, Orders and Payment
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              Product prices are displayed on the relevant
              product pages. Prices and applicable charges
              will be presented during the purchasing process.
            </p>

            <p>
              Placing an order creates an order request.
              An order may initially appear as pending while
              payment processing and verification are completed.
            </p>

            <p>
              An order will be treated as paid only after
              successful confirmation through the applicable
              payment provider&apos;s authorized payment verification
              process.
            </p>

            <p>
              A payment initiation message, screenshot,
              transaction reference supplied by a customer,
              or an unverified notification does not by itself
              establish successful payment.
            </p>

            <p>
              Payments may be processed through third-party
              payment service providers. Their applicable
              terms and policies may also govern the payment
              transaction.
            </p>

            <p>
              Orders may be rejected, cancelled, or reviewed
              where payment cannot be verified, a transaction
              appears fraudulent, or an order cannot be fulfilled,
              subject to applicable law and the relevant refund
              policy.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            6. Digital Delivery and Downloads
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              Eligible digital products are made available
              through the customer&apos;s Nexora account after
              the applicable payment has been successfully
              verified.
            </p>

            <p>
              Download access is subject to account authentication,
              order ownership, payment confirmation, and
              availability of the relevant product files.
            </p>

            <p>
              Download links may be temporary and may expire
              for security reasons. Customers should download
              and securely retain their purchased files.
            </p>

            <p>
              Customers must not attempt to bypass download
              restrictions, access another customer&apos;s orders,
              or obtain files without authorization.
            </p>

            <p>
              If a legitimate download fails, customers may
              contact our support team for assistance.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            7. Intellectual Property and Product Usage
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              Nexora&apos;s website, branding, visual design,
              written content, and other original materials
              are protected by applicable intellectual
              property laws.
            </p>

            <p>
              Ownership of software, source code, libraries,
              frameworks, assets, and other components may
              belong to Nexora, its operator, the relevant
              developers, or other third-party rights holders,
              depending on the product.
            </p>

            <p>
              Purchasing a product does not automatically
              transfer ownership of its underlying intellectual
              property to the customer.
            </p>

            <p>
              The permitted rights to use, modify, deploy,
              distribute, or commercially exploit a purchased
              project must be governed by the applicable
              product licence or separate written agreement.
              Customers must review that licence before use.
            </p>

            <p>
              Customers must not use purchased materials in
              a manner that infringes third-party rights or
              violates applicable law.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            8. Third-Party Software and Services
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              Products may use third-party frameworks,
              libraries, APIs, services, or open-source
              components.
            </p>

            <p>
              Such components may be subject to their own
              licences, terms, usage limits, fees, and
              privacy policies.
            </p>

            <p>
              Customers are responsible for reviewing and
              complying with applicable third-party terms
              when using or deploying a product.
            </p>

            <p>
              Nexora does not control the availability,
              policies, or future changes of independent
              third-party services.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            9. Prohibited Activities
          </h2>

          <div className="mt-5 space-y-4 leading-8 text-slate-400">
            <p>You agree not to:</p>

            <ul className="list-disc space-y-2 pl-6">
              <li>
                Use the website for unlawful, fraudulent,
                or deceptive activities.
              </li>
              <li>
                Attempt unauthorized access to accounts,
                systems, databases, or private files.
              </li>
              <li>
                Interfere with website security, availability,
                or normal operation.
              </li>
              <li>
                Submit false payment information or
                fraudulent order claims.
              </li>
              <li>
                Circumvent payment verification or download
                access restrictions.
              </li>
              <li>
                Misuse software or third-party components
                in violation of their applicable licences.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            10. Refunds and Cancellations
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              Refund requests, cancellations, and payment
              disputes are handled in accordance with our
              Refund Policy and applicable consumer protection
              laws.
            </p>

            <p>
              Customers should review the Refund Policy before
              making a purchase. Nothing in these terms is
              intended to exclude any consumer rights that
              cannot legally be excluded.
            </p>

            <p>
              For assistance with an order or refund request,
              please contact us using the official contact
              information published on our website.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            11. Privacy and Personal Information
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              We collect and process information necessary
              to operate the marketplace, manage customer
              accounts, process orders, provide downloads,
              and respond to enquiries.
            </p>

            <p>
              Personal information is handled in accordance
              with our Privacy Policy and applicable data
              protection laws.
            </p>

            <p>
              Please review our{" "}
              <Link
                href="/privacy"
                className="text-blue-400 hover:text-blue-300"
              >
                Privacy Policy
              </Link>{" "}
              for further information.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            12. Availability and Changes to the Website
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              We aim to keep Nexora accessible and operational.
              However, uninterrupted availability cannot be
              guaranteed.
            </p>

            <p>
              We may update, improve, temporarily suspend,
              or discontinue website features, products,
              or services where reasonably necessary.
            </p>

            <p>
              We will make reasonable efforts to address
              technical problems affecting customer access
              and purchased digital products.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            13. Limitation of Liability
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              To the extent permitted by applicable law,
              Divine flame IT Solutions shall not be liable
              for indirect or consequential losses arising
              from the use of the website or purchased
              software products.
            </p>

            <p>
              Customers are responsible for reviewing,
              testing, configuring, and securing software
              before deploying it in a production environment.
            </p>

            <p>
              Nothing in these terms excludes or limits
              liability where such exclusion or limitation
              is prohibited by applicable law.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            14. Governing Law and Disputes
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              These terms are intended to be governed by
              the laws of India, subject to applicable
              mandatory consumer protection and other
              legal requirements.
            </p>

            <p>
              Any dispute should first be raised with us
              so that the parties may attempt to resolve
              it through good-faith communication.
            </p>

            <p>
              Where a dispute cannot be resolved amicably,
              it may be addressed through the appropriate
              legal forum having jurisdiction under
              applicable law.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            15. Contact Information
          </h2>

          <div className="mt-5 space-y-3 leading-8 text-slate-400">
            <p>
              For questions about these Terms & Conditions,
              orders, products, or the Nexora marketplace,
              please contact:
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="font-semibold text-white">
                Divine flame IT Solutions
              </p>
              <p>Owner: XXXX</p>
              <p>Business Address: XXXX</p>
              <p>Phone: XXXX</p>
              <p>Email: XXXX</p>
              <p>UDYAM Registration: XXXX</p>
              <p>GSTIN: XXXX</p>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-sm leading-7 text-slate-500">
            By using Nexora, you acknowledge that you have
            read and understood these Terms & Conditions.
          </p>

          <div className="mt-6 flex flex-wrap gap-5 text-sm">
            <Link
              href="/about"
              className="text-blue-400 hover:text-blue-300"
            >
              About Us
            </Link>

            <Link
              href="/privacy"
              className="text-blue-400 hover:text-blue-300"
            >
              Privacy Policy
            </Link>

            <Link
              href="/refund"
              className="text-blue-400 hover:text-blue-300"
            >
              Refund Policy
            </Link>

            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300"
            >
              Homepage
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
