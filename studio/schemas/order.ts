const orderSchema = {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'Unique order identifier',
      validation: (Rule: any) => Rule.required(),
      readOnly: true,
    },
    {
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      description: 'Current status of the order',
      options: {
        list: [
          { title: 'Pending Payment', value: 'pending' },
          { title: 'Payment Confirmed', value: 'confirmed' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'confirmed',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      description: 'Payment verification status',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'completed',
      validation: (Rule: any) => Rule.required(),
    },
    
    // Customer Information
    {
      name: 'customer',
      title: 'Customer Information',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Full Name',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'email',
          title: 'Email Address',
          type: 'string',
          validation: (Rule: any) => Rule.required().email(),
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'isGoogleUser',
          title: 'Google Account User',
          type: 'boolean',
          description: 'Whether customer used Google sign-in',
          initialValue: false,
        },
      ],
    },

    // Delivery Information
    {
      name: 'delivery',
      title: 'Delivery Information',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Delivery Address',
          type: 'text',
          rows: 3,
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
        },
        {
          name: 'deliveryInstructions',
          title: 'Delivery Instructions',
          type: 'text',
          rows: 2,
          description: 'Special instructions for delivery',
        },
        {
          name: 'estimatedDelivery',
          title: 'Estimated Delivery Date',
          type: 'date',
          description: 'Expected delivery date',
        },
      ],
    },

    // Order Items
    {
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'productId',
              title: 'Product ID',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'productTitle',
              title: 'Product Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(1),
            },
            {
              name: 'unitPrice',
              title: 'Unit Price (Rs.)',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(0),
            },
            {
              name: 'totalPrice',
              title: 'Total Price (Rs.)',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(0),
            },
            {
              name: 'selectedVariants',
              title: 'Selected Variants',
              type: 'object',
              fields: [
                {
                  name: 'size',
                  title: 'Size',
                  type: 'string',
                },
                {
                  name: 'color',
                  title: 'Color',
                  type: 'string',
                },
                {
                  name: 'material',
                  title: 'Material',
                  type: 'string',
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'productTitle',
              quantity: 'quantity',
              price: 'totalPrice',
            },
            prepare({ title, quantity, price }: any) {
              return {
                title: title,
                subtitle: `Qty: ${quantity} - Rs. ${price?.toLocaleString('en-IN')}`,
              }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },

    // Payment Information
    {
      name: 'payment',
      title: 'Payment Information',
      type: 'object',
      fields: [
        {
          name: 'method',
          title: 'Payment Method',
          type: 'string',
          options: {
            list: [
              { title: 'eSewa', value: 'esewa' },
              { title: 'Cash on Delivery', value: 'cod' },
              { title: 'Bank Transfer', value: 'bank_transfer' },
            ],
          },
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'esewaTransactionId',
          title: 'eSewa Transaction ID',
          type: 'string',
          description: 'eSewa payment reference ID',
          hidden: ({ parent }: any) => parent?.method !== 'esewa',
        },
        {
          name: 'subtotal',
          title: 'Subtotal (Rs.)',
          type: 'number',
          validation: (Rule: any) => Rule.required().min(0),
        },
        {
          name: 'deliveryFee',
          title: 'Delivery Fee (Rs.)',
          type: 'number',
          initialValue: 0,
          validation: (Rule: any) => Rule.min(0),
        },
        {
          name: 'discount',
          title: 'Discount (Rs.)',
          type: 'number',
          initialValue: 0,
          validation: (Rule: any) => Rule.min(0),
        },
        {
          name: 'totalAmount',
          title: 'Total Amount (Rs.)',
          type: 'number',
          validation: (Rule: any) => Rule.required().min(0),
        },
      ],
    },

    // Timestamps
    {
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      readOnly: true,
    },

    // Admin Notes
    {
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes for order processing',
    },
    {
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'Shipping tracking number (if applicable)',
    },
  ],

  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customer.name',
      totalAmount: 'payment.totalAmount',
      status: 'orderStatus',
      orderDate: 'orderDate',
    },
    prepare({ orderNumber, customerName, totalAmount, status, orderDate }: any) {
      const date = orderDate ? new Date(orderDate).toLocaleDateString() : 'Unknown';
      const amount = totalAmount ? `Rs. ${totalAmount.toLocaleString('en-IN')}` : 'Rs. 0';
      
      return {
        title: `Order #${orderNumber}`,
        subtitle: `${customerName} - ${amount} - ${status}`,
        description: `Ordered on ${date}`,
        media: '🛍️',
      }
    },
  },

  orderings: [
    {
      title: 'Order Date (Newest First)',
      name: 'orderDateDesc',
      by: [{ field: 'orderDate', direction: 'desc' }],
    },
    {
      title: 'Order Date (Oldest First)',
      name: 'orderDateAsc',
      by: [{ field: 'orderDate', direction: 'asc' }],
    },
    {
      title: 'Order Number',
      name: 'orderNumber',
      by: [{ field: 'orderNumber', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'orderStatus', direction: 'asc' }],
    },
  ],
}

export default orderSchema
