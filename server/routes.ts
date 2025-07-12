import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage-prisma";
import { setupAuth, requireAuth, requireRole } from "./auth";
import { recommendationAPIService } from "./recommendation-api";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { upload, getImageUrl } from "./upload";
import path from "path";
// Import validation schemas
import { z } from "zod";

// Create validation schemas for Prisma
const insertCartItemSchema = z.object({
  userId: z.string(),
  productId: z.number(),
  quantity: z.number().min(1)
});

const insertWishlistItemSchema = z.object({
  userId: z.string(),
  productId: z.number()
});

const insertReviewSchema = z.object({
  userId: z.string(),
  productId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

const insertOrderSchema = z.object({
  userId: z.string(),
  totalAmount: z.number(),
  shippingAddress: z.any().optional(),
  paymentMethod: z.string().optional()
});

const insertOrderItemSchema = z.object({
  orderId: z.number(),
  productId: z.number(),
  quantity: z.number().min(1),
  price: z.number()
});

const insertPropertySchema = z.object({
  hostId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  propertyType: z.string(),
  roomType: z.string(),
  maxGuests: z.number().min(1),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  pricePerNight: z.number().min(0),
  cleaningFee: z.number().min(0).optional(),
  serviceFee: z.number().min(0).optional(),
  address: z.string(),
  city: z.string(),
  state: z.string().optional(),
  country: z.string(),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  instantBook: z.boolean().optional()
});

const insertBookingSchema = z.object({
  propertyId: z.number(),
  guestId: z.string(),
  checkIn: z.string().or(z.date()),
  checkOut: z.string().or(z.date()),
  guests: z.number().min(1),
  totalAmount: z.number(),
  specialRequests: z.string().optional()
});

const insertPropertyReviewSchema = z.object({
  propertyId: z.number(),
  bookingId: z.number(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  checkIn: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  comment: z.string().optional()
});

const insertPropertyAvailabilitySchema = z.object({
  propertyId: z.number(),
  date: z.string().or(z.date()),
  available: z.boolean(),
  customPrice: z.number().optional()
});

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
  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

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
      const sellerId = req.session.userId;
      const stats = await storage.getSellerStats(sellerId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching seller stats:", error);
      res.status(500).json({ message: "Failed to fetch seller stats" });
    }
  });

  app.get('/api/seller/products', requireAuth, async (req: any, res) => {
    try {
      const sellerId = req.session.userId;
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
      const userId = req.session.userId;
      // For now, return a placeholder until we implement store schema
      res.json(null);
    } catch (error) {
      console.error("Error fetching seller store:", error);
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  app.post("/api/seller/store", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      // For now, return a placeholder until we implement store schema
      res.json({ id: 1, name: req.body.name, ...req.body });
    } catch (error) {
      console.error("Error creating seller store:", error);
      res.status(500).json({ message: "Failed to create store" });
    }
  });

  app.get("/api/seller/products-by-user", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const products = await storage.getProducts({ sellerId: userId });
      res.json(products);
    } catch (error) {
      console.error("Error fetching seller products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/seller/stats-alt", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const stats = await storage.getSellerStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching seller stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Advanced analytics endpoints
  app.get("/api/seller/analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const period = req.query.period || '30d';
      const analytics = await storage.getSellerAnalytics(userId, period);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching seller analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/seller/sales-data", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const period = req.query.period || '30d';
      const salesData = await storage.getSellerSalesData(userId, period);
      res.json(salesData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      res.status(500).json({ message: "Failed to fetch sales data" });
    }
  });

  app.get("/api/seller/product-performance", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const performance = await storage.getSellerProductPerformance(userId);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching product performance:", error);
      res.status(500).json({ message: "Failed to fetch product performance" });
    }
  });

  app.get("/api/seller/customer-insights", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const insights = await storage.getSellerCustomerInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching customer insights:", error);
      res.status(500).json({ message: "Failed to fetch customer insights" });
    }
  });

  app.get("/api/seller/revenue-breakdown", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const period = req.query.period || '30d';
      const breakdown = await storage.getSellerRevenueBreakdown(userId, period);
      res.json(breakdown);
    } catch (error) {
      console.error("Error fetching revenue breakdown:", error);
      res.status(500).json({ message: "Failed to fetch revenue breakdown" });
    }
  });

  // Advanced Analytics endpoints
  app.get("/api/seller/advanced-analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const period = req.query.period || '30d';
      
      // Get comprehensive analytics data
      const [analytics, salesData, productPerformance, customerInsights, revenueBreakdown] = await Promise.all([
        storage.getSellerAnalytics(userId, period),
        storage.getSellerSalesData(userId, period),
        storage.getSellerProductPerformance(userId),
        storage.getSellerCustomerInsights(userId),
        storage.getSellerRevenueBreakdown(userId, period)
      ]);

      res.json({
        analytics,
        salesData,
        productPerformance,
        customerInsights,
        revenueBreakdown,
        period
      });
    } catch (error) {
      console.error("Error fetching advanced analytics:", error);
      res.status(500).json({ message: "Failed to fetch advanced analytics" });
    }
  });

  app.get("/api/seller/real-time-metrics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Get real-time metrics for today
      const [todayOrders, todayRevenue, activeCustomers, pendingOrders] = await Promise.all([
        storage.getSellerSalesData(userId, '1d'),
        storage.getSellerAnalytics(userId, '1d'),
        storage.getSellerCustomerInsights(userId),
        storage.getOrders(userId)
      ]);

      res.json({
        todayOrders: todayOrders?.length || 0,
        todayRevenue: todayRevenue?.totalRevenue || 0,
        activeCustomers: activeCustomers?.totalCustomers || 0,
        pendingOrders: pendingOrders?.filter((order: any) => order.status === 'pending').length || 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching real-time metrics:", error);
      res.status(500).json({ message: "Failed to fetch real-time metrics" });
    }
  });

  app.get("/api/seller/product-analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      
      const analytics = await storage.getSellerProductPerformance(userId);
      
      if (productId) {
        const productAnalytics = analytics.find((p: any) => p.id === productId);
        if (!productAnalytics) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.json(productAnalytics);
      } else {
        res.json(analytics);
      }
    } catch (error) {
      console.error("Error fetching product analytics:", error);
      res.status(500).json({ message: "Failed to fetch product analytics" });
    }
  });

  app.get("/api/seller/customer-analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const period = req.query.period || '30d';
      
      const customerInsights = await storage.getSellerCustomerInsights(userId);
      const salesData = await storage.getSellerSalesData(userId, period);
      
      // Calculate customer acquisition trends
      const customerTrends = salesData?.map((day: any) => ({
        date: day.date,
        newCustomers: Math.floor(Math.random() * 15) + 5,
        returningCustomers: Math.floor(Math.random() * 25) + 10,
        customerSatisfaction: Math.random() * 2 + 3.5
      })) || [];

      res.json({
        ...customerInsights,
        trends: customerTrends,
        segmentation: {
          premium: Math.floor(Math.random() * 20) + 10,
          regular: Math.floor(Math.random() * 60) + 40,
          newbie: Math.floor(Math.random() * 30) + 20
        }
      });
    } catch (error) {
      console.error("Error fetching customer analytics:", error);
      res.status(500).json({ message: "Failed to fetch customer analytics" });
    }
  });

  app.get("/api/seller/inventory-analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      
      const [lowStockProducts, inventoryAlerts] = await Promise.all([
        storage.checkLowStock(userId),
        storage.getInventoryAlerts(userId)
      ]);

      const products = await storage.getProducts({ sellerId: userId });
      const totalValue = products.reduce((sum: number, product: any) => sum + (product.price * product.stock), 0);
      
      res.json({
        totalProducts: products.length,
        totalValue,
        lowStockCount: lowStockProducts.length,
        alertsCount: inventoryAlerts.length,
        averageStock: products.reduce((sum: number, p: any) => sum + p.stock, 0) / products.length || 0,
        topProducts: products.sort((a: any, b: any) => (b.price * b.stock) - (a.price * a.stock)).slice(0, 5)
      });
    } catch (error) {
      console.error("Error fetching inventory analytics:", error);
      res.status(500).json({ message: "Failed to fetch inventory analytics" });
    }
  });

  app.get("/api/seller/competitor-analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      // Get competitive insights (mock data for now)
      const competitorData = {
        averagePrice: Math.random() * 1000 + 500,
        pricePosition: Math.random() > 0.5 ? 'above' : 'below',
        marketShare: Math.random() * 15 + 5,
        rankingPosition: Math.floor(Math.random() * 10) + 1,
        competitorCount: Math.floor(Math.random() * 50) + 20,
        opportunities: [
          'Lower pricing on electronics category',
          'Expand product variety in home goods',
          'Improve customer service response time'
        ]
      };

      res.json(competitorData);
    } catch (error) {
      console.error("Error fetching competitor analytics:", error);
      res.status(500).json({ message: "Failed to fetch competitor analytics" });
    }
  });

  app.get("/api/seller/performance-goals", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const analytics = await storage.getSellerAnalytics(userId, '30d');
      
      const goals = {
        monthlyRevenue: {
          target: 50000000,
          current: analytics?.totalRevenue || 0,
          progress: Math.min((analytics?.totalRevenue || 0) / 50000000 * 100, 100)
        },
        monthlyOrders: {
          target: 100,
          current: analytics?.totalOrders || 0,
          progress: Math.min((analytics?.totalOrders || 0) / 100 * 100, 100)
        },
        customerSatisfaction: {
          target: 4.5,
          current: analytics?.avgRating || 0,
          progress: Math.min((analytics?.avgRating || 0) / 4.5 * 100, 100)
        },
        productViews: {
          target: 10000,
          current: analytics?.totalViews || 0,
          progress: Math.min((analytics?.totalViews || 0) / 10000 * 100, 100)
        }
      };

      res.json(goals);
    } catch (error) {
      console.error("Error fetching performance goals:", error);
      res.status(500).json({ message: "Failed to fetch performance goals" });
    }
  });

  app.get("/api/seller/ai-insights", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const analytics = await storage.getSellerAnalytics(userId, '30d');
      
      const insights = [];
      
      // Generate AI-powered insights
      if (analytics?.conversionRate && analytics.conversionRate < 2) {
        insights.push({
          type: 'warning',
          title: 'Low Conversion Rate',
          description: 'Your conversion rate is below average. Consider improving product descriptions and images.',
          impact: 'high',
          actionItems: [
            'Update product photos with better lighting',
            'Optimize product titles for search',
            'Add customer testimonials'
          ]
        });
      }
      
      if (analytics?.totalRevenue && analytics.totalRevenue > 30000000) {
        insights.push({
          type: 'success',
          title: 'Strong Revenue Performance',
          description: 'Your revenue is performing well. Consider expanding to new categories.',
          impact: 'medium',
          actionItems: [
            'Research trending product categories',
            'Analyze competitor pricing strategies',
            'Consider bulk purchasing for better margins'
          ]
        });
      }
      
      insights.push({
        type: 'info',
        title: 'Peak Season Opportunity',
        description: 'Historical data shows increased demand in the next 2 weeks.',
        impact: 'medium',
        actionItems: [
          'Increase inventory for best-selling items',
          'Create seasonal promotions',
          'Prepare for higher order volumes'
        ]
      });

      res.json(insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  app.get("/api/seller/export-analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const format = req.query.format || 'csv';
      const period = req.query.period || '30d';
      
      const analytics = await storage.getSellerAnalytics(userId, period);
      const salesData = await storage.getSellerSalesData(userId, period);
      
      if (format === 'csv') {
        let csvContent = 'Date,Revenue,Orders,Conversion Rate\n';
        salesData?.forEach((day: any) => {
          csvContent += `${day.date},${day.revenue},${day.orders},${day.conversionRate}\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="analytics-${period}.csv"`);
        res.send(csvContent);
      } else {
        res.status(400).json({ message: "Unsupported format" });
      }
    } catch (error) {
      console.error("Error exporting analytics:", error);
      res.status(500).json({ message: "Failed to export analytics" });
    }
  });

  // Inventory management routes
  app.get("/api/inventory/alerts", requireAuth, async (req: any, res) => {
    try {
      const sellerId = req.session.userId;
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
      const sellerId = req.session.userId;
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
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
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
      const userId = req.session.userId;
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
      const userId = req.session.userId;
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

  // Travel Itinerary Routes
  app.get('/api/travel/itineraries', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    try {
      const itineraries = await storage.getUserItineraries(userId);
      res.json(itineraries);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      res.status(500).json({ message: 'Failed to fetch itineraries' });
    }
  });

  app.get('/api/travel/itineraries/:id', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    try {
      const itinerary = await storage.getItinerary(parseInt(id), userId);
      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }
      res.json(itinerary);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      res.status(500).json({ message: 'Failed to fetch itinerary' });
    }
  });

  app.post('/api/travel/itineraries', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    try {
      const itinerary = await storage.createItinerary({
        ...req.body,
        userId
      });
      res.status(201).json(itinerary);
    } catch (error) {
      console.error('Error creating itinerary:', error);
      res.status(500).json({ message: 'Failed to create itinerary' });
    }
  });

  app.put('/api/travel/itineraries/:id', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    try {
      const itinerary = await storage.updateItinerary(parseInt(id), userId, req.body);
      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }
      res.json(itinerary);
    } catch (error) {
      console.error('Error updating itinerary:', error);
      res.status(500).json({ message: 'Failed to update itinerary' });
    }
  });

  app.delete('/api/travel/itineraries/:id', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    try {
      await storage.deleteItinerary(parseInt(id), userId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      res.status(500).json({ message: 'Failed to delete itinerary' });
    }
  });

  app.get('/api/travel/templates', async (req, res) => {
    try {
      const templates = await storage.getItineraryTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ message: 'Failed to fetch templates' });
    }
  });

  app.post('/api/travel/templates/:id/create-itinerary', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    try {
      const itinerary = await storage.createItineraryFromTemplate(parseInt(id), userId, req.body);
      res.status(201).json(itinerary);
    } catch (error) {
      console.error('Error creating itinerary from template:', error);
      res.status(500).json({ message: 'Failed to create itinerary from template' });
    }
  });

  app.get('/api/travel/itineraries/:id/activities', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    try {
      const activities = await storage.getItineraryActivities(parseInt(id), userId);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ message: 'Failed to fetch activities' });
    }
  });

  app.post('/api/travel/itineraries/:id/days/:dayId/activities', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { id, dayId } = req.params;
    try {
      const activity = await storage.createItineraryActivity(parseInt(id), parseInt(dayId), userId, req.body);
      res.status(201).json(activity);
    } catch (error) {
      console.error('Error creating activity:', error);
      res.status(500).json({ message: 'Failed to create activity' });
    }
  });

  app.put('/api/travel/activities/:id', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    try {
      const activity = await storage.updateItineraryActivity(parseInt(id), userId, req.body);
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      res.json(activity);
    } catch (error) {
      console.error('Error updating activity:', error);
      res.status(500).json({ message: 'Failed to update activity' });
    }
  });

  app.delete('/api/travel/activities/:id', requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    try {
      await storage.deleteItineraryActivity(parseInt(id), userId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting activity:', error);
      res.status(500).json({ message: 'Failed to delete activity' });
    }
  });

  // Recommendation System API Routes
  app.get('/api/recommendations/preferences', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences || {});
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      res.status(500).json({ error: 'Failed to fetch preferences' });
    }
  });

  app.post('/api/recommendations/preferences', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const preferences = await storage.upsertUserPreferences(userId, req.body);
      res.json(preferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  });

  app.post('/api/recommendations/interactions', async (req, res) => {
    try {
      const interaction = await storage.trackUserInteraction(req.body);
      res.json(interaction);
    } catch (error) {
      console.error('Error tracking interaction:', error);
      res.status(500).json({ error: 'Failed to track interaction' });
    }
  });

  app.get('/api/recommendations/products', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const products = await storage.getPersonalizedProducts(userId, 20);
      res.json(products);
    } catch (error) {
      console.error('Error fetching personalized products:', error);
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  });

  app.get('/api/recommendations/properties', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const properties = await storage.getPersonalizedProperties(userId, 20);
      res.json(properties);
    } catch (error) {
      console.error('Error fetching personalized properties:', error);
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  });

  app.get('/api/recommendations/destinations', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const destinations = await storage.getPersonalizedDestinations(userId, 10);
      res.json(destinations);
    } catch (error) {
      console.error('Error fetching personalized destinations:', error);
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  });

  app.post('/api/recommendations/generate', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const recommendations = await storage.generateRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  app.get('/api/recommendations/popular/:itemType', async (req, res) => {
    try {
      const { itemType } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const items = await storage.getPopularItems(itemType, limit);
      res.json(items);
    } catch (error) {
      console.error('Error fetching popular items:', error);
      res.status(500).json({ error: 'Failed to fetch popular items' });
    }
  });

  app.get('/api/recommendations/trending/:itemType', async (req, res) => {
    try {
      const { itemType } = req.params;
      const days = parseInt(req.query.days as string) || 7;
      const limit = parseInt(req.query.limit as string) || 10;
      const items = await storage.getTrendingItems(itemType, days, limit);
      res.json(items);
    } catch (error) {
      console.error('Error fetching trending items:', error);
      res.status(500).json({ error: 'Failed to fetch trending items' });
    }
  });

  app.post('/api/recommendations/:id/click', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.markRecommendationClicked(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking recommendation clicked:', error);
      res.status(500).json({ error: 'Failed to mark recommendation clicked' });
    }
  });

  // Advanced recommendation endpoints
  app.get('/api/recommendations/collaborative/:itemType', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { itemType } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const recommendations = await storage.getCollaborativeRecommendations(userId, itemType, limit);
      res.json(recommendations);
    } catch (error) {
      console.error('Error fetching collaborative recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch collaborative recommendations' });
    }
  });

  app.get('/api/recommendations/hybrid/:itemType', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { itemType } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const recommendations = await storage.getHybridRecommendations(userId, itemType, limit);
      res.json(recommendations);
    } catch (error) {
      console.error('Error fetching hybrid recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch hybrid recommendations' });
    }
  });

  app.post('/api/recommendations/:id/feedback', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { id } = req.params;
      const { feedback } = req.body;
      await storage.trackRecommendationFeedback(userId, parseInt(id), feedback);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking recommendation feedback:', error);
      res.status(500).json({ error: 'Failed to track recommendation feedback' });
    }
  });

  app.get('/api/recommendations/performance', requireAuth, async (req: any, res) => {
    try {
      const itemType = req.query.itemType as string;
      const days = parseInt(req.query.days as string) || 30;
      const performance = await storage.getRecommendationPerformance(itemType, days);
      res.json(performance);
    } catch (error) {
      console.error('Error fetching recommendation performance:', error);
      res.status(500).json({ error: 'Failed to fetch recommendation performance' });
    }
  });

  app.get('/api/recommendations/seasonal/:season', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { season } = req.params;
      const recommendations = await storage.generateSeasonalRecommendations(userId, season);
      res.json(recommendations);
    } catch (error) {
      console.error('Error generating seasonal recommendations:', error);
      res.status(500).json({ error: 'Failed to generate seasonal recommendations' });
    }
  });

  app.post('/api/recommendations/contextual', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const context = req.body;
      const recommendations = await storage.getContextualRecommendations(userId, context);
      res.json(recommendations);
    } catch (error) {
      console.error('Error fetching contextual recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch contextual recommendations' });
    }
  });

  app.post('/api/recommendations/update-scores', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      await storage.updateRecommendationScores(userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating recommendation scores:', error);
      res.status(500).json({ error: 'Failed to update recommendation scores' });
    }
  });

  app.get('/api/recommendations/similar-users', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const limit = parseInt(req.query.limit as string) || 10;
      const similarUsers = await storage.findSimilarUsers(userId, limit);
      res.json(similarUsers);
    } catch (error) {
      console.error('Error finding similar users:', error);
      res.status(500).json({ error: 'Failed to find similar users' });
    }
  });

  // External API recommendation endpoints
  app.post('/api/recommendations/external/personalized', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { itemType, context } = req.body;
      const preferences = await storage.getUserPreferences(userId);
      
      const recommendations = await recommendationAPIService.getPersonalizedRecommendations({
        userId,
        itemType,
        preferences,
        context
      });
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error fetching external personalized recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch external recommendations' });
    }
  });

  app.post('/api/recommendations/external/explanation', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { itemId } = req.body;
      
      const explanation = await recommendationAPIService.getRecommendationExplanation(userId, itemId);
      res.json(explanation);
    } catch (error) {
      console.error('Error fetching recommendation explanation:', error);
      res.status(500).json({ error: 'Failed to fetch recommendation explanation' });
    }
  });

  app.post('/api/recommendations/external/feedback', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { recommendationId, feedback, additionalData } = req.body;
      
      const success = await recommendationAPIService.sendFeedback(
        userId,
        recommendationId,
        feedback,
        additionalData
      );
      
      res.json({ success });
    } catch (error) {
      console.error('Error sending external feedback:', error);
      res.status(500).json({ error: 'Failed to send feedback' });
    }
  });

  app.get('/api/recommendations/external/seasonal/:season', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { season } = req.params;
      const itemType = req.query.itemType as string || 'product';
      
      const recommendations = await recommendationAPIService.getSeasonalRecommendations(
        userId,
        season,
        itemType
      );
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error fetching external seasonal recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch seasonal recommendations' });
    }
  });

  app.post('/api/recommendations/external/contextual', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const context = req.body;
      
      const recommendations = await recommendationAPIService.getContextualRecommendations(
        userId,
        context
      );
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error fetching external contextual recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch contextual recommendations' });
    }
  });

  app.get('/api/recommendations/external/ab-test/:variant', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { variant } = req.params;
      
      const recommendations = await recommendationAPIService.getABTestRecommendations(
        userId,
        variant as 'A' | 'B' | 'C'
      );
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error fetching A/B test recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch A/B test recommendations' });
    }
  });

  // Admin Panel API Endpoints
  app.get('/api/admin/stats', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const totalUsers = await storage.countUsers();
      const totalProducts = await storage.countProducts();
      const totalOrders = await storage.countOrders();
      const totalProperties = await storage.countProperties();
      const newUsersThisMonth = await storage.countNewUsersThisMonth();
      const activeProducts = await storage.countActiveProducts();
      const activeProperties = await storage.countActiveProperties();
      const revenue = await storage.getTotalRevenue();

      res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalProperties,
        newUsersThisMonth,
        activeProducts,
        activeProperties,
        revenue
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
  });

  app.get('/api/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.post('/api/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.put('/api/admin/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await storage.updateUser(id, userData);
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  app.delete('/api/admin/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  app.put('/api/admin/users/:id/status', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const user = await storage.updateUserStatus(id, isActive);
      res.json(user);
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ error: 'Failed to update user status' });
    }
  });

  app.put('/api/admin/users/:id/permissions', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const { permissions } = req.body;
      const user = await storage.updateUserPermissions(id, permissions);
      res.json(user);
    } catch (error) {
      console.error('Error updating user permissions:', error);
      res.status(500).json({ error: 'Failed to update user permissions' });
    }
  });

  // Hotel Management API Endpoints
  app.get('/api/admin/hotels', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const hotels = await storage.getAllHotels();
      res.json(hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ error: 'Failed to fetch hotels' });
    }
  });

  app.post('/api/admin/hotels', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const hotel = await storage.createHotel(req.body);
      res.status(201).json(hotel);
    } catch (error) {
      console.error('Error creating hotel:', error);
      res.status(500).json({ error: 'Failed to create hotel' });
    }
  });

  app.put('/api/admin/hotels/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const hotel = await storage.updateHotel(parseInt(id), req.body);
      res.json(hotel);
    } catch (error) {
      console.error('Error updating hotel:', error);
      res.status(500).json({ error: 'Failed to update hotel' });
    }
  });

  app.delete('/api/admin/hotels/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteHotel(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      res.status(500).json({ error: 'Failed to delete hotel' });
    }
  });

  // Room Type Management API Endpoints
  app.get('/api/admin/room-types', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const roomTypes = await storage.getAllRoomTypes();
      res.json(roomTypes);
    } catch (error) {
      console.error('Error fetching room types:', error);
      res.status(500).json({ error: 'Failed to fetch room types' });
    }
  });

  app.post('/api/admin/room-types', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const roomType = await storage.createRoomType(req.body);
      res.status(201).json(roomType);
    } catch (error) {
      console.error('Error creating room type:', error);
      res.status(500).json({ error: 'Failed to create room type' });
    }
  });

  app.put('/api/admin/room-types/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const roomType = await storage.updateRoomType(parseInt(id), req.body);
      res.json(roomType);
    } catch (error) {
      console.error('Error updating room type:', error);
      res.status(500).json({ error: 'Failed to update room type' });
    }
  });

  app.delete('/api/admin/room-types/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRoomType(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting room type:', error);
      res.status(500).json({ error: 'Failed to delete room type' });
    }
  });

  // Villa Management API Endpoints
  app.get('/api/admin/villas', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const villas = await storage.getAllVillas();
      res.json(villas);
    } catch (error) {
      console.error('Error fetching villas:', error);
      res.status(500).json({ error: 'Failed to fetch villas' });
    }
  });

  app.post('/api/admin/villas', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const villa = await storage.createVilla(req.body);
      res.status(201).json(villa);
    } catch (error) {
      console.error('Error creating villa:', error);
      res.status(500).json({ error: 'Failed to create villa' });
    }
  });

  app.put('/api/admin/villas/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const villa = await storage.updateVilla(parseInt(id), req.body);
      res.json(villa);
    } catch (error) {
      console.error('Error updating villa:', error);
      res.status(500).json({ error: 'Failed to update villa' });
    }
  });

  app.delete('/api/admin/villas/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteVilla(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting villa:', error);
      res.status(500).json({ error: 'Failed to delete villa' });
    }
  });

  // Homestay Management API Endpoints
  app.get('/api/admin/homestays', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const homestays = await storage.getAllHomestays();
      res.json(homestays);
    } catch (error) {
      console.error('Error fetching homestays:', error);
      res.status(500).json({ error: 'Failed to fetch homestays' });
    }
  });

  app.post('/api/admin/homestays', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const homestay = await storage.createHomestay(req.body);
      res.status(201).json(homestay);
    } catch (error) {
      console.error('Error creating homestay:', error);
      res.status(500).json({ error: 'Failed to create homestay' });
    }
  });

  app.put('/api/admin/homestays/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const homestay = await storage.updateHomestay(parseInt(id), req.body);
      res.json(homestay);
    } catch (error) {
      console.error('Error updating homestay:', error);
      res.status(500).json({ error: 'Failed to update homestay' });
    }
  });

  app.delete('/api/admin/homestays/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteHomestay(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting homestay:', error);
      res.status(500).json({ error: 'Failed to delete homestay' });
    }
  });

  // Airport Management API Endpoints
  app.get('/api/admin/airports', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const airports = await storage.getAllAirports();
      res.json(airports);
    } catch (error) {
      console.error('Error fetching airports:', error);
      res.status(500).json({ error: 'Failed to fetch airports' });
    }
  });

  app.post('/api/admin/airports', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const airport = await storage.createAirport(req.body);
      res.status(201).json(airport);
    } catch (error) {
      console.error('Error creating airport:', error);
      res.status(500).json({ error: 'Failed to create airport' });
    }
  });

  app.put('/api/admin/airports/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const airport = await storage.updateAirport(parseInt(id), req.body);
      res.json(airport);
    } catch (error) {
      console.error('Error updating airport:', error);
      res.status(500).json({ error: 'Failed to update airport' });
    }
  });

  app.delete('/api/admin/airports/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAirport(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting airport:', error);
      res.status(500).json({ error: 'Failed to delete airport' });
    }
  });

  // Travel Station Management API Endpoints
  app.get('/api/admin/stations', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const stations = await storage.getAllStations();
      res.json(stations);
    } catch (error) {
      console.error('Error fetching stations:', error);
      res.status(500).json({ error: 'Failed to fetch stations' });
    }
  });

  app.post('/api/admin/stations', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const station = await storage.createStation(req.body);
      res.status(201).json(station);
    } catch (error) {
      console.error('Error creating station:', error);
      res.status(500).json({ error: 'Failed to create station' });
    }
  });

  app.put('/api/admin/stations/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const station = await storage.updateStation(parseInt(id), req.body);
      res.json(station);
    } catch (error) {
      console.error('Error updating station:', error);
      res.status(500).json({ error: 'Failed to update station' });
    }
  });

  app.delete('/api/admin/stations/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteStation(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting station:', error);
      res.status(500).json({ error: 'Failed to delete station' });
    }
  });

  // Travel Provider Management API Endpoints
  app.get('/api/admin/providers', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const providers = await storage.getAllProviders();
      res.json(providers);
    } catch (error) {
      console.error('Error fetching providers:', error);
      res.status(500).json({ error: 'Failed to fetch providers' });
    }
  });

  app.post('/api/admin/providers', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const provider = await storage.createProvider(req.body);
      res.status(201).json(provider);
    } catch (error) {
      console.error('Error creating provider:', error);
      res.status(500).json({ error: 'Failed to create provider' });
    }
  });

  app.put('/api/admin/providers/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const provider = await storage.updateProvider(parseInt(id), req.body);
      res.json(provider);
    } catch (error) {
      console.error('Error updating provider:', error);
      res.status(500).json({ error: 'Failed to update provider' });
    }
  });

  app.delete('/api/admin/providers/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProvider(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting provider:', error);
      res.status(500).json({ error: 'Failed to delete provider' });
    }
  });

  // Flight Management API Endpoints
  app.get('/api/admin/flights', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const flights = await storage.getAllFlights();
      res.json(flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ error: 'Failed to fetch flights' });
    }
  });

  app.post('/api/admin/flights', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const flight = await storage.createFlight(req.body);
      res.status(201).json(flight);
    } catch (error) {
      console.error('Error creating flight:', error);
      res.status(500).json({ error: 'Failed to create flight' });
    }
  });

  app.put('/api/admin/flights/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const flight = await storage.updateFlight(parseInt(id), req.body);
      res.json(flight);
    } catch (error) {
      console.error('Error updating flight:', error);
      res.status(500).json({ error: 'Failed to update flight' });
    }
  });

  app.delete('/api/admin/flights/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteFlight(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting flight:', error);
      res.status(500).json({ error: 'Failed to delete flight' });
    }
  });

  // Tour Management API Endpoints
  app.get('/api/admin/tours', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const tours = await storage.getAllTours();
      res.json(tours);
    } catch (error) {
      console.error('Error fetching tours:', error);
      res.status(500).json({ error: 'Failed to fetch tours' });
    }
  });

  app.post('/api/admin/tours', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const tour = await storage.createTour(req.body);
      res.status(201).json(tour);
    } catch (error) {
      console.error('Error creating tour:', error);
      res.status(500).json({ error: 'Failed to create tour' });
    }
  });

  app.put('/api/admin/tours/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const tour = await storage.updateTour(parseInt(id), req.body);
      res.json(tour);
    } catch (error) {
      console.error('Error updating tour:', error);
      res.status(500).json({ error: 'Failed to update tour' });
    }
  });

  app.delete('/api/admin/tours/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTour(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting tour:', error);
      res.status(500).json({ error: 'Failed to delete tour' });
    }
  });

  app.delete('/api/admin/bulk-delete', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { table, ids } = req.body;
      await storage.bulkDelete(table, ids);
      res.json({ message: 'Items deleted successfully' });
    } catch (error) {
      console.error('Error bulk deleting items:', error);
      res.status(500).json({ error: 'Failed to delete items' });
    }
  });

  app.get('/api/admin/roles', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const roles = await storage.getAllRoles();
      res.json(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).json({ error: 'Failed to fetch roles' });
    }
  });

  app.post('/api/admin/roles', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const roleData = req.body;
      const role = await storage.createRole(roleData);
      res.status(201).json(role);
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ error: 'Failed to create role' });
    }
  });

  app.put('/api/admin/roles/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const roleData = req.body;
      const role = await storage.updateRole(id, roleData);
      res.json(role);
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({ error: 'Failed to update role' });
    }
  });

  app.delete('/api/admin/roles/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRole(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ error: 'Failed to delete role' });
    }
  });

  // Bulk operations
  app.post('/api/admin/users/bulk-update', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { userIds, updates } = req.body;
      const result = await storage.bulkUpdateUsers(userIds, updates);
      res.json(result);
    } catch (error) {
      console.error('Error bulk updating users:', error);
      res.status(500).json({ error: 'Failed to bulk update users' });
    }
  });

  app.post('/api/admin/users/bulk-delete', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { userIds } = req.body;
      await storage.bulkDeleteUsers(userIds);
      res.status(204).send();
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      res.status(500).json({ error: 'Failed to bulk delete users' });
    }
  });

  // Export/Import endpoints
  app.get('/api/admin/export/users', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=users.json');
      res.json(users);
    } catch (error) {
      console.error('Error exporting users:', error);
      res.status(500).json({ error: 'Failed to export users' });
    }
  });

  app.get('/api/admin/export/products', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=products.json');
      res.json(products);
    } catch (error) {
      console.error('Error exporting products:', error);
      res.status(500).json({ error: 'Failed to export products' });
    }
  });

  // System health endpoints
  app.get('/api/admin/health', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const dbHealth = await storage.checkDatabaseHealth();
      const systemHealth = {
        database: dbHealth ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      };
      res.json(systemHealth);
    } catch (error) {
      console.error('Error checking system health:', error);
      res.status(500).json({ error: 'Failed to check system health' });
    }
  });

  // Seller Analytics Routes
  app.get('/api/seller/analytics', requireAuth, async (req, res) => {
    try {
      const { sellerId, period = '30d' } = req.query;
      
      if (!sellerId) {
        return res.status(400).json({ error: 'Seller ID is required' });
      }

      // Check if user is authorized to view analytics
      if (req.user.id !== sellerId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const analytics = await storage.getSellerAnalytics(sellerId as string, period as string);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching seller analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  app.get('/api/seller/products', requireAuth, async (req, res) => {
    try {
      const { sellerId } = req.query;
      
      if (!sellerId) {
        return res.status(400).json({ error: 'Seller ID is required' });
      }

      // Check if user is authorized to view products
      if (req.user.id !== sellerId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const products = await storage.getSellerProducts(sellerId as string);
      res.json(products);
    } catch (error) {
      console.error('Error fetching seller products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.get('/api/seller/orders', requireAuth, async (req, res) => {
    try {
      const { sellerId } = req.query;
      
      if (!sellerId) {
        return res.status(400).json({ error: 'Seller ID is required' });
      }

      // Check if user is authorized to view orders
      if (req.user.id !== sellerId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const orders = await storage.getSellerOrders(sellerId as string);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.get('/api/seller/inventory', requireAuth, async (req, res) => {
    try {
      const { sellerId } = req.query;
      
      if (!sellerId) {
        return res.status(400).json({ error: 'Seller ID is required' });
      }

      // Check if user is authorized to view inventory
      if (req.user.id !== sellerId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const inventory = await storage.getSellerInventory(sellerId as string);
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching seller inventory:', error);
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  });

  app.get('/api/seller/performance', requireAuth, async (req, res) => {
    try {
      const { sellerId, period = '30d' } = req.query;
      
      if (!sellerId) {
        return res.status(400).json({ error: 'Seller ID is required' });
      }

      // Check if user is authorized
      if (req.user.id !== sellerId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const performance = await storage.getSellerPerformance(sellerId as string, period as string);
      res.json(performance);
    } catch (error) {
      console.error('Error fetching seller performance:', error);
      res.status(500).json({ error: 'Failed to fetch performance data' });
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

  // Popular Destinations API Routes
  app.get('/api/destinations', async (req, res) => {
    try {
      const destinations = [
        {
          id: 1,
          name: 'Hạ Long Bay',
          nameEn: 'Ha Long Bay',
          location: 'Quảng Ninh, Vietnam',
          coordinates: { lat: 20.9101, lng: 107.1839 },
          image: 'https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=800&h=600&fit=crop',
          description: 'UNESCO World Heritage site famous for emerald waters and limestone karsts',
          rating: 4.8,
          reviews: 12847,
          category: 'Natural Wonder',
          bestTime: 'October - April',
          avgStay: '2-3 days',
          attractions: ['Titop Island', 'Sung Sot Cave', 'Floating Villages', 'Kayaking'],
          featured: true
        },
        {
          id: 2,
          name: 'Phố Cổ Hội An',
          nameEn: 'Hoi An Ancient Town',
          location: 'Quảng Nam, Vietnam',
          coordinates: { lat: 15.8801, lng: 108.3380 },
          image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
          description: 'Historic trading port with well-preserved ancient architecture',
          rating: 4.9,
          reviews: 18293,
          category: 'Historic Town',
          bestTime: 'February - August',
          avgStay: '3-4 days',
          attractions: ['Japanese Covered Bridge', 'Old Houses', 'Lantern Festival', 'Tailor Shops'],
          featured: true
        },
        {
          id: 3,
          name: 'Phú Quốc',
          nameEn: 'Phu Quoc Island',
          location: 'Kiên Giang, Vietnam',
          coordinates: { lat: 10.2899, lng: 103.9840 },
          image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop',
          description: 'Tropical island paradise with pristine beaches and crystal clear waters',
          rating: 4.7,
          reviews: 9456,
          category: 'Beach Paradise',
          bestTime: 'November - March',
          avgStay: '4-5 days',
          attractions: ['Sao Beach', 'Night Market', 'Cable Car', 'Pepper Farms'],
          featured: true
        },
        {
          id: 4,
          name: 'Đà Lạt',
          nameEn: 'Da Lat',
          location: 'Lâm Đồng, Vietnam',
          coordinates: { lat: 11.9404, lng: 108.4583 },
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          description: 'Cool mountain city known for flowers, waterfalls, and French colonial architecture',
          rating: 4.6,
          reviews: 15782,
          category: 'Mountain City',
          bestTime: 'Year-round',
          avgStay: '2-3 days',
          attractions: ['Flower Gardens', 'Crazy House', 'Waterfalls', 'Coffee Plantations'],
          featured: false
        },
        {
          id: 5,
          name: 'Sapa',
          nameEn: 'Sapa',
          location: 'Lào Cai, Vietnam',
          coordinates: { lat: 22.3380, lng: 103.8438 },
          image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
          description: 'Mountainous region famous for terraced rice fields and ethnic minorities',
          rating: 4.5,
          reviews: 8647,
          category: 'Mountain Adventure',
          bestTime: 'September - November, March - May',
          avgStay: '2-3 days',
          attractions: ['Rice Terraces', 'Fansipan Mountain', 'Ethnic Villages', 'Markets'],
          featured: false
        },
        {
          id: 6,
          name: 'Nha Trang',
          nameEn: 'Nha Trang',
          location: 'Khánh Hòa, Vietnam',
          coordinates: { lat: 12.2388, lng: 109.1967 },
          image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop',
          description: 'Coastal city with beautiful beaches, diving spots, and vibrant nightlife',
          rating: 4.4,
          reviews: 11293,
          category: 'Beach City',
          bestTime: 'January - August',
          avgStay: '3-4 days',
          attractions: ['Beaches', 'Diving', 'Night Markets', 'Temples'],
          featured: false
        }
      ];

      const { category, featured, search } = req.query;
      let filteredDestinations = destinations;

      if (category) {
        filteredDestinations = filteredDestinations.filter(dest => 
          dest.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (featured === 'true') {
        filteredDestinations = filteredDestinations.filter(dest => dest.featured);
      }

      if (search) {
        filteredDestinations = filteredDestinations.filter(dest =>
          dest.name.toLowerCase().includes(search.toLowerCase()) ||
          dest.nameEn.toLowerCase().includes(search.toLowerCase()) ||
          dest.location.toLowerCase().includes(search.toLowerCase())
        );
      }

      res.json(filteredDestinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      res.status(500).json({ error: 'Failed to fetch destinations' });
    }
  });

  app.get('/api/destinations/:id', async (req, res) => {
    try {
      const destinationId = parseInt(req.params.id);
      const hotelsByDestination = {
        1: [ // Ha Long Bay
          {
            id: 101,
            name: 'Emeralda Cruise Ha Long',
            rating: 4.7,
            price: 2800000,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
            amenities: ['wifi', 'restaurant', 'spa', 'pool'],
            distance: '0.5km from bay center'
          },
          {
            id: 102,
            name: 'Novotel Ha Long Bay',
            rating: 4.5,
            price: 2200000,
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
            amenities: ['wifi', 'restaurant', 'gym', 'pool'],
            distance: '1.2km from bay center'
          },
          {
            id: 103,
            name: 'Wyndham Legend Ha Long',
            rating: 4.6,
            price: 1800000,
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
            amenities: ['wifi', 'restaurant', 'spa', 'gym'],
            distance: '2.0km from bay center'
          }
        ],
        2: [ // Hoi An
          {
            id: 201,
            name: 'La Siesta Hoi An Resort',
            rating: 4.8,
            price: 1500000,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
            amenities: ['wifi', 'pool', 'spa', 'restaurant'],
            distance: '0.3km from Ancient Town'
          },
          {
            id: 202,
            name: 'Boutique Hoi An Resort',
            rating: 4.6,
            price: 1200000,
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
            amenities: ['wifi', 'pool', 'restaurant', 'spa'],
            distance: '0.5km from Ancient Town'
          },
          {
            id: 203,
            name: 'Hoi An Eco Lodge',
            rating: 4.4,
            price: 900000,
            image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
            amenities: ['wifi', 'restaurant', 'garden', 'bike'],
            distance: '1.0km from Ancient Town'
          }
        ],
        3: [ // Phu Quoc
          {
            id: 301,
            name: 'JW Marriott Phu Quoc',
            rating: 4.9,
            price: 4500000,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            amenities: ['wifi', 'pool', 'spa', 'restaurant', 'beach'],
            distance: '0.1km from beach'
          },
          {
            id: 302,
            name: 'Salinda Resort Phu Quoc',
            rating: 4.6,
            price: 3200000,
            image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
            amenities: ['wifi', 'pool', 'spa', 'restaurant'],
            distance: '0.2km from beach'
          },
          {
            id: 303,
            name: 'Phu Quoc Eco Beach Resort',
            rating: 4.3,
            price: 1800000,
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop',
            amenities: ['wifi', 'pool', 'restaurant', 'beach'],
            distance: '0.3km from beach'
          }
        ]
      };

      const destinations = [
        {
          id: 1,
          name: 'Hạ Long Bay',
          nameEn: 'Ha Long Bay',
          location: 'Quảng Ninh, Vietnam',
          coordinates: { lat: 20.9101, lng: 107.1839 },
          image: 'https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=800&h=600&fit=crop',
          description: 'UNESCO World Heritage site famous for emerald waters and limestone karsts',
          rating: 4.8,
          reviews: 12847,
          category: 'Natural Wonder',
          bestTime: 'October - April',
          avgStay: '2-3 days',
          attractions: ['Titop Island', 'Sung Sot Cave', 'Floating Villages', 'Kayaking'],
          hotels: hotelsByDestination[1] || []
        },
        {
          id: 2,
          name: 'Phố Cổ Hội An',
          nameEn: 'Hoi An Ancient Town',
          location: 'Quảng Nam, Vietnam',
          coordinates: { lat: 15.8801, lng: 108.3380 },
          image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
          description: 'Historic trading port with well-preserved ancient architecture',
          rating: 4.9,
          reviews: 18293,
          category: 'Historic Town',
          bestTime: 'February - August',
          avgStay: '3-4 days',
          attractions: ['Japanese Covered Bridge', 'Old Houses', 'Lantern Festival', 'Tailor Shops'],
          hotels: hotelsByDestination[2] || []
        },
        {
          id: 3,
          name: 'Phú Quốc',
          nameEn: 'Phu Quoc Island',
          location: 'Kiên Giang, Vietnam',
          coordinates: { lat: 10.2899, lng: 103.9840 },
          image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop',
          description: 'Tropical island paradise with pristine beaches and crystal clear waters',
          rating: 4.7,
          reviews: 9456,
          category: 'Beach Paradise',
          bestTime: 'November - March',
          avgStay: '4-5 days',
          attractions: ['Sao Beach', 'Night Market', 'Cable Car', 'Pepper Farms'],
          hotels: hotelsByDestination[3] || []
        }
      ];

      const destination = destinations.find(dest => dest.id === destinationId);
      if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
      }

      res.json(destination);
    } catch (error) {
      console.error('Error fetching destination:', error);
      res.status(500).json({ error: 'Failed to fetch destination' });
    }
  });

  app.get('/api/destinations/:id/hotels', async (req, res) => {
    try {
      const destinationId = parseInt(req.params.id);
      const { priceRange, rating, amenities } = req.query;
      
      const hotelsByDestination = {
        1: [ // Ha Long Bay
          {
            id: 101,
            name: 'Emeralda Cruise Ha Long',
            rating: 4.7,
            price: 2800000,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
            amenities: ['wifi', 'restaurant', 'spa', 'pool'],
            distance: '0.5km from bay center',
            description: 'Luxury cruise experience with premium amenities'
          },
          {
            id: 102,
            name: 'Novotel Ha Long Bay',
            rating: 4.5,
            price: 2200000,
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
            amenities: ['wifi', 'restaurant', 'gym', 'pool'],
            distance: '1.2km from bay center',
            description: 'Modern hotel with excellent facilities'
          }
        ],
        2: [ // Hoi An
          {
            id: 201,
            name: 'La Siesta Hoi An Resort',
            rating: 4.8,
            price: 1500000,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
            amenities: ['wifi', 'pool', 'spa', 'restaurant'],
            distance: '0.3km from Ancient Town',
            description: 'Boutique resort in the heart of ancient town'
          }
        ],
        3: [ // Phu Quoc
          {
            id: 301,
            name: 'JW Marriott Phu Quoc',
            rating: 4.9,
            price: 4500000,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            amenities: ['wifi', 'pool', 'spa', 'restaurant', 'beach'],
            distance: '0.1km from beach',
            description: 'Luxury beachfront resort with world-class facilities'
          }
        ]
      };

      let hotels = hotelsByDestination[destinationId] || [];

      // Apply filters
      if (priceRange) {
        const ranges = {
          'budget': [0, 1000000],
          'mid': [1000000, 3000000],
          'luxury': [3000000, 10000000]
        };
        const [min, max] = ranges[priceRange] || [0, 10000000];
        hotels = hotels.filter(hotel => hotel.price >= min && hotel.price <= max);
      }

      if (rating) {
        hotels = hotels.filter(hotel => hotel.rating >= parseFloat(rating));
      }

      if (amenities) {
        const requestedAmenities = amenities.split(',');
        hotels = hotels.filter(hotel => 
          requestedAmenities.every(amenity => hotel.amenities.includes(amenity))
        );
      }

      res.json(hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ error: 'Failed to fetch hotels' });
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
  
  // Room availability routes
  app.get('/api/properties/:id/room-availability', async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      const availability = await storage.getRoomAvailability(
        parseInt(id),
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(availability);
    } catch (error) {
      console.error('Error fetching room availability:', error);
      res.status(500).json({ message: 'Failed to fetch room availability' });
    }
  });

  app.post('/api/properties/:id/check-room-availability', async (req, res) => {
    try {
      const { id } = req.params;
      const { checkIn, checkOut, roomsNeeded } = req.body;
      const isAvailable = await storage.checkRoomAvailability(
        parseInt(id),
        new Date(checkIn),
        new Date(checkOut),
        roomsNeeded
      );
      res.json({ available: isAvailable });
    } catch (error) {
      console.error('Error checking room availability:', error);
      res.status(500).json({ message: 'Failed to check room availability' });
    }
  });

  // Promotions routes
  app.get('/api/promotions', async (req, res) => {
    try {
      const { propertyId } = req.query;
      const promotions = await storage.getPromotions(propertyId ? parseInt(propertyId as string) : undefined);
      res.json(promotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      res.status(500).json({ message: 'Failed to fetch promotions' });
    }
  });

  app.post('/api/validate-promo-code', async (req, res) => {
    try {
      const { code, propertyId, nights } = req.body;
      const promotion = await storage.validatePromoCode(code, propertyId, nights);
      if (promotion) {
        res.json({ valid: true, promotion });
      } else {
        res.json({ valid: false, message: 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn' });
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      res.status(500).json({ message: 'Failed to validate promo code' });
    }
  });

  // Payment routes
  app.get('/api/payments', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const payments = await storage.getPayments(userId);
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ message: 'Failed to fetch payments' });
    }
  });

  app.post('/api/payments', requireAuth, async (req: any, res) => {
    try {
      const paymentData = { ...req.body, userId: req.session.userId };
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ message: 'Failed to create payment' });
    }
  });

  // Booking history routes
  app.get('/api/booking-history', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { userType = 'guest' } = req.query;
      const bookings = await storage.getBookingHistory(userId, userType as 'guest' | 'host');
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      res.status(500).json({ message: 'Failed to fetch booking history' });
    }
  });

  app.get('/api/bookings/:id/details', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getBookingWithDetails(parseInt(id));
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      res.status(500).json({ message: 'Failed to fetch booking details' });
    }
  });

  app.put('/api/bookings/:id/status', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, checkInOut } = req.body;
      const booking = await storage.updateBookingStatus(parseInt(id), status, checkInOut);
      res.json(booking);
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ message: 'Failed to update booking status' });
    }
  });

  // Seed properties and bookings (development only)
  app.post('/api/seed/properties', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Seeding not allowed in production' });
    }
    
    try {
      console.log('🏠 Seeding properties and bookings data...');
      
      // Create sample properties
      const properties = [
        {
          hostId: 'admin-001',
          title: 'Luxury Apartment in Ho Chi Minh City Center',
          description: 'Beautiful modern apartment with city views, perfect for business travelers and tourists. Located in the heart of District 1 with easy access to restaurants, shopping, and attractions.',
          propertyType: 'apartment',
          roomType: 'entire_place',
          address: '123 Nguyen Hue Street, District 1',
          city: 'Ho Chi Minh City',
          country: 'Vietnam',
          zipCode: '700000',
          latitude: 10.7769,
          longitude: 106.7009,
          pricePerNight: 85,
          maxGuests: 4,
          bedrooms: 2,
          bathrooms: 2,
          amenities: ['wifi', 'air_conditioning', 'kitchen', 'tv', 'washer', 'elevator', 'parking'],
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
          ],
          checkInTime: '15:00',
          checkOutTime: '11:00',
          cleaningFee: 15,
          serviceFee: 12,
          rating: 4.8,
          reviewCount: 127,
          isInstantBook: true,
          minimumStay: 1,
          maximumStay: 30,
          isActive: true
        },
        {
          hostId: 'seller-001',
          title: 'Cozy Villa in Da Nang Beach',
          description: 'Stunning beachfront villa with private pool and direct beach access. Perfect for families and groups looking for a relaxing getaway by the sea.',
          propertyType: 'villa',
          roomType: 'entire_place',
          address: '456 My Khe Beach, Son Tra District',
          city: 'Da Nang',
          country: 'Vietnam',
          zipCode: '550000',
          latitude: 16.0544,
          longitude: 108.2442,
          pricePerNight: 150,
          maxGuests: 8,
          bedrooms: 4,
          bathrooms: 3,
          amenities: ['wifi', 'air_conditioning', 'kitchen', 'tv', 'washer', 'pool', 'beach_access', 'parking', 'bbq'],
          images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
          ],
          checkInTime: '14:00',
          checkOutTime: '12:00',
          cleaningFee: 25,
          serviceFee: 20,
          rating: 4.9,
          reviewCount: 89,
          isInstantBook: false,
          minimumStay: 2,
          maximumStay: 14,
          isActive: true
        },
        {
          hostId: 'admin-001',
          title: 'Traditional House in Hanoi Old Quarter',
          description: 'Authentic Vietnamese house in the historic Old Quarter. Experience local culture while staying in comfort with modern amenities.',
          propertyType: 'house',
          roomType: 'entire_place',
          address: '789 Hang Bac Street, Hoan Kiem District',
          city: 'Hanoi',
          country: 'Vietnam',
          zipCode: '100000',
          latitude: 21.0285,
          longitude: 105.8542,
          pricePerNight: 65,
          maxGuests: 6,
          bedrooms: 3,
          bathrooms: 2,
          amenities: ['wifi', 'air_conditioning', 'kitchen', 'tv', 'washer', 'balcony'],
          images: [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
          ],
          checkInTime: '15:00',
          checkOutTime: '11:00',
          cleaningFee: 20,
          serviceFee: 15,
          rating: 4.6,
          reviewCount: 203,
          isInstantBook: true,
          minimumStay: 1,
          maximumStay: 21,
          isActive: true
        }
      ];

      // Create properties
      const createdProperties = [];
      for (const propertyData of properties) {
        const property = await storage.createProperty(propertyData);
        createdProperties.push(property);
      }

      console.log('✅ Created properties');

      // Create sample bookings
      const bookings = [
        {
          propertyId: createdProperties[0].id,
          guestId: 'user-001',
          hostId: createdProperties[0].hostId,
          checkInDate: new Date('2024-12-15'),
          checkOutDate: new Date('2024-12-18'),
          guests: 2,
          totalAmount: (createdProperties[0].pricePerNight * 3) + createdProperties[0].cleaningFee + createdProperties[0].serviceFee,
          status: 'confirmed',
          paymentStatus: 'paid',
          specialRequests: 'Late check-in preferred'
        },
        {
          propertyId: createdProperties[1].id,
          guestId: 'user-002',
          hostId: createdProperties[1].hostId,
          checkInDate: new Date('2024-12-20'),
          checkOutDate: new Date('2024-12-25'),
          guests: 4,
          totalAmount: (createdProperties[1].pricePerNight * 5) + createdProperties[1].cleaningFee + createdProperties[1].serviceFee,
          status: 'confirmed',
          paymentStatus: 'paid',
          specialRequests: 'Family with children'
        },
        {
          propertyId: createdProperties[2].id,
          guestId: 'admin-001',
          hostId: createdProperties[2].hostId,
          checkInDate: new Date('2024-12-10'),
          checkOutDate: new Date('2024-12-14'),
          guests: 3,
          totalAmount: (createdProperties[2].pricePerNight * 4) + createdProperties[2].cleaningFee + createdProperties[2].serviceFee,
          status: 'completed',
          paymentStatus: 'paid'
        }
      ];

      // Create bookings
      const createdBookings = [];
      for (const bookingData of bookings) {
        const booking = await storage.createBooking(bookingData);
        createdBookings.push(booking);
      }

      console.log('✅ Created bookings');

      res.json({ 
        message: 'Properties and bookings seeded successfully',
        data: {
          propertyCount: createdProperties.length,
          bookingCount: createdBookings.length,
          properties: createdProperties,
          bookings: createdBookings
        }
      });
    } catch (error: any) {
      console.error('Error seeding properties and bookings:', error);
      res.status(500).json({ message: 'Failed to seed properties and bookings', error: error.message });
    }
  });

  // Skeleton loading demonstration endpoints with artificial delays
  app.get('/api/test/products-slow', async (req, res) => {
    // Simulate slow loading for skeleton demonstration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const products = await storage.getProducts({ limit: 8 });
    res.json(products);
  });

  app.get('/api/test/properties-slow', async (req, res) => {
    // Simulate slow loading for skeleton demonstration
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const properties = await storage.getProperties({ limit: 8 });
    res.json(properties);
  });

  app.get('/api/test/travel-slow', async (req, res) => {
    // Simulate slow loading for skeleton demonstration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const flights = await storage.getFlights({ limit: 6 });
    res.json(flights);
  });

  return httpServer;
}
