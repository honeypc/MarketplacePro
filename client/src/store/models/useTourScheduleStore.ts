import { createModelStore } from '../createModelStore';
import type { TourSchedule } from '@shared/schema';

export const useTourScheduleStore = createModelStore<TourSchedule>();
