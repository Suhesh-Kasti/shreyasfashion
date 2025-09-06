'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getBrandName } from '@/config/brand'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  featuredImage?: string
  author?: string | { name: string; image?: string }
  categories?: string[] | { title: string; slug: { current: string } }[]
  featured?: boolean
}

interface BlogGridProps {
  posts: BlogPost[]
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Extract categories from posts
  const categories = Array.from(
    new Set(
      posts.flatMap(post => {
        if (Array.isArray(post.categories)) {
          return post.categories.map(cat => 
            typeof cat === 'string' ? cat : cat.title
          )
        }
        return []
      })
    )
  )

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || 
                           (Array.isArray(post.categories) && 
                            post.categories.some(cat => 
                              (typeof cat === 'string' ? cat : cat.title) === selectedCategory
                            ))
    
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getAuthorName = (author: string | { name: string } | undefined) => {
    if (typeof author === 'string') return author
    if (author && typeof author === 'object') return author.name
    return 'Anonymous'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {getBrandName()} Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest fashion trends, styling tips, and behind-the-scenes stories
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {posts.length === 0 ? 'No Blog Posts Yet' : 'No Posts Found'}
            </h3>
            <p className="text-gray-600 mb-8">
              {posts.length === 0 
                ? 'Check back soon for fashion insights and styling tips!'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {searchTerm || selectedCategory ? (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Featured Image */}
                <div className="aspect-video relative bg-gray-200">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-4xl">📝</div>
                    </div>
                  )}
                  {post.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{getAuthorName(post.author)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Categories */}
                  {Array.isArray(post.categories) && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.slice(0, 2).map((category, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          {typeof category === 'string' ? category : category.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Read More
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12 text-gray-600">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        )}
      </div>
    </div>
  )
}
