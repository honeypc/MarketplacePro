import { createModelStore } from '../createModelStore';
import type { RoomAvailability } from '@shared/schema';

export const useRoomAvailabilityStore = createModelStore<RoomAvailability>();
