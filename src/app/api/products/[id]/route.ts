import { NextRequest, NextResponse } from 'next/server'
import { getProductById } from '../../../../../lib/sanity'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    console.log('API: Fetching product with ID:', productId)
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const product = await getProductById(productId)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    console.log('API: Found product:', product.title)
    return NextResponse.json(product)
    
  } catch (error) {
    console.error('API: Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
