import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '../../../../../lib/sanity';
import { CreateOrderData } from '@/types/order';
import { validateOrderData } from '@/utils/orderUtils';
import { sendOrderNotificationEmail, sendOrderConfirmationEmail } from '@/utils/emailUtils';

interface EsewaVerificationData {
  oid: string;
  amt: string;
  refId: string;
  pid: string;
}

interface EsewaVerificationResponse {
  response_code: string;
  status: string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
}

/**
 * Verify eSewa payment and create order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { esewaData, orderData }: { esewaData: EsewaVerificationData; orderData: CreateOrderData } = body;

    // Validate required eSewa data
    if (!esewaData.oid || !esewaData.amt || !esewaData.refId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required eSewa payment data'
        },
        { status: 400 }
      );
    }

    // Validate order data
    const validation = validateOrderData(orderData);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order data',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Verify payment with eSewa
    const paymentVerified = await verifyEsewaPayment(esewaData);

    if (!paymentVerified.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed',
          details: paymentVerified.error
        },
        { status: 400 }
      );
    }

    // Add eSewa transaction details to order data
    const enhancedOrderData = {
      ...orderData,
      esewaTransactionId: esewaData.refId,
      esewaResponse: paymentVerified.data,
    };

    // Create order in Sanity
    const createdOrder = await createOrder(enhancedOrderData);

    // Send email notifications
    try {
      // Send admin notification
      await sendOrderNotificationEmail({
        order: createdOrder as any, // Type assertion for Sanity document
        customerEmail: orderData.customer.email,
        adminEmail: process.env.ADMIN_EMAIL || 'admin@daniosfashion.com',
      });

      // Send customer confirmation
      await sendOrderConfirmationEmail(createdOrder as any, orderData.customer.email);

      console.log('Order notification emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send order notification emails:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      order: createdOrder,
      orderNumber: createdOrder.orderNumber,
      message: 'Payment verified and order created successfully',
      paymentDetails: paymentVerified.data,
    });

  } catch (error) {
    console.error('Error in eSewa verification:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle eSewa payment response (GET request from eSewa redirect)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const amt = searchParams.get("amt");
  const pid = searchParams.get("pid");
  const rid = searchParams.get("rid");
  const oid = searchParams.get("oid");

  if (!amt || !pid || !rid) {
    return NextResponse.redirect(
      new URL('/checkout?error=invalid_payment_response', request.url)
    );
  }

  try {
    // Verify payment with eSewa
    const paymentVerified = await verifyEsewaPayment({
      oid: oid || '',
      amt,
      refId: rid,
      pid,
    });

    if (paymentVerified.success) {
      // Redirect to payment success page with transaction details
      const successUrl = new URL('/payment-success', request.url);
      successUrl.searchParams.set('oid', oid || '');
      successUrl.searchParams.set('amt', amt);
      successUrl.searchParams.set('refId', rid);
      successUrl.searchParams.set('pid', pid);
      successUrl.searchParams.set('verified', 'true');

      return NextResponse.redirect(successUrl);
    } else {
      return NextResponse.redirect(
        new URL('/checkout?error=payment_verification_failed', request.url)
      );
    }

  } catch (error) {
    console.error('Error handling eSewa response:', error);
    return NextResponse.redirect(
      new URL('/checkout?error=payment_processing_failed', request.url)
    );
  }
}

/**
 * Verify payment with eSewa API
 */
async function verifyEsewaPayment(esewaData: EsewaVerificationData): Promise<{
  success: boolean;
  data?: EsewaVerificationResponse;
  error?: string;
}> {
  try {
    const merchantCode = process.env.ESEWA_MERCHANT_CODE;
    if (!merchantCode) {
      return {
        success: false,
        error: 'Merchant code not configured',
      };
    }

    // Build query string for eSewa verification
    const params = new URLSearchParams({
      amt: esewaData.amt,
      rid: esewaData.refId,
      pid: esewaData.pid,
      scd: merchantCode,
    });

    const response = await fetch(
      `https://uat.esewa.com.np/epay/transrec?${params.toString()}`
    );

    const xml = await response.text();
    const isSuccess = xml.includes("<response_code>Success</response_code>");

    if (isSuccess) {
      return {
        success: true,
        data: {
          response_code: 'SUCCESS',
          status: 'COMPLETE',
          transaction_uuid: esewaData.refId,
          product_code: esewaData.pid,
          signed_field_names: 'transaction_uuid,product_code,total_amount',
          signature: 'verified',
        } as EsewaVerificationResponse,
      };
    } else {
      return {
        success: false,
        error: `eSewa verification failed: ${xml}`,
      };
    }

  } catch (error) {
    console.error('eSewa verification error:', error);
    return {
      success: false,
      error: `Verification request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
