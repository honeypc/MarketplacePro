import { prisma } from "./prisma";
import type { 
  User, 
  Category, 
  Product, 
  Review, 
  CartItem, 
  WishlistItem, 
  Order, 
  OrderItem,
  ChatRoom,
  ChatMessage,
  Property,
  Booking,
  PropertyReview,
  Payment,
  Itinerary,
  ItineraryDay,
  ItineraryActivity,
  Prisma
} from "@prisma/client";

// Define input types using Prisma generated types
export type UpsertUser = Prisma.UserCreateInput;
export type InsertCategory = Prisma.CategoryCreateInput;
export type InsertProduct = Prisma.ProductCreateInput;
export type InsertReview = Prisma.ReviewCreateInput;
export type InsertCartItem = Prisma.CartItemCreateInput;
export type InsertWishlistItem = Prisma.WishlistItemCreateInput;
export type InsertOrder = Prisma.OrderCreateInput;
export type InsertOrderItem = Prisma.OrderItemCreateInput;
export type InsertChatRoom = Prisma.ChatRoomCreateInput;
export type InsertChatMessage = Prisma.ChatMessageCreateInput;
export type InsertProperty = Prisma.PropertyCreateInput;
export type InsertBooking = Prisma.BookingCreateInput;
export type InsertPropertyReview = Prisma.PropertyReviewCreateInput;
export type InsertPayment = Prisma.PaymentCreateInput;
export type InsertItinerary = Prisma.ItineraryCreateInput;

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
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
  getSellerStats(sellerId: string): Promise<any>;
  getSellerAnalytics(sellerId: string, period: string): Promise<any>;
  getSellerSalesData(sellerId: string, period: string): Promise<any>;
  getSellerProductPerformance(sellerId: string): Promise<any>;
  getSellerCustomerInsights(sellerId: string): Promise<any>;
  getSellerRevenueBreakdown(sellerId: string, period: string): Promise<any>;

  // Inventory management operations
  getInventoryAlerts(sellerId: string): Promise<any[]>;
  createInventoryAlert(alert: any): Promise<any>;
  markAlertAsRead(alertId: number): Promise<void>;
  markAlertAsResolved(alertId: number): Promise<void>;
  
  // Stock movement operations
  getStockMovements(productId: number): Promise<any[]>;
  createStockMovement(movement: any): Promise<any>;
  updateProductStock(productId: number, newStock: number, movementType: string, reason?: string, sellerId?: string): Promise<void>;
  
  // Low stock checking
  checkLowStock(sellerId: string): Promise<any[]>;
  createLowStockAlert(productId: number, sellerId: string): Promise<void>;

  // Chat operations
  getChatRooms(userId: string): Promise<ChatRoom[]>;
  getChatRoom(roomId: number): Promise<ChatRoom | undefined>;
  createChatRoom(room: InsertChatRoom): Promise<ChatRoom>;
  updateChatRoom(roomId: number, updates: any): Promise<ChatRoom>;
  closeChatRoom(roomId: number): Promise<void>;
  
  // Message operations
  getChatMessages(roomId: number, limit?: number, offset?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  markMessagesAsRead(roomId: number, userId: string): Promise<void>;
  getUnreadMessageCount(roomId: number, userId: string): Promise<number>;
  
  // Attachment operations
  createChatAttachment(attachment: any): Promise<any>;
  getChatAttachments(messageId: number): Promise<any[]>;
  
  // Support operations
  getActiveChatRooms(supportAgentId?: string): Promise<ChatRoom[]>;
  assignChatRoom(roomId: number, supportAgentId: string): Promise<ChatRoom>;
  getSupportStats(supportAgentId: string): Promise<any>;

  // Property operations
  getProperties(filters?: any): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: any): Promise<Property>;
  deleteProperty(id: number): Promise<void>;
  getPropertiesByHost(hostId: string): Promise<Property[]>;
  searchProperties(filters: any): Promise<Property[]>;

  // Booking operations
  getBookings(userId: string, userType: 'guest' | 'host'): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: any): Promise<Booking>;
  cancelBooking(id: number, reason: string): Promise<Booking>;
  getPropertyBookings(propertyId: number): Promise<Booking[]>;
  checkAvailability(propertyId: number, checkIn: Date, checkOut: Date): Promise<boolean>;

  // Property review operations
  getPropertyReviews(propertyId: number): Promise<PropertyReview[]>;
  createPropertyReview(review: InsertPropertyReview): Promise<PropertyReview>;
  getBookingReview(bookingId: number): Promise<PropertyReview | undefined>;
  getHostReviews(hostId: string): Promise<PropertyReview[]>;

  // Property availability operations
  getPropertyAvailability(propertyId: number, startDate: Date, endDate: Date): Promise<any[]>;
  setPropertyAvailability(propertyId: number, date: Date, available: boolean, customPrice?: number): Promise<void>;
  bulkSetAvailability(propertyId: number, dates: Date[], available: boolean): Promise<void>;
  
  // Room availability operations
  getRoomAvailability(propertyId: number, startDate: Date, endDate: Date): Promise<any[]>;
  updateRoomAvailability(propertyId: number, date: Date, availableRooms: number, totalRooms: number, priceOverride?: number): Promise<void>;
  checkRoomAvailability(propertyId: number, checkIn: Date, checkOut: Date, roomsNeeded: number): Promise<boolean>;
  
  // Promotions operations
  getPromotions(propertyId?: number): Promise<any[]>;
  getPromotion(id: number): Promise<any | undefined>;
  createPromotion(promotion: any): Promise<any>;
  updatePromotion(id: number, promotion: any): Promise<any>;
  deletePromotion(id: number): Promise<void>;
  validatePromoCode(code: string, propertyId: number, nights: number): Promise<any | null>;
  
  // Payment operations
  getPayments(userId: string): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: any): Promise<Payment>;
  processPayment(bookingId: number, paymentData: any): Promise<Payment>;
  
  // Booking history operations
  getBookingHistory(userId: string, userType: 'guest' | 'host'): Promise<any[]>;
  getBookingWithDetails(id: number): Promise<any | undefined>;
  updateBookingStatus(id: number, status: string, checkInOut?: any): Promise<Booking>;
  
  // Travel itinerary operations
  getUserItineraries(userId: string): Promise<Itinerary[]>;
  getItinerary(id: number, userId: string): Promise<Itinerary | undefined>;
  createItinerary(data: any): Promise<Itinerary>;
  updateItinerary(id: number, userId: string, data: any): Promise<Itinerary>;
  deleteItinerary(id: number, userId: string): Promise<void>;
  getItineraryTemplates(): Promise<any[]>;
  createItineraryFromTemplate(templateId: number, userId: string, customizations: any): Promise<Itinerary>;
  getItineraryActivities(itineraryId: number, userId: string): Promise<ItineraryActivity[]>;
  createItineraryActivity(itineraryId: number, dayId: number, userId: string, data: any): Promise<ItineraryActivity>;
  updateItineraryActivity(id: number, userId: string, data: any): Promise<ItineraryActivity>;
  deleteItineraryActivity(id: number, userId: string): Promise<void>;
}

