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
    
    // 🌟 1. WEBSITE එකට දානවාද නැද්ද කියලා අහන TOGGLE SWITCH එක
    defineField({
      name: 'showOnWebsite',
      title: 'Show on Website',
      type: 'boolean',
      initialValue: false,
      description: 'Turn this on to publish this product on the e-commerce website.',
    }),

    // 🌟 2. IMAGES FIELD එක (Toggle එක true නම් විතරක් image එකක් අනිවාර්යයෙන්ම ඉල්ලනවා)
    defineField({ 
      name: 'images', 
      title: 'Product Images', 
      type: 'array', 
      of: [{ type: 'image' }],
      validation: (Rule) =>
        Rule.custom((images, context) => {
          const document = context.document as any;
          // වෙබ්සයිට් එකට දාන්න කියලා ස්විච් එක ඔන් කරලා, හැබැයි ඉමේජ් දාලා නැත්නම් error එකක් දෙනවා
          if (document?.showOnWebsite && (!images || images.length === 0)) {
            return 'Product images are required if "Show on Website" is enabled.';
          }
          return true;
        }),
    }),

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
            // 🌟 3. ERP එකෙන් එන SKU එක (සැනිටි එකේ මැනුවලි වෙනස් කරන්න බැරි වෙන්න readOnly කරනවා)
            {
              name: 'sku',
              title: 'SKU (Stock Keeping Unit)',
              type: 'string',
              readOnly: true,
              description: 'Auto-generated via ERP backend.',
            },
            {
              name: 'color',
              title: 'Color',
              type: 'string',
            },
            { 
              name: 'size', 
              title: 'Size', 
              type: 'string', 
            },
            { 
              name: 'quantity', 
              title: 'Quantity Available', 
              type: 'number',
              validation: (Rule) => Rule.min(0) 
            }
          ],
          preview: {
            select: {
              sku: 'sku',
              color: 'color',
              size: 'size',
              qty: 'quantity'
            },
            prepare({ sku, color, size, qty }) {
              return {
                title: `${color || 'N/A'} - ${size || 'Free Size'} [${sku || 'NO SKU'}]`,
                subtitle: `Stock: ${qty ?? 0}`
              }
            }
          }
        }
      ]
    }),
  ],
})