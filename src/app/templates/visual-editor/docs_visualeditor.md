# Editor Visual de Plantillas (Template Visual Editor)

## Introducción

El Editor Visual de Plantillas es una herramienta interactiva que permite crear y editar plantillas de documentos y proyectos de forma visual utilizando una interfaz drag-and-drop basada en [React Flow (xyflow)](https://github.com/xyflow/xyflow). Este editor permite visualizar dependencias entre documentos, configurar propiedades de nodos y gestionar relaciones de manera intuitiva.

## Arquitectura y Componentes

### Estructura de Archivos

El editor visual se compone de dos directorios principales:

1. **Página Principal**: `/src/app/templates/visual-editor/`
   - `page.tsx`: Componente principal que integra todos los elementos del editor
   - `docs_visualeditor.md`: Este documento de documentación
   - `informederevisión_templates.md`: Plan de migración de los componentes legacy

2. **Componentes Reutilizables**: `/src/components/template-editor/`
   - `TemplateCanvas.tsx`: Canvas principal con React Flow
   - `Palette.js`: Define bloques/nodos disponibles para arrastrar
   - `PropertiesPanel.tsx/.js`: Panel de edición de propiedades de nodos
   - `SideBar.tsx`: Componente para añadir nuevos nodos
   - `Canvas.js`: Implementación original del canvas (legacy)
   - `index.ts`: Exporta componentes para uso en otros módulos

### Diagrama de Dependencias

```
visual-editor/page.tsx
    ├── TemplateCanvas.tsx
    │     ├── SideBar.tsx
    │     ├── PropertiesPanel.tsx
    │     └── ReactFlow (biblioteca externa)
    ├── ValidationPanel
    ├── KeyboardHelpDialog
    ├── TemplateHints
    └── TemplateTutorial
```

## Componentes Principales

### 1. TemplateCanvas

Componente central que implementa el canvas interactivo donde los usuarios pueden crear, conectar y manipular nodos.

```tsx
interface TemplateCanvasProps {
  initialNodes?: Node<TemplateNodeData>[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node<TemplateNodeData>[], edges: Edge[]) => void;
  readOnly?: boolean;
}
```

**Características principales:**
- Carga y renderiza nodos y conexiones
- Permite el drag-and-drop de nuevos elementos
- Gestiona selección y actualización de nodos
- Proporciona controles de navegación y vista

### 2. PropertiesPanel

Panel lateral que muestra y permite editar propiedades del nodo seleccionado.

**Propiedades configurables:**
- Nombre y descripción del nodo
- Campo "requerido" (checkbox)
- Prompt de IA para generación de contenido
- Propiedades específicas según el tipo de nodo

### 3. SideBar

Barra lateral que permite crear nuevos nodos con configuración personalizada.

**Campos principales:**
- Nombre del nodo
- Descripción 
- Checkbox de requerido
- Campo de prompt de IA

### 4. Palette

Define los tipos de bloques disponibles en el editor con sus metadatos.

**Tipos de bloques predefinidos:**
- Header (título y subtítulo)
- Paragraph (bloque de texto)
- Image (imagen con descripción)
- List (lista de elementos)
- Table (tabla con encabezados y filas)
- Form Field (campo de formulario)

## Flujo de Trabajo

1. **Inicialización del Editor**
   - La página `visual-editor/page.tsx` inicializa el estado del editor
   - Carga datos de una plantilla existente si se proporciona un ID
   - Configura listeners para teclas de acceso rápido y prevención de navegación sin guardar

2. **Creación de Nodos**
   - El usuario puede añadir nodos mediante la barra lateral
   - Los nodos se colocan en el canvas y son manipulables

3. **Configuración de Propiedades**
   - Al seleccionar un nodo, el panel de propiedades muestra sus campos editables
   - Los cambios se reflejan en tiempo real

4. **Creación de Conexiones/Dependencias**
   - Los nodos pueden conectarse arrastrando desde los puntos de conexión
   - Las conexiones representan dependencias o relaciones entre documentos/bloques

5. **Guardado de Plantillas**
   - La plantilla se valida antes de guardarse
   - Se envía a Supabase para su almacenamiento

## Uso del Componente

Para integrar el editor visual en una nueva página:

```tsx
import { TemplateCanvas } from '@/components/template-editor/TemplateCanvas';
import type { Node, Edge } from '@xyflow/react';

// Estado para nodos y conexiones
const [nodes, setNodes] = useState<Node[]>([]);
const [edges, setEdges] = useState<Edge[]>([]);

// Manejador para cambios
const handleFlowChange = (newNodes: Node[], newEdges: Edge[]) => {
  setNodes(newNodes);
  setEdges(newEdges);
};

// Renderizar el editor
return (
  <div className="h-full">
    <TemplateCanvas
      initialNodes={nodes}
      initialEdges={edges}
      onSave={handleFlowChange}
    />
  </div>
);
```

## Estructura de Datos

### Nodos

```ts
interface TemplateNodeData {
  label: string;
  description: string;
  isRequired: boolean;
  aiPrompt?: string;
  type: string;
}

type TemplateNode = Node<TemplateNodeData>;
```

### Visual Data (para almacenar en Supabase)

```ts
interface VisualData {
  nodes: Node<TemplateNodeData>[];
  edges: Edge[];
}
```

## Características Avanzadas

### 1. Historial de Cambios (Undo/Redo)

El editor implementa un sistema de historial que permite deshacer (⌘Z) y rehacer (⌘⇧Z) cambios.

### 2. Validación de Plantillas

Antes de guardar, se realizan dos validaciones:
- `validateTemplateData`: Verifica la integridad de los datos de la plantilla
- `validateDependencies`: Comprueba que no haya dependencias circulares o inválidas

### 3. Atajos de Teclado

- `⌘Z` / `Ctrl+Z`: Deshacer cambio
- `⌘⇧Z` / `Ctrl+Shift+Z`: Rehacer cambio
- `Delete` / `Backspace`: Eliminar nodo seleccionado
- `⌘S` / `Ctrl+S`: Guardar plantilla

## Personalización y Extensión

### Añadir Nuevos Tipos de Nodos

Para añadir un nuevo tipo de nodo, modifica el archivo `Palette.js`:

```js
// Añadir definición al array blocks
const newNodeType = { 
  id: 7, 
  type: 'custom-node', 
  name: 'Custom Node', 
  icon: 'custom-icon',
  fields: ['customField1', 'customField2'],
  description: 'Mi nodo personalizado',
  defaultProps: { 
    customField1: 'Valor predeterminado', 
    customField2: ''
  }
};
```

### Personalizar Estilos

Los estilos de los componentes se definen en archivos CSS específicos:
- `PropertiesPanel.css`: Estilos para el panel de propiedades
- Consultar los archivos `.css` para modificar la apariencia de componentes específicos

## Integración con Supabase

El editor almacena las plantillas en Supabase, utilizando una estructura específica:

- Tabla para plantillas de documentos: `document_templates`
- Tabla para plantillas de proyectos: `project_templates`

Campos relevantes:
- `id`: Identificador único de la plantilla
- `title`: Título de la plantilla
- `description`: Descripción de la plantilla
- `visual_data`: Objeto JSON que contiene los nodos y edges

## Resolución de Problemas Comunes

### Los nodos no se muestran en el canvas

Verifica que los datos iniciales tengan el formato correcto y que ReactFlowProvider esté envolviendo correctamente el componente.

### Las conexiones entre nodos no funcionan

Asegúrate de que los IDs de los nodos de origen y destino existen y son únicos en el array de nodos.

### Los cambios no se guardan

Comprueba que la validación de datos pasa correctamente y que la conexión con Supabase está funcionando.

## Documentación Relacionada

- [React Flow Documentation](https://reactflow.dev/docs/introduction/)
- [Supabase Documentation](https://supabase.com/docs)

## Notas de Migración

El editor visual es parte de un plan de migración para reemplazar componentes legacy en `/project-templates/` y `/templates/`. Para más detalles sobre este proceso, consulta el archivo [`informederevisión_templates.md`](informederevisión_templates.md).
