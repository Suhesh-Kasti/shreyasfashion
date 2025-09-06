import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug } from '../../../../lib/sanity'
import { getBrandName } from '@/config/brand'
import BlogDetails from '@/components/BlogDetails/BlogDetails'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | ${getBrandName()} Blog`,
    description: post.excerpt || post.title,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <BlogDetails post={post} />
    </main>
  )
}
