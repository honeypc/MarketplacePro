import { createModelStore } from '../createModelStore';
import type { Product } from '@shared/schema';

export const useProductStore = createModelStore<Product>();
