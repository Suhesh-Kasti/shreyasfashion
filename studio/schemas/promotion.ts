import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'promotion',
  title: 'Promotions',
  type: 'document',
  icon: () => '🎯',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'type',
      title: 'Promotion Type',
      type: 'string',
      options: {
        list: [
          { title: 'Banner', value: 'banner' },
          { title: 'Countdown Sale', value: 'countdown' },
          { title: 'Flash Sale', value: 'flash' },
          { title: 'Seasonal Sale', value: 'seasonal' },
          { title: 'New Arrival', value: 'new-arrival' },
          { title: 'Best Seller', value: 'best-seller' },
        ],
      },
      validation: (Rule) => Rule.required(),
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
      name: 'discount',
      title: 'Discount',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Discount Type',
          type: 'string',
          options: {
            list: [
              { title: 'Percentage', value: 'percentage' },
              { title: 'Fixed Amount (Rs.)', value: 'fixed' },
              { title: 'Buy One Get One', value: 'bogo' },
            ],
          },
        },
        {
          name: 'value',
          title: 'Discount Value',
          type: 'number',
          description: 'Percentage (e.g., 20) or fixed amount in Rs. (e.g., 500)',
        },
        {
          name: 'code',
          title: 'Promo Code',
          type: 'string',
          description: 'Optional promo code for the discount',
        },
      ],
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'products',
      title: 'Featured Products',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'product' } }],
      description: 'Products to feature in this promotion',
    }),
    defineField({
      name: 'categories',
      title: 'Featured Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Categories to feature in this promotion',
    }),
    defineField({
      name: 'ctaText',
      title: 'Call to Action Text',
      type: 'string',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Call to Action Link',
      type: 'string',
      description: 'URL or path for the CTA button',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Show this promotion on the website',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show in featured promotions section',
      initialValue: false,
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      description: 'Background color for the promotion banner',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'color',
      description: 'Text color for the promotion banner',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'bannerImage',
      active: 'active',
    },
    prepare(selection) {
      const { type, active } = selection
      const status = active ? '🟢' : '🔴'
      return {
        ...selection,
        subtitle: `${status} ${type ? type.charAt(0).toUpperCase() + type.slice(1) : ''} Promotion`
      }
    },
  },
})
