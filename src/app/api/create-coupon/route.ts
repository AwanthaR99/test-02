// src/app/api/create-coupon/route.ts
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
    const data = await req.json();
    
    const newCoupon = {
      _type: 'coupon',
      code: data.code.toUpperCase(), // must capital letters
      discount: Number(data.discount),
      isActive: true, 
    };

    const response = await writeClient.create(newCoupon);
    return NextResponse.json({ success: true, coupon: response });

  } catch (error) {
    console.error("Coupon creation failed:", error);
    return NextResponse.json({ success: false, error: "Failed to create coupon" }, { status: 500 });
  }
}