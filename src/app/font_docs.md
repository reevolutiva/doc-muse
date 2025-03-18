# Documentación de la Carpeta `app`

Esta carpeta implementa el App Router de Next.js 13+, donde cada subcarpeta representa una ruta en la aplicación DocMuse. A continuación, se detalla la estructura y propósito de cada componente.

## Estructura General

```
app/
├── api/                    # API endpoints (Next.js Route Handlers)
│   ├── tables/             # Endpoints para gestión de tablas
│   ├── templates/          # Endpoints para gestión de plantillas
│   │   ├── [id]/           # Operaciones por ID de plantilla
│   │   │   ├── dependencies/  # Gestión de dependencias
│   │   │   └── documents/  # Documentos asociados
│   │   └── visual/         # API para templates visuales
│   └── ...
├── block-editor/           # Editor visual de bloques
├── chat/                   # Funcionalidad de chat (en desarrollo)
├── dashboard/              # Panel de control principal
├── document-templates/     # Redirección a /templates
├── documents/              # Gestión de documentos
│   └── view/               # Visualización de documentos
├── project-templates/      # Redirección a /templates?tab=projects
├── projects/               # Gestión de proyectos
│   ├── [id]/               # Vista y edición de proyecto específico
│   └── new/                # Creación de nuevo proyecto
├── templates/              # Gestión unificada de plantillas
│   ├── visual-editor/      # Editor visual de plantillas
│   └── editor/             # Editor clásico de plantillas
│       └── [id]/           # Edición de plantilla específica
├── error.tsx               # Página de manejo de errores
├── health.ts               # Endpoint para verificación de salud
├── layout.tsx              # Layout principal de la aplicación
├── not-found.tsx           # Página para rutas no encontradas
└── page.tsx                # Página de inicio
```

## Componentes Principales

### 📁 `/api`
Implementa endpoints RESTful siguiendo los estándares de Next.js Route Handlers:

- **tables/schema**: Proporciona información sobre esquemas de tablas en Supabase
- **templates**: CRUD completo para gestión de plantillas
  - GET: Obtiene lista filtrada de plantillas
  - POST: Crea nueva plantilla
- **templates/[id]**: Operaciones para plantilla específica
  - GET: Obtiene detalles de una plantilla
  - PUT: Actualiza una plantilla
  - DELETE: Elimina una plantilla
- **templates/[id]/dependencies**: Gestión de dependencias entre plantillas
- **templates/visual**: API específica para plantillas visuales (React Flow)

### 📁 `/block-editor`
Editor interactivo para la creación visual de bloques de contenido:
- Interfaz basada en React Flow (xyflow)
- Creación de nodos y conexiones
- Configuración de propiedades de bloques
- Mapeo de campos a la base de datos

### 📁 `/dashboard`
Panel de control principal con:
- Resumen de documentos recientes
- Estadísticas de uso
- Acceso rápido a funcionalidades principales

### 📁 `/documents` y `/documents/view`
Sistema de gestión y visualización de documentos:
- Visualización de contenido con DocumentEditor
- Navegación entre proyectos y documentos
- Manejo de estados de carga y errores

### 📁 `/projects` y `/projects/[id]`
Gestión completa de proyectos:
- Listado y búsqueda de proyectos
- Creación de nuevos proyectos
- Edición de proyectos existentes
- Asociación con documentos

### 📁 `/templates` y `/templates/visual-editor`
Centro unificado para gestión de plantillas:
- Sistema de pestañas para plantillas de documentos y proyectos
- Editor visual basado en React Flow para creación intuitiva
- Validación de estructuras y dependencias
- Tutoriales interactivos para nuevos usuarios

## Patrones de Implementación

### Autenticación y Protección de Rutas
Cada sección principal (`/projects`, `/templates`, etc.) implementa:
- Verificación de sesión mediante `createServerComponentClient`
- Redirección a la página principal si no hay sesión activa
- Layout compartido con padding para la navegación

### Manejo de Estados y Carga
Componentes client-side implementan:
- Estados de carga con animaciones apropiadas
- Manejo de errores con mensajes descriptivos
- Redirecciones automáticas cuando es necesario

### Integración con Supabase
Las APIs utilizan:
- Cliente de Supabase para operaciones CRUD
- Manejo consistente de errores
- Respuestas JSON estandarizadas

## Mejores Prácticas

1. **Componentes Cliente/Servidor**: Separación clara con directivas "use client" cuando es necesario
2. **Manejo de Errores**: Implementación de páginas de error y fallbacks
3. **Loading States**: Estados de carga visibles para mejorar la experiencia de usuario
4. **Redirecciones**: Consolidación de rutas duplicadas (document-templates → templates)
5. **Layouts**: Uso de layouts compartidos para mantener coherencia visual
