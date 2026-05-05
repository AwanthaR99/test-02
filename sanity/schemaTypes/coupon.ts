export default {
  name: 'coupon',
  title: 'Coupons',
  type: 'document',
  fields: [
    {
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'The code users will enter (e.g., SAVE10)',
      validation: (Rule: any) => Rule.required().uppercase(), // Must Uppercase only
    },
    {
      name: 'discount',
      title: 'Discount Percentage (%)',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(100), // 1% to 100%
    },
    {
      name: 'isActive',
      title: 'Is Active?',
      type: 'boolean',
      initialValue: true,
    }
  ]
}