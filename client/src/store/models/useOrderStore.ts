import { createModelStore } from '../createModelStore';
import type { Order } from '@shared/schema';

export const useOrderStore = createModelStore<Order>();
