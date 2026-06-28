import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, 
});

export async function POST(req: Request) {
  try {
    const { productId, userEmail, action } = await req.json();

    console.log(`📥 API RECEIVED: Email: ${userEmail} | ProductID: ${productId} | Action: ${action}`);

    if (!userEmail || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    
    let user = await writeClient.fetch(`*[_type == "user" && email == $email][0]`, { email: userEmail });

    
    if (!user) {
      console.log(`⚠️ USER NOT FOUND IN DB. CREATING AUTOMATICALLY FOR: ${userEmail}`);
      user = await writeClient.create({
        _type: "user",
        name: userEmail.split("@")[0], 
        email: userEmail,
        wishlist: [],
      });
      console.log(`👤 AUTO-CREATED USER ID: ${user._id}`);
    }

    // 2. Add Action
    if (action === "add") {
      await writeClient
        .patch(user._id)
        .setIfMissing({ wishlist: [] })
        .insert("after", "wishlist[-1]", [
          {
            _key: Math.random().toString(36).substring(2, 11),
            _type: "reference",
            _ref: productId,
          },
        ])
        .commit();
        
      console.log(`✅ PRODUCT ${productId} ADDED TO WISHLIST SUCCESSFULLY!`);
    } 
    
    // 3. Remove Action
    else if (action === "remove") {
      await writeClient
        .patch(user._id)
        .unset([`wishlist[_ref == "${productId}"]`])
        .commit();

      console.log(`🗑️ PRODUCT ${productId} REMOVED FROM WISHLIST SUCCESSFULLY!`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ SANITY WISHLIST API CRASHED:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}