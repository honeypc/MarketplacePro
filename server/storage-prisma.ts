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

  // Property operations
  getProperties(filters?: any): Promise<any[]>;
  getProperty(id: number): Promise<any | undefined>;
  createProperty(property: any): Promise<any>;
  updateProperty(id: number, property: any): Promise<any>;
  deleteProperty(id: number): Promise<void>;
  getPropertiesByHost(hostId: string): Promise<any[]>;
  searchProperties(filters: any): Promise<any[]>;

  // Booking operations
  getBookings(userId: string, userType: 'guest' | 'host'): Promise<any[]>;
  getBooking(id: number): Promise<any | undefined>;
  createBooking(booking: any): Promise<any>;
  updateBooking(id: number, updates: any): Promise<any>;
  cancelBooking(id: number, reason: string): Promise<any>;
  getPropertyBookings(propertyId: number): Promise<any[]>;
  checkAvailability(propertyId: number, checkIn: Date, checkOut: Date): Promise<boolean>;

  // Property review operations
  getPropertyReviews(propertyId: number): Promise<any[]>;
  createPropertyReview(review: any): Promise<any>;
  getBookingReview(bookingId: number): Promise<any | undefined>;
  getHostReviews(hostId: string): Promise<any[]>;

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
  getPayments(userId: string): Promise<any[]>;
  getPayment(id: number): Promise<any | undefined>;
  createPayment(payment: any): Promise<any>;
  updatePayment(id: number, payment: any): Promise<any>;
  processPayment(bookingId: number, paymentData: any): Promise<any>;
  
  // Booking history operations
  getBookingHistory(userId: string, userType: 'guest' | 'host'): Promise<any[]>;
  getBookingWithDetails(id: number): Promise<any | undefined>;
  updateBookingStatus(id: number, status: string, checkInOut?: any): Promise<any>;
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

  async getSellerAnalytics(sellerId: string, period: string) {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        },
        orderItems: {
          some: {
            product: {
              sellerId: sellerId
            }
          }
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          },
          where: {
            product: {
              sellerId: sellerId
            }
          }
        }
      }
    });

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.orderItems.reduce((itemSum, item) => {
        return itemSum + (item.price * item.quantity);
      }, 0);
    }, 0);

    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => {
      return sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const dailyData = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0, items: 0 };
      }
      acc[date].orders += 1;
      acc[date].revenue += order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      acc[date].items += order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      return acc;
    }, {} as any);

    return {
      totalRevenue,
      totalOrders,
      totalItems,
      averageOrderValue,
      dailyData: Object.values(dailyData),
      period
    };
  }

  async getSellerSalesData(sellerId: string, period: string) {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const salesData = await prisma.orderItem.findMany({
      where: {
        product: {
          sellerId: sellerId
        },
        order: {
          createdAt: {
            gte: startDate,
            lte: now
          },
          status: 'completed'
        }
      },
      include: {
        product: {
          select: {
            name: true,
            category: true,
            price: true
          }
        },
        order: {
          select: {
            createdAt: true,
            status: true
          }
        }
      }
    });

    const categoryData = salesData.reduce((acc, item) => {
      const category = item.product.category;
      if (!acc[category]) {
        acc[category] = { category, revenue: 0, quantity: 0, orders: 0 };
      }
      acc[category].revenue += item.price * item.quantity;
      acc[category].quantity += item.quantity;
      acc[category].orders += 1;
      return acc;
    }, {} as any);

    return {
      totalSales: salesData.length,
      categoryBreakdown: Object.values(categoryData),
      period
    };
  }

  async getSellerProductPerformance(sellerId: string) {
    const products = await prisma.product.findMany({
      where: { sellerId: sellerId },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        category: true,
        isActive: true,
        createdAt: true,
        orderItems: {
          select: {
            quantity: true,
            price: true,
            order: {
              select: {
                status: true,
                createdAt: true
              }
            }
          },
          where: {
            order: {
              status: 'completed'
            }
          }
        },
        reviews: {
          select: {
            rating: true,
            createdAt: true
          }
        }
      }
    });

    return products.map(product => {
      const totalSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalRevenue = product.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const avgRating = product.reviews.length > 0 ? 
        product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length : 0;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        isActive: product.isActive,
        totalSales,
        totalRevenue,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
        createdAt: product.createdAt
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getSellerCustomerInsights(sellerId: string) {
    const orders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              sellerId: sellerId
            }
          }
        },
        status: 'completed'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true
          }
        },
        orderItems: {
          include: {
            product: true
          },
          where: {
            product: {
              sellerId: sellerId
            }
          }
        }
      }
    });

    const customerData = orders.reduce((acc, order) => {
      const customerId = order.user.id;
      if (!acc[customerId]) {
        acc[customerId] = {
          id: customerId,
          name: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email,
          email: order.user.email,
          totalOrders: 0,
          totalSpent: 0,
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt,
          averageOrderValue: 0
        };
      }
      
      acc[customerId].totalOrders += 1;
      const orderValue = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      acc[customerId].totalSpent += orderValue;
      
      if (order.createdAt < acc[customerId].firstOrderDate) {
        acc[customerId].firstOrderDate = order.createdAt;
      }
      if (order.createdAt > acc[customerId].lastOrderDate) {
        acc[customerId].lastOrderDate = order.createdAt;
      }
      
      return acc;
    }, {} as any);

    Object.values(customerData).forEach((customer: any) => {
      customer.averageOrderValue = customer.totalSpent / customer.totalOrders;
    });

    return {
      totalCustomers: Object.keys(customerData).length,
      customers: Object.values(customerData).sort((a: any, b: any) => b.totalSpent - a.totalSpent),
      repeatCustomers: Object.values(customerData).filter((c: any) => c.totalOrders > 1).length
    };
  }

  async getSellerRevenueBreakdown(sellerId: string, period: string) {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        },
        orderItems: {
          some: {
            product: {
              sellerId: sellerId
            }
          }
        },
        status: 'completed'
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                category: true,
                name: true
              }
            }
          },
          where: {
            product: {
              sellerId: sellerId
            }
          }
        }
      }
    });

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.orderItems.reduce((itemSum, item) => {
        return itemSum + (item.price * item.quantity);
      }, 0);
    }, 0);

    const platformFees = totalRevenue * 0.05;
    const netRevenue = totalRevenue - platformFees;

    const categoryBreakdown = orders.reduce((acc, order) => {
      order.orderItems.forEach(item => {
        const category = item.product.category;
        if (!acc[category]) {
          acc[category] = { category, revenue: 0, percentage: 0 };
        }
        acc[category].revenue += item.price * item.quantity;
      });
      return acc;
    }, {} as any);

    Object.values(categoryBreakdown).forEach((cat: any) => {
      cat.percentage = totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0;
    });

    return {
      totalRevenue,
      platformFees,
      netRevenue,
      categoryBreakdown: Object.values(categoryBreakdown),
      period
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

  // Property operations
  async getProperties(filters: any = {}) {
    const where: any = {};
    
    if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
    if (filters.country) where.country = { contains: filters.country, mode: 'insensitive' };
    if (filters.propertyType) where.propertyType = filters.propertyType;
    if (filters.roomType) where.roomType = filters.roomType;
    if (filters.maxGuests) where.maxGuests = { gte: filters.maxGuests };
    if (filters.minPrice) where.pricePerNight = { gte: filters.minPrice };
    if (filters.maxPrice) where.pricePerNight = { lte: filters.maxPrice };
    if (filters.amenities && filters.amenities.length > 0) {
      where.amenities = { hasEvery: filters.amenities };
    }
    
    return await prisma.property.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0
    });
  }

  async getProperty(id: number) {
    return await prisma.property.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        },
        reviews: {
          include: {
            guest: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async createProperty(property: any) {
    return await prisma.property.create({
      data: property,
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });
  }

  async updateProperty(id: number, property: any) {
    return await prisma.property.update({
      where: { id },
      data: property,
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });
  }

  async deleteProperty(id: number) {
    await prisma.property.delete({
      where: { id }
    });
  }

  async getPropertiesByHost(hostId: string) {
    return await prisma.property.findMany({
      where: { hostId },
      include: {
        reviews: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async searchProperties(filters: any) {
    // Use raw SQL query since we're using manual table creation
    const conditions = [];
    const params = [];
    
    conditions.push('is_active = true');
    
    if (filters.destination) {
      conditions.push(`(city ILIKE $${params.length + 1} OR country ILIKE $${params.length + 1} OR address ILIKE $${params.length + 1})`);
      params.push(`%${filters.destination}%`);
    }
    
    if (filters.city) {
      conditions.push(`city ILIKE $${params.length + 1}`);
      params.push(`%${filters.city}%`);
    }
    
    if (filters.propertyType) {
      conditions.push(`property_type = $${params.length + 1}`);
      params.push(filters.propertyType);
    }
    
    if (filters.roomType) {
      conditions.push(`room_type = $${params.length + 1}`);
      params.push(filters.roomType);
    }
    
    if (filters.minPrice) {
      conditions.push(`price_per_night >= $${params.length + 1}`);
      params.push(parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      conditions.push(`price_per_night <= $${params.length + 1}`);
      params.push(parseInt(filters.maxPrice));
    }
    
    if (filters.guests) {
      conditions.push(`max_guests >= $${params.length + 1}`);
      params.push(parseInt(filters.guests));
    }
    
    if (filters.bedrooms) {
      conditions.push(`bedrooms >= $${params.length + 1}`);
      params.push(parseInt(filters.bedrooms));
    }
    
    if (filters.bathrooms) {
      conditions.push(`bathrooms >= $${params.length + 1}`);
      params.push(parseInt(filters.bathrooms));
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      conditions.push(`amenities @> $${params.length + 1}`);
      params.push(JSON.stringify(filters.amenities));
    }
    
    if (filters.instantBook) {
      conditions.push('is_instant_book = true');
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const query = `
      SELECT 
        id,
        host_id as "hostId",
        title,
        description,
        property_type as "propertyType",
        room_type as "roomType",
        address,
        city,
        country,
        zip_code as "zipCode",
        latitude,
        longitude,
        price_per_night as "pricePerNight",
        max_guests as "maxGuests",
        bedrooms,
        bathrooms,
        amenities,
        images,
        check_in_time as "checkInTime",
        check_out_time as "checkOutTime",
        cleaning_fee as "cleaningFee",
        service_fee as "serviceFee",
        rating,
        review_count as "reviewCount",
        is_instant_book as "isInstantBook",
        minimum_stay as "minimumStay",
        maximum_stay as "maximumStay",
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM properties 
      ${whereClause}
      ORDER BY rating DESC NULLS LAST, created_at DESC
      LIMIT ${filters.limit || 50}
      OFFSET ${filters.offset || 0}
    `;
    
    const result = await this.prisma.$queryRawUnsafe(query, ...params);
    return result;
  }

  // Booking operations
  async getBookings(userId: string, userType: 'guest' | 'host') {
    const where = userType === 'guest' ? { guestId: userId } : { hostId: userId };
    
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
                email: true,
                profileImageUrl: true
              }
            }
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getBooking(id: number) {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImageUrl: true
              }
            }
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });
  }

  async createBooking(booking: any) {
    return await prisma.booking.create({
      data: booking,
      include: {
        property: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImageUrl: true
              }
            }
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });
  }

  async updateBooking(id: number, updates: any) {
    return await prisma.booking.update({
      where: { id },
      data: updates,
      include: {
        property: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImageUrl: true
              }
            }
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });
  }

  async cancelBooking(id: number, reason: string) {
    return await prisma.booking.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancellationReason: reason
      },
      include: {
        property: true,
        guest: true
      }
    });
  }

  async getPropertyBookings(propertyId: number) {
    return await prisma.booking.findMany({
      where: { propertyId },
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async checkAvailability(propertyId: number, checkIn: Date, checkOut: Date) {
    const conflictingBookings = await prisma.booking.count({
      where: {
        propertyId,
        status: { in: ['confirmed', 'pending'] },
        OR: [
          {
            AND: [
              { checkInDate: { lte: checkIn } },
              { checkOutDate: { gt: checkIn } }
            ]
          },
          {
            AND: [
              { checkInDate: { lt: checkOut } },
              { checkOutDate: { gte: checkOut } }
            ]
          }
        ]
      }
    });
    
    return conflictingBookings === 0;
  }

  // Property review operations
  async getPropertyReviews(propertyId: number) {
    return await prisma.propertyReview.findMany({
      where: { propertyId },
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        booking: {
          select: {
            id: true,
            checkInDate: true,
            checkOutDate: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPropertyReview(review: any) {
    // Calculate overall rating
    const overallRating = Math.round(
      (review.cleanliness + review.communication + review.checkIn + 
       review.accuracy + review.location + review.value) / 6
    );

    const createdReview = await prisma.propertyReview.create({
      data: {
        ...review,
        rating: overallRating
      },
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        booking: {
          select: {
            id: true,
            checkInDate: true,
            checkOutDate: true
          }
        }
      }
    });

    // Update property rating and review count
    const allReviews = await prisma.propertyReview.findMany({
      where: { propertyId: review.propertyId },
      select: { rating: true }
    });

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await prisma.property.update({
      where: { id: review.propertyId },
      data: {
        rating: Math.round(averageRating * 100) / 100,
        reviewCount: allReviews.length
      }
    });

    return createdReview;
  }

  async getBookingReview(bookingId: number) {
    return await prisma.propertyReview.findUnique({
      where: { bookingId },
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        }
      }
    });
  }

  async getHostReviews(hostId: string) {
    return await prisma.propertyReview.findMany({
      where: { hostId },
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        property: {
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

  // Property availability operations
  async getPropertyAvailability(propertyId: number, startDate: Date, endDate: Date) {
    return await prisma.propertyAvailability.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    });
  }

  async setPropertyAvailability(propertyId: number, date: Date, available: boolean, customPrice?: number) {
    const data: any = {
      propertyId,
      date,
      available
    };
    
    if (customPrice !== undefined) {
      data.price = customPrice;
    }

    await prisma.propertyAvailability.upsert({
      where: { 
        propertyId_date: {
          propertyId,
          date
        }
      },
      update: data,
      create: data
    });
  }

  async bulkSetAvailability(propertyId: number, dates: Date[], available: boolean) {
    const data = dates.map(date => ({
      propertyId,
      date,
      available
    }));

    await prisma.propertyAvailability.createMany({
      data,
      skipDuplicates: true
    });
  }

  // Room availability operations
  async getRoomAvailability(propertyId: number, startDate: Date, endDate: Date) {
    const query = `
      SELECT 
        date,
        available_rooms as "availableRooms",
        total_rooms as "totalRooms",
        price_override as "priceOverride",
        is_blocked as "isBlocked",
        block_reason as "blockReason"
      FROM room_availability 
      WHERE property_id = $1 AND date >= $2 AND date <= $3
      ORDER BY date
    `;
    return await this.prisma.$queryRawUnsafe(query, propertyId, startDate, endDate);
  }

  async updateRoomAvailability(propertyId: number, date: Date, availableRooms: number, totalRooms: number, priceOverride?: number) {
    const query = `
      INSERT INTO room_availability (property_id, date, available_rooms, total_rooms, price_override)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (property_id, date)
      DO UPDATE SET
        available_rooms = EXCLUDED.available_rooms,
        total_rooms = EXCLUDED.total_rooms,
        price_override = EXCLUDED.price_override,
        updated_at = CURRENT_TIMESTAMP
    `;
    await this.prisma.$queryRawUnsafe(query, propertyId, date, availableRooms, totalRooms, priceOverride);
  }

  async checkRoomAvailability(propertyId: number, checkIn: Date, checkOut: Date, roomsNeeded: number) {
    const query = `
      SELECT COUNT(*) as available_days
      FROM room_availability
      WHERE property_id = $1 
        AND date >= $2 
        AND date < $3
        AND available_rooms >= $4
        AND is_blocked = false
    `;
    const result = await this.prisma.$queryRawUnsafe(query, propertyId, checkIn, checkOut, roomsNeeded);
    const totalDays = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return result[0].available_days >= totalDays;
  }

  // Promotions operations
  async getPromotions(propertyId?: number) {
    let query = `
      SELECT 
        p.*,
        pr.title as property_title
      FROM promotions p
      LEFT JOIN properties pr ON p.property_id = pr.id
      WHERE p.is_active = true
    `;
    const params = [];
    
    if (propertyId) {
      query += ` AND p.property_id = $1`;
      params.push(propertyId);
    }
    
    query += ` ORDER BY p.created_at DESC`;
    
    return await this.prisma.$queryRawUnsafe(query, ...params);
  }

  async getPromotion(id: number) {
    const query = `
      SELECT 
        p.*,
        pr.title as property_title
      FROM promotions p
      LEFT JOIN properties pr ON p.property_id = pr.id
      WHERE p.id = $1
    `;
    const result = await this.prisma.$queryRawUnsafe(query, id);
    return result[0];
  }

  async createPromotion(promotion: any) {
    const query = `
      INSERT INTO promotions (
        property_id, title, description, discount_type, discount_value,
        min_nights, max_nights, valid_from, valid_to, promo_code, usage_limit
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const result = await this.prisma.$queryRawUnsafe(
      query,
      promotion.propertyId,
      promotion.title,
      promotion.description,
      promotion.discountType,
      promotion.discountValue,
      promotion.minNights,
      promotion.maxNights,
      promotion.validFrom,
      promotion.validTo,
      promotion.promoCode,
      promotion.usageLimit
    );
    return result[0];
  }

  async updatePromotion(id: number, promotion: any) {
    const query = `
      UPDATE promotions 
      SET title = $2, description = $3, discount_type = $4, discount_value = $5,
          min_nights = $6, max_nights = $7, valid_from = $8, valid_to = $9,
          is_active = $10, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await this.prisma.$queryRawUnsafe(
      query, id, promotion.title, promotion.description, promotion.discountType,
      promotion.discountValue, promotion.minNights, promotion.maxNights,
      promotion.validFrom, promotion.validTo, promotion.isActive
    );
    return result[0];
  }

  async deletePromotion(id: number) {
    await this.prisma.$queryRawUnsafe('DELETE FROM promotions WHERE id = $1', id);
  }

  async validatePromoCode(code: string, propertyId: number, nights: number) {
    const query = `
      SELECT * FROM promotions 
      WHERE promo_code = $1 
        AND property_id = $2
        AND is_active = true
        AND valid_from <= CURRENT_DATE
        AND valid_to >= CURRENT_DATE
        AND min_nights <= $3
        AND (max_nights IS NULL OR max_nights >= $3)
        AND (usage_limit IS NULL OR used_count < usage_limit)
    `;
    const result = await this.prisma.$queryRawUnsafe(query, code, propertyId, nights);
    return result[0] || null;
  }

  // Payment operations
  async getPayments(userId: string) {
    const query = `
      SELECT 
        p.*,
        b.property_id as "propertyId",
        b.check_in_date as "checkInDate",
        b.check_out_date as "checkOutDate",
        pr.title as "propertyTitle"
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN properties pr ON b.property_id = pr.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `;
    return await this.prisma.$queryRawUnsafe(query, userId);
  }

  async getPayment(id: number) {
    const query = `
      SELECT 
        p.*,
        b.property_id as "propertyId",
        b.check_in_date as "checkInDate",
        b.check_out_date as "checkOutDate",
        pr.title as "propertyTitle"
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN properties pr ON b.property_id = pr.id
      WHERE p.id = $1
    `;
    const result = await this.prisma.$queryRawUnsafe(query, id);
    return result[0];
  }

  async createPayment(payment: any) {
    const query = `
      INSERT INTO payments (
        booking_id, user_id, amount, currency, payment_method, payment_status,
        stripe_payment_intent_id, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await this.prisma.$queryRawUnsafe(
      query,
      payment.bookingId,
      payment.userId,
      payment.amount,
      payment.currency || 'VND',
      payment.paymentMethod,
      payment.paymentStatus || 'pending',
      payment.stripePaymentIntentId,
      JSON.stringify(payment.metadata || {})
    );
    return result[0];
  }

  async updatePayment(id: number, payment: any) {
    const query = `
      UPDATE payments 
      SET payment_status = $2, payment_date = $3, stripe_charge_id = $4,
          refund_amount = $5, refund_reason = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await this.prisma.$queryRawUnsafe(
      query, id, payment.paymentStatus, payment.paymentDate,
      payment.stripeChargeId, payment.refundAmount, payment.refundReason
    );
    return result[0];
  }

  async processPayment(bookingId: number, paymentData: any) {
    // Create payment record
    const payment = await this.createPayment({
      bookingId,
      userId: paymentData.userId,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      paymentStatus: 'processing',
      stripePaymentIntentId: paymentData.stripePaymentIntentId,
      metadata: paymentData.metadata
    });

    // Update booking status
    await this.updateBooking(bookingId, { status: 'confirmed' });

    return payment;
  }

  // Booking history operations
  async getBookingHistory(userId: string, userType: 'guest' | 'host') {
    let query = `
      SELECT 
        b.*,
        p.title as "propertyTitle",
        p.images as "propertyImages",
        p.city as "propertyCity",
        p.country as "propertyCountry",
        u.first_name as "guestFirstName",
        u.last_name as "guestLastName",
        u.email as "guestEmail",
        pay.payment_status as "paymentStatus",
        pay.amount as "paymentAmount",
        prom.title as "promotionTitle",
        prom.discount_value as "discountValue"
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN users u ON b.user_id = u.id
      LEFT JOIN payments pay ON b.id = pay.booking_id
      LEFT JOIN promotions prom ON b.promotion_id = prom.id
    `;
    
    if (userType === 'guest') {
      query += ` WHERE b.user_id = $1`;
    } else {
      query += ` WHERE p.host_id = $1`;
    }
    
    query += ` ORDER BY b.created_at DESC`;
    
    return await this.prisma.$queryRawUnsafe(query, userId);
  }

  async getBookingWithDetails(id: number) {
    const query = `
      SELECT 
        b.*,
        p.title as "propertyTitle",
        p.images as "propertyImages",
        p.address as "propertyAddress",
        p.city as "propertyCity",
        p.country as "propertyCountry",
        p.host_id as "hostId",
        u.first_name as "guestFirstName",
        u.last_name as "guestLastName",
        u.email as "guestEmail",
        u.profile_image_url as "guestProfileImage",
        host.first_name as "hostFirstName",
        host.last_name as "hostLastName",
        host.email as "hostEmail",
        host.profile_image_url as "hostProfileImage",
        pay.payment_status as "paymentStatus",
        pay.amount as "paymentAmount",
        pay.payment_method as "paymentMethod",
        prom.title as "promotionTitle",
        prom.discount_value as "discountValue"
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN users u ON b.user_id = u.id
      LEFT JOIN users host ON p.host_id = host.id
      LEFT JOIN payments pay ON b.id = pay.booking_id
      LEFT JOIN promotions prom ON b.promotion_id = prom.id
      WHERE b.id = $1
    `;
    const result = await this.prisma.$queryRawUnsafe(query, id);
    return result[0];
  }

  async updateBookingStatus(id: number, status: string, checkInOut?: any) {
    let query = `
      UPDATE bookings 
      SET status = $2, updated_at = CURRENT_TIMESTAMP
    `;
    const params = [id, status];
    
    if (checkInOut?.checkInStatus) {
      query += `, check_in_status = $${params.length + 1}`;
      params.push(checkInOut.checkInStatus);
    }
    
    if (checkInOut?.checkOutStatus) {
      query += `, check_out_status = $${params.length + 1}`;
      params.push(checkInOut.checkOutStatus);
    }
    
    if (checkInOut?.actualCheckIn) {
      query += `, actual_check_in = $${params.length + 1}`;
      params.push(checkInOut.actualCheckIn);
    }
    
    if (checkInOut?.actualCheckOut) {
      query += `, actual_check_out = $${params.length + 1}`;
      params.push(checkInOut.actualCheckOut);
    }
    
    query += ` WHERE id = $1 RETURNING *`;
    
    const result = await this.prisma.$queryRawUnsafe(query, ...params);
    return result[0];
  }
}

export const storage = new PrismaStorage();