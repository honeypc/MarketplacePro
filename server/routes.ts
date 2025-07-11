import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage-prisma";
import { setupAuth, requireAuth, requireRole } from "./auth";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { upload, getImageUrl } from "./upload";
import path from "path";
// Import validation schemas
import { z } from "zod";
import { 
  insertCartItemSchema, 
  insertWishlistItemSchema, 
  insertReviewSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  insertPropertySchema,
  insertBookingSchema,
  insertPropertyReviewSchema,
  insertPropertyAvailabilitySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: 'sessions',
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // Auth routes
  setupAuth(app);

  // Test auth endpoint to check if auth is working
  app.get('/api/test-auth', requireAuth, (req: any, res) => {
    res.json({ message: "Authentication working!", userId: req.session.userId });
  });

  // Get current user endpoint
  app.get('/api/auth/user', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user by ID route
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', requireAuth, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const filters = {
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        sellerId: req.query.sellerId as string,
        search: req.query.search as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 24,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        sortBy: req.query.sortBy as 'price' | 'created' | 'rating',
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        excludeId: req.query.excludeId ? parseInt(req.query.excludeId as string) : undefined,
      };

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      console.log('Product ID received:', req.params.id);
      const id = parseInt(req.params.id);
      console.log('Parsed ID:', id);
      
      if (isNaN(id)) {
        console.log('Invalid ID format:', req.params.id);
        return res.status(400).json({ message: "Invalid product ID format" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', requireAuth, upload.array('images', 10), async (req: any, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const uploadedImageUrls = files ? files.map(file => getImageUrl(file.filename, req)) : [];
      
      // Parse existing images from form data
      let existingImages: string[] = [];
      if (req.body.images) {
        try {
          existingImages = JSON.parse(req.body.images);
        } catch (e) {
          existingImages = [];
        }
      }
      
      const allImages = [...existingImages, ...uploadedImageUrls];
      
      const productData = insertProductSchema.parse({
        ...req.body,
        sellerId: req.session.userId,
        images: allImages,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock),
        categoryId: parseInt(req.body.categoryId),
      });
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', requireAuth, upload.array('images', 10), async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];
      
      // Verify ownership
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct || existingProduct.sellerId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      let updateData: any = { ...req.body };
      
      // Parse existing images from form data
      let existingImages: string[] = [];
      if (req.body.images) {
        try {
          existingImages = JSON.parse(req.body.images);
        } catch (e) {
          existingImages = [];
        }
      }
      
      // Add newly uploaded images
      const uploadedImageUrls = files ? files.map(file => getImageUrl(file.filename, req)) : [];
      const allImages = [...existingImages, ...uploadedImageUrls];
      
      updateData.images = allImages;
      updateData.price = parseFloat(req.body.price);
      updateData.stock = parseInt(req.body.stock);
      updateData.categoryId = parseInt(req.body.categoryId);

      const productData = insertProductSchema.partial().parse(updateData);
      const product = await storage.updateProduct(id, productData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verify ownership
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct || existingProduct.sellerId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Review routes
  app.get('/api/products/:id/reviews', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/products/:id/reviews', requireAuth, async (req: any, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId,
        userId: req.session.userId,
      });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Cart routes
  app.get('/api/cart', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const cartItems = await storage.getCartItems(userId);
      
      // Get product details for cart items
      const productIds = cartItems.map(item => item.productId);
      const products = await storage.getProductsByIds(productIds);
      
      const cartWithProducts = cartItems.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId),
      }));
      
      res.json(cartWithProducts);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', requireAuth, async (req: any, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put('/api/cart/:id', requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:id', requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Wishlist routes
  app.get('/api/wishlist', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const wishlistItems = await storage.getWishlistItems(userId);
      
      // Get product details for wishlist items
      const productIds = wishlistItems.map(item => item.productId);
      const products = await storage.getProductsByIds(productIds);
      
      const wishlistWithProducts = wishlistItems.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId),
      }));
      
      res.json(wishlistWithProducts);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post('/api/wishlist', requireAuth, async (req: any, res) => {
    try {
      const wishlistItemData = insertWishlistItemSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      const wishlistItem = await storage.addToWishlist(wishlistItemData);
      res.json(wishlistItem);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete('/api/wishlist/:id', requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromWishlist(id);
      res.json({ message: "Item removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Order routes
  app.get('/api/orders', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post('/api/orders', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId,
      });
      
      const order = await storage.createOrder(orderData);
      
      // Create order items from cart
      const cartItems = await storage.getCartItems(userId);
      const productIds = cartItems.map(item => item.productId);
      const products = await storage.getProductsByIds(productIds);
      
      for (const cartItem of cartItems) {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: product.price,
          });
        }
      }
      
      // Clear cart after order
      await storage.clearCart(userId);
      
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Seller dashboard routes
  app.get('/api/seller/stats', requireAuth, async (req: any, res) => {
    try {
      const sellerId = req.user.claims.sub;
      const stats = await storage.getSellerStats(sellerId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching seller stats:", error);
      res.status(500).json({ message: "Failed to fetch seller stats" });
    }
  });

  app.get('/api/seller/products', requireAuth, async (req: any, res) => {
    try {
      const sellerId = req.user.claims.sub;
      const products = await storage.getProducts({ sellerId });
      res.json(products);
    } catch (error) {
      console.error("Error fetching seller products:", error);
      res.status(500).json({ message: "Failed to fetch seller products" });
    }
  });

  // Seller management routes
  app.get("/api/seller/store", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      // For now, return a placeholder until we implement store schema
      res.json(null);
    } catch (error) {
      console.error("Error fetching seller store:", error);
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  app.post("/api/seller/store", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      // For now, return a placeholder until we implement store schema
      res.json({ id: 1, name: req.body.name, ...req.body });
    } catch (error) {
      console.error("Error creating seller store:", error);
      res.status(500).json({ message: "Failed to create store" });
    }
  });

  app.get("/api/seller/products", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const products = await storage.getProducts({ sellerId: userId });
      res.json(products);
    } catch (error) {
      console.error("Error fetching seller products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/seller/stats", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const stats = await storage.getSellerStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching seller stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Inventory management routes
  app.get("/api/inventory/alerts", requireAuth, async (req: any, res) => {
    try {
      const sellerId = req.user?.claims?.sub;
      if (!sellerId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const alerts = await storage.getInventoryAlerts(sellerId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching inventory alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/inventory/alerts/:id/read", requireAuth, async (req: any, res) => {
    try {
      const alertId = parseInt(req.params.id);
      await storage.markAlertAsRead(alertId);
      res.json({ message: "Alert marked as read" });
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  app.post("/api/inventory/alerts/:id/resolve", requireAuth, async (req: any, res) => {
    try {
      const alertId = parseInt(req.params.id);
      await storage.markAlertAsResolved(alertId);
      res.json({ message: "Alert marked as resolved" });
    } catch (error) {
      console.error("Error marking alert as resolved:", error);
      res.status(500).json({ message: "Failed to mark alert as resolved" });
    }
  });

  app.get("/api/inventory/low-stock", requireAuth, async (req: any, res) => {
    try {
      const sellerId = req.user?.claims?.sub;
      if (!sellerId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const lowStockProducts = await storage.checkLowStock(sellerId);
      res.json(lowStockProducts);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.get("/api/inventory/stock-movements/:productId", requireAuth, async (req: any, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const movements = await storage.getStockMovements(productId);
      res.json(movements);
    } catch (error) {
      console.error("Error fetching stock movements:", error);
      res.status(500).json({ message: "Failed to fetch stock movements" });
    }
  });

  app.post("/api/inventory/update-stock", requireAuth, async (req: any, res) => {
    try {
      const { productId, newStock, movementType, reason } = req.body;
      const sellerId = req.user?.claims?.sub;
      
      if (!sellerId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      await storage.updateProductStock(productId, newStock, movementType, reason, sellerId);
      res.json({ message: "Stock updated successfully" });
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ message: "Failed to update stock" });
    }
  });

  // Profile routes
  app.get("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const profileData = req.body;
      const user = await storage.upsertUser({
        id: userId,
        ...profileData,
        updatedAt: new Date(),
      });
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // User orders route
  app.get("/api/user/orders", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // User reviews route  
  app.get("/api/user/reviews", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const reviews = await storage.getUserReviews(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Image upload routes
  app.post('/api/upload/images', requireAuth, upload.array('images', 10), async (req: any, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const imageUrls = files.map(file => getImageUrl(file.filename, req));
      res.json({ 
        message: "Images uploaded successfully",
        images: imageUrls 
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ message: "Failed to upload images" });
    }
  });

  // Serve static files from uploads directory
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    next();
  });

  // Get user by ID
  app.get('/api/users/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Chat routes
  app.get('/api/chat/rooms', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const rooms = await storage.getChatRooms(userId);
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      res.status(500).json({ message: "Failed to fetch chat rooms" });
    }
  });

  app.post('/api/chat/rooms', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const roomData = {
        ...req.body,
        customerId: userId,
        status: 'waiting'
      };
      
      const room = await storage.createChatRoom(roomData);
      res.json(room);
    } catch (error) {
      console.error("Error creating chat room:", error);
      res.status(500).json({ message: "Failed to create chat room" });
    }
  });

  app.get('/api/chat/rooms/:roomId', requireAuth, async (req: any, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const room = await storage.getChatRoom(roomId);
      
      if (!room) {
        return res.status(404).json({ message: "Chat room not found" });
      }
      
      res.json(room);
    } catch (error) {
      console.error("Error fetching chat room:", error);
      res.status(500).json({ message: "Failed to fetch chat room" });
    }
  });

  app.get('/api/chat/rooms/:roomId/messages', requireAuth, async (req: any, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const messages = await storage.getChatMessages(roomId, limit, offset);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat/rooms/:roomId/messages', requireAuth, async (req: any, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const userId = req.session.userId;
      
      const messageData = {
        ...req.body,
        roomId,
        senderId: userId
      };
      
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(500).json({ message: "Failed to create chat message" });
    }
  });

  app.put('/api/chat/rooms/:roomId/read', requireAuth, async (req: any, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const userId = req.session.userId;
      
      await storage.markMessagesAsRead(roomId, userId);
      res.json({ message: "Messages marked as read" });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  });

  app.put('/api/chat/rooms/:roomId/close', requireAuth, async (req: any, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      await storage.closeChatRoom(roomId);
      res.json({ message: "Chat room closed" });
    } catch (error) {
      console.error("Error closing chat room:", error);
      res.status(500).json({ message: "Failed to close chat room" });
    }
  });

  // Support agent routes
  app.get('/api/support/rooms', requireAuth, requireRole('admin'), async (req: any, res) => {
    try {
      const supportAgentId = req.query.agentId as string;
      const rooms = await storage.getActiveChatRooms(supportAgentId);
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching support rooms:", error);
      res.status(500).json({ message: "Failed to fetch support rooms" });
    }
  });

  app.put('/api/support/rooms/:roomId/assign', requireAuth, requireRole('admin'), async (req: any, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const supportAgentId = req.body.supportAgentId || req.session.userId;
      
      const room = await storage.assignChatRoom(roomId, supportAgentId);
      res.json(room);
    } catch (error) {
      console.error("Error assigning chat room:", error);
      res.status(500).json({ message: "Failed to assign chat room" });
    }
  });

  app.get('/api/support/stats', requireAuth, requireRole('admin'), async (req: any, res) => {
    try {
      const supportAgentId = req.query.agentId as string || req.session.userId;
      const stats = await storage.getSupportStats(supportAgentId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching support stats:", error);
      res.status(500).json({ message: "Failed to fetch support stats" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active connections
  const connections = new Map<string, WebSocket>();
  
  wss.on('connection', (ws, req) => {
    let userId: string | null = null;
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'authenticate') {
          userId = data.userId;
          connections.set(userId, ws);
          ws.send(JSON.stringify({ type: 'authenticated', userId }));
        } else if (data.type === 'sendMessage' && userId) {
          // Create message in database
          const messageData = {
            roomId: data.roomId,
            senderId: userId,
            message: data.message,
            messageType: data.messageType || 'text',
            isRead: false
          };
          
          const newMessage = await storage.createChatMessage(messageData);
          
          // Get room details to find participants
          const room = await storage.getChatRoom(data.roomId);
          if (room) {
            const participants = [room.customerId, room.supportAgentId].filter(Boolean);
            
            // Send message to all participants
            participants.forEach(participantId => {
              const participantWs = connections.get(participantId);
              if (participantWs && participantWs.readyState === WebSocket.OPEN) {
                participantWs.send(JSON.stringify({
                  type: 'newMessage',
                  message: newMessage,
                  roomId: data.roomId
                }));
              }
            });
          }
        } else if (data.type === 'joinRoom' && userId) {
          // Join a chat room
          ws.send(JSON.stringify({ type: 'joinedRoom', roomId: data.roomId }));
        } else if (data.type === 'markRead' && userId) {
          // Mark messages as read
          await storage.markMessagesAsRead(data.roomId, userId);
          
          // Notify other participants
          const room = await storage.getChatRoom(data.roomId);
          if (room) {
            const participants = [room.customerId, room.supportAgentId].filter(Boolean);
            participants.forEach(participantId => {
              if (participantId !== userId) {
                const participantWs = connections.get(participantId);
                if (participantWs && participantWs.readyState === WebSocket.OPEN) {
                  participantWs.send(JSON.stringify({
                    type: 'messagesRead',
                    roomId: data.roomId,
                    readBy: userId
                  }));
                }
              }
            });
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });
    
    ws.on('close', () => {
      if (userId) {
        connections.delete(userId);
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Property Routes
  app.get('/api/properties', async (req, res) => {
    try {
      const filters = req.query;
      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ message: 'Failed to fetch properties' });
    }
  });

  app.get('/api/properties/search', async (req, res) => {
    try {
      const filters = req.query;
      const properties = await storage.searchProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error('Error searching properties:', error);
      res.status(500).json({ message: 'Failed to search properties' });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      res.json(property);
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({ message: 'Failed to fetch property' });
    }
  });

  app.post('/api/properties', requireAuth, async (req: any, res) => {
    try {
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        hostId: req.user.id
      });
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ message: 'Failed to create property' });
    }
  });

  app.put('/api/properties/:id', requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      if (property.hostId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this property' });
      }
      
      const updatedProperty = await storage.updateProperty(id, req.body);
      res.json(updatedProperty);
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({ message: 'Failed to update property' });
    }
  });

  app.delete('/api/properties/:id', requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      if (property.hostId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this property' });
      }
      
      await storage.deleteProperty(id);
      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ message: 'Failed to delete property' });
    }
  });

  // Booking Routes
  app.get('/api/bookings', requireAuth, async (req: any, res) => {
    try {
      const { type = 'guest' } = req.query;
      const bookings = await storage.getBookings(req.user.id, type);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  app.get('/api/bookings/:id', requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      if (booking.guestId !== req.user.id && booking.hostId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this booking' });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ message: 'Failed to fetch booking' });
    }
  });

  app.post('/api/bookings', requireAuth, async (req: any, res) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        guestId: req.user.id
      });
      
      // Check availability
      const isAvailable = await storage.checkAvailability(
        bookingData.propertyId,
        new Date(bookingData.checkInDate),
        new Date(bookingData.checkOutDate)
      );
      
      if (!isAvailable) {
        return res.status(400).json({ message: 'Property is not available for the selected dates' });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });

  app.put('/api/bookings/:id', requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      if (booking.guestId !== req.user.id && booking.hostId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }
      
      const updatedBooking = await storage.updateBooking(id, req.body);
      res.json(updatedBooking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Failed to update booking' });
    }
  });

  app.post('/api/bookings/:id/cancel', requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      if (booking.guestId !== req.user.id && booking.hostId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
      
      const { reason } = req.body;
      const cancelledBooking = await storage.cancelBooking(id, reason);
      res.json(cancelledBooking);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ message: 'Failed to cancel booking' });
    }
  });

  // Property Review Routes
  app.get('/api/properties/:id/reviews', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reviews = await storage.getPropertyReviews(id);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching property reviews:', error);
      res.status(500).json({ message: 'Failed to fetch property reviews' });
    }
  });

  app.post('/api/properties/:id/reviews', requireAuth, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const reviewData = insertPropertyReviewSchema.parse({
        ...req.body,
        propertyId,
        guestId: req.user.id
      });
      
      const review = await storage.createPropertyReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating property review:', error);
      res.status(500).json({ message: 'Failed to create property review' });
    }
  });

  app.get('/api/users/:id/properties', async (req, res) => {
    try {
      const hostId = req.params.id;
      const properties = await storage.getPropertiesByHost(hostId);
      res.json(properties);
    } catch (error) {
      console.error('Error fetching user properties:', error);
      res.status(500).json({ message: 'Failed to fetch user properties' });
    }
  });
  
  return httpServer;
}
