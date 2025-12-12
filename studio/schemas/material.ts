const materialSchema = {
    name: 'material',
    title: 'Materials',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Material Name',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        },
    ],
};

export default materialSchema;
