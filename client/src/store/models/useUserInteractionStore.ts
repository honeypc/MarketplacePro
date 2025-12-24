import { createModelStore } from '../createModelStore';
import type { UserInteraction } from '@shared/schema';

export const useUserInteractionStore = createModelStore<UserInteraction>();
