"use client"

import { useState } from "react"
import { ProjectTemplateInfo } from "./project-template-info"

interface ProjectFormSectionProps {
  title: string
  status: string
  progress: number
  loading: boolean
  templateId?: string | null
  onSubmit: (e: React.FormEvent) => Promise<void>
  onTitleChange: (value: string) => void
  onStatusChange: (value: string) => void
  onProgressChange: (value: number) => void
  onDelete: () => void
}

export function ProjectFormSection({
  title,
  status,
  progress,
  loading,
  templateId,
  onSubmit,
  onTitleChange,
  onStatusChange,
  onProgressChange,
  onDelete
}: ProjectFormSectionProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-6 text-xl font-semibold">Project Data</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {templateId && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h4 className="text-sm font-medium text-blue-900">Project Type</h4>
            <ProjectTemplateInfo templateId={templateId} />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="en-progreso">En Progreso</option>
            <option value="completado">Completado</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Progress
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => onProgressChange(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 rounded-lg border border-red-600 px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
          >
            Delete Project
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
