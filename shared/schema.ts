// Export Prisma types for shared use
export type {
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
  PropertyAvailability,
  RoomAvailability,
  Payment,
  Itinerary,
  ItineraryDay,
  ItineraryActivity,
  Session,
  Prisma
} from "@prisma/client";

// Re-export input types from storage-prisma
export type {
  UpsertUser,
  InsertCategory,
  InsertProduct,
  InsertReview,
  InsertCartItem,
  InsertWishlistItem,
  InsertOrder,
  InsertOrderItem,
  InsertChatRoom,
  InsertChatMessage,
  InsertProperty,
  InsertBooking,
  InsertPropertyReview,
  InsertPayment,
  InsertItinerary
} from "../server/storage-prisma";