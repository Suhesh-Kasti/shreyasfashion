import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="prose max-w-none space-y-6 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                    <p>Welcome to Shreyas Fashion. We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Personal Information:</strong> When you make a purchase or sign up, we collect your name, email, phone number, and shipping address.</li>
                        <li><strong>Account Information:</strong> If you use Google Sign-In, we collect your name and email provided by Google.</li>
                        <li><strong>Usage Data:</strong> We collect information on how you interact with our website to improve our services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Process and fulfill your orders.</li>
                        <li>Send you order confirmations and updates.</li>
                        <li>Provide customer support.</li>
                        <li>Improve our website and product offerings.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Information Sharing</h2>
                    <p>We do not sell your personal information. We may share data with trusted third parties solely for the purpose of operating our business, such as:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Sanity:</strong> To manage our content and order data.</li>
                        <li><strong>eSewa:</strong> To process secure payments.</li>
                        <li><strong>Resend:</strong> To send transactional emails.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at support@daniosfashion.com.</p>
                </section>

                <p className="text-sm text-gray-500 mt-8">Last Updated: December 2025</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
