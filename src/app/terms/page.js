"use client";
import DummyLogo from "@/components/ui/DummyLogo";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <DummyLogo />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Terms and Conditions
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Last Updated: September 1, 2025
        </p>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            Welcome to Brickz, a construction services company dedicated to
            delivering high-quality projects. By accessing or using our website
            (the &quot;Website&quot;) or engaging our services, you agree to be
            bound by the following Terms and Conditions (&quot;Terms&quot;). These
            Terms govern your use of the Website and any services provided by
            Brickz (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). If you do
            not agree with these Terms, please do not use our Website or services.
          </p>
        </section>

        {/* Section 1: Acceptance of Terms */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing the Website, creating an account, or engaging Brickz for
            construction services, you agree to comply with these Terms, our{" "}
            <a
              href="/privacy"
              className="text-blue-600 hover:text-blue-500 underline"
            >
              Privacy Policy
            </a>
            , and any applicable laws and regulations. These Terms apply to all
            users, including visitors, registered users, and clients.
          </p>
        </section>

        {/* Section 2: Use of the Website */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Use of the Website
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                2.1 Eligibility
              </h3>
              <p className="text-gray-700 leading-relaxed">
                You must be at least 18 years old to use the Website or engage our
                services. By using the Website, you represent that you meet this
                age requirement and have the legal capacity to enter into
                agreements.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                2.2 Permitted Use
              </h3>
              <p className="text-gray-700 leading-relaxed">
                You may use the Website to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
                <li>
                  Browse information about Brickz’s services, projects, and team.
                </li>
                <li>
                  Register for an account to manage projects, tasks, or invoices.
                </li>
                <li>Contact us for inquiries or to request a quote.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
                <li>Use the Website for any unlawful purpose or in violation of these Terms.</li>
                <li>Attempt to gain unauthorized access to our systems or data.</li>
                <li>Reproduce, copy, or distribute content from the Website without permission.</li>
                <li>Use automated tools (e.g., bots, scrapers) to access or collect data.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                2.3 Account Registration
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To access certain features (e.g., project management, invoicing),
                you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
                <li>Provide accurate, current, and complete information.</li>
                <li>Maintain the security of your account credentials.</li>
                <li>Notify us immediately of any unauthorized use of your account.</li>
                <li>Be responsible for all activities under your account.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Construction Services */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Construction Services
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                3.1 Service Agreements
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Construction services provided by Brickz are subject to separate
                project agreements or contracts, which will outline specific terms,
                including scope, timeline, costs, and deliverables. These Terms do
                not replace project-specific agreements.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                3.2 Client Responsibilities
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Clients engaging Brickz’s services agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
                <li>Provide accurate project specifications and requirements.</li>
                <li>Ensure timely access to the project site.</li>
                <li>Make payments as per the agreed schedule in the project contract.</li>
                <li>Comply with all applicable laws, permits, and regulations.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                3.3 Warranties
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Brickz warrants that all construction work will be performed in a
                professional manner, consistent with industry standards. Specific
                warranty terms, including duration and coverage, will be detailed
                in the project agreement. Warranties do not cover damages due to
                client misuse, neglect, or unauthorized modifications.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Payment Terms */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Payment Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Payments for services are governed by the project agreement. Invoices
            issued through the Website must be paid within the specified timeframe
            (typically 30 days). Late payments may incur interest at a rate
            specified in the project agreement or as permitted by law. Brickz
            reserves the right to suspend services for non-payment.
          </p>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To the fullest extent permitted by law, Brickz shall not be liable for
            any indirect, incidental, special, or consequential damages arising
            from your use of the Website or services, including but not limited to
            loss of profits, data, or business opportunities. Our liability for
            direct damages shall be limited to the amount paid by you for the
            specific service or project giving rise to the claim.
          </p>
        </section>

        {/* Section 6: Dispute Resolution */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Dispute Resolution
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Any disputes arising from these Terms or our services will be resolved
            through negotiation in good faith. If unresolved, disputes shall be
            submitted to mediation before pursuing legal action. Any legal action
            shall be governed by the laws of [Your Jurisdiction, e.g., Delaware,
            USA] and conducted in the courts of [Your City/State].
          </p>
        </section>

        {/* Section 7: Termination */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Termination
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may suspend or terminate your access to the Website or services if
            you violate these Terms, fail to make payments, or engage in unlawful
            conduct. Termination of services will be governed by the terms of the
            project agreement.
          </p>
        </section>

        {/* Section 8: Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Changes to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Brickz reserves the right to update these Terms at any time. Changes
            will be posted on this page with an updated &quot;Last Updated&quot;
            date. Continued use of the Website or services after changes
            constitutes acceptance of the new Terms.
          </p>
        </section>

        {/* Section 9: Contact Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about these Terms or our services, please contact us at:
          </p>
          <ul className="list-none text-gray-700 leading-relaxed ml-4">
            <li>Email: support@brickz.com</li>
            <li>Phone: +1 (800) 555-1234</li>
            <li>Address: 123 Construction Lane, Build City, [State], [Zip Code]</li>
          </ul>
        </section>
      </div>
    </div>
  );
}