import { defineField, defineType } from 'sanity'

export const coupon = defineType({
  name: 'coupon',
  title: 'Coupons',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'The code users will enter (e.g., MEN20)',
      validation: (Rule: any) => Rule.required().uppercase(),
    }),
    
    // 🌟 DISCOUNT TYPE SELECTOR (PERCENTAGE OR FIXED)
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage (%)', value: 'percentage' },
          { title: 'Fixed Amount (LKR)', value: 'fixed' },
        ],
        layout: 'radio',
      },
      initialValue: 'percentage',
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: 'discount',
      title: 'Discount Value',
      description: 'Enter percentage value (1-100) or fixed LKR amount.',
      type: 'number',
      validation: (Rule: any) =>
        Rule.required().custom((value: number, context: any) => {
          const type = context.document?.discountType;
          if (type === 'percentage') {
            if (value < 1 || value > 100) {
              return 'Percentage must be between 1 and 100%';
            }
          }
          if (type === 'fixed') {
            if (value < 1) {
              return 'Fixed discount amount must be greater than 0 LKR';
            }
          }
          return true;
        }),
    }),

    // 🌟 EXCLUSIVE LOYALTY EMAIL RESTRICTION
    defineField({
      name: 'allowedEmail',
      title: 'Allowed Customer Email (Loyalty Restriction)',
      type: 'string',
      description: 'Leave empty for store-wide use. Enter an email to lock this coupon to a specific loyalty customer.',
    }),

    defineField({
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
    }),

    defineField({
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
    }),

    defineField({
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
    }),

    defineField({
      name: 'isActive',
      title: 'Is Active?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})