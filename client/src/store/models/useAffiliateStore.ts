import { createModelStore } from '../createModelStore';
import type { Affiliate } from '@shared/schema';

export const useAffiliateStore = createModelStore<Affiliate>();
