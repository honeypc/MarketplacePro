import { createModelStore } from '../createModelStore';
import type { User } from '@shared/schema';

export const useUserStore = createModelStore<User>();
