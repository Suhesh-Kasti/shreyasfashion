import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seller',
  title: 'Sellers/Vendors',
  type: 'document',
  icon: () => '🏪',
  fields: [
    defineField({
      name: 'name',
      title: 'Seller Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
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
      name: 'bannerImage',
      title: 'Banner Image',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'story',
      title: 'Brand Story',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
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
        }
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email',
          type: 'email',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
        {
          name: 'website',
          title: 'Website',
          type: 'url',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 3,
        },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
        },
        {
          name: 'tiktok',
          title: 'TikTok',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Streetwear', value: 'streetwear' },
          { title: 'Formal Wear', value: 'formal' },
          { title: 'Casual Wear', value: 'casual' },
          { title: 'Athletic Wear', value: 'athletic' },
          { title: 'Vintage Fashion', value: 'vintage' },
          { title: 'Sustainable Fashion', value: 'sustainable' },
          { title: 'Premium Quality', value: 'premium' },
          { title: 'Handmade Items', value: 'handmade' },
        ],
      },
      description: 'What this seller specializes in',
    }),
    defineField({
      name: 'rating',
      title: 'Average Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
      description: 'Average customer rating (0-5)',
    }),
    defineField({
      name: 'totalSales',
      title: 'Total Sales',
      type: 'number',
      description: 'Total number of products sold',
    }),
    defineField({
      name: 'joinedDate',
      title: 'Joined Date',
      type: 'date',
      description: 'When this seller joined the platform',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Seller',
      type: 'boolean',
      description: 'Show in featured sellers section',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Is this seller currently active?',
      initialValue: true,
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'product' } }],
      description: 'Products sold by this seller',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'state',
          title: 'State/Province',
          type: 'string',
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          initialValue: 'Nepal',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'logo',
      active: 'active',
      featured: 'featured',
    },
    prepare(selection) {
      const { active, featured } = selection
      const status = active ? (featured ? '⭐' : '🟢') : '🔴'
      return {
        ...selection,
        subtitle: `${status} ${selection.subtitle || 'Seller/Vendor'}`
      }
    },
  },
})
