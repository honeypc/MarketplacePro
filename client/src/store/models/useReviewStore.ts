import { createModelStore } from '../createModelStore';
import type { Review } from '@shared/schema';

export const useReviewStore = createModelStore<Review>();
