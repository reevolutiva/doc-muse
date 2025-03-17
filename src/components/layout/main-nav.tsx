// Reemplaza las dos opciones separadas por una única opción "Templates"

// ...existing code...

// Busca entradas como estas:
// <Link href="/document-templates">Document Templates</Link>
// <Link href="/project-templates">Project Templates</Link>

// Y reemplázalas con:
<Link
  href="/templates"
  className={cn(
    "text-sm font-medium transition-colors hover:text-primary",
    pathname === "/templates" ? "text-primary" : "text-muted-foreground"
  )}
>
  Templates
</Link>

// ...existing code...
