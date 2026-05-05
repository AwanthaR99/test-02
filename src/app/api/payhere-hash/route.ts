import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, amount, currency } = body;

    // 1. Credentials getting
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // 2. Credentials checking
    if (!merchantId || !merchantSecret) {
      console.error("PayHere Error: Missing Credentials in .env.local");
      return NextResponse.json({ error: "Missing PayHere credentials" }, { status: 500 });
    }

    // 3. Secret  convert to MD5 and Uppercase
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    // 4. Amount 
    const amountFormatted = parseFloat(amount).toFixed(2);

    // 5. Hash String 
    // Formula: merchant_id + order_id + amount + currency + hashedSecret
    const hashStringRaw = `${merchantId}${order_id}${amountFormatted}${currency}${hashedSecret}`;

    
    console.log("================ PAYHERE HASH DEBUG ================");
    console.log("Merchant ID:", merchantId);
    console.log("Order ID:", order_id);
    console.log("Amount (Formatted):", amountFormatted);
    console.log("Currency:", currency);
    console.log("Secret (Hashed):", hashedSecret); 
    console.log("Pre-Hash String:", hashStringRaw);
    console.log("====================================================");

    // 6. Final Hash 
    const hash = crypto
      .createHash("md5")
      .update(hashStringRaw)
      .digest("hex")
      .toUpperCase();

    return NextResponse.json({ hash, merchantId });

  } catch (error) {
    console.error("PayHere Hash Generation Error:", error);
    return NextResponse.json({ error: "Hash generation failed" }, { status: 500 });
  }
}