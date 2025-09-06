import { Metadata } from 'next'
import { getAllBlogPosts } from '../../../../../lib/sanity'
import { getBrandName, getBrandTitle } from '@/config/brand'
import BlogGrid from '@/components/BlogGrid/BlogGrid'

export const metadata: Metadata = {
  title: getBrandTitle('Blog'),
  description: `Latest fashion trends, styling tips, and news from ${getBrandName()}`,
}

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts()

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BlogGrid posts={blogPosts} />
      </div>
    </main>
  )
}
