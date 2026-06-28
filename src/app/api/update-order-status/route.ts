import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Frontend එකෙන් එවන Document ID එක සහ අලුත් Status එක ගන්නවා
    // (Frontend එකේ ලියපු විදිය අනුව id හරි orderId හරි එන්න පුළුවන්)
    const { id, orderId, status } = body;
    const docId = id || orderId;

    if (!docId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Sanity Database එකේ අදාළ Order Document එකේ Status එක අප්ඩේට් කරනවා
    const updatedOrder = await client
      .patch(docId)
      .set({ status: status.toLowerCase() }) // Schema එකේ 'shipped', 'delivered' කියලා තියෙන නිසා අකුරු පොඩි කරනවා
      .commit();

    return NextResponse.json({ message: "Order status updated successfully!", order: updatedOrder });
    
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}