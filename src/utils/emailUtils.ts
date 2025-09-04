import { Resend } from 'resend';
import { OrderEmailData, Order } from '@/types/order';
import { getBrandName, getBrandEmail } from '@/config/brand';
import { formatPrice } from './currency';
import { generateOrderSummary } from './orderUtils';

// Initialize Resend conditionally
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

/**
 * Send order notification email to admin
 */
export async function sendOrderNotificationEmail(emailData: OrderEmailData): Promise<void> {
  if (!process.env.ADMIN_EMAIL) {
    throw new Error('ADMIN_EMAIL is not configured');
  }

  const { order, adminEmail } = emailData;

  try {
    const resend = getResendClient();
    const emailHtml = generateAdminOrderEmailHTML(order);
    const emailText = generateOrderSummary(order);

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'orders@daniosfashion.com',
      to: [adminEmail],
      subject: `🛍️ New Order #${order.orderNumber} - ${formatPrice(order.payment.totalAmount)}`,
      html: emailHtml,
      text: emailText,
    });

    console.log('Admin notification email sent:', result);
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(order: Order, customerEmail: string): Promise<void> {
  try {
    const resend = getResendClient();
    const emailHtml = generateCustomerOrderEmailHTML(order);
    const emailText = generateOrderSummary(order);

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || getBrandEmail(),
      to: [customerEmail],
      subject: `Order Confirmation #${order.orderNumber} - ${getBrandName()}`,
      html: emailHtml,
      text: emailText,
    });

    console.log('Customer confirmation email sent:', result);
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    throw error;
  }
}

/**
 * Generate HTML email template for admin notification
 */
function generateAdminOrderEmailHTML(order: Order): string {
  const orderDate = new Date(order.orderDate).toLocaleString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; color: #000; }
        .status { padding: 5px 10px; border-radius: 3px; color: white; }
        .status.confirmed { background: #28a745; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ New Order Received</h1>
          <p>DANIOS Fashion Store</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h2>Order #${order.orderNumber}</h2>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> <span class="status confirmed">${order.orderStatus.toUpperCase()}</span></p>
            <p><strong>Payment Method:</strong> ${order.payment.method.toUpperCase()}</p>
            ${order.payment.esewaTransactionId ? `<p><strong>eSewa Transaction ID:</strong> ${order.payment.esewaTransactionId}</p>` : ''}
          </div>

          <div class="order-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Google User:</strong> ${order.customer.isGoogleUser ? 'Yes' : 'No'}</p>
          </div>

          <div class="order-info">
            <h3>Delivery Address</h3>
            <p>${order.delivery.address}</p>
            <p>${order.delivery.city}${order.delivery.postalCode ? `, ${order.delivery.postalCode}` : ''}</p>
            ${order.delivery.deliveryInstructions ? `<p><strong>Instructions:</strong> ${order.delivery.deliveryInstructions}</p>` : ''}
          </div>

          <div class="order-info">
            <h3>Order Items</h3>
            ${order.items.map(item => `
              <div class="item">
                <p><strong>${item.productTitle}</strong></p>
                <p>Quantity: ${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(item.totalPrice)}</p>
                ${item.selectedVariants ? `
                  <p style="color: #666; font-size: 14px;">
                    ${Object.entries(item.selectedVariants).filter(([_, value]) => value).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  </p>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <div class="order-info">
            <h3>Payment Summary</h3>
            <p>Subtotal: ${formatPrice(order.payment.subtotal)}</p>
            <p>Delivery Fee: ${formatPrice(order.payment.deliveryFee)}</p>
            ${order.payment.discount > 0 ? `<p>Discount: -${formatPrice(order.payment.discount)}</p>` : ''}
            <p class="total">Total: ${formatPrice(order.payment.totalAmount)}</p>
          </div>
        </div>

        <div class="footer">
          <p>This order requires your attention. Please process it as soon as possible.</p>
          <p>DANIOS Fashion Store - Admin Notification</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML email template for customer confirmation
 */
function generateCustomerOrderEmailHTML(order: Order): string {
  const orderDate = new Date(order.orderDate).toLocaleString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; color: #000; }
        .status { padding: 5px 10px; border-radius: 3px; color: white; background: #28a745; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .cta { background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p>Thank you for shopping with DANIOS</p>
        </div>
        
        <div class="content">
          <p>Hi ${order.customer.name},</p>
          <p>Thank you for your order! We've received your order and will process it shortly.</p>

          <div class="order-info">
            <h2>Order #${order.orderNumber}</h2>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> <span class="status">${order.orderStatus.toUpperCase()}</span></p>
            <p><strong>Payment Method:</strong> ${order.payment.method.toUpperCase()}</p>
          </div>

          <div class="order-info">
            <h3>Delivery Address</h3>
            <p>${order.delivery.address}</p>
            <p>${order.delivery.city}${order.delivery.postalCode ? `, ${order.delivery.postalCode}` : ''}</p>
            ${order.delivery.deliveryInstructions ? `<p><strong>Special Instructions:</strong> ${order.delivery.deliveryInstructions}</p>` : ''}
          </div>

          <div class="order-info">
            <h3>Your Items</h3>
            ${order.items.map(item => `
              <div class="item">
                <p><strong>${item.productTitle}</strong></p>
                <p>Quantity: ${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(item.totalPrice)}</p>
                ${item.selectedVariants ? `
                  <p style="color: #666; font-size: 14px;">
                    ${Object.entries(item.selectedVariants).filter(([_, value]) => value).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  </p>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <div class="order-info">
            <h3>Order Total</h3>
            <p>Subtotal: ${formatPrice(order.payment.subtotal)}</p>
            <p>Delivery Fee: ${formatPrice(order.payment.deliveryFee)}</p>
            ${order.payment.discount > 0 ? `<p>Discount: -${formatPrice(order.payment.discount)}</p>` : ''}
            <p class="total">Total Paid: ${formatPrice(order.payment.totalAmount)}</p>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.orderNumber}" class="cta">Track Your Order</a>
          </div>

          <p>We'll send you another email when your order ships. If you have any questions, please contact us.</p>
        </div>

        <div class="footer">
          <p>Thank you for choosing DANIOS Fashion Store!</p>
          <p>Follow us on social media for the latest updates</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdateEmail(
  order: Order,
  customerEmail: string,
  newStatus: string,
  trackingNumber?: string
): Promise<void> {
  try {
    const resend = getResendClient();
    const statusMessages = {
      processing: 'Your order is being processed',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
    };

    const subject = `Order #${order.orderNumber} - ${statusMessages[newStatus as keyof typeof statusMessages] || 'Status Updated'}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Order Status Update</h2>
        <p>Hi ${order.customer.name},</p>
        <p>Your order #${order.orderNumber} status has been updated to: <strong>${newStatus.toUpperCase()}</strong></p>
        ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
        <p>Thank you for shopping with DANIOS Fashion Store!</p>
      </div>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'orders@daniosfashion.com',
      to: [customerEmail],
      subject,
      html: emailHtml,
    });

    console.log('Order status update email sent');
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
}
