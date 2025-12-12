import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '../../../../../lib/sanity';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const orderId = formData.get('orderId') as string;

        if (!file || !orderId) {
            return NextResponse.json(
                { success: false, error: 'File and order ID are required' },
                { status: 400 }
            );
        }

        // Upload image to Sanity
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageAsset = await writeClient.assets.upload('image', buffer, {
            filename: `payment-proof-${orderId}.${file.name.split('.').pop()}`
        });

        // Update order with payment proof
        await writeClient
            .patch(orderId)
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
