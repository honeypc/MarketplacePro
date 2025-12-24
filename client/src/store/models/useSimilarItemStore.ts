import { createModelStore } from '../createModelStore';
import type { SimilarItem } from '@shared/schema';

export const useSimilarItemStore = createModelStore<SimilarItem>();
