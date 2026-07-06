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
      // 🚨 මෙතන (Rule: any) ලෙස වෙනස් කර ඇත
      validation: (Rule: any) => Rule.required().uppercase(),
    },
    {
      name: 'discount',
      title: 'Discount Percentage (%)',
      type: 'number',
      // 🚨 මෙතනත් (Rule: any) ලෙස වෙනස් කර ඇත
      validation: (Rule: any) => Rule.min(1).max(100),
    },
    {
      name: 'applicableCategory',
      title: 'Applicable Main Category',
      type: 'string',
      description: 'Select which main category this coupon belongs to.',
      options: {
        list: [
          { title: 'All Products', value: 'all' },
          { title: 'Men', value: 'men' },
          { title: 'Women', value: 'women' },
          { title: 'Kids', value: 'kids' },
          { title: 'Accessories', value: 'accessories' },
        ],
      },
      initialValue: 'all',
    },
    {
      name: 'applicableOccasion',
      title: 'Applicable Occasion',
      type: 'string',
      description: 'Select occasion if needed. (Only if Main Category is NOT "All")',
      options: {
        list: [
          { title: 'Any Occasion', value: 'any' },
          { title: 'Casual Wear', value: 'casual' },
          { title: 'Office Wear', value: 'office' },
          { title: 'Inner Wear', value: 'inner' },
          { title: 'Party / Formal', value: 'party' },
        ],
      },
      initialValue: 'any',
      hidden: ({ document }: any) => document?.applicableCategory === 'all',
    },
    {
      name: 'applicableSubCategory',
      title: 'Applicable Sub Category',
      type: 'string',
      description: 'Select specific sub-category if needed.',
      options: {
        list: [
          { title: 'Any Sub Category', value: 'any' },
          { title: 'T-Shirt', value: 't-shirt' },
          { title: 'Shirt', value: 'shirt' },
          { title: 'Top/Blouse', value: 'top' },
          { title: 'Trouser', value: 'trouser' },
          { title: 'Denim/Jeans', value: 'jeans' },
          { title: 'Shorts', value: 'shorts' },
          { title: 'Leggings', value: 'leggings' },
          { title: 'Skirt', value: 'skirt' },
          { title: 'Sarong', value: 'sarong' },
          { title: 'Saree', value: 'saree' },
          { title: 'Kurti', value: 'kurti' },
          { title: 'Frock/Dress', value: 'frock' },
          { title: 'Kids Set', value: 'kids-set' },
          { title: 'Innerwear', value: 'innerwear' },
          { title: 'Cap/Hat', value: 'cap' },
          { title: 'Belt', value: 'belt' },
          { title: 'Wallet', value: 'wallet' },
          { title: 'Handbag', value: 'handbag' },
          { title: 'Watch', value: 'watch' },
          { title: 'Sunglasses', value: 'sunglasses' },
          { title: 'Perfume', value: 'perfume' },
        ],
      },
      initialValue: 'any',
      hidden: ({ document }: any) => document?.applicableCategory === 'all',
    },
    {
      name: 'isActive',
      title: 'Is Active?',
      type: 'boolean',
      initialValue: true,
    }
  ]
}