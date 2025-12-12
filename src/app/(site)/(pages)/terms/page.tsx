import React from 'react';

const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

            <div className="prose max-w-none space-y-6 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
                    <p>By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Purchases</h2>
                    <p>If you wish to purchase any product or service made available through the Service, you may be asked to supply certain information relevant to your Purchase including, without limitation, your name, address, and payment information.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Accounts</h2>
                    <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Intellectual Property</h2>
                    <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Shreyas Fashion and its licensors.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Termination</h2>
                    <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Changes</h2>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
                </section>

                <p className="text-sm text-gray-500 mt-8">Last Updated: December 2025</p>
            </div>
        </div>
    );
};

export default TermsOfService;
