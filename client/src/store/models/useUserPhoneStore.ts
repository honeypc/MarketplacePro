import { createModelStore } from '../createModelStore';
import type { UserPhone } from '@shared/schema';

export const useUserPhoneStore = createModelStore<UserPhone>();
