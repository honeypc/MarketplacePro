import {
  users,
  categories,
  products,
  reviews,
  cartItems,
  wishlistItems,
  orders,
  orderItems,
  inventoryAlerts,
  stockMovements,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Review,
  type InsertReview,
  type CartItem,
  type InsertCartItem,
  type WishlistItem,
  type InsertWishlistItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type InventoryAlert,
  type InsertInventoryAlert,
  type StockMovement,
  type InsertStockMovement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, desc, asc, sql, inArray } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Product operations
  getProducts(filters?: {
    categoryId?: number;
    sellerId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
    sortBy?: 'price' | 'created' | 'rating';
    sortOrder?: 'asc' | 'desc';
    excludeId?: number;
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getProductsByIds(ids: number[]): Promise<Product[]>;

  // Review operations
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getUserReviews(userId: string): Promise<Review[]>;

  // Cart operations
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Wishlist operations
  getWishlistItems(userId: string): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: number): Promise<void>;

  // Order operations
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Seller operations
  getSellerStats(sellerId: string): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    avgRating: number;
  }>;

  // Inventory management operations
  getInventoryAlerts(sellerId: string): Promise<InventoryAlert[]>;
  createInventoryAlert(alert: InsertInventoryAlert): Promise<InventoryAlert>;
  markAlertAsRead(alertId: number): Promise<void>;
  markAlertAsResolved(alertId: number): Promise<void>;
  
  // Stock movement operations
  getStockMovements(productId: number): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  updateProductStock(productId: number, newStock: number, movementType: string, reason?: string, sellerId?: string): Promise<void>;
  
  // Low stock checking
  checkLowStock(sellerId: string): Promise<Product[]>;
  createLowStockAlert(productId: number, sellerId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db
      .insert(categories)
      .values(category)
      .returning();
    return result[0];
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
    const result = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(filters?: {
    categoryId?: number;
    sellerId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
    sortBy?: 'price' | 'created' | 'rating';
    sortOrder?: 'asc' | 'desc';
    excludeId?: number;
  }): Promise<Product[]> {
    const conditions = [];

    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.sellerId) {
      conditions.push(eq(products.sellerId, filters.sellerId));
    }

    if (filters?.search) {
      conditions.push(ilike(products.title, `%${filters.search}%`));
    }

    if (filters?.minPrice) {
      conditions.push(sql`${products.price}::numeric >= ${filters.minPrice}`);
    }

    if (filters?.maxPrice) {
      conditions.push(sql`${products.price}::numeric <= ${filters.maxPrice}`);
    }

    if (filters?.excludeId) {
      conditions.push(sql`${products.id} != ${filters.excludeId}`);
    }

    let query = db.select().from(products);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Default sorting
    query = query.orderBy(desc(products.createdAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db
      .insert(products)
      .values(product)
      .returning();
    return result[0];
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const result = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    return await db.select().from(products).where(inArray(products.id, ids));
  }

  // Review operations
  async getProductReviews(productId: number): Promise<(Review & { user: User })[]> {
    return await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        verified: reviews.verified,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db
      .insert(reviews)
      .values(review)
      .returning();
    return result[0];
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const existing = await db
      .select()
      .from(cartItems)
      .where(and(
        eq(cartItems.userId, item.userId),
        eq(cartItems.productId, item.productId)
      ));

    if (existing.length > 0) {
      const result = await db
        .update(cartItems)
        .set({ quantity: existing[0].quantity + (item.quantity || 1) })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(cartItems)
        .values(item)
        .returning();
      return result[0];
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const result = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return result[0];
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return await db
      .select()
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, userId));
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const result = await db
      .insert(wishlistItems)
      .values(item)
      .returning();
    return result[0];
  }

  async removeFromWishlist(id: number): Promise<void> {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
  }

  // Order operations
  async getOrders(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db
      .insert(orders)
      .values(order)
      .returning();
    return result[0];
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const result = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const result = await db
      .insert(orderItems)
      .values(item)
      .returning();
    return result[0];
  }

  // Seller operations
  async getSellerStats(sellerId: string): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    avgRating: number;
  }> {
    const productCount = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(products)
      .where(eq(products.sellerId, sellerId));

    const orderCount = await db
      .select({
        count: sql<number>`count(*)::int`,
        revenue: sql<number>`sum(${orders.totalAmount})::numeric`,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(products.sellerId, sellerId));

    const avgRating = await db
      .select({
        avg: sql<number>`avg(${reviews.rating})::numeric`,
      })
      .from(reviews)
      .innerJoin(products, eq(reviews.productId, products.id))
      .where(eq(products.sellerId, sellerId));

    return {
      totalProducts: productCount[0]?.count || 0,
      totalOrders: orderCount[0]?.count || 0,
      totalRevenue: Number(orderCount[0]?.revenue || 0),
      avgRating: Number(avgRating[0]?.avg || 0),
    };
  }

  // Inventory management operations
  async getInventoryAlerts(sellerId: string): Promise<InventoryAlert[]> {
    return await db
      .select()
      .from(inventoryAlerts)
      .where(eq(inventoryAlerts.sellerId, sellerId))
      .orderBy(desc(inventoryAlerts.createdAt));
  }

  async createInventoryAlert(alert: InsertInventoryAlert): Promise<InventoryAlert> {
    const [newAlert] = await db
      .insert(inventoryAlerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async markAlertAsRead(alertId: number): Promise<void> {
    await db
      .update(inventoryAlerts)
      .set({ isRead: true })
      .where(eq(inventoryAlerts.id, alertId));
  }

  async markAlertAsResolved(alertId: number): Promise<void> {
    await db
      .update(inventoryAlerts)
      .set({ isResolved: true, resolvedAt: new Date() })
      .where(eq(inventoryAlerts.id, alertId));
  }

  // Stock movement operations
  async getStockMovements(productId: number): Promise<StockMovement[]> {
    return await db
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.productId, productId))
      .orderBy(desc(stockMovements.createdAt));
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const [newMovement] = await db
      .insert(stockMovements)
      .values(movement)
      .returning();
    return newMovement;
  }

  async updateProductStock(
    productId: number,
    newStock: number,
    movementType: string,
    reason?: string,
    sellerId?: string
  ): Promise<void> {
    // Get current product
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      throw new Error('Product not found');
    }

    const previousStock = product.stock;
    const quantity = newStock - previousStock;

    // Update product stock
    await db
      .update(products)
      .set({ stock: newStock, updatedAt: new Date() })
      .where(eq(products.id, productId));

    // Create stock movement record
    await this.createStockMovement({
      productId,
      sellerId: sellerId || product.sellerId,
      movementType,
      quantity,
      previousStock,
      newStock,
      reason: reason || `Stock ${movementType}`,
    });

    // Check if low stock alert is needed
    if (newStock <= (product.lowStockThreshold || 10)) {
      await this.createLowStockAlert(productId, product.sellerId);
    }
  }

  async checkLowStock(sellerId: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.sellerId, sellerId),
          sql`${products.stock} <= ${products.lowStockThreshold}`
        )
      );
  }

  async createLowStockAlert(productId: number, sellerId: string): Promise<void> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product) return;

    // Check if there's already an unresolved low stock alert
    const existingAlert = await db
      .select()
      .from(inventoryAlerts)
      .where(
        and(
          eq(inventoryAlerts.productId, productId),
          eq(inventoryAlerts.alertType, 'low_stock'),
          eq(inventoryAlerts.isResolved, false)
        )
      )
      .limit(1);

    if (existingAlert.length > 0) return;

    // Create low stock alert
    await this.createInventoryAlert({
      productId,
      sellerId,
      alertType: 'low_stock',
      message: `Low stock alert: ${product.title} has only ${product.stock} units remaining (threshold: ${product.lowStockThreshold})`,
      severity: product.stock === 0 ? 'critical' : product.stock <= 5 ? 'high' : 'medium',
    });
  }
}

export const storage = new DatabaseStorage();