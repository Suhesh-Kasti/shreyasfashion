"use client";

import React, { useState } from 'react';

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How do I place an order?",
            answer: "Browse our collection, add items to your cart, and proceed to checkout. You can pay via eSewa or choose Cash on Delivery."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept eSewa (digital wallet), Bank Transfer, and Cash on Delivery (COD)."
        },
        {
            question: "How long does delivery take?",
            answer: "Delivery within Kathmandu Valley takes 1-3 business days. Outside the valley may take 3-7 business days."
        },
        {
            question: "Do you ship internationally?",
            answer: "Currently, we only ship within Nepal."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns within 7 days of delivery. Items must be unworn and in original condition. See our Refund Policy for details."
        },
        {
            question: "How can I track my order?",
            answer: "After placing an order, you'll receive a confirmation email. You can also view your order status by visiting 'My Orders' after logging in."
        },
        {
            question: "Can I cancel my order?",
            answer: "Yes, you can cancel your order within 24 hours of placing it. Contact our support team at support@daniosfashion.com."
        },
        {
            question: "What if I receive a damaged item?",
            answer: "Contact us immediately at support@daniosfashion.com with photos of the damaged item. We'll arrange a replacement or refund."
        },
        {
            question: "Do you offer gift wrapping?",
            answer: "Yes! Add a note during checkout requesting gift wrapping, and we'll include it at no extra charge."
        },
        {
            question: "How do I contact customer support?",
            answer: "Email us at support@daniosfashion.com or call (+977) 98-1234-5678. We're available Monday-Saturday, 10 AM - 6 PM."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-600 mb-8">Find answers to common questions about our products and services.</p>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-900">{faq.question}</span>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openIndex === index && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <p className="text-gray-700">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
                <p className="text-gray-700 mb-4">Our support team is here to help!</p>
                <a
                    href="/contact"
                    className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                    Contact Us
                </a>
            </div>
        </div>
    );
};

export default FAQPage;
