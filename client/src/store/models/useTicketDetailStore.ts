import { createModelStore } from '../createModelStore';
import type { TicketDetail } from '@shared/schema';

export const useTicketDetailStore = createModelStore<TicketDetail>();
