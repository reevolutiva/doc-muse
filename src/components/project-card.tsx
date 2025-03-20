"use client"

import { Card } from "@/components/ui/card"
import { FileText, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  title: string
  type: string
  progress: number
  documentsCount: number
  lastUpdate: string
  status: "en-progreso" | "completado"
  onClick?: (project: ProjectCardProps) => void
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
      className="cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
      onClick={() => onClick?.({
        title,
        type,
        progress,
        documentsCount,
        lastUpdate,
        status
      })}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{type}</p>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs",
              status === "en-progreso"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            )}
          >
            {status === "en-progreso" ? "En progreso" : "Completado"}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progreso General</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{documentsCount} documentos</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Última actualización: {lastUpdate}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
