import { prisma } from "./prisma";
import { calculateDiscountAmount, isDiscountActive, isDiscountApplicable } from "./discount-utils";
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
  UserPreferences,
  UserInteraction,
  Recommendation,
  SimilarItem,
  TourDetail,
  TourSchedule,
  TicketDetail,
  TourBooking,
  Notification,
  Affiliate,
  AffiliateClick,
  AffiliateConversion,
  Payout,
  Discount,
  ContentRating,
  ShippingAddress,
  UserPhone,
  RecentlyViewedProduct,
  SavedProduct,
  Prisma
} from "@prisma/client";

// Define input types using Prisma generated types
export type UpsertUser = Prisma.UserCreateInput;
export type InsertCategory = Prisma.CategoryCreateInput;
export type InsertProduct = Prisma.ProductCreateInput;
export type InsertReview = Prisma.ReviewCreateInput;
export type InsertCartItem = Prisma.CartItemCreateInput;
export type InsertWishlistItem = Prisma.WishlistItemCreateInput;
export type InsertOrder = Prisma.OrderUncheckedCreateInput;
export type InsertOrderItem = Prisma.OrderItemUncheckedCreateInput;
export type InsertChatRoom = Prisma.ChatRoomCreateInput;
export type InsertChatMessage = Prisma.ChatMessageCreateInput;
export type InsertProperty = Prisma.PropertyCreateInput;
export type InsertBooking = Prisma.BookingUncheckedCreateInput;
export type InsertPropertyReview = Prisma.PropertyReviewCreateInput;
export type InsertPayment = Prisma.PaymentCreateInput;
export type InsertItinerary = Prisma.ItineraryCreateInput;
export type InsertUserPreferences = Prisma.UserPreferencesCreateInput;
export type InsertUserInteraction = Prisma.UserInteractionCreateInput;
export type InsertRecommendation = Prisma.RecommendationCreateInput;
export type InsertSimilarItem = Prisma.SimilarItemCreateInput;
export type InsertTourDetail = Prisma.TourDetailUncheckedCreateInput;
export type InsertTourSchedule = Prisma.TourScheduleUncheckedCreateInput;
export type InsertTicketDetail = Prisma.TicketDetailUncheckedCreateInput;
export type InsertTourBooking = Prisma.TourBookingUncheckedCreateInput;
export type InsertNotification = Prisma.NotificationCreateInput;
export type InsertAffiliate = Prisma.AffiliateCreateInput;
export type InsertAffiliateClick = Prisma.AffiliateClickCreateInput;
export type InsertAffiliateConversion = Prisma.AffiliateConversionCreateInput;
export type InsertPayout = Prisma.PayoutCreateInput;
export type InsertDiscount = Prisma.DiscountUncheckedCreateInput;
export type UpdateDiscount = Prisma.DiscountUncheckedUpdateInput;
export type InsertContentRating = Prisma.ContentRatingUncheckedCreateInput;
export type InsertShippingAddress = Prisma.ShippingAddressUncheckedCreateInput;
export type UpdateShippingAddress = Prisma.ShippingAddressUncheckedUpdateInput;
export type InsertUserPhone = Prisma.UserPhoneUncheckedCreateInput;
export type UpdateUserPhone = Prisma.UserPhoneUncheckedUpdateInput;
export type InsertRecentlyViewed = Prisma.RecentlyViewedProductUncheckedCreateInput;
export type InsertSavedProduct = Prisma.SavedProductUncheckedCreateInput;
export type UpdateSavedProduct = Prisma.SavedProductUncheckedUpdateInput;

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  listUsers(filters?: { role?: string; isActive?: boolean; search?: string }): Promise<User[]>;
  updateUser(id: string, userData: any): Promise<User>;
  updateUserStatus(id: string, isActive: boolean): Promise<User>;
  updateUserPermissions(id: string, permissions: string[]): Promise<User>;
  adjustUserCredit(id: string, amount: number): Promise<User>;
  getUserWallet(userId: string): Promise<{ walletCredits: number; listingLimit: number } | undefined>;
  updateUserWallet(
    userId: string,
    updates: { creditDelta?: number; listingLimitDelta?: number }
  ): Promise<User>;
  getListingLimitStatus(userId: string): Promise<{
    limit: number;
    used: number;
    remaining: number;
    breakdown: { products: number; properties: number; tours: number };
  } | undefined>;
  boostProductWithCredits(
    userId: string,
    productId: number,
    credits: number
  ): Promise<{ product: Product; walletCredits: number }>;

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
    customAttributeFilters?: Record<string, any>;
    customSortKey?: string;
    customSortOrder?: 'asc' | 'desc';
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  updateProductVisibility(id: number, isActive: boolean): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getProductsByIds(ids: number[]): Promise<Product[]>;

  // Review operations
  getAllReviews(): Promise<Review[]>;
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getUserReviews(userId: string): Promise<Review[]>;

  // Content rating operations
  canUserRateTarget(userId: string, targetType: string, targetId: string): Promise<boolean>;
  upsertContentRating(rating: InsertContentRating): Promise<ContentRating>;
  getRatingsForTarget(targetType: string, targetId: string): Promise<ContentRating[]>;
  getRatingSummary(targetType: string, targetId: string): Promise<{
    targetType: string;
    targetId: string;
    averageRating: number;
    totalRatings: number;
    distribution: Record<number, number>;
  }>;

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

  // Discount operations
  getDiscounts(filters?: { productId?: number; propertyId?: number; tourId?: number; activeOnly?: boolean }): Promise<Discount[]>;
  getDiscount(id: number): Promise<Discount | undefined>;
  createDiscount(discount: InsertDiscount): Promise<Discount>;
  updateDiscount(id: number, discount: UpdateDiscount): Promise<Discount>;
  deleteDiscount(id: number): Promise<void>;

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
  getProperties(filters?: {
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    customAttributeFilters?: Record<string, any>;
    customSortKey?: string;
    customSortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<Property[]>;
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

  // Recommendation System operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences>;
  trackUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction>;
  getUserInteractions(userId: string, itemType?: string, limit?: number): Promise<UserInteraction[]>;
  getRecommendations(userId: string, itemType?: string, limit?: number): Promise<Recommendation[]>;
  generateRecommendations(userId: string): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  markRecommendationClicked(id: number): Promise<void>;
  getSimilarItems(itemType: string, itemId: string, limit?: number): Promise<SimilarItem[]>;
  createSimilarItem(similarItem: InsertSimilarItem): Promise<SimilarItem>;
  getPopularItems(itemType: string, limit?: number): Promise<any[]>;
  getTrendingItems(itemType: string, days?: number, limit?: number): Promise<any[]>;
  getPersonalizedProducts(userId: string, limit?: number): Promise<Product[]>;
  getPersonalizedProperties(userId: string, limit?: number): Promise<Property[]>;
  getPersonalizedDestinations(userId: string, limit?: number): Promise<any[]>;

  // Advanced recommendation methods
  getCollaborativeRecommendations(userId: string, itemType: string, limit?: number): Promise<any[]>;
  computeUserSimilarity(userId1: string, userId2: string): Promise<number>;
  findSimilarUsers(userId: string, limit?: number): Promise<string[]>;
  updateRecommendationScores(userId: string): Promise<void>;
  getHybridRecommendations(userId: string, itemType: string, limit?: number): Promise<any[]>;
  trackRecommendationFeedback(userId: string, recommendationId: number, feedback: 'positive' | 'negative' | 'neutral'): Promise<void>;
  getRecommendationPerformance(itemType?: string, days?: number): Promise<any>;
  generateSeasonalRecommendations(userId: string, season: string): Promise<Recommendation[]>;
  getContextualRecommendations(userId: string, context: any): Promise<any[]>;

  // Hotel management operations
  getAllHotels(): Promise<any[]>;
  createHotel(hotel: any): Promise<any>;
  updateHotel(id: number, hotel: any): Promise<any>;
  deleteHotel(id: number): Promise<void>;

  // Room Type management operations
  getAllRoomTypes(): Promise<any[]>;
  createRoomType(roomType: any): Promise<any>;
  updateRoomType(id: number, roomType: any): Promise<any>;
  deleteRoomType(id: number): Promise<void>;

  // Villa management operations
  getAllVillas(): Promise<any[]>;
  createVilla(villa: any): Promise<any>;
  updateVilla(id: number, villa: any): Promise<any>;
  deleteVilla(id: number): Promise<void>;

  // Homestay management operations
  getAllHomestays(): Promise<any[]>;
  createHomestay(homestay: any): Promise<any>;
  updateHomestay(id: number, homestay: any): Promise<any>;
  deleteHomestay(id: number): Promise<void>;

  // Airport management operations
  getAllAirports(): Promise<any[]>;
  createAirport(airport: any): Promise<any>;
  updateAirport(id: number, airport: any): Promise<any>;
  deleteAirport(id: number): Promise<void>;

  // Travel Station management operations
  getAllStations(): Promise<any[]>;
  createStation(station: any): Promise<any>;
  updateStation(id: number, station: any): Promise<any>;
  deleteStation(id: number): Promise<void>;

  // Travel Provider management operations
  getAllProviders(): Promise<any[]>;
  createProvider(provider: any): Promise<any>;
  updateProvider(id: number, provider: any): Promise<any>;
  deleteProvider(id: number): Promise<void>;

  // Flight management operations
  getAllFlights(): Promise<any[]>;
  createFlight(flight: any): Promise<any>;
  updateFlight(id: number, flight: any): Promise<any>;
  deleteFlight(id: number): Promise<void>;

  // Tour management operations
  getTours(filters?: { search?: string; location?: string; hostId?: string }): Promise<TourDetail[]>;
  getTour(tourId: number): Promise<TourDetail | undefined>;
  getTourSchedules(tourId: number): Promise<TourSchedule[]>;
  createTour(tour: InsertTourDetail): Promise<TourDetail>;
  createTourSchedule(schedule: InsertTourSchedule): Promise<TourSchedule>;
  createTicketDetail(ticket: InsertTicketDetail): Promise<TicketDetail>;
  updateTourStatus(tourId: number, status: string): Promise<TourDetail>;
  bookTour(booking: InsertTourBooking, guests: number, discount?: Discount): Promise<TourBooking>;
  updateTourBookingStatus(bookingId: number, status: string): Promise<TourBooking>;
  getTourBookings(userId: string, role?: 'host' | 'guest'): Promise<TourBooking[]>;

  // Notification operations
  getNotifications(userId: string, limit?: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(notificationId: number): Promise<Notification>;

  // Shipping Address operations
  getShippingAddresses(userId: string): Promise<ShippingAddress[]>;
  getShippingAddressById(id: number): Promise<ShippingAddress | null>;
  createShippingAddress(address: InsertShippingAddress): Promise<ShippingAddress>;
  updateShippingAddress(id: number, address: UpdateShippingAddress): Promise<ShippingAddress>;
  deleteShippingAddress(id: number): Promise<void>;
  unsetDefaultShippingAddress(userId: string): Promise<void>;

  // User Phone operations
  getUserPhones(userId: string): Promise<UserPhone[]>;
  getUserPhoneById(id: number): Promise<UserPhone | null>;
  createUserPhone(phone: InsertUserPhone): Promise<UserPhone>;
  updateUserPhone(id: number, phone: UpdateUserPhone): Promise<UserPhone>;
  deleteUserPhone(id: number): Promise<void>;
  unsetPrimaryUserPhone(userId: string): Promise<void>;

  // Recently Viewed Products operations
  getRecentlyViewedProducts(userId: string, limit?: number): Promise<RecentlyViewedProduct[]>;
  getRecentlyViewedById(id: number): Promise<RecentlyViewedProduct | null>;
  trackRecentlyViewed(data: InsertRecentlyViewed): Promise<RecentlyViewedProduct>;
  deleteRecentlyViewed(id: number): Promise<void>;

  // Saved Products operations
  getSavedProducts(userId: string): Promise<SavedProduct[]>;
  getSavedProductById(id: number): Promise<SavedProduct | null>;
  createSavedProduct(data: InsertSavedProduct): Promise<SavedProduct>;
  updateSavedProduct(id: number, data: UpdateSavedProduct): Promise<SavedProduct>;
  deleteSavedProduct(id: number): Promise<void>;
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

  async listUsers(filters: { role?: string; isActive?: boolean; search?: string } = {}): Promise<User[]> {
    const { role, isActive, search } = filters;
    return prisma.user.findMany({
      where: {
        ...(role ? { role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(search
          ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } }
            ]
          }
          : {})
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getUserWallet(
    userId: string
  ): Promise<{ walletCredits: number; listingLimit: number } | undefined> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletCredits: true, listingLimit: true }
    });
    return user || undefined;
  }

  async updateUserWallet(
    userId: string,
    updates: { creditDelta?: number; listingLimitDelta?: number }
  ): Promise<User> {
    const data: Prisma.UserUpdateInput = {};

    if (updates.creditDelta) {
      data.walletCredits = { increment: updates.creditDelta };
    }

    if (updates.listingLimitDelta) {
      data.listingLimit = { increment: updates.listingLimitDelta };
    }

    return await prisma.user.update({
      where: { id: userId },
      data
    });
  }

  async getListingLimitStatus(userId: string): Promise<{
    limit: number;
    used: number;
    remaining: number;
    breakdown: { products: number; properties: number; tours: number };
  } | undefined> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { listingLimit: true }
    });

    if (!user) {
      return undefined;
    }

    const [products, properties, tours] = await prisma.$transaction([
      prisma.product.count({ where: { sellerId: userId } }),
      prisma.property.count({ where: { hostId: userId } }),
      prisma.tourDetail.count({ where: { hostId: userId } })
    ]);

    const used = products + properties + tours;
    const limit = user.listingLimit ?? 10;

    return {
      limit,
      used,
      remaining: Math.max(0, limit - used),
      breakdown: { products, properties, tours }
    };
  }

  async boostProductWithCredits(
    userId: string,
    productId: number,
    credits: number
  ): Promise<{ product: Product; walletCredits: number }> {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { walletCredits: true }
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (credits <= 0) {
        throw new Error("Invalid credit amount");
      }

      if (user.walletCredits < credits) {
        throw new Error("Insufficient credits");
      }

      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { sellerId: true }
      });

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.sellerId !== userId) {
        throw new Error("Unauthorized");
      }

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          boostScore: { increment: credits },
          boostedAt: new Date()
        }
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { walletCredits: { decrement: credits } },
        select: { walletCredits: true }
      });

      return { product: updatedProduct, walletCredits: updatedUser.walletCredits };
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
      sortBy,
      sortOrder,
      excludeId,
      customAttributeFilters,
      customSortKey,
      customSortOrder
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

    const andConditions: any[] = [];
    if (customAttributeFilters && typeof customAttributeFilters === 'object') {
      Object.entries(customAttributeFilters).forEach(([key, value]) => {
        andConditions.push({
          customAttributes: {
            path: [key],
            equals: value
          }
        });
      });
    }

    if (andConditions.length > 0) {
      where.AND = [...(where.AND || []), ...andConditions];
    }

    const orderBy: any[] = [];
    const effectiveSortBy = sortBy || 'created';
    const effectiveSortOrder = sortOrder || 'desc';

    if (effectiveSortBy === 'price') {
      orderBy.push({ price: effectiveSortOrder });
    } else if (effectiveSortBy === 'created') {
      orderBy.push({ boostScore: 'desc' }, { createdAt: effectiveSortOrder });
    }

    if (customSortKey) {
      orderBy.push({
        customAttributes: {
          path: [customSortKey],
          sort: customSortOrder || 'asc'
        }
      });
    }

    if (orderBy.length === 0) {
      orderBy.push({ boostScore: 'desc' }, { createdAt: 'desc' });
    }

    return await prisma.product.findMany({
      where,
      orderBy: orderBy.length === 1 ? orderBy[0] : orderBy,
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
        },
        discounts: true
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
        },
        discounts: true
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

  async updateProductVisibility(id: number, isActive: boolean): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { isActive, updatedAt: new Date() }
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
        category: true,
        discounts: true
      }
    });
  }

  // Review operations
  async getAllReviews(): Promise<Review[]> {
    return await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
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

  // Generic content rating operations
  async canUserRateTarget(userId: string, targetType: string, targetId: string): Promise<boolean> {
    const completedStatuses = ['completed', 'delivered', 'fulfilled'];

    if (targetType === 'product') {
      const productId = Number(targetId);
      if (Number.isNaN(productId)) return false;

      const orderItem = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: {
            userId,
            status: { in: completedStatuses }
          }
        }
      });

      return !!orderItem;
    }

    if (targetType === 'property') {
      const propertyId = Number(targetId);
      if (Number.isNaN(propertyId)) return false;

      const booking = await prisma.booking.findFirst({
        where: {
          propertyId,
          guestId: userId,
          status: { in: completedStatuses }
        }
      });

      return !!booking;
    }

    if (['tour', 'trip'].includes(targetType)) {
      const scheduleId = Number(targetId);

      if (!Number.isNaN(scheduleId)) {
        const tourBooking = await prisma.tourBooking.findFirst({
          where: {
            userId,
            tourScheduleId: scheduleId,
            status: { in: completedStatuses }
          }
        });

        if (tourBooking) return true;
      }

      const tourId = Number(targetId);
      if (!Number.isNaN(tourId)) {
        const tourBooking = await prisma.tourBooking.findFirst({
          where: {
            userId,
            status: { in: completedStatuses },
            schedule: {
              tourId
            }
          }
        });

        if (tourBooking) return true;
      }

      return false;
    }

    return false;
  }

  async upsertContentRating(rating: InsertContentRating): Promise<ContentRating> {
    return prisma.contentRating.upsert({
      where: {
        userId_targetType_targetId: {
          userId: rating.userId,
          targetType: rating.targetType,
          targetId: rating.targetId
        }
      },
      update: {
        rating: rating.rating,
        comment: rating.comment,
        metadata: rating.metadata,
        updatedAt: new Date()
      },
      create: rating
    });
  }

  async getRatingsForTarget(targetType: string, targetId: string): Promise<ContentRating[]> {
    return prisma.contentRating.findMany({
      where: { targetType, targetId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRatingSummary(targetType: string, targetId: string): Promise<{
    targetType: string;
    targetId: string;
    averageRating: number;
    totalRatings: number;
    distribution: Record<number, number>;
  }> {
    const aggregate = await prisma.contentRating.aggregate({
      where: { targetType, targetId },
      _avg: { rating: true },
      _count: true
    });

    const distributionSeed: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const distributionResults = await prisma.contentRating.groupBy({
      by: ['rating'],
      where: { targetType, targetId },
      _count: { rating: true }
    });

    for (const entry of distributionResults) {
      distributionSeed[entry.rating] = entry._count.rating;
    }

    return {
      targetType,
      targetId,
      averageRating: aggregate._avg.rating ?? 0,
      totalRatings: aggregate._count._all,
      distribution: distributionSeed
    };
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

  // Discount operations
  async getDiscounts(filters: { productId?: number; propertyId?: number; tourId?: number; activeOnly?: boolean } = {}): Promise<Discount[]> {
    const where: any = {};

    if (filters.productId) {
      where.productId = filters.productId;
    }

    if (filters.propertyId) {
      where.propertyId = filters.propertyId;
    }

    if (filters.tourId) {
      where.tourId = filters.tourId;
    }

    if (filters.activeOnly) {
      const now = new Date();
      where.isActive = true;
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    }

    return prisma.discount.findMany({
      where,
      orderBy: { startDate: 'desc' }
    });
  }

  async getDiscount(id: number): Promise<Discount | undefined> {
    const discount = await prisma.discount.findUnique({ where: { id } });
    return discount || undefined;
  }

  async createDiscount(discount: InsertDiscount): Promise<Discount> {
    return prisma.discount.create({ data: discount });
  }

  async updateDiscount(id: number, discount: UpdateDiscount): Promise<Discount> {
    return prisma.discount.update({
      where: { id },
      data: discount
    });
  }

  async deleteDiscount(id: number): Promise<void> {
    await prisma.discount.delete({ where: { id } });
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
        },
        discount: true
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
        },
        discount: true
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

    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          sellerId
        }
      },
      select: {
        quantity: true,
        price: true
      }
    });

    const { totalSales, revenue } = orderItems.reduce(
      (acc, item) => {
        const itemRevenue = Number(item.price) * item.quantity;
        return {
          totalSales: acc.totalSales + item.quantity,
          revenue: acc.revenue + itemRevenue
        };
      },
      { totalSales: 0, revenue: 0 }
    );

    return {
      totalProducts: stats[0]?._count?.id || 0,
      totalStock: stats[0]?._sum?.stock || 0,
      totalSales,
      revenue
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

    const chatRooms = await prisma.chatRoom.findMany({
      where: { supportAgentId },
      select: {
        id: true,
        status: true,
        customerId: true,
        messages: {
          select: {
            senderId: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    const closedChats = chatRooms.filter(room => room.status === 'closed').length;

    const responseTimes = chatRooms.reduce<number[]>((acc, room) => {
      let lastCustomerMessage: Date | null = null;

      room.messages.forEach(message => {
        if (message.senderId === supportAgentId) {
          if (lastCustomerMessage) {
            acc.push(message.createdAt.getTime() - lastCustomerMessage.getTime());
            lastCustomerMessage = null;
          }
        } else if (message.senderId === room.customerId) {
          lastCustomerMessage = message.createdAt;
        }
      });

      return acc;
    }, []);

    return {
      totalChats,
      activeChats,
      averageResponseTime: responseTimes.length
        ? Number(
          (
            responseTimes.reduce((sum, time) => sum + time, 0) /
            responseTimes.length /
            60000
          ).toFixed(2)
        )
        : 0,
      satisfactionScore: totalChats
        ? parseFloat(((closedChats / totalChats) * 5).toFixed(2))
        : 0
    };
  }

  // Property operations
  async getProperties(filters: any = {}): Promise<Property[]> {
    const {
      city,
      propertyType,
      minPrice,
      maxPrice,
      search,
      customAttributeFilters,
      customSortKey,
      customSortOrder,
      limit,
      offset
    } = filters;

    const where: any = {
      isActive: true
    };

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    const searchTerm = typeof search === 'string' ? search.trim() : '';
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { address: { contains: searchTerm, mode: 'insensitive' } },
        { city: { contains: searchTerm, mode: 'insensitive' } },
        { country: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    const minPriceValue = minPrice !== undefined ? Number(minPrice) : undefined;
    const maxPriceValue = maxPrice !== undefined ? Number(maxPrice) : undefined;

    if (minPriceValue || maxPriceValue) {
      where.pricePerNight = {};
      if (!Number.isNaN(minPriceValue) && minPriceValue !== undefined) {
        where.pricePerNight.gte = minPriceValue;
      }
      if (!Number.isNaN(maxPriceValue) && maxPriceValue !== undefined) {
        where.pricePerNight.lte = maxPriceValue;
      }
    }

    const andConditions: any[] = [];
    if (customAttributeFilters && typeof customAttributeFilters === 'object') {
      Object.entries(customAttributeFilters).forEach(([key, value]) => {
        andConditions.push({
          customAttributes: {
            path: [key],
            equals: value
          }
        });
      });
    }

    if (andConditions.length > 0) {
      where.AND = [...(where.AND || []), ...andConditions];
    }

    const orderBy: any[] = [];
    if (customSortKey) {
      orderBy.push({
        customAttributes: {
          path: [customSortKey],
          sort: customSortOrder || 'asc'
        }
      });
    }

    if (orderBy.length === 0) {
      orderBy.push({ createdAt: 'desc' });
    }

    const limitValue = limit !== undefined ? Number(limit) : undefined;
    const offsetValue = offset !== undefined ? Number(offset) : undefined;

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
        },
        discounts: true
      },
      orderBy: orderBy.length === 1 ? orderBy[0] : orderBy,
      take: !Number.isNaN(limitValue) && limitValue !== undefined ? limitValue : undefined,
      skip: !Number.isNaN(offsetValue) && offsetValue !== undefined ? offsetValue : undefined
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
        },
        discounts: true
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
      orderBy: { createdAt: 'desc' },
      include: {
        discounts: true
      }
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
        },
        discount: true
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
        },
        discount: true
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
        },
        discount: true
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

  // Recommendation System implementation
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId }
    });
    return preferences || undefined;
  }

  async upsertUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    return await prisma.userPreferences.upsert({
      where: { userId },
      update: {
        ...preferences,
        updatedAt: new Date()
      },
      create: {
        userId,
        ...preferences
      }
    });
  }

  async trackUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction> {
    return await prisma.userInteraction.create({
      data: interaction
    });
  }

  async getUserInteractions(userId: string, itemType?: string, limit: number = 100): Promise<UserInteraction[]> {
    return await prisma.userInteraction.findMany({
      where: {
        userId,
        ...(itemType && { itemType })
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async getRecommendations(userId: string, itemType?: string, limit: number = 20): Promise<Recommendation[]> {
    return await prisma.recommendation.findMany({
      where: {
        userId,
        isActive: true,
        ...(itemType && { itemType }),
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { score: 'desc' },
      take: limit
    });
  }

  async generateRecommendations(userId: string): Promise<Recommendation[]> {
    // Get user preferences and interactions
    const preferences = await this.getUserPreferences(userId);
    const interactions = await this.getUserInteractions(userId, undefined, 50);

    const recommendations: Recommendation[] = [];

    // Content-based recommendations for products
    const productRecommendations = await this.generateProductRecommendations(userId, preferences, interactions);
    recommendations.push(...productRecommendations);

    // Content-based recommendations for properties
    const propertyRecommendations = await this.generatePropertyRecommendations(userId, preferences, interactions);
    recommendations.push(...propertyRecommendations);

    // Content-based recommendations for destinations
    const destinationRecommendations = await this.generateDestinationRecommendations(userId, preferences, interactions);
    recommendations.push(...destinationRecommendations);

    // Store recommendations in database
    for (const rec of recommendations) {
      await this.createRecommendation(rec);
    }

    return recommendations;
  }

  private async generateProductRecommendations(userId: string, preferences: UserPreferences | undefined, interactions: UserInteraction[]): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get user's favorite categories from preferences and interactions
    const favoriteCategories = preferences?.favoriteCategories || [];
    const interactedProductIds = interactions
      .filter(i => i.itemType === 'product')
      .map(i => parseInt(i.itemId));

    // Get products from favorite categories
    if (favoriteCategories.length > 0) {
      const products = await prisma.product.findMany({
        where: {
          category: {
            name: { in: favoriteCategories }
          },
          id: { notIn: interactedProductIds },
          isActive: true
        },
        include: { category: true },
        take: 10
      });

      for (const product of products) {
        recommendations.push({
          userId,
          itemType: 'product',
          itemId: product.id.toString(),
          score: 0.8,
          reason: `Based on your interest in ${product.category.name}`,
          category: 'category_preference'
        });
      }
    }

    // Get similar products based on interactions
    for (const interaction of interactions.filter(i => i.itemType === 'product' && i.actionType === 'view')) {
      const similarItems = await this.getSimilarItems('product', interaction.itemId, 5);
      for (const similar of similarItems) {
        const product = await prisma.product.findUnique({
          where: { id: parseInt(similar.similarItemId) },
          include: { category: true }
        });

        if (product && product.isActive) {
          recommendations.push({
            userId,
            itemType: 'product',
            itemId: similar.similarItemId,
            score: similar.similarity,
            reason: `Similar to products you've viewed`,
            category: 'similar_items'
          });
        }
      }
    }

    return recommendations;
  }

  private async generatePropertyRecommendations(userId: string, preferences: UserPreferences | undefined, interactions: UserInteraction[]): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get user's accommodation preferences
    const accommodationType = preferences?.accommodationType;
    const travelBudgetRange = preferences?.travelBudgetRange;

    let priceFilter = {};
    if (travelBudgetRange) {
      const ranges = {
        'budget': { lte: 1000000 },
        'mid': { gte: 1000000, lte: 3000000 },
        'luxury': { gte: 3000000 }
      };
      priceFilter = { pricePerNight: ranges[travelBudgetRange] || {} };
    }

    // Get properties based on preferences
    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
        ...(accommodationType && { propertyType: accommodationType }),
        ...priceFilter
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    for (const property of properties) {
      const score = accommodationType === property.propertyType ? 0.9 : 0.7;
      recommendations.push({
        userId,
        itemType: 'property',
        itemId: property.id.toString(),
        score,
        reason: `Matches your ${accommodationType || 'travel'} preferences`,
        category: 'preference_match'
      });
    }

    return recommendations;
  }

  private async generateDestinationRecommendations(userId: string, preferences: UserPreferences | undefined, interactions: UserInteraction[]): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get user's preferred destinations
    const preferredDestinations = preferences?.preferredDestinations || [];
    const interests = preferences?.interests || [];

    // Mock destinations data (in a real app, this would come from a destinations table)
    const destinations = [
      { id: '1', name: 'Ha Long Bay', category: 'natural', interests: ['nature', 'adventure'] },
      { id: '2', name: 'Hoi An', category: 'cultural', interests: ['history', 'culture'] },
      { id: '3', name: 'Phu Quoc', category: 'beach', interests: ['beach', 'relaxation'] },
      { id: '4', name: 'Da Lat', category: 'mountain', interests: ['nature', 'romance'] },
      { id: '5', name: 'Sapa', category: 'adventure', interests: ['adventure', 'culture'] }
    ];

    for (const destination of destinations) {
      const matchesInterests = interests.some(interest =>
        destination.interests.includes(interest.toLowerCase())
      );

      if (matchesInterests || preferredDestinations.includes(destination.category)) {
        recommendations.push({
          userId,
          itemType: 'destination',
          itemId: destination.id,
          score: matchesInterests ? 0.8 : 0.6,
          reason: `Matches your interests in ${interests.join(', ')}`,
          category: 'interest_match'
        });
      }
    }

    return recommendations;
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    return await prisma.recommendation.create({
      data: {
        ...recommendation,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });
  }

  async markRecommendationClicked(id: number): Promise<void> {
    await prisma.recommendation.update({
      where: { id },
      data: { clickedAt: new Date() }
    });
  }

  async getSimilarItems(itemType: string, itemId: string, limit: number = 10): Promise<SimilarItem[]> {
    return await prisma.similarItem.findMany({
      where: {
        itemType,
        itemId
      },
      orderBy: { similarity: 'desc' },
      take: limit
    });
  }

  async createSimilarItem(similarItem: InsertSimilarItem): Promise<SimilarItem> {
    return await prisma.similarItem.create({
      data: similarItem
    });
  }

  async getPopularItems(itemType: string, limit: number = 10): Promise<any[]> {
    // Get most interacted items
    const popularItems = await prisma.userInteraction.groupBy({
      by: ['itemId'],
      where: { itemType },
      _count: { itemId: true },
      orderBy: { _count: { itemId: 'desc' } },
      take: limit
    });

    const itemIds = popularItems.map(item => parseInt(item.itemId));

    if (itemType === 'product') {
      return await prisma.product.findMany({
        where: { id: { in: itemIds }, isActive: true },
        include: { category: true }
      });
    } else if (itemType === 'property') {
      return await prisma.property.findMany({
        where: { id: { in: itemIds }, isActive: true }
      });
    }

    return [];
  }

  async getTrendingItems(itemType: string, days: number = 7, limit: number = 10): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trendingItems = await prisma.userInteraction.groupBy({
      by: ['itemId'],
      where: {
        itemType,
        createdAt: { gte: startDate }
      },
      _count: { itemId: true },
      orderBy: { _count: { itemId: 'desc' } },
      take: limit
    });

    const itemIds = trendingItems.map(item => parseInt(item.itemId));

    if (itemType === 'product') {
      return await prisma.product.findMany({
        where: { id: { in: itemIds }, isActive: true },
        include: { category: true }
      });
    } else if (itemType === 'property') {
      return await prisma.property.findMany({
        where: { id: { in: itemIds }, isActive: true }
      });
    }

    return [];
  }

  async getPersonalizedProducts(userId: string, limit: number = 20): Promise<Product[]> {
    const recommendations = await this.getRecommendations(userId, 'product', limit);
    const productIds = recommendations.map(r => parseInt(r.itemId));

    return await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { category: true }
    });
  }

  async getPersonalizedProperties(userId: string, limit: number = 20): Promise<Property[]> {
    const recommendations = await this.getRecommendations(userId, 'property', limit);
    const propertyIds = recommendations.map(r => parseInt(r.itemId));

    return await prisma.property.findMany({
      where: { id: { in: propertyIds }, isActive: true }
    });
  }

  async getPersonalizedDestinations(userId: string, limit: number = 10): Promise<any[]> {
    const recommendations = await this.getRecommendations(userId, 'destination', limit);

    // Mock destinations data (in a real app, this would come from a destinations table)
    const allDestinations = [
      { id: '1', name: 'Ha Long Bay', category: 'natural', rating: 4.8 },
      { id: '2', name: 'Hoi An', category: 'cultural', rating: 4.9 },
      { id: '3', name: 'Phu Quoc', category: 'beach', rating: 4.7 },
      { id: '4', name: 'Da Lat', category: 'mountain', rating: 4.6 },
      { id: '5', name: 'Sapa', category: 'adventure', rating: 4.5 }
    ];

    return allDestinations.filter(dest =>
      recommendations.some(rec => rec.itemId === dest.id)
    );
  }

  // Advanced recommendation methods implementation
  async getCollaborativeRecommendations(userId: string, itemType: string, limit: number = 20): Promise<any[]> {
    // Find similar users based on interaction patterns
    const similarUsers = await this.findSimilarUsers(userId, 10);

    if (similarUsers.length === 0) {
      return [];
    }

    // Get items liked by similar users but not by current user
    const currentUserInteractions = await this.getUserInteractions(userId, itemType);
    const currentUserItemIds = currentUserInteractions.map(i => i.itemId);

    const collaborativeItems = await prisma.userInteraction.findMany({
      where: {
        userId: { in: similarUsers },
        itemType,
        actionType: { in: ['like', 'purchase', 'book'] },
        itemId: { notIn: currentUserItemIds }
      },
      select: {
        itemId: true,
        actionType: true,
        userId: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2
    });

    // Score items based on similar user actions
    const itemScores = new Map<string, number>();

    for (const interaction of collaborativeItems) {
      const score = itemScores.get(interaction.itemId) || 0;
      const actionWeight = interaction.actionType === 'purchase' || interaction.actionType === 'book' ? 3 :
        interaction.actionType === 'like' ? 2 : 1;
      itemScores.set(interaction.itemId, score + actionWeight);
    }

    // Sort by score and get top items
    const topItemIds = Array.from(itemScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([itemId]) => parseInt(itemId));

    // Fetch item details
    if (itemType === 'product') {
      return await prisma.product.findMany({
        where: { id: { in: topItemIds }, isActive: true },
        include: { category: true }
      });
    } else if (itemType === 'property') {
      return await prisma.property.findMany({
        where: { id: { in: topItemIds }, isActive: true }
      });
    }

    return [];
  }

  async computeUserSimilarity(userId1: string, userId2: string): Promise<number> {
    // Get interactions for both users
    const user1Interactions = await this.getUserInteractions(userId1);
    const user2Interactions = await this.getUserInteractions(userId2);

    // Create item vectors
    const user1Items = new Set(user1Interactions.map(i => i.itemId));
    const user2Items = new Set(user2Interactions.map(i => i.itemId));

    // Calculate Jaccard similarity
    const intersection = new Set([...user1Items].filter(item => user2Items.has(item)));
    const union = new Set([...user1Items, ...user2Items]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  async findSimilarUsers(userId: string, limit: number = 10): Promise<string[]> {
    // Get all users who have interactions
    const allUsers = await prisma.userInteraction.findMany({
      select: { userId: true },
      distinct: ['userId'],
      where: { userId: { not: userId } }
    });

    // Calculate similarity with each user
    const similarities = await Promise.all(
      allUsers.map(async (user) => ({
        userId: user.userId,
        similarity: await this.computeUserSimilarity(userId, user.userId)
      }))
    );

    // Sort by similarity and return top users
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(s => s.userId);
  }

  async updateRecommendationScores(userId: string): Promise<void> {
    // Get user's recent interactions
    const recentInteractions = await this.getUserInteractions(userId, undefined, 20);

    // Update scores based on interaction patterns
    const categoryPreferences = new Map<string, number>();
    const itemTypePreferences = new Map<string, number>();

    for (const interaction of recentInteractions) {
      const itemType = interaction.itemType;
      const weight = interaction.actionType === 'purchase' || interaction.actionType === 'book' ? 3 :
        interaction.actionType === 'like' ? 2 : 1;

      itemTypePreferences.set(itemType, (itemTypePreferences.get(itemType) || 0) + weight);

      // Get category for products
      if (itemType === 'product') {
        const product = await prisma.product.findUnique({
          where: { id: parseInt(interaction.itemId) },
          include: { category: true }
        });

        if (product?.category) {
          categoryPreferences.set(product.category.name,
            (categoryPreferences.get(product.category.name) || 0) + weight);
        }
      }
    }

    // Update existing recommendations with new scores
    const existingRecommendations = await this.getRecommendations(userId);

    for (const rec of existingRecommendations) {
      let newScore = rec.score;

      // Boost score based on preferences
      const typeBoost = itemTypePreferences.get(rec.itemType) || 0;
      newScore += typeBoost * 0.1;

      await prisma.recommendation.update({
        where: { id: rec.id },
        data: { score: Math.min(newScore, 1.0) }
      });
    }
  }

  async getHybridRecommendations(userId: string, itemType: string, limit: number = 20): Promise<any[]> {
    // Get content-based recommendations
    const contentBased = await this.getPersonalizedProducts(userId, Math.floor(limit * 0.6));

    // Get collaborative recommendations
    const collaborative = await this.getCollaborativeRecommendations(userId, itemType, Math.floor(limit * 0.4));

    // Combine and deduplicate
    const combined = [...contentBased, ...collaborative];
    const uniqueItems = combined.filter((item, index, self) =>
      index === self.findIndex(i => i.id === item.id)
    );

    return uniqueItems.slice(0, limit);
  }

  async trackRecommendationFeedback(userId: string, recommendationId: number, feedback: 'positive' | 'negative' | 'neutral'): Promise<void> {
    // Update recommendation with feedback
    await prisma.recommendation.update({
      where: { id: recommendationId },
      data: {
        feedback,
        updatedAt: new Date()
      }
    });

    // Use feedback to improve future recommendations
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId }
    });

    if (recommendation) {
      const scoreAdjustment = feedback === 'positive' ? 0.1 :
        feedback === 'negative' ? -0.1 : 0;

      await prisma.recommendation.update({
        where: { id: recommendationId },
        data: { score: Math.max(0, Math.min(1, recommendation.score + scoreAdjustment)) }
      });
    }
  }

  async getRecommendationPerformance(itemType?: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const recommendations = await prisma.recommendation.findMany({
      where: {
        createdAt: { gte: startDate },
        ...(itemType && { itemType })
      },
      select: {
        id: true,
        score: true,
        clickedAt: true,
        feedback: true,
        itemType: true,
        category: true
      }
    });

    const totalRecommendations = recommendations.length;
    const clickedRecommendations = recommendations.filter(r => r.clickedAt).length;
    const positiveRecommendations = recommendations.filter(r => r.feedback === 'positive').length;
    const negativeRecommendations = recommendations.filter(r => r.feedback === 'negative').length;

    return {
      totalRecommendations,
      clickThroughRate: totalRecommendations > 0 ? clickedRecommendations / totalRecommendations : 0,
      positiveRate: totalRecommendations > 0 ? positiveRecommendations / totalRecommendations : 0,
      negativeRate: totalRecommendations > 0 ? negativeRecommendations / totalRecommendations : 0,
      averageScore: recommendations.reduce((sum, r) => sum + r.score, 0) / totalRecommendations || 0,
      categoryBreakdown: recommendations.reduce((acc, r) => {
        acc[r.category || 'unknown'] = (acc[r.category || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  async generateSeasonalRecommendations(userId: string, season: string): Promise<Recommendation[]> {
    const preferences = await this.getUserPreferences(userId);
    const recommendations: Recommendation[] = [];

    // Seasonal product recommendations
    const seasonalKeywords = {
      spring: ['spring', 'fresh', 'light', 'outdoor', 'garden'],
      summer: ['summer', 'beach', 'vacation', 'travel', 'cool'],
      autumn: ['autumn', 'fall', 'warm', 'cozy', 'harvest'],
      winter: ['winter', 'warm', 'indoor', 'holiday', 'comfort']
    };

    const keywords = seasonalKeywords[season as keyof typeof seasonalKeywords] || [];

    // Find products with seasonal keywords
    const seasonalProducts = await prisma.product.findMany({
      where: {
        OR: keywords.map(keyword => ({
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } }
          ]
        })),
        isActive: true
      },
      take: 10
    });

    for (const product of seasonalProducts) {
      recommendations.push({
        userId,
        itemType: 'product',
        itemId: product.id.toString(),
        score: 0.8,
        reason: `Perfect for ${season} season`,
        category: 'seasonal'
      });
    }

    return recommendations;
  }

  async getContextualRecommendations(userId: string, context: any): Promise<any[]> {
    const { location, timeOfDay, weather, occasion } = context;
    const recommendations = [];

    // Location-based recommendations
    if (location) {
      const locationProperties = await prisma.property.findMany({
        where: {
          OR: [
            { city: { contains: location, mode: 'insensitive' } },
            { address: { contains: location, mode: 'insensitive' } }
          ],
          isActive: true
        },
        take: 5
      });
      recommendations.push(...locationProperties);
    }

    // Time-based recommendations
    if (timeOfDay) {
      const timeKeywords = {
        morning: ['breakfast', 'coffee', 'morning'],
        afternoon: ['lunch', 'work', 'productivity'],
        evening: ['dinner', 'entertainment', 'relaxation'],
        night: ['sleep', 'comfort', 'rest']
      };

      const keywords = timeKeywords[timeOfDay as keyof typeof timeKeywords] || [];

      const timeRelevantProducts = await prisma.product.findMany({
        where: {
          OR: keywords.map(keyword => ({
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } }
            ]
          })),
          isActive: true
        },
        take: 5
      });

      recommendations.push(...timeRelevantProducts);
    }

    return recommendations;
  }

  // Admin methods
  async countUsers(): Promise<number> {
    return await prisma.user.count();
  }

  async countProducts(): Promise<number> {
    return await prisma.product.count();
  }

  async countOrders(): Promise<number> {
    return await prisma.order.count();
  }

  async countProperties(): Promise<number> {
    return await prisma.property.count();
  }

  async countNewUsersThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    });
  }

  async countActiveProducts(): Promise<number> {
    return await prisma.product.count({
      where: {
        stock: {
          gt: 0
        }
      }
    });
  }

  async countActiveProperties(): Promise<number> {
    return await prisma.property.count();
  }

  async getTotalRevenue(): Promise<number> {
    const result = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      }
    });
    return result._sum.totalAmount || 0;
  }

  async getAllUsers(): Promise<any[]> {
    return await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async createUser(userData: any): Promise<any> {
    return await prisma.user.create({
      data: userData
    });
  }

  // Seller Analytics Methods
  async getSellerAnalytics(sellerId: string, period: string): Promise<any> {
    try {
      const endDate = new Date();
      let startDate: Date;

      switch (period) {
        case '7d':
          startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get products by seller
      const products = await prisma.product.findMany({
        where: { sellerId },
        include: {
          orderItems: {
            include: {
              order: true
            }
          },
          reviews: true
        }
      });

      // Calculate revenue
      const totalRevenue = products.reduce((sum, product) => {
        return sum + product.orderItems.reduce((itemSum, item) => {
          return itemSum + (item.price * item.quantity);
        }, 0);
      }, 0);

      // Count orders
      const totalOrders = await prisma.order.count({
        where: {
          orderItems: {
            some: {
              product: {
                sellerId
              }
            }
          },
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      // Calculate average rating
      const allReviews = products.flatMap(p => p.reviews);
      const avgRating = allReviews.length > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
        : 0;

      return {
        revenue: {
          total: totalRevenue,
          change: 12.5, // Mock change percentage
          trend: 'up'
        },
        orders: {
          total: totalOrders,
          change: 8.3,
          trend: 'up'
        },
        products: {
          total: products.length,
          active: products.filter(p => p.stock > 0).length,
          lowStock: products.filter(p => p.stock <= 10 && p.stock > 0).length,
          outOfStock: products.filter(p => p.stock === 0).length
        },
        satisfaction: avgRating,
        period: period
      };
    } catch (error) {
      console.error('Error fetching seller analytics:', error);
      throw error;
    }
  }

  async getSellerProducts(sellerId: string): Promise<any> {
    return await prisma.product.findMany({
      where: { sellerId },
      include: {
        orderItems: true,
        reviews: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getSellerOrders(sellerId: string): Promise<any> {
    return await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              sellerId
            }
          }
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getSellerInventory(sellerId: string): Promise<any> {
    const products = await prisma.product.findMany({
      where: { sellerId },
      select: {
        id: true,
        title: true,
        stock: true,
        price: true,
        category: true,
        createdAt: true
      }
    });

    return {
      products,
      totalProducts: products.length,
      lowStock: products.filter(p => p.stock <= 10 && p.stock > 0).length,
      outOfStock: products.filter(p => p.stock === 0).length,
      totalValue: products.reduce((sum, product) => sum + (product.price * product.stock), 0)
    };
  }

  async getSellerPerformance(sellerId: string, period: string): Promise<any> {
    try {
      const endDate = new Date();
      let startDate: Date;

      switch (period) {
        case '7d':
          startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get top performing products
      const topProducts = await prisma.product.findMany({
        where: {
          sellerId,
          orderItems: {
            some: {
              order: {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                }
              }
            }
          }
        },
        include: {
          orderItems: {
            include: {
              order: true
            }
          },
          reviews: true
        },
        take: 10
      });

      // Calculate metrics for each product
      const productMetrics = topProducts.map(product => {
        const sales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const revenue = product.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const avgRating = product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0;

        return {
          id: product.id,
          title: product.title,
          sales,
          revenue,
          avgRating,
          reviewCount: product.reviews.length
        };
      });

      return {
        topProducts: productMetrics.sort((a, b) => b.revenue - a.revenue),
        period: period
      };
    } catch (error) {
      console.error('Error fetching seller performance:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: any): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { ...userData, updatedAt: new Date() }
    });
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { isActive, updatedAt: new Date() }
    });
  }

  async updateUserPermissions(id: string, permissions: string[]): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { permissions, updatedAt: new Date() }
    });
  }

  async adjustUserCredit(id: string, amount: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        creditBalance: {
          increment: amount
        },
        updatedAt: new Date()
      }
    });
  }

  async bulkDelete(table: string, ids: (string | number)[]): Promise<void> {
    switch (table) {
      case 'users':
        await prisma.user.deleteMany({
          where: { id: { in: ids as string[] } }
        });
        break;
      case 'products':
        await prisma.product.deleteMany({
          where: { id: { in: ids as number[] } }
        });
        break;
      case 'orders':
        await prisma.order.deleteMany({
          where: { id: { in: ids as number[] } }
        });
        break;
      case 'reviews':
        await prisma.review.deleteMany({
          where: { id: { in: ids as number[] } }
        });
        break;
      case 'properties':
        await prisma.property.deleteMany({
          where: { id: { in: ids as number[] } }
        });
        break;
      case 'categories':
        await prisma.category.deleteMany({
          where: { id: { in: ids as number[] } }
        });
        break;
      case 'itineraries':
        await prisma.itinerary.deleteMany({
          where: { id: { in: ids as number[] } }
        });
        break;
      default:
        throw new Error(`Unsupported table: ${table}`);
    }
  }

  async getAllRoles(): Promise<any[]> {
    return [
      {
        id: 'admin',
        name: 'Admin',
        description: 'Full system access',
        permissions: ['read_all', 'write_all', 'delete_all', 'manage_users', 'manage_roles']
      },
      {
        id: 'seller',
        name: 'Seller',
        description: 'Manage products and orders',
        permissions: ['read_products', 'write_products', 'read_orders', 'write_orders']
      },
      {
        id: 'user',
        name: 'User',
        description: 'Standard user access',
        permissions: ['read_products', 'read_properties', 'create_orders', 'read_profile']
      }
    ];
  }

  async createRole(roleData: any): Promise<any> {
    return {
      id: Date.now().toString(),
      ...roleData,
      createdAt: new Date()
    };
  }

  async updateRole(id: string, roleData: any): Promise<any> {
    return {
      id,
      ...roleData,
      updatedAt: new Date()
    };
  }

  async deleteRole(id: string): Promise<void> {
    console.log(`Role ${id} deleted`);
  }

  async bulkUpdateUsers(userIds: string[], updates: any): Promise<any> {
    const results = await this.prisma.$transaction(
      userIds.map(id =>
        this.prisma.user.update({
          where: { id },
          data: updates
        })
      )
    );
    return results;
  }

  async bulkDeleteUsers(userIds: string[]): Promise<void> {
    await this.prisma.user.deleteMany({
      where: {
        id: {
          in: userIds
        }
      }
    });
  }

  async getAllProducts(): Promise<any[]> {
    return await this.prisma.product.findMany({
      include: {
        category: true,
        seller: true
      }
    });
  }

  async checkDatabaseHealth(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Hotel management operations
  async getAllHotels(): Promise<any[]> {
    return [
      {
        id: 1,
        name: 'Khách sạn Marriott Hanoi',
        address: '8 Hai Ba Trung, Hoan Kiem, Hanoi',
        city: 'Hanoi',
        country: 'Vietnam',
        rating: 4.5,
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
        roomCount: 267,
        status: 'active',
        description: 'Luxury hotel in the heart of Hanoi',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: 'InterContinental Saigon',
        address: '2 Lam Son Square, District 1, Ho Chi Minh City',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        rating: 4.8,
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Business Center'],
        roomCount: 305,
        status: 'active',
        description: 'Iconic luxury hotel in downtown Saigon',
        images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  async createHotel(hotel: any): Promise<any> {
    return {
      id: Date.now(),
      ...hotel,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateHotel(id: number, hotel: any): Promise<any> {
    return {
      id,
      ...hotel,
      updatedAt: new Date()
    };
  }

  async deleteHotel(id: number): Promise<void> {
    console.log(`Hotel ${id} deleted`);
  }

  // Room Type management operations
  async getAllRoomTypes(): Promise<any[]> {
    return [
      {
        id: 1,
        name: 'Deluxe Room',
        description: 'Spacious room with city view',
        basePrice: 1200000,
        maxOccupancy: 2,
        amenities: ['WiFi', 'AC', 'Minibar', 'Safe'],
        size: 35,
        bedType: 'Queen',
        hotelId: 1,
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        status: 'active',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: 'Executive Suite',
        description: 'Luxury suite with separate living area',
        basePrice: 2500000,
        maxOccupancy: 4,
        amenities: ['WiFi', 'AC', 'Minibar', 'Safe', 'Balcony', 'Living Room'],
        size: 65,
        bedType: 'King',
        hotelId: 1,
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
        status: 'active',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  async createRoomType(roomType: any): Promise<any> {
    return {
      id: Date.now(),
      ...roomType,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateRoomType(id: number, roomType: any): Promise<any> {
    return {
      id,
      ...roomType,
      updatedAt: new Date()
    };
  }

  async deleteRoomType(id: number): Promise<void> {
    console.log(`Room type ${id} deleted`);
  }

  // Villa management operations
  async getAllVillas(): Promise<any[]> {
    return [
      {
        id: 1,
        name: 'Villa Paradise Phu Quoc',
        location: 'Phu Quoc Island, Vietnam',
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        pricePerNight: 5000000,
        amenities: ['Private Pool', 'Beach Access', 'WiFi', 'Kitchen', 'Garden'],
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
        rating: 4.9,
        status: 'active',
        description: 'Luxury beachfront villa with private pool',
        ownerId: 'owner1',
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: 'Mountain Villa Da Lat',
        location: 'Da Lat, Vietnam',
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        pricePerNight: 3500000,
        amenities: ['Mountain View', 'Fireplace', 'WiFi', 'Kitchen', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
        rating: 4.7,
        status: 'active',
        description: 'Cozy mountain villa with stunning views',
        ownerId: 'owner2',
        createdAt: new Date('2023-03-15'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  async createVilla(villa: any): Promise<any> {
    return {
      id: Date.now(),
      ...villa,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateVilla(id: number, villa: any): Promise<any> {
    return {
      id,
      ...villa,
      updatedAt: new Date()
    };
  }

  async deleteVilla(id: number): Promise<void> {
    console.log(`Villa ${id} deleted`);
  }

  // Homestay management operations
  async getAllHomestays(): Promise<any[]> {
    return [
      {
        id: 1,
        name: 'Homestay Mai Chau Valley',
        location: 'Mai Chau, Hoa Binh, Vietnam',
        hostFamily: 'Nguyen Family',
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        pricePerNight: 800000,
        amenities: ['Traditional House', 'Local Meals', 'WiFi', 'Bicycle Rental'],
        images: ['https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800'],
        rating: 4.6,
        status: 'active',
        description: 'Authentic homestay experience in traditional stilt house',
        hostId: 'host1',
        activities: ['Rice field tours', 'Traditional cooking', 'Local crafts'],
        createdAt: new Date('2023-04-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: 'Mekong Delta Homestay',
        location: 'Can Tho, Vietnam',
        hostFamily: 'Tran Family',
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        pricePerNight: 1200000,
        amenities: ['River View', 'Boat Tours', 'WiFi', 'Traditional Meals'],
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
        rating: 4.8,
        status: 'active',
        description: 'Riverside homestay with authentic Mekong Delta experience',
        hostId: 'host2',
        activities: ['Floating market tours', 'Fruit garden visits', 'Traditional fishing'],
        createdAt: new Date('2023-04-15'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  async createHomestay(homestay: any): Promise<any> {
    return {
      id: Date.now(),
      ...homestay,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateHomestay(id: number, homestay: any): Promise<any> {
    return {
      id,
      ...homestay,
      updatedAt: new Date()
    };
  }

  async deleteHomestay(id: number): Promise<void> {
    console.log(`Homestay ${id} deleted`);
  }

  // Airport management operations
  async getAllAirports(): Promise<any[]> {
    return [
      {
        id: 1,
        code: 'HAN',
        name: 'Noi Bai International Airport',
        city: 'Hanoi',
        country: 'Vietnam',
        terminals: 2,
        runways: 2,
        status: 'active',
        coordinates: { lat: 21.2212, lng: 105.8072 },
        services: ['Duty Free', 'Restaurants', 'WiFi', 'Lounges', 'Car Rental'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        code: 'SGN',
        name: 'Tan Son Nhat International Airport',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        terminals: 2,
        runways: 2,
        status: 'active',
        coordinates: { lat: 10.8188, lng: 106.6520 },
        services: ['Duty Free', 'Restaurants', 'WiFi', 'Lounges', 'Car Rental'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 3,
        code: 'DAD',
        name: 'Da Nang International Airport',
        city: 'Da Nang',
        country: 'Vietnam',
        terminals: 1,
        runways: 1,
        status: 'active',
        coordinates: { lat: 16.0439, lng: 108.2019 },
        services: ['Duty Free', 'Restaurants', 'WiFi', 'Car Rental'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  async createAirport(airport: any): Promise<any> {
    return {
      id: Date.now(),
      ...airport,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateAirport(id: number, airport: any): Promise<any> {
    return {
      id,
      ...airport,
      updatedAt: new Date()
    };
  }

  async deleteAirport(id: number): Promise<void> {
    console.log(`Airport ${id} deleted`);
  }

  // Travel Station management operations
  async getAllStations(): Promise<any[]> {
    return [
      {
        id: 1,
        name: 'Ben Xe Mien Dong',
        type: 'Bus Terminal',
        city: 'Ho Chi Minh City',
        address: '292 Dinh Bo Linh, Binh Thanh District',
        coordinates: { lat: 10.8142, lng: 106.7317 },
        services: ['Ticket Counter', 'Waiting Area', 'Food Court', 'Parking'],
        operators: ['Phuong Trang', 'Sinh Tourist', 'Hanh Cafe'],
        status: 'active',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: 'Hanoi Railway Station',
        type: 'Train Station',
        city: 'Hanoi',
        address: '120 Le Duan, Hoan Kiem District',
        coordinates: { lat: 21.0245, lng: 105.8412 },
        services: ['Ticket Counter', 'Waiting Area', 'Restaurant', 'Luggage Storage'],
        operators: ['Vietnam Railways'],
        status: 'active',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 3,
        name: 'Superdong Ferry Terminal',
        type: 'Ferry Terminal',
        city: 'Phu Quoc',
        address: 'Duong To Port, Phu Quoc Island',
        coordinates: { lat: 10.2899, lng: 103.9654 },
        services: ['Ticket Counter', 'Waiting Area', 'Cafe', 'Parking'],
        operators: ['Superdong Fast Ferry', 'Phu Quoc Express'],
        status: 'active',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  async createStation(station: any): Promise<any> {
    return {
      id: Date.now(),
      ...station,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateStation(id: number, station: any): Promise<any> {
    return {
      id,
      ...station,
      updatedAt: new Date()
    };
  }

  async deleteStation(id: number): Promise<void> {
    console.log(`Station ${id} deleted`);
  }

  // Travel Provider management operations
  async getAllProviders(): Promise<any[]> {
    return [
      {
        id: 1,
        name: 'Vietnam Airlines',
        type: 'Airline',
        code: 'VN',
        country: 'Vietnam',
        fleet: 85,
        destinations: 95,
        services: ['Domestic', 'International', 'Cargo'],
        status: 'active',
        logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200',
        description: 'National flag carrier of Vietnam',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: 'Phuong Trang',
        type: 'Bus Company',
        code: 'FUTA',
        country: 'Vietnam',
        fleet: 1200,
        destinations: 63,
        services: ['Intercity Bus', 'Tourist Bus', 'Limousine'],
        status: 'active',
        logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=200',
        description: 'Leading bus transportation company in Vietnam',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 3,
        name: 'Sinh Tourist',
        type: 'Tour Operator',
        code: 'SINH',
        country: 'Vietnam',
        fleet: 50,
        destinations: 45,
        services: ['Adventure Tours', 'Cultural Tours', 'Transportation'],
        status: 'active',
        logo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200',
        description: 'Popular backpacker tour operator',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  async createProvider(provider: any): Promise<any> {
    return {
      id: Date.now(),
      ...provider,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateProvider(id: number, provider: any): Promise<any> {
    return {
      id,
      ...provider,
      updatedAt: new Date()
    };
  }

  async deleteProvider(id: number): Promise<void> {
    console.log(`Provider ${id} deleted`);
  }

  // Flight management operations
  async getAllFlights(): Promise<any[]> {
    return [
      {
        id: 1,
        flightNumber: 'VN210',
        airline: 'Vietnam Airlines',
        aircraftType: 'Boeing 787',
        departureAirport: 'HAN',
        arrivalAirport: 'SGN',
        departureTime: '08:00',
        arrivalTime: '10:15',
        duration: '2h 15m',
        frequency: 'Daily',
        seatConfiguration: {
          economy: 240,
          business: 28,
          first: 12
        },
        prices: {
          economy: 2800000,
          business: 8500000,
          first: 15000000
        },
        status: 'active',
        amenities: ['WiFi', 'Meals', 'Entertainment'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        flightNumber: 'VJ142',
        airline: 'VietJet Air',
        aircraftType: 'Airbus A321',
        departureAirport: 'SGN',
        arrivalAirport: 'DAD',
        departureTime: '14:30',
        arrivalTime: '15:45',
        duration: '1h 15m',
        frequency: 'Daily',
        seatConfiguration: {
          economy: 230,
          business: 12
        },
        prices: {
          economy: 1800000,
          business: 4200000
        },
        status: 'active',
        amenities: ['WiFi', 'Snacks'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  async createFlight(flight: any): Promise<any> {
    return {
      id: Date.now(),
      ...flight,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateFlight(id: number, flight: any): Promise<any> {
    return {
      id,
      ...flight,
      updatedAt: new Date()
    };
  }

  async deleteFlight(id: number): Promise<void> {
    console.log(`Flight ${id} deleted`);
  }

  // Tour management operations
  async getTours(filters: { search?: string; location?: string; hostId?: string } = {}): Promise<TourDetail[]> {
    const { search, location, hostId } = filters;
    return prisma.tourDetail.findMany({
      where: {
        ...(hostId ? { hostId } : {}),
        ...(location
          ? {
            location: {
              contains: location,
              mode: 'insensitive'
            }
          }
          : {}),
        ...(search
          ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } }
            ]
          }
          : {})
      },
      include: {
        schedules: {
          include: {
            tickets: true,
            bookings: true
          }
        },
        discounts: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTour(tourId: number): Promise<TourDetail | undefined> {
    const tour = await prisma.tourDetail.findUnique({
      where: { id: tourId },
      include: {
        schedules: { include: { tickets: true, bookings: true } },
        discounts: true
      }
    });
    return tour ?? undefined;
  }

  async getTourSchedules(tourId: number): Promise<TourSchedule[]> {
    return prisma.tourSchedule.findMany({
      where: { tourId },
      include: { tickets: true },
      orderBy: { startTime: 'asc' }
    });
  }

  async createTour(tour: InsertTourDetail): Promise<TourDetail> {
    return prisma.tourDetail.create({
      data: tour,
      include: { schedules: true }
    });
  }

  async createTourSchedule(schedule: InsertTourSchedule): Promise<TourSchedule> {
    return prisma.tourSchedule.create({
      data: schedule,
      include: { tickets: true }
    });
  }

  async createTicketDetail(ticket: InsertTicketDetail): Promise<TicketDetail> {
    return prisma.ticketDetail.create({
      data: ticket
    });
  }

  async updateTourStatus(tourId: number, status: string): Promise<TourDetail> {
    return prisma.tourDetail.update({
      where: { id: tourId },
      data: { status, updatedAt: new Date() }
    });
  }

  async bookTour(booking: InsertTourBooking, guests: number, discount?: Discount): Promise<TourBooking> {
    return prisma.$transaction(async (tx) => {
      const schedule = await tx.tourSchedule.findUnique({
        where: { id: booking.tourScheduleId },
        include: { tour: true }
      });

      if (!schedule) {
        throw new Error('Tour schedule not found');
      }

      if (schedule.availableSpots < guests) {
        throw new Error('Not enough availability for this schedule');
      }

      if (discount) {
        if (!isDiscountActive(discount)) {
          throw new Error('Discount is not active');
        }
        const applies = isDiscountApplicable(discount, { tourId: schedule.tourId });
        if (!applies) {
          throw new Error('Discount is not applicable to this tour');
        }
        if (discount.productId || discount.propertyId) {
          throw new Error('Discount is not valid for tour bookings');
        }
      }

      const basePrice = Number(schedule.price ?? schedule.tour?.basePrice ?? 0);
      const baseAmount = basePrice * guests;
      const discountAmount = discount ? calculateDiscountAmount(baseAmount, discount) : 0;
      const totalAmount = Math.max(baseAmount - discountAmount, 0);

      await tx.tourSchedule.update({
        where: { id: schedule.id },
        data: { availableSpots: { decrement: guests } }
      });

      return tx.tourBooking.create({
        data: {
          ...booking,
          totalAmount,
          discountAmount,
          discountId: discount?.id
        }
      });
    });
  }

  async updateTourBookingStatus(bookingId: number, status: string): Promise<TourBooking> {
    return prisma.tourBooking.update({
      where: { id: bookingId },
      data: { status }
    });
  }

  async getTourBookings(userId: string, role: 'host' | 'guest' = 'guest'): Promise<TourBooking[]> {
    if (role === 'host') {
      return prisma.tourBooking.findMany({
        where: {
          schedule: {
            tour: {
              hostId: userId
            }
          }
        },
        include: {
          schedule: {
            include: { tour: true }
          },
          discount: true
        },
        orderBy: { bookedAt: 'desc' }
      });
    }

    return prisma.tourBooking.findMany({
      where: { userId },
      include: {
        schedule: {
          include: { tour: true }
        },
        discount: true
      },
      orderBy: { bookedAt: 'desc' }
    });
  }

  // Notification operations
  async getNotifications(userId: string, limit = 20): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    return prisma.notification.create({ data: notification });
  }

  async markNotificationRead(notificationId: number): Promise<Notification> {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() }
    });
  }

  // Shipping Address operations
  async getShippingAddresses(userId: string): Promise<ShippingAddress[]> {
    return prisma.shippingAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    });
  }

  async getShippingAddressById(id: number): Promise<ShippingAddress | null> {
    return prisma.shippingAddress.findUnique({
      where: { id }
    });
  }

  async createShippingAddress(address: InsertShippingAddress): Promise<ShippingAddress> {
    return prisma.shippingAddress.create({
      data: address
    });
  }

  async updateShippingAddress(id: number, address: UpdateShippingAddress): Promise<ShippingAddress> {
    return prisma.shippingAddress.update({
      where: { id },
      data: address
    });
  }

  async deleteShippingAddress(id: number): Promise<void> {
    await prisma.shippingAddress.delete({
      where: { id }
    });
  }

  async unsetDefaultShippingAddress(userId: string): Promise<void> {
    await prisma.shippingAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  }

  // User Phone operations
  async getUserPhones(userId: string): Promise<UserPhone[]> {
    return prisma.userPhone.findMany({
      where: { userId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }]
    });
  }

  async getUserPhoneById(id: number): Promise<UserPhone | null> {
    return prisma.userPhone.findUnique({
      where: { id }
    });
  }

  async createUserPhone(phone: InsertUserPhone): Promise<UserPhone> {
    return prisma.userPhone.create({
      data: phone
    });
  }

  async updateUserPhone(id: number, phone: UpdateUserPhone): Promise<UserPhone> {
    return prisma.userPhone.update({
      where: { id },
      data: phone
    });
  }

  async deleteUserPhone(id: number): Promise<void> {
    await prisma.userPhone.delete({
      where: { id }
    });
  }

  async unsetPrimaryUserPhone(userId: string): Promise<void> {
    await prisma.userPhone.updateMany({
      where: { userId, isPrimary: true },
      data: { isPrimary: false }
    });
  }

  // Recently Viewed Products operations
  async getRecentlyViewedProducts(userId: string, limit = 20): Promise<RecentlyViewedProduct[]> {
    return prisma.recentlyViewedProduct.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: limit
    });
  }

  async getRecentlyViewedById(id: number): Promise<RecentlyViewedProduct | null> {
    return prisma.recentlyViewedProduct.findUnique({
      where: { id }
    });
  }

  async trackRecentlyViewed(data: InsertRecentlyViewed): Promise<RecentlyViewedProduct> {
    // Upsert to update if exists or create if not
    const existing = await prisma.recentlyViewedProduct.findUnique({
      where: {
        userId_productId: {
          userId: data.userId,
          productId: data.productId
        }
      }
    });

    if (existing) {
      return prisma.recentlyViewedProduct.update({
        where: { id: existing.id },
        data: {
          viewedAt: new Date(),
          duration: data.duration,
          metadata: data.metadata
        }
      });
    }

    return prisma.recentlyViewedProduct.create({
      data: data
    });
  }

  async deleteRecentlyViewed(id: number): Promise<void> {
    await prisma.recentlyViewedProduct.delete({
      where: { id }
    });
  }

  // Saved Products operations
  async getSavedProducts(userId: string): Promise<SavedProduct[]> {
    return prisma.savedProduct.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' }
    });
  }

  async getSavedProductById(id: number): Promise<SavedProduct | null> {
    return prisma.savedProduct.findUnique({
      where: { id }
    });
  }

  async createSavedProduct(data: InsertSavedProduct): Promise<SavedProduct> {
    return prisma.savedProduct.create({
      data: data
    });
  }

  async updateSavedProduct(id: number, data: UpdateSavedProduct): Promise<SavedProduct> {
    return prisma.savedProduct.update({
      where: { id },
      data: data
    });
  }

  async deleteSavedProduct(id: number): Promise<void> {
    await prisma.savedProduct.delete({
      where: { id }
    });
  }
}

export const storage = new PrismaStorage();
