import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';
import { 
  Product, 
  Order, 
  User, 
  ApiResponse, 
  LoginFormValues, 
  RegisterFormValues 
} from '../utils/types';

// Set up axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error - could clear token and redirect to login
      AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Product API functions
export const getProducts = async (filters?: any): Promise<ApiResponse<Product[]>> => {
  try {
    let url = '/api/products';
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, value as string);
      });
      url += `?${params.toString()}`;
    }
    const response = await apiClient.get<ApiResponse<Product[]>>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [], success: false, message: 'Failed to fetch products' };
  }
};

export const getProductById = async (id: number): Promise<ApiResponse<Product>> => {
  try {
    const response = await apiClient.get<ApiResponse<Product>>(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return { data: {} as Product, success: false, message: 'Failed to fetch product' };
  }
};

export const getProductsBySeller = async (sellerId: number): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/api/products/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching seller products:`, error);
    return { data: [], success: false, message: 'Failed to fetch seller products' };
  }
};

export const createProduct = async (productData: FormData): Promise<ApiResponse<Product>> => {
  try {
    const response = await apiClient.post<ApiResponse<Product>>('/api/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    return { data: {} as Product, success: false, message: 'Failed to create product' };
  }
};

export const updateProduct = async (id: number, productData: FormData): Promise<ApiResponse<Product>> => {
  try {
    const response = await apiClient.put<ApiResponse<Product>>(`/api/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    return { data: {} as Product, success: false, message: 'Failed to update product' };
  }
};

export const deleteProduct = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return { data: false, success: false, message: 'Failed to delete product' };
  }
};

// Order API functions
export const getOrders = async (): Promise<ApiResponse<Order[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Order[]>>('/api/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { data: [], success: false, message: 'Failed to fetch orders' };
  }
};

export const getOrderById = async (id: number): Promise<ApiResponse<Order>> => {
  try {
    const response = await apiClient.get<ApiResponse<Order>>(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return { data: {} as Order, success: false, message: 'Failed to fetch order' };
  }
};

export const createOrder = async (orderData: any): Promise<ApiResponse<Order>> => {
  try {
    const response = await apiClient.post<ApiResponse<Order>>('/api/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    return { data: {} as Order, success: false, message: 'Failed to create order' };
  }
};

export const updateOrderStatus = async (id: number, status: string): Promise<ApiResponse<Order>> => {
  try {
    const response = await apiClient.patch<ApiResponse<Order>>(`/api/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order status ${id}:`, error);
    return { data: {} as Order, success: false, message: 'Failed to update order status' };
  }
};

// Cart API functions
export const getCart = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/api/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { data: { items: [] }, success: false, message: 'Failed to fetch cart' };
  }
};

export const updateCart = async (items: any[]): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.put<ApiResponse<any>>('/api/cart', { items });
    return response.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    return { data: { items: [] }, success: false, message: 'Failed to update cart' };
  }
};

// Auth API functions
export const login = async (credentials: LoginFormValues): Promise<ApiResponse<{user: User, token: string}>> => {
  try {
    const response = await apiClient.post<ApiResponse<{user: User, token: string}>>('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    return { data: { user: {} as User, token: '' }, success: false, message: 'Login failed' };
  }
};

export const register = async (userData: RegisterFormValues): Promise<ApiResponse<{user: User, token: string}>> => {
  try {
    const response = await apiClient.post<ApiResponse<{user: User, token: string}>>('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    return { data: { user: {} as User, token: '' }, success: false, message: 'Registration failed' };
  }
};

export const logout = async (): Promise<ApiResponse<boolean>> => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    return { data: true, success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Error during logout:', error);
    return { data: false, success: false, message: 'Logout failed' };
  }
};

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/api/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return { data: {} as User, success: false, message: 'Failed to fetch user profile' };
  }
};