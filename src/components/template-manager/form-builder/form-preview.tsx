"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { FormField } from './form-builder'

interface FormPreviewProps {
  fields: FormField[]
}

export function FormPreview({ fields }: FormPreviewProps) {
  const schema = z.object(
    fields.reduce<Record<string, z.ZodType>>((acc, field) => {
      let validator: z.ZodType;

      switch (field.type) {
        case 'number':
          validator = z.coerce.number()
            .min(field.validation?.min ?? -Infinity)
            .max(field.validation?.max ?? Infinity);
          break;
        case 'checkbox':
          validator = z.boolean();
          break;
        case 'date':
          validator = z.string().datetime();
          break;
        default:
          validator = z.string();
          if (field.validation?.pattern) {
            validator = validator.regex(
              new RegExp(field.validation.pattern),
              field.validation.message || 'Invalid format'
            );
          }
      }

      acc[field.id] = field.required ? validator : validator.optional();
      return acc;
    }, {})
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: any) => {
    console.log('Form data:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'text' && (
            <input
              type="text"
              {...register(field.id, { required: field.required })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )}

          {field.type === 'number' && (
            <input
              type="number"
              {...register(field.id)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )}

          {field.type === 'date' && (
            <input
              type="date"
              {...register(field.id)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )}

          {field.type === 'select' && (
            <select
              {...register(field.id)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {field.type === 'checkbox' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(field.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{field.label}</span>
            </div>
          )}

          {field.type === 'radio' && (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={option}
                    {...register(field.id)}
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{option}</span>
                </div>
              ))}
            </div>
          )}

          {errors[field.id] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[field.id]?.message as string}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit Form
      </button>
    </form>
  )
}
