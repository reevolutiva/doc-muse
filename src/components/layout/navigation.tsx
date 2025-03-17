"use client"

// ...existing code...

// Buscar las entradas del menú que tienen "Project Templates" y "Document Templates"
// y reemplazarlas por una única entrada "Templates"
export function MainNav() {
  // ...existing code...
  
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {/* ...existing code... */}
      
      <Link
        href="/templates"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Templates
      </Link>
      
      {/* Eliminar o comentar las entradas individuales:
      <Link
        href="/document-templates"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Document Templates
      </Link>
      
      <Link
        href="/project-templates"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Project Templates
      </Link>
      */}
      
      {/* ...existing code... */}
    </nav>
  )
}
