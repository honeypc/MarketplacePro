// Authentication
export { useAuth } from './useAuth';

// Data fetching hooks
export { useProducts, useProduct, useCreateProduct, useUpdateProduct, useDeleteProduct } from './useProducts';
export { useCategories, useCategory, useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategories';
export { useCart, useAddToCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from './useCart';
export { useWishlist, useAddToWishlist, useRemoveFromWishlist, useIsInWishlist } from './useWishlist';
export { useOrders, useOrder, useCreateOrder, useUpdateOrderStatus } from './useOrders';
export { useProductReviews, useUserReviews, useCreateReview, useUpdateReview, useDeleteReview } from './useReviews';
export { useChatRooms, useChatRoom, useChatMessages, useCreateChatRoom, useCreateChatMessage, useCloseChatRoom, useMarkMessagesAsRead } from './useChat';
export { useInventoryAlerts, useStockMovements, useUpdateProductStock, useMarkAlertAsRead, useMarkAlertAsResolved, useSellerStats } from './useInventory';
export { useProperties, useSearchProperties, useProperty, useCreateProperty, useUpdateProperty, useDeleteProperty, usePropertiesByHost } from './useProperties';
export { useBookings, useBooking, useCreateBooking, useUpdateBooking, useCancelBooking } from './useBookings';
export { usePropertyReviews, useCreatePropertyReview } from './usePropertyReviews';
export { usePromotions, useValidatePromoCode, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from './usePromotions';
export { usePayments, usePayment, useCreatePayment, useUpdatePayment, useProcessPayment } from './usePayments';
export { useRoomAvailability, useCheckRoomAvailability, useUpdateRoomAvailability } from './useRoomAvailability';
export { useBookingHistory, useBookingDetails, useUpdateBookingStatus } from './useBookingHistory';
export { 
  useUserPreferences, 
  useUpdatePreferences, 
  useTrackInteraction, 
  usePersonalizedProducts, 
  usePersonalizedProperties, 
  usePersonalizedDestinations, 
  useGenerateRecommendations, 
  usePopularItems, 
  useTrendingItems, 
  useMarkRecommendationClicked, 
  useRecommendationData 
} from './useRecommendations';

// State management hooks
export { useCartStore } from '../store/useCartStore';
export { useWishlistStore } from '../store/useWishlistStore';
export { useUIStore } from '../store/useUIStore';
export { useSearchStore } from '../store/useSearchStore';
export { useChatStore } from '../store/useChatStore';

// Utility hooks
export { useLocalStorage } from './useLocalStorage';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useIntersectionObserver, useInfiniteScroll } from './useIntersectionObserver';
export { useWebSocket } from './useWebSocket';
export { useImageUpload } from './useImageUpload';
export { usePermissions } from './usePermissions';

// UI hooks (existing)
export { useMobile } from './use-mobile';
export { useToast } from './use-toast';

// Types
export type { Product, ProductFilters } from './useProducts';
export type { Category } from './useCategories';
export type { CartItem } from './useCart';
export type { WishlistItem } from './useWishlist';
export type { Order, OrderItem } from './useOrders';
export type { Review } from './useReviews';
export type { ChatRoom, ChatMessage } from './useChat';
export type { InventoryAlert, StockMovement } from './useInventory';
export type { UserRole, Permission } from './usePermissions';
export type { UploadedImage, UseImageUploadOptions } from './useImageUpload';
export type { WebSocketMessage, UseWebSocketOptions } from './useWebSocket';