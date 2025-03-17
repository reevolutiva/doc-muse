"use client"

// ...existing code...

export function Sidebar() {
  // ...existing code...
  
  return (
    <div className="...">
      {/* ...existing code... */}
      
      <div className="space-y-1">
        {/* ...existing code... */}
        
        {/* Reemplazar entradas separadas con una sola */}
        <Link href="/templates" className="...">
          Templates
        </Link>
        
        {/* Eliminar o comentar:
        <Link href="/document-templates" className="...">
          Document Templates
        </Link>
        
        <Link href="/project-templates" className="...">
          Project Templates
        </Link>
        */}
        
        {/* ...existing code... */}
      </div>
      
      {/* ...existing code... */}
    </div>
  )
}
