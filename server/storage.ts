import {
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Review, type InsertReview,
  type Cart, type InsertCart,
  type Login
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateLogin(credentials: Login): Promise<User | undefined>;
  
  // Product operations
  getProducts(filters?: Partial<Product>): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByBuyer(buyerId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order items operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Review operations
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Cart operations
  getCart(userId: number): Promise<Cart | undefined>;
  updateCart(userId: number, items: any[]): Promise<Cart | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  private carts: Map<number, Cart>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private reviewIdCounter: number;
  private cartIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    this.carts = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.reviewIdCounter = 1;
    this.cartIdCounter = 1;
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      password: insertUser.password,
      role: insertUser.role || 'buyer',
      phone: insertUser.phone || null,
      address: insertUser.address || null,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async validateLogin(credentials: Login): Promise<User | undefined> {
    const user = await this.getUserByEmail(credentials.email);
    if (user && user.password === credentials.password) {
      // In a real app, you'd compare hashed passwords
      return user;
    }
    return undefined;
  }

  // Product operations
  async getProducts(filters?: Partial<Product>): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (filters) {
      products = products.filter(product => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined) return true;
          return product[key as keyof Product] === value;
        });
      });
    }
    
    return products;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.sellerId === sellerId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const product: Product = {
      id,
      name: insertProduct.name,
      description: insertProduct.description,
      category: insertProduct.category,
      price: insertProduct.price,
      quantity: insertProduct.quantity,
      unit: insertProduct.unit,
      imageUrl: insertProduct.imageUrl || null,
      sellerId: insertProduct.sellerId,
      available: insertProduct.available !== undefined ? insertProduct.available : true,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date()
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByBuyer(buyerId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.buyerId === buyerId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    const order: Order = {
      id,
      buyerId: insertOrder.buyerId,
      status: insertOrder.status || 'pending',
      totalAmount: insertOrder.totalAmount,
      shippingAddress: insertOrder.shippingAddress,
      paymentMethod: insertOrder.paymentMethod,
      createdAt: now,
      updatedAt: now
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date()
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order items operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const item: OrderItem = {
      id,
      orderId: insertItem.orderId,
      productId: insertItem.productId,
      quantity: insertItem.quantity,
      unitPrice: insertItem.unitPrice,
      totalPrice: insertItem.totalPrice
    };
    this.orderItems.set(id, item);
    return item;
  }

  // Review operations
  async getReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.productId === productId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const now = new Date();
    const review: Review = {
      id,
      productId: insertReview.productId,
      userId: insertReview.userId,
      rating: insertReview.rating,
      comment: insertReview.comment || null,
      createdAt: now
    };
    this.reviews.set(id, review);
    return review;
  }

  // Cart operations
  async getCart(userId: number): Promise<Cart | undefined> {
    return Array.from(this.carts.values()).find(cart => cart.userId === userId);
  }

  async updateCart(userId: number, items: any[]): Promise<Cart | undefined> {
    let cart = await this.getCart(userId);
    const now = new Date();
    
    if (!cart) {
      const id = this.cartIdCounter++;
      cart = {
        id,
        userId,
        items,
        updatedAt: now
      };
      this.carts.set(id, cart);
    } else {
      cart = {
        ...cart,
        items,
        updatedAt: now
      };
      this.carts.set(cart.id, cart);
    }
    
    return cart;
  }
}

export const storage = new MemStorage();
