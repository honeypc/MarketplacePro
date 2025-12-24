import { createModelStore } from '../createModelStore';
import type { PropertyAvailability } from '@shared/schema';

export const usePropertyAvailabilityStore = createModelStore<PropertyAvailability>();
