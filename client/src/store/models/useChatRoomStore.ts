import { createModelStore } from '../createModelStore';
import type { ChatRoom } from '@shared/schema';

export const useChatRoomStore = createModelStore<ChatRoom>();
