
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Nexora, operated by Divine flame IT Solutions, collects, uses, stores, and protects personal information, including account, order, and customer support data.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Nexora",
    description:
      "Understand how Nexora handles personal information, customer accounts, orders, data storage, security, and privacy requests.",
    url: "/privacy",
    siteName: "Nexora",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Nexora",
    description:
      "Learn how Nexora collects, uses, stores, and protects customer information.",
  },
};


const lastUpdated = "November 11, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Legal Information
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            This Privacy Policy explains how Nexora and its operator,
            Divine flame IT Solutions, handle personal information when
            you visit or use our website and services.
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
              Nexora is a digital marketplace operated by Divine flame IT
              Solutions. This policy applies to information collected
              through the Nexora website, customer accounts, orders,
              customer support, and related services.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              By using our website, you acknowledge that you have had
              the opportunity to read this policy. Where consent is
              legally required, we will seek it through an appropriate
              process.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              2. Information We May Collect
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Depending on how you use Nexora, we may collect the
              following categories of information:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6 leading-8 text-gray-600">
              <li>
                <strong>Account information:</strong> Email address,
                account name where provided, and authentication
                credentials required to create and access an account.
              </li>

              <li>
                <strong>Order information:</strong> Purchased product,
                product identifier, order amount, currency, order date,
                and payment status.
              </li>

              <li>
                <strong>Customer communications:</strong> Information
                you voluntarily provide when contacting us for support
                or making an enquiry.
              </li>

              <li>
                <strong>Technical information:</strong> Information
                necessary to operate accounts, maintain sessions,
                protect the website, and investigate technical or
                security problems.
              </li>

              <li>
                <strong>Transaction information:</strong> Information
                made available by payment providers when payment
                processing is introduced or used.
              </li>
            </ul>

            <p className="mt-4 leading-8 text-gray-600">
              We aim to collect only information that is reasonably
              necessary for the purposes described in this policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              3. How We Use Information
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Information may be used for the following purposes:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6 leading-8 text-gray-600">
              <li>Creating and managing customer accounts.</li>
              <li>Authenticating users and maintaining secure sessions.</li>
              <li>Processing and managing product orders.</li>
              <li>Providing access to purchased digital products.</li>
              <li>Responding to customer enquiries and support requests.</li>
              <li>Preventing fraud, misuse, and unauthorized access.</li>
              <li>Maintaining, improving, and securing our services.</li>
              <li>Meeting applicable legal and accounting obligations.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              4. Account Security and Authentication
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Nexora uses an authentication system to manage customer
              registration, sign-in, and account sessions.
              Authentication information is processed to help verify
              account access and protect customer accounts.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Customers are responsible for keeping their login
              credentials confidential and notifying us if they
              suspect unauthorized access to their accounts.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              5. Orders and Payment Information
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              When you place an order, we maintain information needed
              to manage that order, including the product, order
              amount, currency, date, and payment status.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Payment processing may involve third-party payment
              providers. When a payment provider is integrated, its
              own privacy policy and terms may also apply to the
              information it processes.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Nexora will not treat an order as paid merely because
              a customer submits a payment request. Payment status
              must be confirmed through the applicable verified
              payment process.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Payment-provider details and any additional payment
              information collected will be reflected in an updated
              version of this policy when the payment integration
              becomes operational.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              6. Data Storage and Service Providers
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              We use third-party infrastructure providers to operate
              Nexora and deliver its services. These providers may
              process or store information on our behalf as required
              for their services.
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6 leading-8 text-gray-600">
              <li>
                <strong>MongoDB Atlas:</strong> Used for application
                database storage, including account and order records.
              </li>

              <li>
                <strong>Backblaze B2:</strong> Used for private storage
                of digital product files, including source-code ZIP
                packages.
              </li>

              <li>
                <strong>Authentication infrastructure:</strong> Used
                to support account registration, sign-in, and session
                management.
              </li>
            </ul>

            <p className="mt-4 leading-8 text-gray-600">
              Access to private digital product files is controlled
              through server-side authorization checks. Download
              access is intended only for eligible customers whose
              orders have been confirmed as paid.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Some service providers may process or store information
              outside India. Their processing is subject to their
              applicable terms, privacy practices, and relevant legal
              requirements.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              7. Cookies and Session Technologies
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Nexora uses authentication-related cookies or similar
              technologies where necessary to maintain secure login
              sessions and provide account functionality.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Blocking essential cookies may affect your ability to
              sign in or use certain account features.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Any additional analytics, advertising, or optional
              tracking technologies introduced in the future will
              be reflected in this policy and handled as required
              by applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              8. Sharing of Information
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              We do not intend to sell customer personal information.
              Information may be shared only where reasonably
              necessary for legitimate business operations, including:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6 leading-8 text-gray-600">
              <li>Infrastructure and hosting service providers.</li>
              <li>Authentication and database service providers.</li>
              <li>Payment providers when payment services are used.</li>
              <li>Professional advisers where reasonably necessary.</li>
              <li>Government authorities where disclosure is legally required.</li>
            </ul>

            <p className="mt-4 leading-8 text-gray-600">
              We do not authorize service providers to use customer
              information for purposes unrelated to the services
              they provide, subject to their applicable terms and
              legal obligations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              9. Data Retention
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              We retain information for as long as reasonably
              necessary to provide our services, maintain customer
              accounts, manage orders, resolve disputes, protect
              our business, and comply with applicable legal
              requirements.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Certain order, transaction, or accounting records may
              need to be retained for legally required periods even
              after an account is closed.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              When information is no longer required, we will take
              reasonable steps to delete it or otherwise dispose
              of it, subject to legal retention requirements and
              technical limitations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              10. Data Security
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              We use reasonable technical and organizational
              measures intended to protect information against
              unauthorized access, disclosure, alteration, loss,
              or misuse.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              These measures include access controls, authentication,
              server-side authorization, and restricted access to
              private digital product storage.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              No internet-based system can guarantee absolute
              security. We will take appropriate steps when we
              become aware of a security incident, as required
              by applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              11. Your Privacy Rights and Requests
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Depending on applicable law, you may have rights
              concerning your personal information, including
              requesting access, correction, updating, or deletion
              of information, and raising a privacy-related concern.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              You may contact us using the details below to submit
              a privacy request. We may need to verify your identity
              before acting on a request.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Some information may need to be retained where
              required by law or necessary for legitimate legal
              and business purposes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              12. Children and Minor Users
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Nexora is intended for individuals who are legally
              eligible to enter into transactions under applicable
              law. We do not knowingly seek to collect personal
              information from children in violation of applicable
              legal requirements.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              13. External Websites
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Our website may contain links to third-party websites
              or services. We are not responsible for the privacy
              practices, content, or security of external websites.
              Customers should review the privacy policies of those
              services before sharing information with them.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              14. Changes to This Privacy Policy
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              We may update this policy when our services,
              technology, business practices, or legal requirements
              change.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              The updated policy will be published on this page
              with a revised update date. We encourage customers
              to review it periodically.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7">
            <h2 className="text-2xl font-semibold">
              15. Business and Privacy Contact
            </h2>

            <div className="mt-5 space-y-3 leading-8 text-gray-600">
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
                <strong>Business Email:</strong> XXXX
              </p>

              <p>
                <strong>Phone Number:</strong> XXXX
              </p>

              <p>
                <strong>UDYAM Registration:</strong> XXXX
              </p>

              <p>
                <strong>GSTIN:</strong> XXXX
              </p>
            </div>

            <p className="mt-5 leading-8 text-gray-600">
              For privacy questions, personal information requests,
              or concerns about how your information is handled,
              please contact us using the business contact details
              above.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="leading-8 text-gray-600">
              For additional information about our services and
              business, please review our other policies.
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
                href="/refund"
                className="text-blue-600 hover:text-blue-800"
              >
                Refund Policy
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
