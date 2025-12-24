import { createModelStore } from '../createModelStore';
import type { FormField } from '@shared/schema';

export const useFormFieldStore = createModelStore<FormField>();
