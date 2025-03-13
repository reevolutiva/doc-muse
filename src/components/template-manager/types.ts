export interface Template {
  id: string
  title: string
  description: string | null
  content: string
  config?: Record<string, unknown>
  categories?: string[]
  created_at: string
  updated_at: string
}

export interface PaginationState {
  page: number
  limit: number
  total: number
}
