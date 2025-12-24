import { createModelStore } from '../createModelStore';
import type { Itinerary } from '@shared/schema';

export const useItineraryStore = createModelStore<Itinerary>();
