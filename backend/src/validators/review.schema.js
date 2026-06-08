import { z } from 'zod';
import { ALLOWED_LANGUAGES, CODE_MAX_LENGTH } from '../../../Utils/languages.js';

export const reviewSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required.')
    .max(CODE_MAX_LENGTH, `Code exceeds the ${CODE_MAX_LENGTH.toLocaleString()}-character limit.`),
  language: z.enum(ALLOWED_LANGUAGES, {
    errorMap: () => ({ message: 'Unsupported language.' }),
  }),
});
