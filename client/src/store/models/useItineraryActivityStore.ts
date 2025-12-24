import { createModelStore } from '../createModelStore';
import type { ItineraryActivity } from '@shared/schema';

export const useItineraryActivityStore = createModelStore<ItineraryActivity>();
