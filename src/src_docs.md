# Documentación de la Carpeta `src`

Esta carpeta es el corazón de la aplicación DocMuse (Kimfe), donde reside todo el código fuente. A continuación, se detalla la estructura y propósito de cada subcarpeta y componente principal.

## Estructura General

```
src/
├── api/              # Funciones y llamadas a API
├── app/              # Next.js App Router (páginas y rutas)
├── components/       # Componentes React reutilizables
├── contexts/         # Contextos de React para gestión de estado
├── features/         # Módulos organizados por características
├── hooks/            # Hooks personalizados de React
├── lib/              # Utilidades, configuraciones y servicios
├── styles/           # Estilos globales (CSS, Tailwind)
├── tests/            # Pruebas unitarias e integración
└── types/            # Tipos globales de TypeScript
```

## Componentes Principales

### 📁 `api/`
Contiene funciones para interactuar con APIs externas o servicios:
- `templateApi.ts`: Funciones para gestionar plantillas (obtener, guardar, actualizar)

### 📁 `app/`
Implementa el App Router de Next.js 13+, donde cada carpeta representa una ruta:
- Ver [documentación detallada de app](./app/font_docs.md)

### 📁 `components/`
Componentes React reutilizables organizados por funcionalidad:
- `ui/`: Componentes base como botones, inputs, cards
- `navigation/`: Componentes de navegación (navbar)
- `project-edit/`: Componentes para edición de proyectos
- `project-template/`: Componentes para gestión de plantillas de proyecto
- `template-manager/`: Componentes para administrar plantillas
- `block-editor/`: Editor de bloques de documentos
- `document-editor/`: Editor de documentos completos
- `document-config/`: Configuración de documentos

### 📁 `contexts/`
Proveedores de contexto para estado global:
- `DocumentContext.tsx`: Gestión del estado de documentos

### 📁 `features/`
Código organizado por características/funcionalidades:
- `documents/`: Funcionalidad completa de gestión de documentos
  - `components/`: Componentes específicos
  - `hooks/`: Hooks relacionados con documentos
  - `services/`: Servicios para operaciones con documentos
  - `types/`: Tipos específicos
  - `utils/`: Utilidades para manipulación de documentos

### 📁 `hooks/`
Hooks personalizados para reutilizar lógica:
- `useAuth.ts`: Gestión de autenticación
- `useProjects.ts`: Operaciones CRUD para proyectos
- `useTemplates.ts`: Gestión de plantillas
- `useTemplateLoader.ts`: Carga de datos de plantillas
- `useProjectState.ts`: Estado global de proyectos
- `useDependencyManagement.ts`: Manejo de dependencias entre plantillas

### 📁 `lib/`
Utilidades y configuraciones compartidas:
- `supabase.ts`: Cliente y configuraciones de Supabase
- `supabase.types.ts`: Tipos generados de la base de datos Supabase
- `constants/`: Constantes de la aplicación
- `services/`: Servicios para comunicación con backend
  - `project-service.ts`: Operaciones CRUD para proyectos
  - `document-service.ts`: Operaciones para documentos
  - `project-template-service.ts`: Servicios para plantillas de proyectos
- `types/`: Definiciones de tipos
  - `document.ts`: Tipos relacionados con documentos
  - `templates/`: Tipos relacionados con plantillas
  - `edge-function.ts`: Tipos para funciones edge de Supabase
- `utils/`: Funciones de utilidad
  - `error-handler.ts`: Manejo centralizado de errores
  - `utils.ts`: Utilidades generales

### 📁 `styles/`
Estilos globales de la aplicación:
- `globals.css`: Estilos globales y configuración de Tailwind

## Tecnologías Principales

- **Frontend**: Next.js 13+ con React y TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (autenticación, base de datos, almacenamiento)
- **Editor Visual**: React Flow (xyflow) para edición visual de plantillas
- **UI Components**: Combinación de componentes personalizados y Radix UI
- **Estado**: React Context y Hooks personalizados

## Flujo de Datos

1. Los componentes de UI interactúan con hooks personalizados
2. Los hooks utilizan servicios para comunicarse con Supabase
3. Los servicios gestionan operaciones CRUD y manejan errores
4. Los contextos proporcionan estado global cuando es necesario

## Integración con Supabase

La aplicación utiliza Supabase como backend, integrándose a través de:
- Cliente de Supabase en `lib/supabase.ts`
- Tipos generados en `lib/supabase.types.ts`
- Servicios específicos que interactúan con Supabase en `lib/services/`
- Autenticación y gestión de sesiones mediante hooks personalizados

## Convenciones de Código

- Componentes de página en `app/`
- Componentes reutilizables en `components/`
- Funcionalidades organizadas por características en `features/`
- Utilidades y servicios compartidos en `lib/`
- Hooks personalizados en `hooks/` o dentro de `features/`
