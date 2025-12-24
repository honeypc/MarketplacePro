import { createModelStore } from '../createModelStore';
import type { SavedProduct } from '@shared/schema';

export const useSavedProductStore = createModelStore<SavedProduct>();
