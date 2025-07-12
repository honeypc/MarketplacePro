import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("firstName"),
  lastName: varchar("lastName"),
  profileImageUrl: varchar("profileImageUrl"),
  password: varchar("password"), // For email/password auth
  role: varchar("role").default("user"), // admin, seller, user
  isActive: boolean("isActive").default(true),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  parentId: integer("parentId"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sellerId: varchar("sellerId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: integer("categoryId").notNull(),
  stock: integer("stock").notNull().default(0),
  images: text("images").array(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Product reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("productId").notNull(),
  userId: varchar("userId").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  productId: integer("productId").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Wishlist items table
export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  productId: integer("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address").$type<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }>(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Inventory alerts table
export const inventoryAlerts = pgTable("inventory_alerts", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  sellerId: varchar("seller_id").notNull(),
  alertType: varchar("alert_type", { length: 50 }).notNull(), // 'low_stock', 'out_of_stock', 'restock_reminder'
  message: text("message").notNull(),
  severity: varchar("severity", { length: 20 }).notNull().default("medium"), // 'low', 'medium', 'high', 'critical'
  isRead: boolean("is_read").default(false),
  isResolved: boolean("is_resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stock movements table for tracking inventory history
export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  sellerId: varchar("seller_id").notNull(),
  movementType: varchar("movement_type", { length: 50 }).notNull(), // 'sale', 'restock', 'adjustment', 'return', 'damaged'
  quantity: integer("quantity").notNull(),
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  reason: text("reason"),
  orderId: integer("order_id"), // Reference to order if movement is from sale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat support system tables
export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  customerId: varchar("customerId").references(() => users.id).notNull(),
  supportAgentId: varchar("supportAgentId").references(() => users.id),
  status: varchar("status", { length: 20 }).default("active").notNull(), // 'active', 'closed', 'waiting'
  subject: varchar("subject", { length: 255 }),
  priority: varchar("priority", { length: 20 }).default("medium").notNull(), // 'low', 'medium', 'high', 'urgent'
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  closedAt: timestamp("closedAt"),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  roomId: integer("roomId").references(() => chatRooms.id).notNull(),
  senderId: varchar("senderId").references(() => users.id).notNull(),
  message: text("message").notNull(),
  messageType: varchar("messageType", { length: 20 }).default("text").notNull(), // 'text', 'image', 'file', 'system'
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const chatAttachments = pgTable("chat_attachments", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => chatMessages.id).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Room/Property listings table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  hostId: varchar("host_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  propertyType: varchar("property_type", { length: 50 }).notNull(), // 'hotel', 'apartment', 'house', 'villa', 'studio', 'homestay'
  roomType: varchar("room_type", { length: 50 }).notNull(), // 'entire_place', 'private_room', 'shared_room'
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms").notNull().default(1),
  bathrooms: integer("bathrooms").notNull().default(1),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  cleaningFee: decimal("cleaning_fee", { precision: 10, scale: 2 }).default("0"),
  serviceFee: decimal("service_fee", { precision: 10, scale: 2 }).default("0"),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  images: jsonb("images").$type<string[]>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  houseRules: text("house_rules"),
  checkInTime: varchar("check_in_time", { length: 20 }).default("15:00"),
  checkOutTime: varchar("check_out_time", { length: 20 }).default("11:00"),
  minStayNights: integer("min_stay_nights").default(1),
  maxStayNights: integer("max_stay_nights").default(365),
  instantBook: boolean("instant_book").default(false),
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active', 'inactive', 'pending'
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  guestId: varchar("guest_id").notNull(),
  hostId: varchar("host_id").notNull(),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  numberOfGuests: integer("number_of_guests").notNull(),
  numberOfNights: integer("number_of_nights").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  cleaningFee: decimal("cleaning_fee", { precision: 10, scale: 2 }).default("0"),
  serviceFee: decimal("service_fee", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'confirmed', 'cancelled', 'completed'
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"), // 'pending', 'paid', 'refunded'
  guestNotes: text("guest_notes"),
  hostNotes: text("host_notes"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property reviews table
export const propertyReviews = pgTable("property_reviews", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  bookingId: integer("booking_id").notNull(),
  guestId: varchar("guest_id").notNull(),
  hostId: varchar("host_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  cleanliness: integer("cleanliness").notNull(),
  communication: integer("communication").notNull(),
  checkIn: integer("check_in").notNull(),
  accuracy: integer("accuracy").notNull(),
  location: integer("location").notNull(),
  value: integer("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Property availability table
export const propertyAvailability = pgTable("property_availability", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  date: timestamp("date").notNull(),
  available: boolean("available").notNull().default(true),
  price: decimal("price", { precision: 10, scale: 2 }), // Custom price for specific dates
  minStayNights: integer("min_stay_nights"), // Override default min stay
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  reviews: many(reviews),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  orders: many(orders),
  inventoryAlerts: many(inventoryAlerts),
  stockMovements: many(stockMovements),
  customerChatRooms: many(chatRooms, { relationName: "customerChatRooms" }),
  supportChatRooms: many(chatRooms, { relationName: "supportChatRooms" }),
  chatMessages: many(chatMessages),
  hostedProperties: many(properties),
  guestBookings: many(bookings, { relationName: "guestBookings" }),
  hostBookings: many(bookings, { relationName: "hostBookings" }),
  propertyReviews: many(propertyReviews),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  orderItems: many(orderItems),
  inventoryAlerts: many(inventoryAlerts),
  stockMovements: many(stockMovements),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, {
    fields: [wishlistItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const inventoryAlertsRelations = relations(inventoryAlerts, ({ one }) => ({
  product: one(products, {
    fields: [inventoryAlerts.productId],
    references: [products.id],
  }),
  seller: one(users, {
    fields: [inventoryAlerts.sellerId],
    references: [users.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
  seller: one(users, {
    fields: [stockMovements.sellerId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [stockMovements.orderId],
    references: [orders.id],
  }),
}));

export const chatRoomsRelations = relations(chatRooms, ({ one, many }) => ({
  customer: one(users, {
    fields: [chatRooms.customerId],
    references: [users.id],
    relationName: "customerChatRooms",
  }),
  supportAgent: one(users, {
    fields: [chatRooms.supportAgentId],
    references: [users.id],
    relationName: "supportChatRooms",
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one, many }) => ({
  room: one(chatRooms, {
    fields: [chatMessages.roomId],
    references: [chatRooms.id],
  }),
  sender: one(users, {
    fields: [chatMessages.senderId],
    references: [users.id],
  }),
  attachments: many(chatAttachments),
}));

export const chatAttachmentsRelations = relations(chatAttachments, ({ one }) => ({
  message: one(chatMessages, {
    fields: [chatAttachments.messageId],
    references: [chatMessages.id],
  }),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  host: one(users, {
    fields: [properties.hostId],
    references: [users.id],
  }),
  bookings: many(bookings),
  reviews: many(propertyReviews),
  availability: many(propertyAvailability),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  property: one(properties, {
    fields: [bookings.propertyId],
    references: [properties.id],
  }),
  guest: one(users, {
    fields: [bookings.guestId],
    references: [users.id],
    relationName: "guestBookings",
  }),
  host: one(users, {
    fields: [bookings.hostId],
    references: [users.id],
    relationName: "hostBookings",
  }),
  reviews: many(propertyReviews),
}));

export const propertyReviewsRelations = relations(propertyReviews, ({ one }) => ({
  property: one(properties, {
    fields: [propertyReviews.propertyId],
    references: [properties.id],
  }),
  booking: one(bookings, {
    fields: [propertyReviews.bookingId],
    references: [bookings.id],
  }),
  guest: one(users, {
    fields: [propertyReviews.guestId],
    references: [users.id],
  }),
}));

export const propertyAvailabilityRelations = relations(propertyAvailability, ({ one }) => ({
  property: one(properties, {
    fields: [propertyAvailability.propertyId],
    references: [properties.id],
  }),
}));

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertInventoryAlertSchema = createInsertSchema(inventoryAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertChatAttachmentSchema = createInsertSchema(chatAttachments).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyReviewSchema = createInsertSchema(propertyReviews).omit({
  id: true,
  createdAt: true,
});

export const insertPropertyAvailabilitySchema = createInsertSchema(propertyAvailability).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InventoryAlert = typeof inventoryAlerts.$inferSelect;
export type InsertInventoryAlert = z.infer<typeof insertInventoryAlertSchema>;
export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatAttachment = typeof chatAttachments.$inferSelect;
export type InsertChatAttachment = z.infer<typeof insertChatAttachmentSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type PropertyReview = typeof propertyReviews.$inferSelect;
export type InsertPropertyReview = z.infer<typeof insertPropertyReviewSchema>;
export type PropertyAvailability = typeof propertyAvailability.$inferSelect;
export type InsertPropertyAvailability = z.infer<typeof insertPropertyAvailabilitySchema>;
