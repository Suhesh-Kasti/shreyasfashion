import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../../../../lib/sanity'; // Adjust path if needed, usually ../../../../../lib/sanity

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
        // Check if client is available
        if (!client) {
            throw new Error('Sanity client not initialized');
        }

        // Fetch orders for this customer
        const query = `*[_type == "order" && customer.email == $email] | order(_createdAt desc) {
      _id,
      orderNumber,
      orderDate,
      orderStatus,
      payment {
        totalAmount,
        method,
        status
      },
      items[] {
        productTitle,
        quantity,
        totalPrice,
        "image": image.asset->url
      },
      delivery {
        address,
        city
      }
    }`;

        const orders = await client.fetch(query, { email });

        return NextResponse.json({
            success: true,
            orders,
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
