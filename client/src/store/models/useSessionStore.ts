import { createModelStore } from '../createModelStore';
import type { Session } from '@shared/schema';

export const useSessionStore = createModelStore<Session>();
