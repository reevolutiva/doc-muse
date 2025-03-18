"use client"

// ...existing code...

// Buscar las entradas del menú que tienen "Project Templates" y "Document Templates"
// y reemplazarlas por una única entrada "Templates"
export function MainNav() {
  // ...existing code...
  
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      
      <Link
        href="/projects"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Projects
      </Link>
      
      <Link
        href="/templates"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Templates
      </Link>
      
      {/* ...other navigation items... */}
    </nav>
  )
}
