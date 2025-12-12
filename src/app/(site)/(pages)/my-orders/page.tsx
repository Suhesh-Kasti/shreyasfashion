"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface Order {
    _id: string;
    orderNumber: string;
    orderDate: string;
    orderStatus: string;
    payment: {
        totalAmount: number;
        method: string;
        status: string;
    };
    items: Array<{
        productTitle: string;
        quantity: number;
        totalPrice: number;
    }>;
}

const MyOrdersPage = () => {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            redirect('/auth/signin');
        }

        if (session?.user?.email) {
            fetchOrders(session.user.email);
        }
    }, [session, status]);

    const fetchOrders = async (email: string) => {
        try {
            const response = await fetch(`/api/orders/list?email=${email}`);
            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                setError(data.error || 'Failed to fetch orders');
            }
        } catch (err) {
            setError('An error occurred while fetching orders');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || (loading && session)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {orders.length === 0 && !loading ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Link
                        href="/shop"
                        className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order Placed</p>
                                    <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="font-medium">NPR {order.payment.totalAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Order #</p>
                                    <p className="font-medium">{order.orderNumber}</p>
                                </div>
                                <div className="ml-auto">
                                    <Link
                                        href={`/order-confirmation/${order.orderNumber}?email=${session.user?.email}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            <div className="px-6 py-4">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {order.orderStatus.toUpperCase()}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Payment: {order.payment.method.toUpperCase()} ({order.payment.status})
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-800">
                                                {item.quantity}x {item.productTitle}
                                            </span>
                                            <span className="text-gray-600">
                                                NPR {item.totalPrice.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
