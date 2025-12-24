import { createModelStore } from '../createModelStore';
import type { ChatMessage } from '@shared/schema';

export const useChatMessageStore = createModelStore<ChatMessage>();
