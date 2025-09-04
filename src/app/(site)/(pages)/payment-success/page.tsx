"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatPrice } from '@/utils/currency';
import toast from 'react-hot-toast';
import { getBrandEmail, getSocialLinks } from '@/config/brand';

interface PaymentDetails {
  oid: string;
  amt: string;
  refId: string;
  pid: string;
  verified: boolean;
}

const PaymentSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment details from URL parameters
        const paymentDetails: PaymentDetails = {
          oid: searchParams.get('oid') || '',
          amt: searchParams.get('amt') || '',
          refId: searchParams.get('refId') || '',
          pid: searchParams.get('pid') || '',
          verified: searchParams.get('verified') === 'true',
        };

        // Validate payment details
        if (!paymentDetails.oid || !paymentDetails.amt || !paymentDetails.refId || !paymentDetails.pid) {
          throw new Error('Invalid payment response data');
        }

        // Get pending order data from sessionStorage
        const pendingOrderData = sessionStorage.getItem('pendingOrder');
        if (!pendingOrderData) {
          throw new Error('No pending order found. Please try placing your order again.');
        }

        const orderData = JSON.parse(pendingOrderData);

        // Verify payment and create order
        const response = await fetch('/api/esewa/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            esewaData: {
              oid: paymentDetails.oid,
              amt: paymentDetails.amt,
              refId: paymentDetails.refId,
              pid: paymentDetails.pid,
            },
            orderData,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setOrderNumber(result.orderNumber);
          
          // Clear pending order data
          sessionStorage.removeItem('pendingOrder');
          
          // Clear cart (you might want to dispatch a Redux action here)
          // dispatch(clearCart());
          
          toast.success('Order placed successfully!');
        } else {
          throw new Error(result.error || 'Payment verification failed');
        }

      } catch (error) {
        console.error('Payment processing error:', error);
        setError(error instanceof Error ? error.message : 'Payment processing failed');
        toast.error('Payment processing failed. Please contact support.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-danios-black mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-danios-black text-white py-2 px-4 rounded-md hover:bg-danios-text transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your order. We&apos;ve received your payment and will process your order shortly.</p>
          </div>

          {/* Order Details */}
          <div className="px-6 py-8">
            {orderNumber && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Confirmation</h2>
                <p className="text-gray-600">Your order number is:</p>
                <p className="text-2xl font-bold text-danios-black mt-1">{orderNumber}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Payment Confirmed</h3>
                  <p className="text-gray-600 text-sm">Your payment has been successfully processed</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Order Processing</h3>
                  <p className="text-gray-600 text-sm">We&apos;re preparing your order for shipment</p>
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
              <h3 className="font-medium text-blue-900 mb-2">What&apos;s Next?</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• You&apos;ll receive an email confirmation shortly</li>
                <li>• We&apos;ll send you tracking information once your order ships</li>
                <li>• Estimated delivery: 3-7 business days</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-danios-black text-white py-3 px-6 rounded-md hover:bg-danios-text transition-colors font-medium"
              >
                Continue Shopping
              </button>
              {orderNumber && (
                <button
                  onClick={() => router.push(`/orders/${orderNumber}`)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Track Order
                </button>
              )}
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
                <a href="#" className="text-danios-black hover:text-danios-text">Instagram</a>
                <a href="#" className="text-danios-black hover:text-danios-text">Facebook</a>
                <a href="#" className="text-danios-black hover:text-danios-text">TikTok</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
