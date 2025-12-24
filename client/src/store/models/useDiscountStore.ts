import { createModelStore } from '../createModelStore';
import type { Discount } from '@shared/schema';

export const useDiscountStore = createModelStore<Discount>();
