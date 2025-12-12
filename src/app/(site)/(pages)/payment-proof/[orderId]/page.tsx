"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../../../lib/sanity';

interface PaymentProofPageProps {
    params: Promise<{ orderId: string }>;
}

export default function PaymentProofPage({ params }: PaymentProofPageProps) {
    const router = useRouter();
    const [orderId, setOrderId] = useState<string>('');
    const [order, setOrder] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            const resolvedParams = await params;
            setOrderId(resolvedParams.orderId);

            const query = `*[_type == "order" && orderNumber == $orderId][0] {
        orderNumber,
        "paymentMethod": payment.method,
        paymentProof
      }`;

            const orderData = await client.fetch(query, { orderId: resolvedParams.orderId });
            setOrder(orderData);
            setLoading(false);
        };

        loadOrder();
    }, [params]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !orderId) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('orderId', orderId);

            const response = await fetch('/api/payment-proof/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                router.push(`/order-confirmation/${orderId}`);
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert(`Failed to upload: ${error instanceof Error ? error.message : 'Please try again'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSkip = () => {
        router.push(`/order-confirmation/${orderId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                    <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    if (order.paymentMethod === 'cod') {
        router.push(`/order-confirmation/${orderId}`);
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upload Payment Proof</h1>
                    <p className="text-sm sm:text-base text-gray-600">Order #{orderId}</p>
                </div>

                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    {order.paymentMethod === 'esewa' && (
                        <p className="text-xs sm:text-sm text-blue-800">
                            <strong>eSewa Payment:</strong> Please upload a screenshot of your eSewa payment confirmation showing the transaction details.
                        </p>
                    )}
                    {order.paymentMethod === 'bank_transfer' && (
                        <p className="text-xs sm:text-sm text-blue-800">
                            <strong>Bank QR Payment:</strong> Please upload a screenshot of your bank transfer showing the transaction ID and amount.
                        </p>
                    )}
                    {order.paymentMethod !== 'esewa' && order.paymentMethod !== 'bank_transfer' && (
                        <p className="text-xs sm:text-sm text-blue-800">
                            <strong>Note:</strong> Please upload a screenshot of your payment confirmation to help us verify your order quickly.
                        </p>
                    )}
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Payment Screenshot
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {preview && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                            <img src={preview} alt="Payment proof preview" className="max-w-full h-auto rounded-lg border" />
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm sm:text-base"
                        >
                            {uploading ? 'Uploading...' : 'Upload & Continue'}
                        </button>
                        <button
                            onClick={handleSkip}
                            disabled={uploading}
                            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
                        >
                            Skip for Now
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        You can also upload the payment proof later by contacting support.
                    </p>
                </div>
            </div>
        </div>
    );
}
