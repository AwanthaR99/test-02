import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  // ⚠️ පොඩි දෙයක්: කලින් අපි .env එකේ හැදුවේ NEXT_PUBLIC_SANITY_WRITE_TOKEN කියලා නම්, මෙතනත් ඒ නමම දාන්න. නැත්නම් SANITY_API_TOKEN තිබ්බට කමක් නෑ .env එකේ ඒක තියෙනවා නම්.
  token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN, 
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Create a clean slug from the title
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').slice(0, 96);

    const newProduct: any = {
      _type: 'product',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      price: Number(data.price),
      description: data.description,
      
      // 🌟 1. අලුතින් එකතු කරපු E-commerce Toggle එක
      isSyncedToWeb: Boolean(data.isSyncedToWeb), 
      
      occasion: data.occasion !== "" ? data.occasion : undefined,
      subCategory: data.subCategory !== "" ? data.subCategory : undefined,
      
      // 🌟 2. Stock Variants ටික අලුත් විදිහට Map කිරීම (sku, inStoreStock, webStock)
      stock: data.stock.map((item: any) => ({
        _key: crypto.randomUUID(), 
        sku: item.sku,
        color: item.color,
        size: item.size,
        inStoreStock: Number(item.inStoreStock),
        webStock: Number(item.webStock)
      })),

      // UPDATE: Handle multiple images (Mapping through imageIds array)
      images: data.imageIds && data.imageIds.length > 0 
        ? data.imageIds.map((id: string) => ({
            _key: crypto.randomUUID(),
            _type: 'image',
            asset: { _type: 'reference', _ref: id }
          }))
        : []
    };

    // Add category reference if selected
    if (data.categoryId) {
      newProduct.category = {
        _type: 'reference',
        _ref: data.categoryId
      };
    }

    // Save to Sanity Database
    const response = await writeClient.create(newProduct);
    return NextResponse.json({ success: true, product: response });

  } catch (error) {
    console.error("Product creation failed:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}