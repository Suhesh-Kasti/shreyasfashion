"use client";

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { client } from '../../../../../../lib/sanity';

// Social Share Component
const SocialShare = ({ title, url }: { title: string; url: string }) => {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTitle}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex gap-3 items-center">
      <span className="text-sm font-medium text-gray-600">Share:</span>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
      </a>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-black text-white rounded-full hover:bg-gray-800">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
      </a>
      <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
      </a>
      <button onClick={copyToClipboard} className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      </button>
    </div>
  );
};

// Blog content components for social embeds
const components = {
  types: {
    youtube: ({ value }: any) => {
      const getYouTubeID = (url: string) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        return match?.[1];
      };
      const videoId = getYouTubeID(value.url);
      return (
        <div className="aspect-video my-6">
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    },
    instagram: ({ value }: any) => (
      <div className="my-6 flex justify-center">
        <blockquote className="instagram-media" data-instgrm-permalink={value.url} data-instgrm-version="14" />
      </div>
    ),
    tiktok: ({ value }: any) => {
      const getTikTokID = (url: string) => {
        const match = url.match(/\/video\/(\d+)/);
        return match?.[1];
      };
      const videoId = getTikTokID(value.url);
      return (
        <div className="my-6 flex justify-center">
          <blockquote className="tiktok-embed" cite={value.url} data-video-id={videoId}>
            <a href={value.url} target="_blank" rel="noopener noreferrer">View on TikTok</a>
          </blockquote>
        </div>
      );
    },
    image: ({ value }: any) => (
      <div className="my-6">
        <Image
          src={value.asset.url}
          alt={value.alt || ''}
          width={800}
          height={600}
          className="rounded-lg w-full"
        />
      </div>
    )
  }
};

interface BlogPost {
  params: Promise<{ slug: string }>;
}

export default function BlogPost({ params }: BlogPost) {
  const [post, setPost] = useState<any>(null);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);

      const postQuery = `
        *[_type == "blog" && slug.current == $slug][0] {
          title,
          excerpt,
          "featuredImage": featuredImage.asset->url,
          content,
          "author": author->{name, "image": image.asset->url},
          "categories": categories[]->title,
          publishedAt,
          _createdAt
        }
      `;

      const latestQuery = `
        *[_type == "blog" && slug.current != $slug] | order(publishedAt desc)[0...5] {
          title,
          slug,
          "image": featuredImage.asset->url,
          publishedAt
        }
      `;

      const productsQuery = `
        *[_type == "product"] | order(_createdAt desc)[0...4] {
          _id,
          title,
          price,
          discountedPrice,
          "image": imgs.thumbnails[0].asset->url,
          slug
        }
      `;

      const [postData, latestData, productsData] = await Promise.all([
        client.fetch(postQuery, { slug: resolvedParams.slug }),
        client.fetch(latestQuery, { slug: resolvedParams.slug }),
        client.fetch(productsQuery)
      ]);

      setPost(postData);
      setLatestPosts(latestData);
      setNewProducts(productsData);
      setLoading(false);

      if (typeof window !== 'undefined' && postData?.content) {
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);

        const tiktokScript = document.createElement('script');
        tiktokScript.src = 'https://www.tiktok.com/embed.js';
        tiktokScript.async = true;
        document.body.appendChild(tiktokScript);
      }
    };

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://yoursite.com/blog/${slug}`;

  return (
    <article className="max-w-7xl mx-auto px-4 py-12">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
        <div>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
            {post.excerpt && (<p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>)}
            <div className="flex items-center gap-4 mb-6">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.image && (<Image src={post.author.image} alt={post.author.name} width={48} height={48} className="rounded-full" />)}
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">{new Date(post.publishedAt || post._createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
            <SocialShare title={post.title} url={currentUrl} />
          </header>
          {post.featuredImage && (
            <div className="mb-8">
              <Image src={post.featuredImage} alt={post.title} width={1200} height={600} className="w-full rounded-lg" />
            </div>
          )}
          <div className="prose prose-lg max-w-none">
            <PortableText value={post.content} components={components} />
          </div>
          <div className="mt-12 pt-6 border-t">
            <SocialShare title={post.title} url={currentUrl} />
          </div>
        </div>
        <aside className="mt-12 lg:mt-0">
          {latestPosts.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-4">Latest Posts</h3>
              <div className="space-y-4">
                {latestPosts.map((latestPost) => (
                  <Link key={latestPost.slug.current} href={`/blog/${latestPost.slug.current}`} className="flex gap-3 hover:opacity-75 transition">
                    {latestPost.image && (<Image src={latestPost.image} alt={latestPost.title} width={60} height={60} className="rounded object-cover" />)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{latestPost.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{new Date(latestPost.publishedAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {newProducts.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">New in Store</h3>
              <div className="space-y-4">
                {newProducts.map((product) => (
                  <Link key={product._id} href={`/shop-collection`} className="flex gap-3 hover:opacity-75 transition">
                    {product.image && (<Image src={product.image} alt={product.title} width={60} height={60} className="rounded object-cover" />)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{product.title}</h4>
                      <p className="text-sm font-bold text-gray-900 mt-1">NPR {product.discountedPrice || product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
