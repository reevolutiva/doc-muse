import { z } from 'zod'
import type { FieldErrors } from 'react-hook-form'

export const templateValidationSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  content: z.any()
})

export type ValidationErrors = FieldErrors<z.infer<typeof templateValidationSchema>> & {
  validation?: string;
}

export interface FormValidation {
  errors: ValidationErrors;
  validateField: (field: string, value: any) => boolean;
  validateForm: () => boolean;
}
