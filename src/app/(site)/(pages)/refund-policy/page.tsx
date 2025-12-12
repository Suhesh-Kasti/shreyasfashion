import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Refund & Return Policy</h1>

            <div className="prose max-w-none space-y-6 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Return Window</h2>
                    <p>We accept returns within <strong>7 days</strong> of delivery. Items must be unworn, unwashed, and in original condition with all tags attached.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How to Initiate a Return</h2>
                    <p>Contact our support team at <strong>support@daniosfashion.com</strong> with your order number and reason for return.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Refund Process</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Refunds are processed within 5-7 business days after we receive the returned item.</li>
                        <li>For Cash on Delivery orders, refunds will be issued via bank transfer.</li>
                        <li>For eSewa payments, refunds will be credited back to your eSewa account.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Non-Returnable Items</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Items marked as "Final Sale"</li>
                        <li>Damaged or worn items</li>
                        <li>Items without original tags</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Exchange Policy</h2>
                    <p>We currently do not offer direct exchanges. Please return the item for a refund and place a new order for the desired size or color.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
                    <p>For questions about returns, contact us at support@daniosfashion.com or call (+977) 98-1234-5678.</p>
                </section>

                <p className="text-sm text-gray-500 mt-8">Last Updated: December 2025</p>
            </div>
        </div>
    );
};

export default RefundPolicy;
