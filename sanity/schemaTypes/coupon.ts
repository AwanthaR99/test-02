export default {
  name: 'coupon',
  title: 'Coupons',
  type: 'document',
  fields: [
    {
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'The code users will enter (e.g., MEN20)',
      validation: (Rule: any) => Rule.required().uppercase(),
    },
    {
      name: 'discount',
      title: 'Discount Percentage (%)',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(100),
    },
    {
      name: 'applicableCategory',
      title: 'Applicable Category',
      type: 'string',
      description: 'Select which category this coupon belongs to. Choose "all" for store-wide discount.',
      options: {
        list: [
          { title: 'All Products', value: 'all' },
          { title: 'Men', value: 'men' },
          { title: 'Women', value: 'women' },
          { title: 'Kids', value: 'kids' },
          { title: 'Accessories', value: 'accessories' },
        ],
      },
      initialValue: 'all', // ඉබේම All Products කියලා සෙට් වෙනවා
    },
    {
      name: 'isActive',
      title: 'Is Active?',
      type: 'boolean',
      initialValue: true,
    }
  ]
}