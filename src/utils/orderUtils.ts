import { CreateOrderData, Order, OrderItem } from '@/types/order';
import { formatPrice } from './currency';

/**
 * Generate a unique order number
 * Format: DANIOS-YYYYMMDD-XXXX (e.g., DANIOS-20241222-0001)
 */
export const generateOrderNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  
  return `DANIOS-${year}${month}${day}-${random}`;
};

/**
 * Calculate order totals from cart items
 */
export const calculateOrderTotals = (items: OrderItem[], deliveryFee: number = 0, discount: number = 0) => {
  const subtotal = items.reduce((total, item) => total + item.totalPrice, 0);
  const totalAmount = subtotal + deliveryFee - discount;
  
  return {
    subtotal,
    deliveryFee,
    discount,
    totalAmount,
  };
};

/**
 * Validate order data before submission
 */
export const validateOrderData = (orderData: CreateOrderData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate customer info
  if (!orderData.customer.name?.trim()) {
    errors.push('Customer name is required');
  }
  if (!orderData.customer.email?.trim()) {
    errors.push('Customer email is required');
  }
  if (!orderData.customer.phone?.trim()) {
    errors.push('Customer phone number is required');
  }
  
  // Validate delivery info
  if (!orderData.delivery.address?.trim()) {
    errors.push('Delivery address is required');
  }
  if (!orderData.delivery.city?.trim()) {
    errors.push('City is required');
  }
  
  // Validate items
  if (!orderData.items || orderData.items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  
  orderData.items.forEach((item, index) => {
    if (!item.productId) {
      errors.push(`Item ${index + 1}: Product ID is required`);
    }
    if (!item.productTitle) {
      errors.push(`Item ${index + 1}: Product title is required`);
    }
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
    }
    if (item.unitPrice <= 0) {
      errors.push(`Item ${index + 1}: Unit price must be greater than 0`);
    }
  });
  
  // Validate payment info
  if (!orderData.payment.method) {
    errors.push('Payment method is required');
  }
  if (orderData.payment.totalAmount <= 0) {
    errors.push('Total amount must be greater than 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format order data for Sanity CMS
 */
export const formatOrderForSanity = (orderData: CreateOrderData): Omit<Order, '_id'> => {
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();
  
  return {
    orderNumber,
    orderStatus: 'confirmed',
    paymentStatus: 'completed',
    customer: orderData.customer,
    delivery: orderData.delivery,
    items: orderData.items,
    payment: {
      ...orderData.payment,
      esewaTransactionId: orderData.esewaTransactionId,
      esewaResponse: orderData.esewaResponse ? JSON.stringify(orderData.esewaResponse) : undefined,
    },
    orderDate: now,
    lastUpdated: now,
  };
};

/**
 * Generate order summary for emails
 */
export const generateOrderSummary = (order: Order): string => {
  const itemsList = order.items.map(item => 
    `• ${item.productTitle} (Qty: ${item.quantity}) - ${formatPrice(item.totalPrice)}`
  ).join('\n');
  
  const variantsList = order.items.map(item => {
    if (!item.selectedVariants) return '';
    const variants = [];
    if (item.selectedVariants.size) variants.push(`Size: ${item.selectedVariants.size}`);
    if (item.selectedVariants.color) variants.push(`Color: ${item.selectedVariants.color}`);
    if (item.selectedVariants.material) variants.push(`Material: ${item.selectedVariants.material}`);
    return variants.length > 0 ? `  ${variants.join(', ')}` : '';
  }).filter(Boolean).join('\n');
  
  return `
Order #${order.orderNumber}
Order Date: ${new Date(order.orderDate).toLocaleString()}

CUSTOMER INFORMATION:
Name: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}

DELIVERY ADDRESS:
${order.delivery.address}
${order.delivery.city}${order.delivery.postalCode ? `, ${order.delivery.postalCode}` : ''}
${order.delivery.deliveryInstructions ? `Instructions: ${order.delivery.deliveryInstructions}` : ''}

ORDER ITEMS:
${itemsList}
${variantsList ? '\nVariants:\n' + variantsList : ''}

PAYMENT SUMMARY:
Subtotal: ${formatPrice(order.payment.subtotal)}
Delivery Fee: ${formatPrice(order.payment.deliveryFee)}
Discount: ${formatPrice(order.payment.discount)}
Total Amount: ${formatPrice(order.payment.totalAmount)}

Payment Method: ${order.payment.method.toUpperCase()}
${order.payment.esewaTransactionId ? `eSewa Transaction ID: ${order.payment.esewaTransactionId}` : ''}

Order Status: ${order.orderStatus.toUpperCase()}
Payment Status: ${order.paymentStatus.toUpperCase()}
  `.trim();
};

/**
 * Get order status display text
 */
export const getOrderStatusText = (status: Order['orderStatus']): string => {
  const statusMap = {
    pending: 'Pending Payment',
    confirmed: 'Payment Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  
  return statusMap[status] || status;
};

/**
 * Get payment status display text
 */
export const getPaymentStatusText = (status: Order['paymentStatus']): string => {
  const statusMap = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
  };
  
  return statusMap[status] || status;
};

/**
 * Estimate delivery date (3-7 business days from order date)
 */
export const estimateDeliveryDate = (orderDate: string): string => {
  const order = new Date(orderDate);
  const deliveryDays = 5; // Average 5 business days
  const delivery = new Date(order);
  delivery.setDate(order.getDate() + deliveryDays);
  
  return delivery.toISOString().split('T')[0]; // Return YYYY-MM-DD format
};
