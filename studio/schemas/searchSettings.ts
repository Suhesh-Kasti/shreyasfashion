import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'searchSettings',
    title: 'Search Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'quickSearch',
            title: 'Quick Search Links',
            type: 'array',
            description: 'Category shortcuts that appear in the search dropdown',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'label',
                        title: 'Display Label',
                        type: 'string',
                        validation: Rule => Rule.required()
                    },
                    {
                        name: 'url',
                        title: 'URL',
                        type: 'string',
                        description: 'e.g., /shop-collection?category=sweatshirts',
                        validation: Rule => Rule.required()
                    }
                ]
            }]
        }),

        defineField({
            name: 'popularSearches',
            title: 'Popular Search Terms',
            type: 'array',
            description: 'Popular search keywords displayed as quick-click buttons',
            of: [{
                type: 'string'
            }],
            validation: Rule => Rule.max(8)
        })
    ],

    preview: {
        prepare() {
            return {
                title: 'Search Settings'
            }
        }
    }
});
