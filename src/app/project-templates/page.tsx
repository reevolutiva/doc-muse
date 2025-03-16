"use client"

import { useState, useEffect } from 'react'
import { ProjectTemplateManager } from '@/components/project-template/project-template-manager'

export default function ProjectTemplatesPage() {
  const [isMounted, setIsMounted] = useState(false)

  // Solo ejecutar en el cliente después del montaje inicial
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Renderizar un contenedor simple durante SSR
  if (!isMounted) {
    return <div className="container mx-auto p-8 max-w-7xl"></div>
  }

  // Renderizar el componente completo solo en el cliente
  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <ProjectTemplateManager />
    </div>
  )
}