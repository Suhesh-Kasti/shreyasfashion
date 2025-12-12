import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'footerSettings',
    title: 'Footer Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'helpSupport',
            title: 'Help & Support',
            type: 'object',
            fields: [
                { name: 'sectionTitle', title: 'Section Title', type: 'string' },
                {
                    name: 'address',
                    title: 'Address',
                    type: 'object',
                    fields: [
                        { name: 'text', title: 'Address Text', type: 'string' },
                        { name: 'icon', title: 'Icon', type: 'image' }
                    ]
                },
                {
                    name: 'phone',
                    title: 'Phone',
                    type: 'object',
                    fields: [
                        { name: 'number', title: 'Phone Number', type: 'string' },
                        { name: 'icon', title: 'Icon', type: 'image' }
                    ]
                },
                {
                    name: 'email',
                    title: 'Email',
                    type: 'object',
                    fields: [
                        { name: 'address', title: 'Email Address', type: 'string' },
                        { name: 'icon', title: 'Icon', type: 'image' }
                    ]
                }
            ]
        }),

        defineField({
            name: 'quickLinks',
            title: 'Quick Links',
            type: 'object',
            fields: [
                { name: 'sectionTitle', title: 'Section Title', type: 'string' },
                {
                    name: 'links',
                    title: 'Links',
                    type: 'array',
                    of: [{
                        type: 'object',
                        fields: [
                            { name: 'label', title: 'Link Label', type: 'string' },
                            { name: 'url', title: 'Link URL', type: 'string' }
                        ]
                    }]
                }
            ]
        }),

        defineField({
            name: 'accountLinks',
            title: 'Account Links',
            type: 'object',
            fields: [
                { name: 'sectionTitle', title: 'Section Title', type: 'string' },
                {
                    name: 'links',
                    title: 'Links',
                    type: 'array',
                    of: [{
                        type: 'object',
                        fields: [
                            { name: 'label', title: 'Link Label', type: 'string' },
                            { name: 'url', title: 'Link URL', type: 'string' }
                        ]
                    }]
                }
            ]
        }),

        defineField({
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'object',
            fields: [
                { name: 'sectionTitle', title: 'Section Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' },
                {
                    name: 'platforms',
                    title: 'Social Platforms',
                    type: 'array',
                    of: [{
                        type: 'object',
                        fields: [
                            { name: 'name', title: 'Platform Name', type: 'string' },
                            { name: 'url', title: 'Profile URL', type: 'url' },
                            { name: 'icon', title: 'Icon (SVG or Image)', type: 'image' },
                            {
                                name: 'iconSvg',
                                title: 'Icon SVG Code (Alternative)',
                                type: 'text',
                                description: 'Paste SVG code here if you prefer SVG over image'
                            },
                            { name: 'bgColor', title: 'Background Color', type: 'string', description: 'e.g. #1877f2 for Facebook' }
                        ]
                    }]
                }
            ]
        }),

        defineField({
            name: 'paymentMethods',
            title: 'Payment Methods',
            type: 'object',
            fields: [
                { name: 'sectionTitle', title: 'Section Title', type: 'string' },
                {
                    name: 'methods',
                    title: 'Payment Methods',
                    type: 'array',
                    of: [{
                        type: 'object',
                        fields: [
                            { name: 'name', title: 'Method Name', type: 'string' },
                            { name: 'icon', title: 'Icon', type: 'image' },
                            { name: 'bgColor', title: 'Background Color', type: 'string' }
                        ]
                    }]
                }
            ]
        }),

        defineField({
            name: 'copyrightText',
            title: 'Copyright Text',
            type: 'string'
        }),

        defineField({
            name: 'founderName',
            title: 'Founder/Owner Name',
            type: 'string'
        })
    ]
});
