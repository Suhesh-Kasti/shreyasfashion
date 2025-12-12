const tagSchema = {
    name: 'tag',
    title: 'Tags',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Tag Name',
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
    ],
};

export default tagSchema;
