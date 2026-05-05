export default {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    {
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
    },
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    
    {
      name: 'address',
      title: 'Shipping Address',
      type: 'text',
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'quantity', type: 'number' },
            { name: 'price', type: 'number' },
            
            { name: 'size', type: 'string' },
            { name: 'color', type: 'string' },
            { name: 'product', type: 'reference', to: [{ type: 'product' }] }
          ]
        }
      ]
    },
    {
      name: 'totalAmount',
      title: 'Total Amount (Inc. Shipping)',
      type: 'number',
    },
    
    {
      name: 'shippingFee',
      title: 'Shipping Fee',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
        ],
        layout: 'radio'
      },
      initialValue: 'pending'
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }
  ]
}