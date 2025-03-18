# Arquitectura del Proyecto (Actualizada)

## Estructura General del Proyecto

```
doc-muse/
├── public/              # Archivos estáticos
├── src/                 # Código fuente principal
│   ├── api/             # Funciones y llamadas a API
│   ├── app/             # Rutas y páginas (Next.js App Router)
│   ├── components/      # Componentes React reutilizables
│   ├── contexts/        # Contextos para gestión de estado
│   ├── features/        # Módulos organizados por características
│   ├── hooks/           # Hooks personalizados
│   ├── lib/             # Utilidades, configuraciones y servicios
│   ├── styles/          # Estilos globales
│   ├── tests/           # Pruebas unitarias e integración
│   └── types/           # Tipos globales de TypeScript
├── Docs/                # Documentación del proyecto
├── scripts/             # Scripts de utilidad
├── supabase/            # Configuración de Supabase
│   ├── functions/       # Funciones Edge de Supabase
│   ├── migrations/      # Scripts SQL para inicialización
│   └── config.toml      # Configuración del proyecto
├── __mocks__/           # Mocks para pruebas
├── __tests__/           # Tests estructurados
└── project-templates/   # Plantillas de proyectos (legacy)
```

## Directorios Principales (Actualizados)

### 📁 `src/` 
Documentación en (documentación en `src/src_docs.md`)
Código fuente principal de la aplicación:

#### 🔸 `api/`
Funciones para interactuar con APIs externas o servicios:
- `templateApi.ts`: Funciones para gestionar plantillas (obtener, guardar, actualizar)

#### 🔸 `app/`
Documentación en `src/app/font_docs.md`
Implementa el App Router de Next.js 13+:
- `api/`: Endpoints RESTful con Route Handlers (documentación en `src/app/api.md`)
  - `tables/schema`: Información sobre esquemas de tablas en Supabase
  - `templates/`: CRUD completo para plantillas
  - `templates/visual`: API para plantillas visuales con React Flow
- `block-editor/`: Editor visual de bloques basado en React Flow
- `chat/`: Funcionalidad de chat (en desarrollo)
- `dashboard/`: Panel de control con estadísticas
- `documents/`: Gestión y visualización de documentos
- `projects/`: Administración de proyectos
- `templates/`: Sistema unificado de gestión de plantillas
  - `visual-editor/`: Editor visual basado en React Flow
  - `editor/`: Editor clásico de plantillas
- `document-templates/`: (Redirección a /templates)
- `project-templates/`: (Redirección a /templates?tab=projects)
- `layout.tsx`: Layout principal con navegación
- `page.tsx`: Página de inicio
- `error.tsx`: Manejo centralizado de errores
- `health.ts`: Endpoint para verificación de salud

#### 🔸 `components/`
Componentes React reutilizables:
- `ui/`: Componentes base (botones, inputs, cards)
- `navigation/`: Componentes de navegación
- `template-manager/`: Componentes para gestión visual de plantillas
- `block-editor/`: Editor de bloques de documentos
- `document-editor/`: Editor de documentos completos
- `document-config/`: Configuración de documentos
- `project-edit/`: Componentes para edición de proyectos
- `project-template/`: Componentes para gestión de plantillas de proyecto

#### 🔸 `contexts/`
Proveedores de contexto para estado global:
- `DocumentContext.tsx`: Gestión del estado de documentos

#### 🔸 `features/`
Código organizado por características:
- `documents/`: Gestión completa de documentos
  - `components/`: Componentes específicos
  - `hooks/`: Hooks relacionados con documentos
  - `services/`: Servicios para operaciones
  - `types/`: Tipos específicos
  - `utils/`: Utilidades de manipulación

#### 🔸 `hooks/`
Hooks personalizados:
- `useAuth.ts`: Gestión de autenticación
- `useProjects.ts`: Operaciones CRUD para proyectos
- `useTemplates.ts`: Gestión de plantillas
- `useTemplateLoader.ts`: Carga de datos de plantillas
- `useProjectState.ts`: Estado global de proyectos
- `useDependencyManagement.ts`: Manejo de dependencias

#### 🔸 `lib/`
Utilidades y configuraciones:
- `supabase.ts`: Cliente y configuración de Supabase
- `supabase.types.ts`: Tipos generados de la base de datos
- `constants/`: Constantes de la aplicación
  - `document-types.ts`: Definición de tipos de documento
