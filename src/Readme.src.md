# Documentación de la Carpeta `src`

## Introducción

La carpeta `src` es el núcleo central del proyecto Doc-Muse, donde reside todo el código fuente de la aplicación. Este documento proporciona una guía completa de su estructura, componentes principales y cómo utilizarlos correctamente.

## Estructura General

La carpeta `src` está organizada siguiendo un patrón modular que facilita el mantenimiento y escalabilidad del código:

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
- [`templateApi.ts`](src/api/templateApi.ts): Funciones para gestionar plantillas (obtener, guardar, actualizar)
- [`templateApi.js`](src/api/templateApi.js): Versión legacy que está siendo migrada a TypeScript

### 📁 `app/`
Implementa el App Router de Next.js 13+, donde cada carpeta representa una ruta:
- **api/**: Endpoints RESTful con Route Handlers
  - **tables/schema/**: Información sobre esquemas de tablas
  - **templates/**: CRUD completo para plantillas
  - **templates/visual/**: API para plantillas visuales con React Flow
- **dashboard/**: Panel de control con estadísticas
- **documents/**: Gestión y visualización de documentos
- **projects/**: Administración de proyectos
- **templates/**: Sistema unificado de gestión de plantillas
  - **visual-editor/**: Editor visual basado en React Flow
  - **editor/**: Editor clásico de plantillas
- **layout.tsx**: Layout principal con navegación
- **page.tsx**: Página de inicio
- **error.tsx**: Manejo centralizado de errores

### 📁 `components/`
Componentes React reutilizables organizados por funcionalidad:
- **ui/**: Componentes base como botones, inputs, cards
- **navigation/**: Componentes de navegación (navbar)
- **template-editor/**: Componentes para el editor visual de plantillas
  - [`TemplateCanvas.tsx`](src/components/template-editor/TemplateCanvas.tsx): Canvas principal con React Flow
  - [`Palette.js`](src/components/template-editor/Palette.js): Bloques/nodos disponibles
  - [`PropertiesPanel.tsx`](src/components/template-editor/PropertiesPanel.tsx): Panel de edición de propiedades
  - [`SideBar.tsx`](src/components/template-editor/SideBar.tsx): Componente para añadir nodos
- **template-manager/**: Componentes para administración de plantillas
- **document-editor/**: Editor de documentos completos

### 📁 `contexts/`
Proveedores de contexto para estado global:
- [`DocumentContext.tsx`](src/contexts/DocumentContext.tsx): Gestión del estado de documentos

### 📁 `features/`
Código organizado por características/funcionalidades:
- **documents/**: Gestión completa de documentos
  - **components/**: Componentes específicos
  - **hooks/**: Hooks relacionados con documentos
  - **services/**: Servicios para operaciones
  - **types/**: Tipos específicos
  - **utils/**: Utilidades de manipulación

### 📁 `hooks/`
Hooks personalizados para reutilizar lógica:
- [`useAuth.ts`](src/hooks/useAuth.ts): Gestión de autenticación
- [`useProjects.ts`](src/hooks/useProjects.ts): Operaciones CRUD para proyectos
- [`useTemplates.ts`](src/hooks/useTemplates.ts): Gestión de plantillas
- [`useTemplateLoader.ts`](src/hooks/useTemplateLoader.ts): Carga de datos de plantillas

### 📁 `lib/`
Utilidades y configuraciones compartidas:
- [`supabase.ts`](src/lib/supabase.ts): Cliente y configuraciones de Supabase
- [`supabase.types.ts`](src/lib/supabase.types.ts): Tipos generados de la base de datos
- **constants/**: Constantes de la aplicación
  - [`document-types.ts`](src/lib/constants/document-types.ts): Definición de tipos de documento
- **services/**: Servicios para comunicación con backend
  - [`project-service.ts`](src/lib/services/project-service.ts): Operaciones para proyectos
  - [`document-service.ts`](src/lib/services/document-service.ts): Operaciones para documentos
- **utils/**: Funciones de utilidad
  - [`document.ts`](src/lib/utils/document.ts): Utilidades para documentos

### 📁 `styles/`
Estilos globales de la aplicación:
- [`globals.css`](src/styles/globals.css): Estilos globales y configuración de Tailwind

## Tecnologías Principales

- **Frontend**: Next.js 13+ con React y TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (autenticación, base de datos, almacenamiento)
- **Editor Visual**: React Flow (xyflow) para plantillas visuales
- **Estado**: React Context y Hooks personalizados

## Flujo de Datos

1. Los componentes de UI interactúan con hooks personalizados
2. Los hooks utilizan servicios para comunicarse con Supabase
3. Los servicios gestionan operaciones CRUD y manejan errores
4. Los contextos proporcionan estado global cuando es necesario
5. Las APIs en Next.js Route Handlers proporcionan endpoints para operaciones del servidor

## Editor Visual de Plantillas (React Flow)

El sistema de edición visual de plantillas utiliza [React Flow (xyflow)](https://reactflow.dev/) y está implementado en los siguientes componentes principales:

- [`/src/components/template-editor/TemplateCanvas.tsx`](src/components/template-editor/TemplateCanvas.tsx): Componente principal que renderiza el canvas interactivo
- [`/src/components/template-editor/PropertiesPanel.tsx`](src/components/template-editor/PropertiesPanel.tsx): Panel lateral para editar propiedades de los nodos
- [`/src/app/templates/visual-editor/page.tsx`](src/app/templates/visual-editor/page.tsx): Página que integra todos los componentes del editor visual

### Cómo usar el Editor Visual:

1. Acceder a la ruta `/templates/visual-editor` con parámetros opcionales:
   - `id`: Para editar una plantilla existente
   - `type`: Para especificar si es plantilla de documento (`document`) o proyecto (`project`)

2. Arrastrar elementos desde la paleta al canvas
3. Conectar nodos para establecer dependencias y relaciones
4. Editar propiedades de nodos mediante el panel lateral
5. Guardar la plantilla al finalizar la edición

## Integración con Supabase

La aplicación utiliza Supabase como backend, integrándose a través de:
- Cliente de Supabase en [`lib/supabase.ts`](src/lib/supabase.ts)
- Tipos generados en [`lib/supabase.types.ts`](src/lib/supabase.types.ts)
- Servicios específicos que interactúan con Supabase en [`lib/services/`](src/lib/services/)
- Variables de entorno definidas en `.env.local` (no incluido en el repositorio)

### Configuración de Supabase:

```typescript
// Ejemplo de importación del cliente de Supabase
import { supabase } from '@/lib/supabase';

// Ejemplo de consulta
const { data, error } = await supabase
  .from('templates')
  .select('*')
  .order('created_at', { ascending: false });
```

## Convenciones de Código

- Componentes de página en `app/`
- Componentes reutilizables en `components/`
- Funcionalidades organizadas por características en `features/`
- Utilidades y servicios compartidos en `lib/`
- Hooks personalizados en `hooks/` o dentro de `features/`
- Nomenclatura:
  - Componentes: PascalCase (ej. `TemplateCanvas.tsx`)
  - Hooks: camelCase con prefijo 'use' (ej. `useTemplates.ts`)
  - Utilidades: camelCase (ej. `document.ts`)

## Consideraciones para Desarrollo

- El proyecto utiliza pnpm como gestor de paquetes preferido
- Las variables de entorno se configuran en `.env.local`
- El backend se ha montado mediante el CLI de Supabase en un entorno Docker
- La arquitectura está documentada en [`Docs/arquitectura.md`](../Docs/arquitectura.md)

La documentación anterior proporciona una visión general completa de la estructura del código fuente en la carpeta `src`, facilitando la comprensión del proyecto para los desarrolladores que se incorporen al mismo.
