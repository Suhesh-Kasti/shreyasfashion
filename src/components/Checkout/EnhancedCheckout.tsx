"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { selectTotalPrice, removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { formatPrice } from "@/utils/currency";
import { CreateOrderData, CustomerInfo, DeliveryInfo } from "@/types/order";
import { validateOrderData } from "@/utils/orderUtils";
import toast from "react-hot-toast";
import Image from "next/image";

interface CheckoutFormData {
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Delivery Info
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryInstructions: string;

  // Payment
  paymentMethod: 'esewa' | 'cod' | 'bank_transfer';

  // Other
  orderNotes: string;
}

const EnhancedCheckout: React.FC = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPostalCode: '',
    deliveryInstructions: '',
    paymentMethod: 'esewa',
    orderNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form with session data if available
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        customerName: session.user.name || '',
        customerEmail: session.user.email || '',
      }));
    }
  }, [session]);

  // Calculate totals
  const deliveryFee = totalPrice > 2000 ? 0 : 150; // Free delivery over Rs. 2000
  const discount = 0; // Can be implemented later
  const finalTotal = totalPrice + deliveryFee - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Full name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid phone number';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!formData.deliveryCity.trim()) {
      newErrors.deliveryCity = 'City is required';
    }

    // Cart validation
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add items before checkout.');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const customer: CustomerInfo = {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        isGoogleUser: !!session?.user,
        googleId: (session?.user as any)?.id,
      };

      const delivery: DeliveryInfo = {
        address: formData.deliveryAddress,
        city: formData.deliveryCity,
        postalCode: formData.deliveryPostalCode,
        deliveryInstructions: formData.deliveryInstructions,
      };

      const orderItems = cartItems.map(item => ({
        productId: item.id.toString(),
        productTitle: item.title,
        quantity: item.quantity,
        unitPrice: item.discountedPrice,
        totalPrice: item.discountedPrice * item.quantity,
        productImage: item.imgs?.thumbnails?.[0] || item.imgs?.previews?.[0],
        selectedVariants: item.selectedVariants,
      }));

      const orderData: CreateOrderData = {
        customer,
        delivery,
        items: orderItems,
        payment: {
          method: formData.paymentMethod,
          subtotal: totalPrice,
          deliveryFee,
          discount,
          totalAmount: finalTotal,
        },
      };

      // Validate order data
      const validation = validateOrderData(orderData);
      if (!validation.isValid) {
        toast.error(`Order validation failed: ${validation.errors.join(', ')}`);
        return;
      }

      // Handle different payment methods
      if (formData.paymentMethod === 'esewa') {
        // Redirect to eSewa payment
        await initiateEsewaPayment(orderData);
      } else if (formData.paymentMethod === 'cod') {
        // Process COD order
        await processCODOrder(orderData);
      } else if (formData.paymentMethod === 'bank_transfer') {
        // Process bank transfer order
        await processBankTransferOrder(orderData);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateEsewaPayment = async (orderData: CreateOrderData) => {
    try {
      // Store order data in sessionStorage for after payment
      sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));

      // Generate unique product ID for this transaction
      const productId = `DANIOS-${Date.now()}`;
      const amount = orderData.payment.totalAmount;

      // eSewa configuration
      const esewaConfig = {
        amt: amount,
        pdc: 0, // Delivery charge
        psc: 0, // Service charge
        txAmt: 0, // Tax amount
        tAmt: amount, // Total amount
        pid: productId,
        scd: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || 'EPAYTEST',
        su: `${window.location.origin}/api/esewa/verify?status=success`,
        fu: `${window.location.origin}/checkout?error=payment_failed`,
      };

      // Create form and submit to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://uat.esewa.com.np/epay/main'; // Sandbox URL

      // Add form fields
      Object.entries(esewaConfig).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
      });

      // Submit form
      document.body.appendChild(form);
      toast.success('Redirecting to eSewa payment...');
      form.submit();

    } catch (error) {
      console.error('eSewa payment initiation error:', error);
      toast.error('Failed to initiate eSewa payment. Please try again.');
    }
  };

  const processCODOrder = async (orderData: CreateOrderData) => {
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();

        // Clear cart after successful order
        dispatch(removeAllItemsFromCart());

        toast.success('Order placed successfully!');
        // Redirect to order confirmation
        window.location.href = `/order-confirmation/${result.orderNumber}`;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('COD order error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const processBankTransferOrder = async (orderData: CreateOrderData) => {
    // Similar to COD but with different status
    await processCODOrder(orderData);
  };

  // Show login requirement if user is not authenticated
  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-8">
            Please sign in with your Google account to continue with checkout. This helps us provide better service and order tracking.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/checkout' })}
              className="inline-flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:border-gray-400 hover:shadow-md transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-sm text-gray-500">
              We use Google Sign-In to secure your account and provide better order tracking.
            </p>
          </div>

          {/* Cart Summary for Non-Logged Users */}
          {cartItems.length > 0 && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Your Cart ({cartItems.length} items)</h3>
              <div className="space-y-2">
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.title} (x{item.quantity})</span>
                    <span className="font-medium">{formatPrice(item.discountedPrice * item.quantity)}</span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <p className="text-sm text-gray-500">...and {cartItems.length - 3} more items</p>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Customer Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black ${errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your email address"
                />
                {errors.customerEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
                )}
              </div>

              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your phone number"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your complete delivery address"
                />
                {errors.deliveryAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="deliveryCity" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="deliveryCity"
                    name="deliveryCity"
                    value={formData.deliveryCity}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black ${errors.deliveryCity ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="City"
                  />
                  {errors.deliveryCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryCity}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="deliveryPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="deliveryPostalCode"
                    name="deliveryPostalCode"
                    value={formData.deliveryPostalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black"
                    placeholder="Postal code"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  id="deliveryInstructions"
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black"
                  placeholder="Any special instructions for delivery"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                    {item.imgs?.thumbnails?.[0] ? (
                      <Image
                        src={item.imgs.thumbnails[0]}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">{item.title.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.discountedPrice * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="esewa"
                  checked={formData.paymentMethod === 'esewa'}
                  onChange={handleInputChange}
                  className="text-brand-black focus:ring-brand-black"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">e</span>
                  </div>
                  <span>eSewa</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className="text-brand-black focus:ring-brand-black"
                />
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Cash on Delivery</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={formData.paymentMethod === 'bank_transfer'}
                  onChange={handleInputChange}
                  className="text-brand-black focus:ring-brand-black"
                />
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  </svg>
                  <span>Bank Transfer</span>
                </div>
              </label>

              {/* Bank Transfer Details Section */}
              {formData.paymentMethod === 'bank_transfer' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex flex-col items-center">
                    <p className="font-medium text-gray-900 mb-2">Scan QR to Compelte Payment</p>
                    <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm border border-gray-200 mb-3 relative">
                      <Image
                        src="/images/bank-qr.jpg"
                        alt="Bank QR Code"
                        width={192}
                        height={192}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Bank Name:</span> Nabil Bank</p>
                      <p><span className="font-medium">Account Name:</span> Shreya&apos;s Fashion Pvt. Ltd.</p>
                      <p><span className="font-medium">Account Number:</span> 1234567890</p>
                      <p className="text-xs text-gray-500 mt-2">Please declare the order total amount: {formatPrice(finalTotal)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Order Notes (Optional)
              </label>
              <textarea
                id="orderNotes"
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black"
                placeholder="Any special notes for your order"
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || cartItems.length === 0}
              className={`w-full mt-6 py-3 px-4 rounded-md font-medium transition-all duration-200 ${isSubmitting || cartItems.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-brand-black text-white hover:bg-brand-text hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {isSubmitting ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default EnhancedCheckout;
