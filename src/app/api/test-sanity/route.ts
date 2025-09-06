import { NextResponse } from 'next/server'
import { client } from '../../../../lib/sanity'

export async function GET() {
  try {
    console.log('Testing Sanity connection...')
    console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
    
    if (!client) {
      return NextResponse.json({ 
        success: false, 
        error: 'Sanity client not configured',
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
      })
    }

    // Test basic connection
    const products = await client.fetch('*[_type == "product"] { _id, title, slug, price }')
    const categories = await client.fetch('*[_type == "category"] { _id, name, slug }')
    
    console.log('Products found:', products.length)
    console.log('Categories found:', categories.length)
    
    return NextResponse.json({
      success: true,
      data: {
        products: products,
        categories: categories,
        productCount: products.length,
        categoryCount: categories.length
      }
    })
    
  } catch (error) {
    console.error('Sanity test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
    })
  }
}
