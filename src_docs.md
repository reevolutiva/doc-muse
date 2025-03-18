# Documentación de la Carpeta `src`

...existing code...

### 📁 `app/`
Implementa el App Router de Next.js 13+, donde cada carpeta representa una ruta en la aplicación:

- **api/**: Endpoints RESTful con Next.js Route Handlers
  - **tables/schema/**: Información sobre esquemas de tablas
  - **templates/**: CRUD completo para gestión de plantillas
  - **templates/[id]/**: Operaciones para plantillas específicas
  - **templates/visual/**: Endpoints para plantillas visuales

- **block-editor/**: Editor interactivo visual de bloques basado en React Flow
- **chat/**: Funcionalidad de chat (en desarrollo)
- **dashboard/**: Panel de control con estadísticas y accesos rápidos
- **documents/**: Gestión y visualización de documentos
- **projects/**: Administración de proyectos y documentos asociados
- **templates/**: Sistema unificado de gestión de plantillas con editor visual

- **error.tsx**: Manejo centralizado de errores
- **layout.tsx**: Layout principal con navegación y estructura común
- **not-found.tsx**: Página personalizada para rutas no encontradas
- **page.tsx**: Página de inicio con redirección inteligente

Ver [documentación detallada de app](./app/font_docs.md)

...existing code...
