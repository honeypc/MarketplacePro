import { createModelStore } from '../createModelStore';
import type { UserPreferences } from '@shared/schema';

export const useUserPreferencesStore = createModelStore<UserPreferences>();
