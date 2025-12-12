import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',
  icon: () => '📝',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short description for blog listing',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }
          ]
        },
        {
          type: 'object',
          name: 'youtube',
          title: 'YouTube Video',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'YouTube URL',
              description: 'Paste full YouTube video URL (e.g., https://www.youtube.com/watch?v=...)',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: { url: 'url' },
            prepare({ url }) {
              return {
                title: 'YouTube Video',
                subtitle: url
              }
            }
          }
        },
        {
          type: 'object',
          name: 'instagram',
          title: 'Instagram Post',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'Instagram Post URL',
              description: 'Paste Instagram post URL (e.g., https://www.instagram.com/p/...)',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: { url: 'url' },
            prepare({ url }) {
              return {
                title: 'Instagram Post',
                subtitle: url
              }
            }
          }
        },
        {
          type: 'object',
          name: 'facebook',
          title: 'Facebook Post/Video',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'Facebook URL',
              description: 'Paste Facebook post or video URL',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: { url: 'url' },
            prepare({ url }) {
              return {
                title: 'Facebook Post',
                subtitle: url
              }
            }
          }
        },
        {
          type: 'object',
          name: 'twitter',
          title: 'X (Twitter) Post',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'X/Twitter Post URL',
              description: 'Paste X (Twitter) post URL',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: { url: 'url' },
            prepare({ url }) {
              return {
                title: 'X (Twitter) Post',
                subtitle: url
              }
            }
          }
        },
        {
          type: 'object',
          name: 'tiktok',
          title: 'TikTok Video',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'TikTok Video URL',
              description: 'Paste TikTok video URL (e.g., https://www.tiktok.com/@username/video/...)',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: { url: 'url' },
            prepare({ url }) {
              return {
                title: 'TikTok Video',
                subtitle: url
              }
            }
          }
        }
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'blogCategory' } }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Show this post in featured sections',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
