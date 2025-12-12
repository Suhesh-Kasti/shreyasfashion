const seasonSchema = {
    name: 'season',
    title: 'Seasons',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Season Name',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
            options: {
                list: [
                    { title: 'Spring', value: 'Spring' },
                    { title: 'Summer', value: 'Summer' },
                    { title: 'Fall', value: 'Fall' },
                    { title: 'Winter', value: 'Winter' },
                    { title: 'All Season', value: 'All Season' },
                ],
            },
        },
    ],
};

export default seasonSchema;
