import { createModelStore } from '../createModelStore';
import type { TourBooking } from '@shared/schema';

export const useTourBookingStore = createModelStore<TourBooking>();
