"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false)

  // Ejecutar solo en el cliente después del montaje inicial
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Renderizar una versión básica durante SSR
  if (!isMounted) {
    return (
      <div className="container mx-auto p-8 max-w-7xl min-h-[70vh] flex flex-col items-center justify-center">
        <h2>Not Found</h2>
      </div>
    )
  }

  // Renderizar el contenido completo con estilos solo en el cliente
  return (
    <div className="container mx-auto p-8 max-w-7xl min-h-[70vh] flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Return Home
      </Link>
    </div>
  )
}
