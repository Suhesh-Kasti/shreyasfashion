const productSchema = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price (Rs.)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
      description: 'Price in Nepali Rupees',
    },
    {
      name: 'discountedPrice',
      title: 'Discounted Price (Rs.)',
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
      description: 'Leave empty if no discount. Price in Nepali Rupees',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'imgs',
      title: 'Product Images',
      type: 'object',
      fields: [
        {
          name: 'thumbnails',
          title: 'Thumbnail Images',
          type: 'array',
          of: [
            {
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
          validation: (Rule: any) => Rule.min(1).max(5),
        },
        {
          name: 'gallery',
          title: 'Gallery Images',
          type: 'array',
          of: [
            {
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'reviews',
      title: 'Number of Reviews',
      type: 'number',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as featured to show on homepage',
    },
    {
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: 'Unisex', value: 'unisex' },
          { title: 'Men', value: 'men' },
          { title: 'Women', value: 'women' },
        ],
      },
      initialValue: 'unisex',
    },
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'xs' },
          { title: 'S', value: 's' },
          { title: 'M', value: 'm' },
          { title: 'L', value: 'l' },
          { title: 'XL', value: 'xl' },
          { title: 'XXL', value: 'xxl' },
          { title: 'XXXL', value: 'xxxl' },
        ],
      },
    },
    {
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Color Name',
              type: 'string',
            },
            {
              name: 'value',
              title: 'Color Value',
              type: 'string',
              description: 'Hex color code or color name',
            },
            {
              name: 'image',
              title: 'Color Variant Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              description: 'Product image in this color',
            },
          ],
        },
      ],
    },
    {
      name: 'material',
      title: 'Material',
      type: 'string',
      options: {
        list: [
          { title: '100% Cotton', value: '100% Cotton' },
          { title: 'Cotton Blend', value: 'Cotton Blend' },
          { title: 'Premium Cotton', value: 'Premium Cotton' },
          { title: 'Organic Cotton', value: 'Organic Cotton' },
          { title: 'Polyester Blend', value: 'Polyester Blend' },
          { title: 'Fleece', value: 'Fleece' },
          { title: 'Denim', value: 'Denim' },
        ],
      },
    },
    {
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Casual', value: 'casual' },
          { title: 'Formal', value: 'formal' },
          { title: 'Streetwear', value: 'streetwear' },
          { title: 'Athletic', value: 'athletic' },
          { title: 'Vintage', value: 'vintage' },
          { title: 'Minimalist', value: 'minimalist' },
          { title: 'Oversized', value: 'oversized' },
        ],
      },
    },
    {
      name: 'season',
      title: 'Season',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Spring', value: 'spring' },
          { title: 'Summer', value: 'summer' },
          { title: 'Fall', value: 'fall' },
          { title: 'Winter', value: 'winter' },
          { title: 'All Season', value: 'all-season' },
        ],
      },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'New Arrival', value: 'new-arrival' },
          { title: 'Best Seller', value: 'best-seller' },
          { title: 'Limited Edition', value: 'limited-edition' },
          { title: 'Eco Friendly', value: 'eco-friendly' },
          { title: 'Premium', value: 'premium' },
          { title: 'Trending', value: 'trending' },
          { title: 'Sale', value: 'sale' },
        ],
      },
    },
    {
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      options: {
        list: [
          { title: 'Under Rs. 1,000', value: 'under-1000' },
          { title: 'Rs. 1,000 - 2,500', value: '1000-2500' },
          { title: 'Rs. 2,500 - 5,000', value: '2500-5000' },
          { title: 'Rs. 5,000 - 10,000', value: '5000-10000' },
          { title: 'Over Rs. 10,000', value: 'over-10000' },
        ],
      },
      description: 'Auto-calculated based on price, but can be overridden',
    },
    {
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      description: 'Product weight for shipping calculations',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'imgs.thumbnails.0',
      price: 'price',
      category: 'category.title',
    },
    prepare(selection: any) {
      const { title, media, price, category } = selection
      return {
        title,
        subtitle: `Rs. ${price?.toLocaleString('en-IN')} • ${category || 'No category'}`,
        media,
      }
    },
  },
}

export default productSchema
