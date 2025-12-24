import { createModelStore } from '../createModelStore';
import type { Booking } from '@shared/schema';

export const useBookingStore = createModelStore<Booking>();
