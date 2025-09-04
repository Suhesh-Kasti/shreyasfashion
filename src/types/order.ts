export interface OrderItem {
  productId: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedVariants?: {
    size?: string;
    color?: string;
    material?: string;
  };
  productImage?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  isGoogleUser: boolean;
  googleId?: string;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  postalCode?: string;
  deliveryInstructions?: string;
  estimatedDelivery?: string;
}

export interface PaymentInfo {
  method: 'esewa' | 'cod' | 'bank_transfer';
  esewaTransactionId?: string;
  esewaResponse?: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  items: OrderItem[];
  payment: PaymentInfo;
  orderDate: string;
  lastUpdated?: string;
  adminNotes?: string;
  trackingNumber?: string;
}

export interface CreateOrderData {
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  items: OrderItem[];
  payment: Omit<PaymentInfo, 'esewaResponse'>;
  esewaTransactionId?: string;
  esewaResponse?: any;
}

export interface OrderEmailData {
  order: Order;
  customerEmail: string;
  adminEmail: string;
}
