import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, discountAmount } = await req.json();

    if (!email || !discountAmount) {
      return NextResponse.json({ error: "Email and Discount Amount are required" }, { status: 400 });
    }

    // 1. Unique Coupon Code එකක් auto-generate කරගන්නවා (e.g., LOYAL-7X9B)
    const uniqueId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const couponCode = `LOYAL-${uniqueId}`;

    // 2. සැනිටි එක ඇතුළේ අලුත් Coupon Document එකක් create කරනවා
    await client.create({
      _type: "coupon",
      code: couponCode,
      discountType: "fixed", // Fixed Price Discount
      discount: Number(discountAmount),
      allowedEmail: email.trim().toLowerCase(), // Email එක ලොක් කරනවා
      applicableCategory: "all",
      isActive: true,
    });

    // 3. Nodemailer හරහා Loyalty Customer ට Email එක සෙට් කිරීම
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ඔයාගේ Gmail එක
        pass: process.env.EMAIL_PASS, // App Password එක
      },
    });

    const mailOptions = {
      from: `"Amila Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎁 Exclusive Loyalty Reward from Amila Fashion!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; rounded-style: 8px;">
          <h2 style="color: #4f46e5; text-transform: uppercase;">Thank you for being loyal!</h2>
          <p>Hi there,</p>
          <p>We appreciate your continuous support for Amila Fashion. As a special token of appreciation, we have generated an exclusive <b>Fixed Price Discount Coupon</b> just for you!</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #4f46e5; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #4b5563;">Your Exclusive Coupon Code:</p>
            <h1 style="margin: 5px 0; font-size: 28px; letter-spacing: 2px; color: #111827;">${couponCode}</h1>
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #10b981;">Discount Value: Rs. ${Number(discountAmount).toLocaleString()}.00</p>
          </div>

          <p style="font-size: 12px; color: #6b7280;">* Note: This coupon is strictly tied to your email address (${email}) and cannot be used by any other account.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; text-align: center; color: #9ca3af;">Amila Fashion Control Panel Automation</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Coupon generated and Email sent!", couponCode });

  } catch (error: any) {
    console.error("Loyalty Coupon Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}