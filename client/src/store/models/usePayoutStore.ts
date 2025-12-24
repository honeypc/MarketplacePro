import { createModelStore } from '../createModelStore';
import type { Payout } from '@shared/schema';

export const usePayoutStore = createModelStore<Payout>();
