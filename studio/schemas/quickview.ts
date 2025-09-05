import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'quickview',
  title: 'Quick View Content',
  type: 'document',
  icon: () => '👁️',
  description: 'Content for product quick view modals',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: { type: 'product' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'highlights',
      title: 'Product Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key features to highlight in quick view',
    }),
    defineField({
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      of: [
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
      description: 'Extra images for quick view gallery',
    }),
    defineField({
      name: 'sizeGuide',
      title: 'Size Guide',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ],
      description: 'Size guide image for this product',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'How to care for this product',
      options: {
        list: [
          { title: 'Machine wash cold', value: 'machine-wash-cold' },
          { title: 'Hand wash only', value: 'hand-wash-only' },
          { title: 'Dry clean only', value: 'dry-clean-only' },
          { title: 'Do not bleach', value: 'no-bleach' },
          { title: 'Tumble dry low', value: 'tumble-dry-low' },
          { title: 'Air dry', value: 'air-dry' },
          { title: 'Iron low heat', value: 'iron-low' },
          { title: 'Do not iron', value: 'no-iron' },
        ],
      },
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'material',
              title: 'Material',
              type: 'string',
              options: {
                list: [
                  { title: 'Cotton', value: 'cotton' },
                  { title: 'Polyester', value: 'polyester' },
                  { title: 'Elastane', value: 'elastane' },
                  { title: 'Wool', value: 'wool' },
                  { title: 'Silk', value: 'silk' },
                  { title: 'Linen', value: 'linen' },
                  { title: 'Viscose', value: 'viscose' },
                  { title: 'Nylon', value: 'nylon' },
                ],
              },
            },
            {
              name: 'percentage',
              title: 'Percentage',
              type: 'number',
              validation: (Rule) => Rule.min(0).max(100),
            },
          ],
          preview: {
            select: {
              material: 'material',
              percentage: 'percentage',
            },
            prepare({ material, percentage }) {
              return {
                title: `${material}: ${percentage}%`,
              }
            },
          },
        }
      ],
      description: 'Material composition (should add up to 100%)',
    }),
    defineField({
      name: 'sustainability',
      title: 'Sustainability Info',
      type: 'text',
      rows: 3,
      description: 'Information about sustainable practices, eco-friendly materials, etc.',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'product' } }],
      description: 'Products to suggest in quick view',
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'fitInfo',
      title: 'Fit Information',
      type: 'object',
      fields: [
        {
          name: 'fit',
          title: 'Fit Type',
          type: 'string',
          options: {
            list: [
              { title: 'Slim Fit', value: 'slim' },
              { title: 'Regular Fit', value: 'regular' },
              { title: 'Relaxed Fit', value: 'relaxed' },
              { title: 'Oversized', value: 'oversized' },
              { title: 'Tight Fit', value: 'tight' },
            ],
          },
        },
        {
          name: 'modelInfo',
          title: 'Model Information',
          type: 'string',
          description: 'e.g., "Model is 5\'8" wearing size M"',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'product.title',
      subtitle: 'product.category.name',
      media: 'product.imgs.thumbnails.0',
    },
    prepare(selection) {
      return {
        title: `Quick View: ${selection.title || 'Untitled Product'}`,
        subtitle: selection.subtitle || 'Product Quick View',
        media: selection.media,
      }
    },
  },
})
