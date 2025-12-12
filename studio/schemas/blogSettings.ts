import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'blogSettings',
    title: 'Blog Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'sidebar',
            title: 'Sidebar Widgets',
            type: 'object',
            fields: [
                {
                    name: 'showLatestPosts',
                    title: 'Show Latest Posts',
                    type: 'boolean',
                    initialValue: true
                },
                {
                    name: 'latestPostsCount',
                    title: 'Number of Latest Posts',
                    type: 'number',
                    initialValue: 5,
                    validation: Rule => Rule.min(1).max(10)
                },
                {
                    name: 'showNewProducts',
                    title: 'Show New Products',
                    type: 'boolean',
                    initialValue: true
                },
                {
                    name: 'newProductsCount',
                    title: 'Number of New Products',
                    type: 'number',
                    initialValue: 4,
                    validation: Rule => Rule.min(1).max(8)
                }
            ]
        }),
        defineField({
            name: 'socialShare',
            title: 'Social Share Settings',
            type: 'object',
            fields: [
                {
                    name: 'enableSharing',
                    title: 'Enable Social Sharing',
                    type: 'boolean',
                    initialValue: true
                },
                {
                    name: 'platforms',
                    title: 'Share Platforms',
                    type: 'array',
                    of: [{
                        type: 'string'
                    }],
                    options: {
                        list: [
                            { title: 'Facebook', value: 'facebook' },
                            { title: 'X (Twitter)', value: 'twitter' },
                            { title: 'Pinterest', value: 'pinterest' },
                            { title: 'WhatsApp', value: 'whatsapp' },
                            { title: 'LinkedIn', value: 'linkedin' },
                            { title: 'Copy Link', value: 'copy' }
                        ]
                    },
                    initialValue: ['facebook', 'twitter', 'pinterest', 'whatsapp', 'copy']
                }
            ]
        })
    ],
    preview: {
        prepare() {
            return {
                title: 'Blog Settings'
            }
        }
    }
});
