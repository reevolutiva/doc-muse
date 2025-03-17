"use client"

import { Card } from "@/components/ui/card"
import { FileText, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/utils"

interface ProjectCardProps extends Project {
  onClick?: () => void
}

export function ProjectCard({
  title,
  type,
  progress,
  documentsCount,
  lastUpdate,
  status,
  onClick
}: ProjectCardProps) {
  return (
    <Card 
      className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            status === "completado" 
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          )}>
            {status === "completado" ? "Completed" : "In Progress"}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>{documentsCount} documents</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last update: {new Date(lastUpdate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
