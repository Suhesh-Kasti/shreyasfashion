"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const amt = searchParams.get('amt');
      const pid = searchParams.get('oid');
      const rid = searchParams.get('refId');

      if (!amt || !pid || !rid) {
        setVerificationStatus('failed');
        return;
      }

      try {
        const response = await fetch(`/api/esewa/verify?amt=${amt}&pid=${pid}&rid=${rid}`);
        const data = await response.json();

        if (data.status === 'success') {
          setVerificationStatus('success');
          setOrderDetails({
            orderId: pid,
            amount: amt,
            transactionId: rid
          });
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationStatus('failed');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <>
      <Breadcrumb title="Payment Status" pages={["payment", "success"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
            {verificationStatus === 'loading' && (
              <div>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue mx-auto mb-6"></div>
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  Verifying Payment...
                </h2>
                <p className="text-gray-600">
                  Please wait while we verify your payment with eSewa.
                </p>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. Your payment has been processed successfully.
                </p>
                
                {orderDetails && (
                  <div className="bg-gray-1 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-lg text-dark mb-4">Order Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium text-dark">{orderDetails.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-medium text-dark">${orderDetails.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium text-dark">{orderDetails.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium text-dark">eSewa</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-dark transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/my-account"
                    className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    View Orders
                  </Link>
                </div>
              </div>
            )}

            {verificationStatus === 'failed' && (
              <div>
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
                  Payment Verification Failed
                </h2>
                <p className="text-gray-600 mb-6">
                  We could not verify your payment. Please contact support if you believe this is an error.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/checkout"
                    className="bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-dark transition-colors"
                  >
                    Try Again
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentSuccessPage;
