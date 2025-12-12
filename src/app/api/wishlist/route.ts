import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../../../lib/sanity';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    try {
        if (!client) {
            throw new Error('Sanity client not initialized');
        }

        // Fetch or create wishlist for this user
        const query = `*[_type == "wishlist" && userEmail == $email][0] {
      _id,
      items[] {
        "productId": product->_id,
        "product": product->{
          _id,
          title,
          price,
          discountedPrice,
          "image": imgs.thumbnails[0].asset->url,
          slug
        },
        addedAt
      }
    }`;

        const wishlist = await client.fetch(query, { email: session.user.email });

        return NextResponse.json({
            success: true,
            items: wishlist?.items || []
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch wishlist',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    try {
        if (!client) {
            throw new Error('Sanity client not initialized');
        }

        const { productId, action } = await request.json();

        if (!productId) {
            return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
        }

        // Find existing wishlist
        const existingWishlist = await client.fetch(
            `*[_type == "wishlist" && userEmail == $email][0]`,
            { email: session.user.email }
        );

        if (action === 'remove') {
            // Remove item from wishlist
            if (existingWishlist) {
                await client
                    .patch(existingWishlist._id)
                    .set({
                        items: existingWishlist.items?.filter((item: any) => item.product._ref !== productId) || []
                    })
                    .commit();
            }

            return NextResponse.json({ success: true, message: 'Item removed from wishlist' });
        }

        // Add item to wishlist
        if (existingWishlist) {
            // Check if item already exists
            const itemExists = existingWishlist.items?.some(
                (item: any) => item.product._ref === productId
            );

            if (itemExists) {
                return NextResponse.json({ success: true, message: 'Item already in wishlist' });
            }

            // Add new item
            await client
                .patch(existingWishlist._id)
                .setIfMissing({ items: [] })
                .append('items', [{
                    _type: 'object',
                    product: { _type: 'reference', _ref: productId },
                    addedAt: new Date().toISOString()
                }])
                .commit();
        } else {
            // Create new wishlist
            await client.create({
                _type: 'wishlist',
                userEmail: session.user.email,
                items: [{
                    _type: 'object',
                    product: { _type: 'reference', _ref: productId },
                    addedAt: new Date().toISOString()
                }]
            });
        }

        return NextResponse.json({ success: true, message: 'Item added to wishlist' });
    } catch (error) {
        console.error('Error updating wishlist:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update wishlist',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
