import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId, orderNumber, total, customerName, customerEmail } = await request.json();

    // Send email to customer
    const customerEmailResult = await sendEmail({
      to: customerEmail,
      ...emailTemplates.orderConfirmation(customerName, orderNumber, total),
    });

    // Send email to admin
    const adminEmailResult = await sendEmail({
      to: 'admin@shopflow.com',
      subject: `New Order Received - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">New Order Notification</h1>
          <p>A new order has been placed on ShopFlow.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
            <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
          </div>
          <p>Please review and process this order in the admin dashboard.</p>
          <p>Best regards,<br>ShopFlow System</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      customerEmailSent: customerEmailResult.success,
      adminEmailSent: adminEmailResult.success,
    });
  } catch (error) {
    console.error('Error sending order notification emails:', error);
    return NextResponse.json(
      { error: 'Failed to send notification emails' },
      { status: 500 }
    );
  }
}