import { createModelStore } from '../createModelStore';
import type { AffiliateConversion } from '@shared/schema';

export const useAffiliateConversionStore = createModelStore<AffiliateConversion>();
