const deliverySettings = {
    name: 'deliverySettings',
    title: 'Delivery Settings',
    type: 'document',
    fields: [
        {
            name: 'freeDeliveryThreshold',
            title: 'Free Delivery Threshold (NPR)',
            type: 'number',
            description: 'Orders above this amount get free delivery',
            validation: (Rule: any) => Rule.required().min(0),
            initialValue: 2000,
        },
        {
            name: 'standardDeliveryFee',
            title: 'Standard Delivery Fee (NPR)',
            type: 'number',
            description: 'Delivery fee for orders below threshold',
            validation: (Rule: any) => Rule.required().min(0),
            initialValue: 150,
        },
        {
            name: 'estimatedDeliveryDays',
            title: 'Estimated Delivery Days',
            type: 'number',
            description: 'Number of days for standard delivery',
            validation: (Rule: any) => Rule.required().min(1),
            initialValue: 5,
        },
    ],
    preview: {
        prepare() {
            return {
                title: 'Delivery Settings',
            };
        },
    },
};

export default deliverySettings;
