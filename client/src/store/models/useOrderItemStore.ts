import { createModelStore } from '../createModelStore';
import type { OrderItem } from '@shared/schema';

export const useOrderItemStore = createModelStore<OrderItem>();
