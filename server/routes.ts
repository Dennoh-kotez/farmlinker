import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, insertUserSchema, insertProductSchema, 
  insertOrderSchema, insertOrderItemSchema, insertReviewSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// Middleware to verify if user is authenticated 
const requireAuth = (req: Request, res: Response, next: any) => {
  // In a real app, this would check a JWT token or session
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  // Add user ID to request for use in route handlers
  req.body.userId = Number(userId);
  next();
};

// Middleware to check if user is a seller
const requireSeller = async (req: Request, res: Response, next: any) => {
  const userId = Number(req.headers['user-id']);
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 'seller' && user.role !== 'both') {
      return res.status(403).json({ message: "Seller permissions required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to verify permissions",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Auth Routes
  apiRouter.post("/login", async (req, res) => {
    try {
      const parseResult = loginSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ 
          message: "Validation error",
          errors: validationError.details 
        });
      }

      const user = await storage.validateLogin(parseResult.data);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // In a real app, you would generate a JWT token here
      const { password, ...userWithoutPassword } = user;
      res.json({ 
        user: userWithoutPassword,
        token: "dummy-token" // This would be a real JWT token in a production app
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // User Routes
  apiRouter.post("/register", async (req, res) => {
    try {
      const parseResult = insertUserSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ 
          message: "Validation error",
          errors: validationError.details 
        });
      }

      const { email } = parseResult.data;
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          message: "Email already registered" 
        });
      }

      const newUser = await storage.createUser(parseResult.data);
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ 
        message: "Registration failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  apiRouter.get("/users/me", requireAuth, async (req, res) => {
    try {
      const userId = Number(req.headers['user-id']);
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch user data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Product Routes
  apiRouter.get("/products", async (req, res) => {
    try {
      // Parse query parameters for filtering
      const { category, seller_id } = req.query;
      const filters: any = {};
      
      if (category) {
        filters.category = String(category);
      }
      
      if (seller_id) {
        filters.sellerId = Number(seller_id);
      }
      
      const products = await storage.getProducts(filters);
      res.json({ products });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  apiRouter.get("/products/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch product",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  apiRouter.post("/products", requireSeller, async (req, res) => {
    try {
      const parseResult = insertProductSchema.safeParse({
        ...req.body,
        sellerId: Number(req.headers['user-id']) // Ensure seller ID is set to current user
      });
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ 
          message: "Validation error",
          errors: validationError.details 
        });
      }
      
      const newProduct = await storage.createProduct(parseResult.data);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to create product",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  apiRouter.patch("/products/:id", requireSeller, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.headers['user-id']);
      
      // Check if product exists and belongs to the seller
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.sellerId !== userId) {
        return res.status(403).json({ message: "You can only update your own products" });
      }
      
      const updatedProduct = await storage.updateProduct(id, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to update product",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  apiRouter.delete("/products/:id", requireSeller, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.headers['user-id']);
      
      // Check if product exists and belongs to the seller
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.sellerId !== userId) {
        return res.status(403).json({ message: "You can only delete your own products" });
      }
      
      const success = await storage.deleteProduct(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete product" });
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to delete product",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Cart Routes
  apiRouter.get("/cart", requireAuth, async (req, res) => {
    try {
      const userId = Number(req.headers['user-id']);
      const cart = await storage.getCart(userId);
      
      if (!cart) {
        // Return empty cart if none exists
        return res.json({ 
          userId,
          items: [],
          updatedAt: new Date()
        });
      }
      
      res.json(cart);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch cart",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  apiRouter.post("/cart", requireAuth, async (req, res) => {
    try {
      const userId = Number(req.headers['user-id']);
      const { items } = req.body;
      
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Items must be an array" });
      }
      
      const updatedCart = await storage.updateCart(userId, items);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to update cart",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Order Routes
  apiRouter.get("/orders", requireAuth, async (req, res) => {
    try {
      const userId = Number(req.headers['user-id']);
      const orders = await storage.getOrdersByBuyer(userId);
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch orders",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  apiRouter.get("/orders/:id", requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.headers['user-id']);
      
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Ensure the order belongs to the user
      if (order.buyerId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get order items
      const orderItems = await storage.getOrderItems(id);
      
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch order",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  apiRouter.post("/orders", requireAuth, async (req, res) => {
    try {
      const userId = Number(req.headers['user-id']);
      
      const parseResult = insertOrderSchema.safeParse({
        ...req.body,
        buyerId: userId
      });
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ 
          message: "Validation error",
          errors: validationError.details 
        });
      }
      
      // Create the order
      const newOrder = await storage.createOrder(parseResult.data);
      
      // Create order items
      const { items } = req.body;
      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const itemData = {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          };
          
          await storage.createOrderItem(itemData);
        }
      }
      
      // Clear the cart after successful order
      await storage.updateCart(userId, []);
      
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to create order",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Review Routes
  apiRouter.get("/products/:id/reviews", async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const reviews = await storage.getReviews(productId);
      res.json({ reviews });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch reviews",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  apiRouter.post("/products/:id/reviews", requireAuth, async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const userId = Number(req.headers['user-id']);
      
      const parseResult = insertReviewSchema.safeParse({
        ...req.body,
        productId,
        userId
      });
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ 
          message: "Validation error",
          errors: validationError.details 
        });
      }
      
      const newReview = await storage.createReview(parseResult.data);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to create review",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