- `services/`: Servicios para comunicación con backend
  - `project-service.ts`: Operaciones para proyectos
  - `document-service.ts`: Operaciones para documentos
  - `project-template-service.ts`: Servicios para plantillas
- `types/`: Definiciones de tipos
  - `document.ts`: Tipos para documentos
  - `project-template.ts`: Tipos para plantillas de proyecto
  - `templates/`: Tipos para plantillas
  - `edge-function.ts`: Tipos para funciones edge
- `utils/`: Funciones de utilidad
  - `error-handler.ts`: Manejo centralizado de errores
  - `tableSchema.ts`: Utilidades para esquemas de tablas
  - `utils.ts`: Utilidades generales

#### 🔸 `styles/`
Estilos globales:
- `globals.css`: Estilos globales y configuración Tailwind

### 📁 `Docs/`
Documentación del proyecto:
- `arquitectura.md`: Descripción de la arquitectura
- `features/`: Documentación de características
  - `rfp_refactor_performance.md`: Requisitos para refactorización
- `testing/`: Documentación de pruebas
- `Prompts/`: Instrucciones para agentes IA
- `bug_fixer.md`: Guía para resolución de errores
- `bug_vitacora.md`: Registro de problemas y soluciones

### 📁 `supabase/`
Configuración y funciones de Supabase:
- `functions/`: Funciones Edge (serverless)
- `migrations/`: Scripts SQL para inicialización
- `config.toml`: Configuración del proyecto

## Archivos de Configuración (Actualizados)
- `next.config.js`: Configuración de Next.js
- `package.json`: Dependencias y scripts
- `docker-compose.yml`: Configuración para desarrollo con Docker
- `Dockerfile`: Instrucciones para construcción de imagen
- `jest.config.js`: Configuración para pruebas unitarias
- `jest.setup.js`: Configuración para entorno de pruebas
- `tailwind.config.ts`: Configuración de Tailwind CSS
- `components.json`: Configuración de componentes UI
- `.env.local`: Variables de entorno locales

## Tecnologías Principales
- **Frontend**: Next.js 13+ con App Router y React
- **Tipado**: TypeScript para seguridad de tipos
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (autenticación, base de datos, almacenamiento)
- **Editor Visual**: React Flow (xyflow) para plantillas visuales
- **Testing**: Jest con React Testing Library
- **Contenerización**: Docker para desarrollo y despliegue

## Flujo de Trabajo
1. Los componentes de UI interactúan con hooks personalizados
2. Los hooks utilizan servicios para comunicarse con Supabase
3. Los servicios gestionan operaciones CRUD y manejan errores
4. Los contextos proporcionan estado global cuando es necesario
5. Las APIs en Next.js Route Handlers proporcionan endpoints para operaciones del servidor

## Características Principales
1. **Sistema de Plantillas**
   - Editor visual basado en nodos con React Flow
   - Mapeo de campos a bases de datos
   - Validación de dependencias
   - Gestión de bloques y prompts

2. **Editor de Documentos**
   - Sistema de bloques personalizables
   - Generación de contenido con IA
   - Previsualización instantánea

3. **Gestión de Proyectos**
   - Organización jerárquica de documentos
   - Plantillas de proyecto configurables

## Archivos y Componentes Obsoletos o Duplicados

Esta sección identifica componentes y archivos que están duplicados, obsoletos o en ubicaciones incorrectas:

### Componentes Duplicados
- `/project-templates/` y `/templates/`: Contienen componentes con funcionalidad solapada según `Docs/features/informederevisión_templates.md`. La nueva implementación con React Flow está reemplazando gradualmente estos componentes.

### Archivos No Migrados
- `src/components/BlockForm.jsx`: Aún no migrado a TypeScript
- `src/api/templateApi.js`: Existe junto a su versión migrada `templateApi.ts`
- `src/components/template-editor/Palette.js`: Componente en JavaScript que debería migrarse a TypeScript

### Archivos Conflictivos
- `jest.config.cjs` y `jest.config.js`: Configuraciones duplicadas para Jest (según `Docs/testing/testing-inform.md`)
- `src/components/Palette.tsx` y `src/components/template-editor/Palette.js`: Implementaciones duplicadas para el mismo componente

## Próximas Tareas de Refactorización
1. Completar migración a TypeScript de todos los componentes en JavaScript
2. Consolidar componentes duplicados entre `/project-templates/` y `/templates/`
3. Unificar documentación dispersa en múltiples archivos
4. Eliminar archivos de respaldo o versiones antiguas
5. Estructurar consistentemente las pruebas para reflejar la estructura del código fuente
