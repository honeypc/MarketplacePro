import { createModelStore } from '../createModelStore';
import type { Notification } from '@shared/schema';

export const useNotificationStore = createModelStore<Notification>();
