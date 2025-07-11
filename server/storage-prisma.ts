import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<any | undefined>;
  getUserByEmail(email: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  upsertUser(user: any): Promise<any>;

  // Category operations
  getCategories(): Promise<any[]>;
  createCategory(category: any): Promise<any>;
  updateCategory(id: number, category: any): Promise<any>;
  deleteCategory(id: number): Promise<void>;

  // Product operations
  getProducts(filters?: any): Promise<any[]>;
  getProduct(id: number): Promise<any | undefined>;
  createProduct(product: any): Promise<any>;
  updateProduct(id: number, product: any): Promise<any>;
  deleteProduct(id: number): Promise<void>;
  getProductsByIds(ids: number[]): Promise<any[]>;

  // Review operations
  getProductReviews(productId: number): Promise<any[]>;
  createReview(review: any): Promise<any>;
  getUserReviews(userId: string): Promise<any[]>;

  // Cart operations
  getCartItems(userId: string): Promise<any[]>;
  addToCart(item: any): Promise<any>;
  updateCartItem(id: number, quantity: number): Promise<any>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Wishlist operations
  getWishlistItems(userId: string): Promise<any[]>;
  addToWishlist(item: any): Promise<any>;
  removeFromWishlist(id: number): Promise<void>;

  // Order operations
  getOrders(userId: string): Promise<any[]>;
  getOrder(id: number): Promise<any | undefined>;
  createOrder(order: any): Promise<any>;
  updateOrderStatus(id: number, status: string): Promise<any>;
  getOrderItems(orderId: number): Promise<any[]>;
  createOrderItem(item: any): Promise<any>;

  // Seller operations
  getSellerStats(sellerId: string): Promise<any>;

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
  getChatRooms(userId: string): Promise<any[]>;
  getChatRoom(roomId: number): Promise<any | undefined>;
  createChatRoom(room: any): Promise<any>;
  updateChatRoom(roomId: number, updates: any): Promise<any>;
  closeChatRoom(roomId: number): Promise<void>;
  
  // Message operations
  getChatMessages(roomId: number, limit?: number, offset?: number): Promise<any[]>;
  createChatMessage(message: any): Promise<any>;
  markMessagesAsRead(roomId: number, userId: string): Promise<void>;
  getUnreadMessageCount(roomId: number, userId: string): Promise<number>;
  
  // Attachment operations
  createChatAttachment(attachment: any): Promise<any>;
  getChatAttachments(messageId: number): Promise<any[]>;
  
  // Support operations
  getActiveChatRooms(supportAgentId?: string): Promise<any[]>;
  assignChatRoom(roomId: number, supportAgentId: string): Promise<any>;
  getSupportStats(supportAgentId: string): Promise<any>;
}

export class PrismaStorage implements IStorage {
  // User operations
  async getUser(id: string) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async createUser(userData: any) {
    return await prisma.user.create({
      data: userData
    });
  }

