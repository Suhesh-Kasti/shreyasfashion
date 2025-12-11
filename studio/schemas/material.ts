export default {
    name: 'material',
    title: 'Material',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        }
    ]
}
