import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const orderData = await req.json();
    
    // 🚨 UPDATE: මොන නමින් ආවත් අල්ලගන්න Fallbacks දැම්මා
    const orderId = orderData.orderId || "N/A";
    const customerName = orderData.customerName || "Customer";
    const email = orderData.email;
    const phone = orderData.phone || "N/A";
    const address = orderData.address || "No address provided";
    const items = orderData.items || [];
    
    // සල්ලි ගාණ totalAmount, total, හෝ amount කියන ඕනම එකකින් ගන්නවා
    const finalAmount = orderData.totalAmount || orderData.total || orderData.amount || 0;

    // 1. Setup Email Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Generate Items Table Rows for the Email
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.title || "Item"}</strong><br/>
          <small style="color: #666;">Size: ${item.size || "N/A"} | Color: ${item.color || "N/A"}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${(item.price * (item.quantity || 1)).toLocaleString()}</td>
      </tr>
    `).join("");

    // ==========================================
    // 📧 EMAIL 1: CUSTOMER RECEIPT
    // ==========================================
    const customerMailOptions = {
      from: `"Amila Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation - ${orderId} | Amila Fashion`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">AMILA FASHION</h1>
            <p style="margin: 5px 0 0;">Thank you for your purchase!</p>
          </div>
          
          <div style="padding: 30px;">
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>We've successfully received your payment. Your order is now being processed. Here are the details:</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
              <p style="margin: 5px 0 0;"><strong>Total Amount:</strong> Rs. ${finalAmount.toLocaleString()}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f3f4f6; text-align: left;">
                  <th style="padding: 10px;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <h3 style="margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 5px;">Shipping Information</h3>
            <p style="color: #4b5563; line-height: 1.5;">
              ${address.replace(/\n/g, "<br>")} <br/>
              <strong>Phone:</strong> ${phone}
            </p>

            <p style="margin-top: 30px; font-size: 14px; color: #6b7280; text-align: center;">
              If you have any questions, reply to this email or contact our support team.
            </p>
          </div>
        </div>
      `,
    };

    // ==========================================
    // 📧 EMAIL 2: ADMIN ALERT
    // ==========================================
    const adminMailOptions = {
      from: `"Amila Fashion System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: `🚨 NEW ORDER RECEIVED: ${orderId} - Rs. ${finalAmount.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ffedd5; border-radius: 8px;">
          <div style="background-color: #ea580c; padding: 15px; text-align: center; color: white;">
            <h2 style="margin: 0;">New Order Alert! 🎉</h2>
          </div>
          <div style="padding: 20px;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Value:</strong> Rs. ${finalAmount.toLocaleString()}</p>
            
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details:</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            
            <a href="http://localhost:3000/admin/orders" style="display: block; width: 100%; text-align: center; background-color: #4F46E5; color: white; padding: 12px 0; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
              View Order in Dashboard
            </a>
          </div>
        </div>
      `,
    };

    // 3. Send Both Emails parallelly
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    return NextResponse.json({ success: true, message: "Emails sent successfully" });

  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ success: false, error: "Failed to send emails" }, { status: 500 });
  }
}