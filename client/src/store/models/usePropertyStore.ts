import { createModelStore } from '../createModelStore';
import type { Property } from '@shared/schema';

export const usePropertyStore = createModelStore<Property>();
