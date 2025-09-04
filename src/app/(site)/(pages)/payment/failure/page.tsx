"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";

const PaymentFailurePage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('oid') || 'N/A';

  return (
    <>
      <Breadcrumb title="Payment Failed" pages={["payment", "failure"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold text-dark mb-4">
              Payment Failed
            </h2>
            
            <p className="text-gray-600 mb-6">
              Unfortunately, your payment could not be processed. This could be due to various reasons such as insufficient funds, network issues, or payment cancellation.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">What happened?</h3>
              <ul className="text-sm text-red-700 text-left space-y-1">
                <li>• Payment was cancelled or declined</li>
                <li>• Network connection issues during payment</li>
                <li>• Insufficient balance in your eSewa account</li>
                <li>• Technical issues with the payment gateway</li>
              </ul>
            </div>

            {orderId !== 'N/A' && (
              <div className="bg-gray-1 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-lg text-dark mb-2">Order Information</h3>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-dark">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-red-600">Payment Failed</span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">What can you do?</h3>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Check your eSewa account balance</li>
                <li>• Ensure stable internet connection</li>
                <li>• Try a different payment method</li>
                <li>• Contact our support team if the issue persists</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/checkout"
                className="bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-dark transition-colors"
              >
                Try Payment Again
              </Link>
              <Link
                href="/cart"
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Cart
              </Link>
              <Link
                href="/contact"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@nextmerce.com" className="text-blue hover:underline">
                  support@nextmerce.com
                </a>{" "}
                or call us at{" "}
                <a href="tel:+977-1-4444444" className="text-blue hover:underline">
                  +977-1-4444444
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentFailurePage;
