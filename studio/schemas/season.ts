export default {
    name: 'season',
    title: 'Season',
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
