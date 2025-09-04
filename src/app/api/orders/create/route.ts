import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '../../../../../lib/sanity';
import { CreateOrderData } from '@/types/order';
import { validateOrderData } from '@/utils/orderUtils';
import { sendOrderNotificationEmail } from '@/utils/emailUtils';

export async function POST(request: NextRequest) {
  try {
    const orderData: CreateOrderData = await request.json();

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

    // Create order in Sanity
    const createdOrder = await createOrder(orderData);

    // Send email notification to admin
    try {
      await sendOrderNotificationEmail({
        order: createdOrder as any, // Type assertion for Sanity document
        customerEmail: orderData.customer.email,
        adminEmail: process.env.ADMIN_EMAIL || 'admin@daniosfashion.com',
      });
      console.log('Order notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      order: createdOrder,
      orderNumber: createdOrder.orderNumber,
      message: 'Order created successfully',
    });

  } catch (error) {
    console.error('Error creating order:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    // This would fetch orders by customer email
    // Implementation depends on your needs
    return NextResponse.json({
      success: true,
      orders: [],
      message: 'Orders retrieved successfully',
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
