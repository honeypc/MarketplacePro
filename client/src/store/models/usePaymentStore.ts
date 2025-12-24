import { createModelStore } from '../createModelStore';
import type { Payment } from '@shared/schema';

export const usePaymentStore = createModelStore<Payment>();
