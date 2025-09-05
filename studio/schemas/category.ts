const categorySchema = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Main category image for tiles and banners',
    },
    {
      name: 'bannerImage',
      title: 'Category Banner Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Large banner image for category pages',
    },
    {
      name: 'icon',
      title: 'Category Icon',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Small icon for navigation and filters',
    },
    {
      name: 'featured',
      title: 'Featured Category',
      type: 'boolean',
      initialValue: false,
      description: 'Show this category prominently on the homepage',
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      featured: 'featured',
    },
    prepare(selection: any) {
      const { title, media, featured } = selection
      return {
        title,
        subtitle: featured ? 'Featured Category' : 'Category',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
}

export default categorySchema
