import { NextRequest, NextResponse } from 'next/server';
import { client, writeClient } from '../../../../../lib/sanity';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const orderNumber = formData.get('orderId') as string;

        if (!file || !orderNumber) {
            return NextResponse.json(
                { success: false, error: 'File and order ID are required' },
                { status: 400 }
            );
        }

        // Find order _id by orderNumber
        const order = await client.fetch(
            `*[_type == "order" && orderNumber == $orderNumber][0]{ _id }`,
            { orderNumber }
        );

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Upload image to Sanity
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageAsset = await writeClient.assets.upload('image', buffer, {
            filename: `payment-proof-${orderNumber}.${file.name.split('.').pop()}`
        });

        // Update order with payment proof using _id
        await writeClient
            .patch(order._id)
            .set({
                paymentProof: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id
                    }
                }
            })
            .commit();

        return NextResponse.json({
            success: true,
            message: 'Payment proof uploaded successfully'
        });

    } catch (error) {
        console.error('Payment proof upload error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Upload failed'
            },
            { status: 500 }
        );
    }
}
