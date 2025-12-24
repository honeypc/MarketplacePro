import { createModelStore } from '../createModelStore';
import type { WishlistItem } from '@shared/schema';

export const useWishlistItemStore = createModelStore<WishlistItem>();
