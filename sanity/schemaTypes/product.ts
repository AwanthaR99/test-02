import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Product Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'price', title: 'Price (LKR)', type: 'number' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'images', title: 'Product Images', type: 'array', of: [{ type: 'image' }] }),
    defineField({ name: 'category', title: 'Main Category', type: 'reference', to: [{ type: 'category' }] }),
    
    defineField({
      name: 'occasion',
      title: 'Occasion',
      type: 'string',
      options: {
        list: [
          { title: 'Casual Wear', value: 'casual' },
          { title: 'Office Wear', value: 'office' },
          { title: 'Inner Wear', value: 'inner' },
          { title: 'Party / Formal', value: 'party' },
        ],
      },
    }),

    defineField({
      name: 'subCategory',
      title: 'Sub Category',
      type: 'string',
      options: {
        list: [
          // Men & Women Tops
          { title: 'T-Shirt', value: 't-shirt' },
          { title: 'Shirt', value: 'shirt' },
          { title: 'Top/Blouse', value: 'top' },
          
          // Bottoms
          { title: 'Trouser', value: 'trouser' },
          { title: 'Denim/Jeans', value: 'jeans' },
          { title: 'Shorts', value: 'shorts' },
          { title: 'Leggings', value: 'leggings' },
          { title: 'Skirt', value: 'skirt' },
          
          // Traditional & Dresses
          { title: 'Sarong', value: 'sarong' },
          { title: 'Saree', value: 'saree' },
          { title: 'Kurti', value: 'kurti' },
          { title: 'Frock/Dress', value: 'frock' },
          
          // Kids
          { title: 'Kids Set', value: 'kids-set' },

          // Innerwear
          { title: 'Innerwear', value: 'innerwear' },

          // Accessories
          { title: 'Cap/Hat', value: 'cap' },
          { title: 'Belt', value: 'belt' },
          { title: 'Wallet', value: 'wallet' },
          { title: 'Handbag', value: 'handbag' },
          { title: 'Watch', value: 'watch' },
          { title: 'Sunglasses', value: 'sunglasses' },
          { title: 'Perfume', value: 'perfume' },
          { title: 'Cream/Lotion', value: 'cream' },
          { title: 'Hair Oil', value: 'hair-oil' },
        ],
      },
    }),

    defineField({
      name: 'stock',
      title: 'Product Variants (Stock)',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Variant',
          fields: [
            // 1. COLOR - (Frontend එකෙන් "N/A" එව්වත්, "Printed" එව්වත් මේක බාරගන්නවා)
            {
              name: 'color',
              title: 'Color',
              type: 'string',
            },
            // 2. SIZE - (Frontend එකෙන් "Free Size", "32", "L" මොක එව්වත් බාරගන්නවා)
            { 
              name: 'size', 
              title: 'Size', 
              type: 'string', 
            },
            // 3. QUANTITY
            { 
              name: 'quantity', 
              title: 'Quantity Available', 
              type: 'number',
              validation: (Rule) => Rule.min(0) 
            }
          ],
          // මේ preview එකෙන් Sanity Dashboard එකේ ලස්සනට පෙන්වනවා "Black - 32 (Stock: 10)" වගේ.
          preview: {
            select: {
              color: 'color',
              size: 'size',
              qty: 'quantity'
            },
            prepare({ color, size, qty }) {
              return {
                title: `${color || 'N/A'} - ${size || 'Free Size'}`,
                subtitle: `Stock: ${qty ?? 0}`
              }
            }
          }
        }
      ]
    }),
  ],
})