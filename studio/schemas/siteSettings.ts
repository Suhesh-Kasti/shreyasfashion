const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: "Shreya's Fashion",
    },
    {
      name: 'description',
      title: 'Site Description',
      type: 'text',
      initialValue: 'Premium streetwear crafted in Nepal',
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'backgroundImage',
          title: 'Hero Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          description: 'Main hero banner background image',
        },
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          initialValue: 'Elevate Your Everyday',
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'string',
          initialValue: "Crafted in Nepal by Shreya's Fashion. Premium streetwear that defines your style.",
        },
        {
          name: 'ctaText',
          title: 'Call to Action Text',
          type: 'string',
          initialValue: 'Shop Collection',
        },
        {
          name: 'secondaryCtaText',
          title: 'Secondary CTA Text',
          type: 'string',
          initialValue: 'Our Story',
        },
      ],
    },
    {
      name: 'aboutSection',
      title: 'About Section',
      type: 'object',
      fields: [
        {
          name: 'founderImage',
          title: 'Founder Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          description: 'Photo of Shreya Ghimire, founder',
        },
        {
          name: 'companyImages',
          title: 'Company Images',
          type: 'array',
          of: [
            {
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
          description: 'Images showcasing the company, workshop, products, etc.',
        },
      ],
    },
    {
      name: 'brandStats',
      title: 'Brand Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Statistic Value',
              type: 'string',
              description: 'e.g., "100%", "Made", "Free"',
            },
            {
              name: 'label',
              title: 'Statistic Label',
              type: 'string',
              description: 'e.g., "Premium Cotton", "in Nepal", "Shipping"',
            },
          ],
        },
      ],
      initialValue: [
        { value: '100%', label: 'Premium Cotton' },
        { value: 'Made', label: 'in Nepal' },
        { value: 'Free', label: 'Shipping' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroSection.backgroundImage',
    },
    prepare(selection: any) {
      return {
        title: `Site Settings: ${selection.title}`,
        media: selection.media,
      }
    },
  },
}

export default siteSettingsSchema