  async upsertUser(userData: any) {
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
  async getCategories() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(category: any) {
    return await prisma.category.create({
      data: category
    });
  }

  async updateCategory(id: number, category: any) {
    return await prisma.category.update({
      where: { id },
      data: category
    });
  }

  async deleteCategory(id: number) {
    await prisma.category.delete({
      where: { id }
    });
  }

  // Product operations
  async getProducts(filters: any = {}) {
    const where: any = {};
    
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    
    if (filters.sellerId) {
      where.sellerId = filters.sellerId;
    }
    
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    
    if (filters.excludeId) {
      where.id = { not: filters.excludeId };
    }

    const orderBy: any = {};
    if (filters.sortBy === 'price') {
      orderBy.price = filters.sortOrder || 'asc';
    } else if (filters.sortBy === 'created') {
      orderBy.createdAt = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return await prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: true,
        reviews: {
          include: { user: true }
        }
      },
      orderBy,
      take: filters.limit,
      skip: filters.offset
    });
  }

  async getProduct(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: true,
        reviews: {
          include: { user: true }
        }
      }
    });
  }

  async createProduct(product: any) {
    return await prisma.product.create({
      data: product,
      include: {
        category: true,
        seller: true
      }
    });
  }

  async updateProduct(id: number, product: any) {
    return await prisma.product.update({
      where: { id },
      data: product,
      include: {
        category: true,
        seller: true
      }
    });
  }

  async deleteProduct(id: number) {
    await prisma.product.delete({
      where: { id }
    });
  }

  async getProductsByIds(ids: number[]) {
    return await prisma.product.findMany({
      where: { id: { in: ids } },
      include: {
        category: true,
        seller: true
      }
    });
  }

  // Review operations
  async getProductReviews(productId: number) {
    return await prisma.review.findMany({
      where: { productId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createReview(review: any) {
    return await prisma.review.create({
      data: review,
      include: { user: true }
    });
  }

  async getUserReviews(userId: string) {
    return await prisma.review.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Cart operations
  async getCartItems(userId: string) {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });
  }

  async addToCart(item: any) {
    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: item.userId,
        productId: item.productId
      }
    });

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (item.quantity || 1) },
        include: { product: true }
      });
    }

    return await prisma.cartItem.create({
      data: item,
      include: { product: true }
    });
  }

  async updateCartItem(id: number, quantity: number) {
    return await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true }
    });
  }

  async removeFromCart(id: number) {
    await prisma.cartItem.delete({
      where: { id }
    });
  }

  async clearCart(userId: string) {
    await prisma.cartItem.deleteMany({
      where: { userId }
    });
  }

  // Wishlist operations
  async getWishlistItems(userId: string) {
    return await prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true }
    });
  }

  async addToWishlist(item: any) {
    return await prisma.wishlistItem.create({
      data: item,
      include: { product: true }
    });
  }

  async removeFromWishlist(id: number) {
    await prisma.wishlistItem.delete({
      where: { id }
    });
  }

  // Order operations
  async getOrders(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrder(id: number) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });
  }

  async createOrder(order: any) {
    return await prisma.order.create({
      data: order,
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });
  }

  async updateOrderStatus(id: number, status: string) {
    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async getOrderItems(orderId: number) {
    return await prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true }
    });
  }

  async createOrderItem(item: any) {
    return await prisma.orderItem.create({
      data: item,
      include: { product: true }
    });
  }

  // Seller operations
  async getSellerStats(sellerId: string) {
    const totalProducts = await prisma.product.count({
      where: { sellerId }
    });

    const totalOrders = await prisma.orderItem.count({
      where: { product: { sellerId } }
    });

    const totalRevenue = await prisma.orderItem.aggregate({
      where: { product: { sellerId } },
      _sum: { price: true }
    });

    const avgRating = await prisma.review.aggregate({
      where: { product: { sellerId } },
      _avg: { rating: true }
    });

    return {
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.price || 0,
      avgRating: avgRating._avg.rating || 0
    };
  }

  // Inventory management operations
  async getInventoryAlerts(sellerId: string) {
    return await prisma.inventoryAlert.findMany({
      where: { sellerId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createInventoryAlert(alert: any) {
    return await prisma.inventoryAlert.create({
      data: alert,
      include: { product: true }
    });
  }

  async markAlertAsRead(alertId: number) {
    await prisma.inventoryAlert.update({
      where: { id: alertId },
      data: { isRead: true }
    });
  }

  async markAlertAsResolved(alertId: number) {
    await prisma.inventoryAlert.update({
      where: { id: alertId },
      data: { isResolved: true }
    });
  }

  async getStockMovements(productId: number) {
    return await prisma.stockMovement.findMany({
      where: { productId },
      include: { seller: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createStockMovement(movement: any) {
    return await prisma.stockMovement.create({
      data: movement,
      include: { seller: true }
    });
  }

  async updateProductStock(productId: number, newStock: number, movementType: string, reason?: string, sellerId?: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const previousStock = product.stock;

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: newStock }
      }),
      prisma.stockMovement.create({
        data: {
          productId,
          sellerId,
          movementType,
          quantity: newStock - previousStock,
          previousStock,
          newStock,
          reason
        }
      })
    ]);

    // Check for low stock
    if (newStock <= 10 && sellerId) {
      await this.createLowStockAlert(productId, sellerId);
    }
  }

  async checkLowStock(sellerId: string) {
    return await prisma.product.findMany({
      where: {
        sellerId,
        stock: { lte: 10 }
      },
      include: { category: true }
    });
  }

  async createLowStockAlert(productId: number, sellerId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) return;

    await prisma.inventoryAlert.create({
      data: {
        productId,
        sellerId,
        type: 'low_stock',
        message: `Low stock alert: ${product.title} has ${product.stock} items remaining`
      }
    });
  }

  // Chat operations
  async getChatRooms(userId: string) {
    return await prisma.chatRoom.findMany({
      where: {
        OR: [
          { customerId: userId },
          { supportAgentId: userId }
        ]
      },
      include: {
        customer: true,
        supportAgent: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getChatRoom(roomId: number) {
    return await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        customer: true,
        supportAgent: true
      }
    });
  }

  async createChatRoom(room: any) {
    return await prisma.chatRoom.create({
      data: room,
      include: {
        customer: true,
        supportAgent: true
      }
    });
  }

  async updateChatRoom(roomId: number, updates: any) {
    return await prisma.chatRoom.update({
      where: { id: roomId },
      data: updates,
      include: {
        customer: true,
        supportAgent: true
      }
    });
  }

  async closeChatRoom(roomId: number) {
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        status: 'closed',
        closedAt: new Date()
      }
    });
  }

  async getChatMessages(roomId: number, limit: number = 50, offset: number = 0) {
    return await prisma.chatMessage.findMany({
      where: { roomId },
      include: {
        sender: true,
        attachments: true
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset
    });
  }

  async createChatMessage(message: any) {
    return await prisma.chatMessage.create({
      data: message,
      include: {
        sender: true,
        attachments: true
      }
    });
  }

  async markMessagesAsRead(roomId: number, userId: string) {
    await prisma.chatMessage.updateMany({
      where: {
        roomId,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    });
  }

  async getUnreadMessageCount(roomId: number, userId: string) {
    return await prisma.chatMessage.count({
      where: {
        roomId,
        senderId: { not: userId },
        isRead: false
      }
    });
  }

  async createChatAttachment(attachment: any) {
    return await prisma.chatAttachment.create({
      data: attachment
    });
  }

  async getChatAttachments(messageId: number) {
    return await prisma.chatAttachment.findMany({
      where: { messageId }
    });
  }

  async getActiveChatRooms(supportAgentId?: string) {
    const where: any = {
      status: { in: ['active', 'waiting'] }
    };

    if (supportAgentId) {
      where.supportAgentId = supportAgentId;
    }

    return await prisma.chatRoom.findMany({
      where,
      include: {
        customer: true,
        supportAgent: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async assignChatRoom(roomId: number, supportAgentId: string) {
    return await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        supportAgentId,
        status: 'active'
      },
      include: {
        customer: true,
        supportAgent: true
      }
    });
  }

  async getSupportStats(supportAgentId: string) {
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
      avgResponseTime: 2, // Mock data
      customerSatisfaction: 95 // Mock data
    };
  }
}

export const storage = new PrismaStorage();