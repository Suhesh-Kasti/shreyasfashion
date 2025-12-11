"use client";
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getBrandEmail } from '@/config/brand';

const OrderConfirmationPage = () => {
    const router = useRouter();
    const params = useParams();
    const orderNumber = params?.id as string;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-green-50 px-6 py-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600">Thank you for your order. We will process your order shortly.</p>
                    </div>

                    {/* Order Details */}
                    <div className="px-6 py-8">
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Confirmation</h2>
                            <p className="text-gray-600">Your order number is:</p>
                            <p className="text-2xl font-bold text-brand-black mt-1">{orderNumber}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-sm">1</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Order Placed</h3>
                                    <p className="text-gray-600 text-sm">We have received your order details</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-semibold text-sm">2</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-500">Processing</h3>
                                    <p className="text-gray-500 text-sm">We will call you to confirm the order details</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-semibold text-sm">3</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-500">Shipping</h3>
                                    <p className="text-gray-500 text-sm">Your order will be shipped within 2-3 business days</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
                            <ul className="text-blue-800 text-sm space-y-1">
                                <li>• Our team will verify your order details</li>
                                <li>• You may receive a confirmation call</li>
                                <li>• Cash on Delivery payment will be collected upon delivery</li>
                            </ul>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => router.push('/')}
                                className="flex-1 bg-brand-black text-white py-3 px-6 rounded-md hover:bg-brand-text transition-colors font-medium border border-transparent"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex-1 bg-white text-brand-black py-3 px-6 rounded-md hover:bg-gray-50 transition-colors font-medium border border-brand-black flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Order
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Contact Support</h3>
                            <p className="text-gray-600 text-sm mb-2">If you have any questions about your order:</p>
                            <p className="text-brand-black font-medium">{getBrandEmail()}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Follow Us</h3>
                            <p className="text-gray-600 text-sm mb-2">Stay updated on your order and new arrivals:</p>
                            <div className="flex space-x-3">
                                <a href="#" className="text-brand-black hover:text-brand-text">Instagram</a>
                                <a href="#" className="text-brand-black hover:text-brand-text">Facebook</a>
                                <a href="#" className="text-brand-black hover:text-brand-text">TikTok</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
