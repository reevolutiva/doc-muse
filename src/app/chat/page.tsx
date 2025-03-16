"use client"

import { useState, useEffect } from 'react'

export default function ChatPage() {
  // Usar un estado para manejar el montaje del componente
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Renderizar un div vacío sin className durante SSR para evitar el error
  if (!isMounted) {
    return <div data-nextjs-chat-placeholder></div>
  }
  
  // Una vez montado en el cliente, renderizar el contenido real
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Chat</h1>
      <p className="text-gray-600">
        Esta funcionalidad está en desarrollo. Pronto podrás chatear con tus documentos.
      </p>
    </div>
  )
}
