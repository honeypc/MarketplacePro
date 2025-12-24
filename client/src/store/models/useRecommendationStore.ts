import { createModelStore } from '../createModelStore';
import type { Recommendation } from '@shared/schema';

export const useRecommendationStore = createModelStore<Recommendation>();
