import { createModelStore } from '../createModelStore';
import type { RecentlyViewedProduct } from '@shared/schema';

export const useRecentlyViewedProductStore = createModelStore<RecentlyViewedProduct>();
