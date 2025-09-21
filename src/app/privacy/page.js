"use client";
import DummyLogo from "@/components/ui/DummyLogo";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <DummyLogo />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Last Updated: September 1, 2025
        </p>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            At Brickz, we are committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            personal information when you use our website (the &quot;Website&quot;)
            or engage our construction services. By using our Website or services,
            you consent to the practices described in this policy. If you do not
            agree, please do not use our Website or services.
          </p>
        </section>

        {/* Section 1: Information We Collect */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                1.1 Personal Information
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may collect personal information you provide, such as:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
                <li>Name, email address, phone number, and address when you register an account or contact us.</li>
                <li>Payment information for invoicing and project agreements.</li>
                <li>Project specifications or other details you submit for construction services.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                1.2 Non-Personal Information
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may collect non-personal information, such as:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
                <li>Browser type, IP address, and device information.</li>
                <li>Usage data, such as pages visited and time spent on the Website.</li>
                <li>Aggregated analytics data to improve our services.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We use your information to:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
            <li>Provide and manage construction services, including project planning and invoicing.</li>
            <li>Process payments and communicate with you about your account or projects.</li>
            <li>Respond to inquiries, provide customer support, and send service-related updates.</li>
            <li>Improve our Website and services through analytics and user feedback.</li>
            <li>Comply with legal obligations and protect our rights.</li>
          </ul>
        </section>

        {/* Section 3: Sharing Your Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Sharing Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may share your information with:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
            <li>Subcontractors or partners involved in delivering construction services, as outlined in project agreements.</li>
            <li>Third-party service providers (e.g., payment processors, analytics tools) who assist with our operations.</li>
            <li>Legal authorities if required by law or to protect our rights.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-2">
            We do not sell or rent your personal information to third parties for marketing purposes.
          </p>
        </section>

        {/* Section 4: Data Security */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Data Security
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We implement reasonable security measures to protect your information,
            such as encryption and secure servers. However, no system is completely
            secure, and we cannot guarantee absolute security. You are responsible
            for maintaining the confidentiality of your account credentials.
          </p>
        </section>

        {/* Section 5: Your Rights */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Your Rights
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
            <li>Access, correct, or delete your personal information.</li>
            <li>Opt out of certain data processing activities.</li>
            <li>Request a copy of your data in a portable format.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-2">
            To exercise these rights, contact us at the details provided in Section
            7. We will respond within the timeframe required by applicable law.
          </p>
        </section>

        {/* Section 6: Cookies and Tracking */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Cookies and Tracking
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar technologies to enhance your experience,
            analyze usage, and deliver personalized content. You can manage cookie
            preferences through your browser settings. By using our Website, you
            consent to our use of cookies as described in this policy.
          </p>
        </section>

        {/* Section 7: Contact Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about this Privacy Policy or our data practices, please
            contact us at:
          </p>
          <ul className="list-none text-gray-700 leading-relaxed ml-4">
            <li>Email: support@brickz.com</li>
            <li>Phone: +1 (800) 555-1234</li>
            <li>Address: 123 Construction Lane, Build City, [State], [Zip Code]</li>
          </ul>
        </section>

        {/* Section 8: Changes to Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Changes to Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated &quot;Last Updated&quot; date.
            Continued use of the Website or services after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        {/* Back to Terms Link */}
        <div className="text-center">
          <Link
            href="/terms"
            className="text-blue-600 hover:text-blue-500 underline text-sm"
          >
            View our Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}