export default {
    name: 'style',
    title: 'Style',
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