export class PrismaStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    return user || undefined;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    return await prisma.user.create({
      data: userData
    });
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    return await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        ...userData,
        updatedAt: new Date()
      },
      create: userData
    });
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    return await prisma.category.create({
      data: category
    });
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data: {
        ...category,
        updatedAt: new Date()
      }
    });
  }

  async deleteCategory(id: number): Promise<void> {
    await prisma.category.delete({
      where: { id }
    });
  }

  // Product operations
  async getProducts(filters: any = {}): Promise<Product[]> {
    const {
      categoryId,
      sellerId,
      search,
      minPrice,
      maxPrice,
      limit = 50,
      offset = 0,
      sortBy = 'created',
      sortOrder = 'desc',
      excludeId
    } = filters;

    const where: any = {
      isActive: true
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const orderBy: any = {};
    if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'created') {
      orderBy.createdAt = sortOrder;
    }

    return await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    return await prisma.product.create({
      data: product
    });
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data: {
        ...product,
        updatedAt: new Date()
      }
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await prisma.product.delete({
      where: { id }
    });
  }

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        id: { in: ids }
      },
      include: {
        category: true
      }
    });
  }

  // Review operations
  async getProductReviews(productId: number): Promise<Review[]> {
    return await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createReview(review: InsertReview): Promise<Review> {
    return await prisma.review.create({
      data: review
    });
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return await prisma.review.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    return await prisma.cartItem.create({
      data: item
    });
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    return await prisma.cartItem.update({
      where: { id },
      data: {
        quantity,
        updatedAt: new Date()
      }
    });
  }

  async removeFromCart(id: number): Promise<void> {
    await prisma.cartItem.delete({
      where: { id }
    });
  }

  async clearCart(userId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { userId }
    });
  }

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    return await prisma.wishlistItem.create({
      data: item
    });
  }

  async removeFromWishlist(id: number): Promise<void> {
    await prisma.wishlistItem.delete({
      where: { id }
    });
  }

  // Order operations
  async getOrders(userId: string): Promise<Order[]> {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    return order || undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    return await prisma.order.create({
      data: order
    });
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      }
    });
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await prisma.orderItem.findMany({
      where: { orderId },
      include: {
        product: true
      }
    });
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    return await prisma.orderItem.create({
      data: item
    });
  }

  // Seller operations (simplified for now)
  async getSellerStats(sellerId: string): Promise<any> {
    const stats = await prisma.product.groupBy({
      by: ['sellerId'],
      where: { sellerId },
      _count: {
        id: true
      },
      _sum: {
        stock: true
      }
    });

    return {
      totalProducts: stats[0]?._count?.id || 0,
      totalStock: stats[0]?._sum?.stock || 0,
      totalSales: 0, // TODO: implement based on orders
      revenue: 0 // TODO: implement based on orders
    };
  }

  async getSellerAnalytics(sellerId: string, period: string): Promise<any> {
    // Simplified implementation
    return {
      sales: [],
      revenue: 0,
      orders: 0,
      products: 0
    };
  }

  async getSellerSalesData(sellerId: string, period: string): Promise<any> {
    // Simplified implementation
    return {
      daily: [],
      weekly: [],
      monthly: []
    };
  }

  async getSellerProductPerformance(sellerId: string): Promise<any> {
    // Simplified implementation
    return [];
  }

  async getSellerCustomerInsights(sellerId: string): Promise<any> {
    // Simplified implementation
    return {
      totalCustomers: 0,
      repeatCustomers: 0,
      averageOrderValue: 0
    };
  }

  async getSellerRevenueBreakdown(sellerId: string, period: string): Promise<any> {
    // Simplified implementation
    return {
      totalRevenue: 0,
      productRevenue: {},
      categoryRevenue: {}
    };
  }

  // Inventory operations (simplified)
  async getInventoryAlerts(sellerId: string): Promise<any[]> {
    return [];
  }

  async createInventoryAlert(alert: any): Promise<any> {
    return alert;
  }

  async markAlertAsRead(alertId: number): Promise<void> {
    // No-op for now
  }

  async markAlertAsResolved(alertId: number): Promise<void> {
    // No-op for now
  }

  async getStockMovements(productId: number): Promise<any[]> {
    return [];
  }

  async createStockMovement(movement: any): Promise<any> {
    return movement;
  }

  async updateProductStock(productId: number, newStock: number, movementType: string, reason?: string, sellerId?: string): Promise<void> {
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: newStock,
        updatedAt: new Date()
      }
    });
  }

  async checkLowStock(sellerId: string): Promise<any[]> {
    return await prisma.product.findMany({
      where: {
        sellerId,
        stock: { lt: 10 }
      }
    });
  }

  async createLowStockAlert(productId: number, sellerId: string): Promise<void> {
    // No-op for now
  }

  // Chat operations
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    return await prisma.chatRoom.findMany({
      where: {
        OR: [
          { customerId: userId },
          { supportAgentId: userId }
        ]
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        supportAgent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getChatRoom(roomId: number): Promise<ChatRoom | undefined> {
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        supportAgent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    return room || undefined;
  }

  async createChatRoom(room: InsertChatRoom): Promise<ChatRoom> {
    return await prisma.chatRoom.create({
      data: room
    });
  }

  async updateChatRoom(roomId: number, updates: any): Promise<ChatRoom> {
    return await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    });
  }

  async closeChatRoom(roomId: number): Promise<void> {
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        status: 'closed',
        closedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async getChatMessages(roomId: number, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    return await prisma.chatMessage.findMany({
      where: { roomId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset
    });
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    return await prisma.chatMessage.create({
      data: message
    });
  }

  async markMessagesAsRead(roomId: number, userId: string): Promise<void> {
    await prisma.chatMessage.updateMany({
      where: {
        roomId,
        senderId: { not: userId },
        isRead: false
      },
      data: {
        isRead: true
      }
    });
  }

  async getUnreadMessageCount(roomId: number, userId: string): Promise<number> {
    return await prisma.chatMessage.count({
      where: {
        roomId,
        senderId: { not: userId },
        isRead: false
      }
    });
  }

  async createChatAttachment(attachment: any): Promise<any> {
    return attachment;
  }

  async getChatAttachments(messageId: number): Promise<any[]> {
    return [];
  }

  async getActiveChatRooms(supportAgentId?: string): Promise<ChatRoom[]> {
    const where: any = {
      status: 'active'
    };
    
    if (supportAgentId) {
      where.supportAgentId = supportAgentId;
    }

    return await prisma.chatRoom.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        supportAgent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async assignChatRoom(roomId: number, supportAgentId: string): Promise<ChatRoom> {
    return await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        supportAgentId,
        updatedAt: new Date()
      }
    });
  }

  async getSupportStats(supportAgentId: string): Promise<any> {
    const totalChats = await prisma.chatRoom.count({
      where: { supportAgentId }
    });

    const activeChats = await prisma.chatRoom.count({
      where: {
        supportAgentId,
        status: 'active'
      }
    });

    return {
      totalChats,
      activeChats,
      averageResponseTime: 0, // TODO: implement
      satisfactionScore: 0 // TODO: implement
    };
  }

  // Property operations
  async getProperties(filters: any = {}): Promise<Property[]> {
    const where: any = {
      isActive: true
    };

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.propertyType) {
      where.propertyType = filters.propertyType;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.pricePerNight = {};
      if (filters.minPrice) {
        where.pricePerNight.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        where.pricePerNight.lte = filters.maxPrice;
      }
    }

    return await prisma.property.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });
    return property || undefined;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    return await prisma.property.create({
      data: property
    });
  }

  async updateProperty(id: number, property: any): Promise<Property> {
    return await prisma.property.update({
      where: { id },
      data: {
        ...property,
        updatedAt: new Date()
      }
    });
  }

  async deleteProperty(id: number): Promise<void> {
    await prisma.property.delete({
      where: { id }
    });
  }

  async getPropertiesByHost(hostId: string): Promise<Property[]> {
    return await prisma.property.findMany({
      where: { hostId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async searchProperties(filters: any): Promise<Property[]> {
    return await this.getProperties(filters);
  }

  // Booking operations
  async getBookings(userId: string, userType: 'guest' | 'host'): Promise<Booking[]> {
    const where: any = userType === 'guest' 
      ? { guestId: userId }
      : { property: { hostId: userId } };

    return await prisma.booking.findMany({
      where,
      include: {
        property: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    return booking || undefined;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    return await prisma.booking.create({
      data: booking
    });
  }

  async updateBooking(id: number, updates: any): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    });
  }

  async cancelBooking(id: number, reason: string): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: {
        status: 'cancelled',
        updatedAt: new Date()
      }
    });
  }

  async getPropertyBookings(propertyId: number): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { propertyId },
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async checkAvailability(propertyId: number, checkIn: Date, checkOut: Date): Promise<boolean> {
    const conflictingBookings = await prisma.booking.count({
      where: {
        propertyId,
        status: { in: ['confirmed', 'pending'] },
        OR: [
          {
            checkIn: { lte: checkIn },
            checkOut: { gt: checkIn }
          },
          {
            checkIn: { lt: checkOut },
            checkOut: { gte: checkOut }
          },
          {
            checkIn: { gte: checkIn },
            checkOut: { lte: checkOut }
          }
        ]
      }
    });

    return conflictingBookings === 0;
  }

  // Property review operations
  async getPropertyReviews(propertyId: number): Promise<PropertyReview[]> {
    return await prisma.propertyReview.findMany({
      where: { propertyId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPropertyReview(review: InsertPropertyReview): Promise<PropertyReview> {
    return await prisma.propertyReview.create({
      data: review
    });
  }

  async getBookingReview(bookingId: number): Promise<PropertyReview | undefined> {
    const review = await prisma.propertyReview.findUnique({
      where: { bookingId }
    });
    return review || undefined;
  }

  async getHostReviews(hostId: string): Promise<PropertyReview[]> {
    return await prisma.propertyReview.findMany({
      where: {
        property: { hostId }
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            images: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Simplified implementations for remaining methods
  async getPropertyAvailability(propertyId: number, startDate: Date, endDate: Date): Promise<any[]> {
    return [];
  }

  async setPropertyAvailability(propertyId: number, date: Date, available: boolean, customPrice?: number): Promise<void> {
    // No-op for now
  }

  async bulkSetAvailability(propertyId: number, dates: Date[], available: boolean): Promise<void> {
    // No-op for now
  }

  async getRoomAvailability(propertyId: number, startDate: Date, endDate: Date): Promise<any[]> {
    return [];
  }

  async updateRoomAvailability(propertyId: number, date: Date, availableRooms: number, totalRooms: number, priceOverride?: number): Promise<void> {
    // No-op for now
  }

  async checkRoomAvailability(propertyId: number, checkIn: Date, checkOut: Date, roomsNeeded: number): Promise<boolean> {
    return true;
  }

  async getPromotions(propertyId?: number): Promise<any[]> {
    return [];
  }

  async getPromotion(id: number): Promise<any | undefined> {
    return undefined;
  }

  async createPromotion(promotion: any): Promise<any> {
    return promotion;
  }

  async updatePromotion(id: number, promotion: any): Promise<any> {
    return promotion;
  }

  async deletePromotion(id: number): Promise<void> {
    // No-op for now
  }

  async validatePromoCode(code: string, propertyId: number, nights: number): Promise<any | null> {
    return null;
  }

  async getPayments(userId: string): Promise<Payment[]> {
    return await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const payment = await prisma.payment.findUnique({
      where: { id }
    });
    return payment || undefined;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    return await prisma.payment.create({
      data: payment
    });
  }

  async updatePayment(id: number, payment: any): Promise<Payment> {
    return await prisma.payment.update({
      where: { id },
      data: {
        ...payment,
        updatedAt: new Date()
      }
    });
  }

  async processPayment(bookingId: number, paymentData: any): Promise<Payment> {
    return await prisma.payment.create({
      data: {
        ...paymentData,
        bookingId
      }
    });
  }

  async getBookingHistory(userId: string, userType: 'guest' | 'host'): Promise<any[]> {
    return await this.getBookings(userId, userType);
  }

  async getBookingWithDetails(id: number): Promise<any | undefined> {
    return await this.getBooking(id);
  }

  async updateBookingStatus(id: number, status: string, checkInOut?: any): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      }
    });
  }

  // Itinerary operations
  async getUserItineraries(userId: string): Promise<Itinerary[]> {
    return await prisma.itinerary.findMany({
      where: { userId },
      include: {
        days: {
          include: {
            activities: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getItinerary(id: number, userId: string): Promise<Itinerary | undefined> {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id, userId },
      include: {
        days: {
          include: {
            activities: {
              orderBy: { orderIndex: 'asc' }
            }
          },
          orderBy: { dayNumber: 'asc' }
        }
      }
    });
    return itinerary || undefined;
  }

  async createItinerary(data: any): Promise<Itinerary> {
    return await prisma.itinerary.create({
      data: data
    });
  }

  async updateItinerary(id: number, userId: string, data: any): Promise<Itinerary> {
    return await prisma.itinerary.update({
      where: { id, userId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async deleteItinerary(id: number, userId: string): Promise<void> {
    await prisma.itinerary.delete({
      where: { id, userId }
    });
  }

  async getItineraryTemplates(): Promise<any[]> {
    return [];
  }

  async createItineraryFromTemplate(templateId: number, userId: string, customizations: any): Promise<Itinerary> {
    // Simplified implementation
    return await prisma.itinerary.create({
      data: {
        userId,
        title: customizations.title || 'New Itinerary',
        destination: customizations.destination || '',
        startDate: customizations.startDate || new Date(),
        endDate: customizations.endDate || new Date(),
        status: 'planning'
      }
    });
  }

  async getItineraryActivities(itineraryId: number, userId: string): Promise<ItineraryActivity[]> {
    return await prisma.itineraryActivity.findMany({
      where: {
        day: {
          itineraryId,
          itinerary: { userId }
        }
      },
      include: {
        day: true
      },
      orderBy: { orderIndex: 'asc' }
    });
  }

  async createItineraryActivity(itineraryId: number, dayId: number, userId: string, data: any): Promise<ItineraryActivity> {
    return await prisma.itineraryActivity.create({
      data: {
        ...data,
        dayId
      }
    });
  }

  async updateItineraryActivity(id: number, userId: string, data: any): Promise<ItineraryActivity> {
    return await prisma.itineraryActivity.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async deleteItineraryActivity(id: number, userId: string): Promise<void> {
    await prisma.itineraryActivity.delete({
      where: { id }
    });
  }
}

export const storage = new PrismaStorage();