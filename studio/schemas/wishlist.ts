import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'wishlist',
    title: 'Wishlist',
    type: 'document',
    fields: [
        defineField({
            name: 'userEmail',
            title: 'User Email',
            type: 'string',
            validation: Rule => Rule.required().email(),
            description: 'Email of the user (from Google Auth)'
        }),
        defineField({
            name: 'items',
            title: 'Wishlist Items',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'product',
                        title: 'Product',
                        type: 'reference',
                        to: [{ type: 'product' }],
                        validation: Rule => Rule.required()
                    },
                    {
                        name: 'addedAt',
                        title: 'Added At',
                        type: 'datetime',
                        initialValue: () => new Date().toISOString()
                    }
                ],
                preview: {
                    select: {
                        title: 'product.title',
                        media: 'product.imgs.thumbnails.0'
                    }
                }
            }]
        })
    ],
    preview: {
        select: {
            email: 'userEmail',
            itemCount: 'items.length'
        },
        prepare({ email, itemCount }) {
            return {
                title: email,
                subtitle: `${itemCount || 0} items`
            }
        }
    }
});
