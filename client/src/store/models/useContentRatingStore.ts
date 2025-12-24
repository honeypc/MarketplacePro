import { createModelStore } from '../createModelStore';
import type { ContentRating } from '@shared/schema';

export const useContentRatingStore = createModelStore<ContentRating>();
