import { createModelStore } from '../createModelStore';
import type { Category } from '@shared/schema';

export const useCategoryStore = createModelStore<Category>();
