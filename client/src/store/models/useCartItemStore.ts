import { createModelStore } from '../createModelStore';
import type { CartItem } from '@shared/schema';

export const useCartItemStore = createModelStore<CartItem>();
