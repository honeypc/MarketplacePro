import { createModelStore } from '../createModelStore';
import type { ShippingAddress } from '@shared/schema';

export const useShippingAddressStore = createModelStore<ShippingAddress>();
