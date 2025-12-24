import { createModelStore } from '../createModelStore';
import type { ItineraryDay } from '@shared/schema';

export const useItineraryDayStore = createModelStore<ItineraryDay>();
