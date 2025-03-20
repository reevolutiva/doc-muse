import { z } from 'zod'
import type { FieldErrors } from 'react-hook-form'

export const templateFormSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  content: z.any()
})

export type TemplateFormData = z.infer<typeof templateFormSchema>

export interface FormErrors extends FieldErrors<TemplateFormData> {
  validation?: string
}
