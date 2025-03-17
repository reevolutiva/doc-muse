### Directorios Principales
- **src/**: Código fuente principal de la aplicación
  - **app/**: Rutas y páginas de la aplicación utilizando Next.js App Router
    - **templates/**: Sistema de gestión de plantillas
    - **projects/**: Gestión de proyectos y documentos
    - **documents/**: Editor y visualización de documentos
    - **api/**: Endpoints de la API
  - **components/**: Componentes React reutilizables
    - **block-editor/**: Editor visual de bloques de contenido
    - **template-manager/**: Gestión visual de plantillas
    - **document-editor/**: Editor colaborativo de documentos
    - **ui/**: Componentes base reutilizables
    - **shared/**: Componentes comunes entre módulos
  - **hooks/**: Custom hooks para lógica compartida
    - **useTemplateManager/**: Gestión de estado de plantillas
    - **useDocumentEditor/**: Lógica del editor de documentos
    - **useProjectState/**: Estado global de proyectos
  - **lib/**: Funciones de utilidad y configuración
    - **supabase.ts**: Cliente y configuración de Supabase
    - **types/**: Definiciones de tipos TypeScript
    - **utils/**: Funciones de utilidad general
    - **services/**: Servicios para comunicación con backend
  - **styles/**: Estilos globales con Tailwind CSS

- **supabase/**: Configuración y funciones relacionadas con Supabase
  - **functions/**: Funciones Edge de Supabase (serverless)
  - **migrations/**: Scripts SQL para la inicialización de la base de datos
  - **config.toml**: Configuración del proyecto Supabase

- **public/**: Archivos estáticos accesibles públicamente
- **Docs/**: Documentación del proyecto
- **scripts/**: Scripts de utilidad para desarrollo y despliegue

### Archivos de Configuración
- **next.config.js**: Configuración de Next.js
- **package.json**: Dependencias y scripts del proyecto
- **docker-compose.yml** y **Dockerfile**: Configuración para despliegue con Docker
- **tailwind.config.ts**: Configuración de Tailwind CSS
- **.env.local**: Variables de entorno locales (gitignored)

### Arquitectura Frontend
- **Framework**: Next.js 14 con App Router
- **State Management**: React Hooks y Context
- **Styling**: Tailwind CSS con componentes personalizados
- **Editor Visual**: React Flow para edición de plantillas
- **Editor de Documentos**: TipTap con extensiones personalizadas
- **Gestión de Formularios**: React Hook Form con Zod
- **Comunicación Backend**: Supabase Client SDK

### Características Principales
1. **Sistema de Plantillas**
   - Editor visual basado en nodos
   - Mapeo de campos a bases de datos
   - Validación de dependencias
   - Historial de versiones

2. **Editor de Documentos**
   - Edición colaborativa en tiempo real
   - Sistema de bloques personalizables
   - Generación de contenido con IA
   - Control de versiones

3. **Gestión de Proyectos**
   - Organización jerárquica de documentos
   - Seguimiento de progreso
   - Sistema de permisos y roles
   - Plantillas de proyecto

### Flujo de Datos
1. La interfaz de usuario se comunica con los servicios mediante hooks personalizados
2. Los servicios utilizan el SDK de Supabase para operaciones CRUD
3. Los cambios en tiempo real se manejan mediante suscripciones de Supabase
4. El estado local se gestiona con React Context y hooks personalizados
