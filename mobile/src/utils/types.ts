// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // 'buyer' or 'seller'
  county?: string;
  mpesaNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Product related types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string; // e.g., 'kg', 'bunch', 'piece'
  category: string;
  imageUrl: string;
  sellerId: number;
  sellerName?: string;
  county?: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Order related types
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  productName?: string;
  productImageUrl?: string;
  subtotal?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: number;
  buyerId: number;
  status: string; // 'pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'
  totalAmount: number;
  paymentMethod: string; // 'mpesa', 'cash_on_delivery'
  mpesaReference?: string;
  deliveryAddress: string;
  contactPhone: string;
  items?: OrderItem[];
  buyerName?: string;
  sellerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Cart related types
export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

// Review related types
export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Navigation related types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Products: undefined;
  ProductDetail: { productId: number };
  BuyerDashboard: undefined;
  SellerDashboard: undefined;
  Profile: undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderDetail: { orderId: number };
  AddProduct: undefined;
  EditProduct: { productId: number };
};

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Form values for auth
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
  county?: string;
  mpesaNumber?: string;
}

// Form values for products
export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  available: boolean;
  image?: any; // For image file upload
}

// Form values for checkout
export interface CheckoutFormValues {
  paymentMethod: string;
  deliveryAddress: string;
  contactPhone: string;
}