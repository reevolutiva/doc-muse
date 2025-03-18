# Documentación de Componentes: `block-editor/react-flow`

## Introducción

Este documento proporciona una guía detallada sobre los componentes y funcionalidades del módulo `react-flow` utilizado en la aplicación `Doc-Muse`. Este módulo permite la creación y gestión de flujos de trabajo interactivos con nodos y bordes.

## Estructura del Directorio

La estructura del directorio `react-flow` es la siguiente:

```
react-flow/
├── template.tsx
├── forms/
│   ├── AddNodeForm.css
│   └── AddNodeForm.tsx
└── general-docs/
    ├── deleterNode.tsx
    ├── delterNode.css
    ├── edges.tsx
    ├── headingNode.css
    ├── HeadingNode.tsx
    ├── nodes.tsx
    └── paragraphNode.css
    └── ParagraphNode.tsx
```

## Componentes

### 1. `template.tsx`

Este componente define el flujo de trabajo para la creación y gestión de plantillas utilizando `ReactFlow`.

#### Funcionalidades:
- Renderiza un flujo de trabajo interactivo con nodos y bordes.
- Permite agregar y eliminar nodos.
- Utiliza `ReactFlow` para manejar el estado de los nodos y bordes.

#### Código:
```tsx
// ...existing code...
```

### 2. `forms/AddNodeForm.tsx`

Este componente proporciona un formulario para agregar nuevos nodos al flujo de trabajo.

#### Funcionalidades:
- Renderiza un formulario con un selector para elegir el tipo de nodo.
- Permite ingresar texto para personalizar el nodo.
- Agrega el nodo al flujo de trabajo al enviar el formulario.

#### Código:
```tsx
// ...existing code...
```

### 3. `general-docs/nodes.tsx`

Este archivo define los nodos iniciales para el flujo de trabajo general de documentos.

#### Código:
```tsx
// ...existing code...
```

### 4. `general-docs/edges.tsx`

Este archivo define los bordes iniciales para el flujo de trabajo general de documentos.

#### Código:
```tsx
// ...existing code...
```

### 5. `general-docs/deleterNode.tsx`

Este componente define un nodo personalizado que puede ser eliminado del flujo de trabajo.

#### Funcionalidades:
- Renderiza un nodo con un botón para eliminarlo.
- Utiliza `ReactFlow` para manejar los nodos.
- El botón de eliminación solo es visible cuando se pasa el cursor sobre el nodo.
- Al hacer clic en el botón de eliminación, el nodo se elimina del flujo de trabajo.

#### Código:
```tsx
// ...existing code...
```

### 6. `general-docs/HeadingNode.tsx`

Este componente define un nodo personalizado para encabezados en el flujo de trabajo.

#### Funcionalidades:
- Renderiza un nodo con estilo de encabezado H2.
- Incluye conectores en la parte superior e inferior.
- Permite personalizar el texto del encabezado mediante `data.label`.
- Utiliza estilos CSS personalizados definidos en `headingNode.css`.
- Toma el ancho dinámicamente según su contenido.

#### Código:
```tsx
// ...existing code...
```

### 7. `general-docs/ParagraphNode.tsx`

Este componente define un nodo personalizado para párrafos de texto en el flujo de trabajo.

#### Funcionalidades:
- Renderiza un nodo con estilo de párrafo.
- Incluye conectores en la parte superior e inferior.
- Permite personalizar el texto mediante `data.label`.
- Utiliza estilos CSS personalizados definidos en `paragraphNode.css`.
- Toma el ancho dinámicamente según su contenido con un ancho máximo de 400px.

#### Código:
```tsx
// ...existing code...
```

## Uso de los Componentes

### Agregar un Nodo

Para agregar un nodo al flujo de trabajo, utiliza el componente `AddNodeForm`. Este componente proporciona un formulario con un selector para elegir el tipo de nodo y un campo de texto para personalizar el nodo.

```tsx
import { AddNodeForm } from './forms/AddNodeForm';

<AddNodeForm nodes={nodes} setNodes={setNodes} />
```

### Renderizar el Flujo de Trabajo

Para renderizar el flujo de trabajo, utiliza el componente `TemplatesReactFlow`. Este componente maneja el estado de los nodos y bordes, y renderiza el flujo de trabajo interactivo.

```tsx
import TemplatesReactFlow from './template';

<TemplatesReactFlow />
```

### Personalizar Nodos

Los nodos personalizados como `HeadingNode` y `ParagraphNode` se pueden utilizar para renderizar contenido específico en el flujo de trabajo. Estos nodos se definen en los archivos correspondientes y se pueden personalizar mediante las propiedades `data.label`.

```tsx
import HeadingNode from './general-docs/HeadingNode';
import ParagraphNode from './general-docs/ParagraphNode';

const nodeTypes = {
  headingNode: HeadingNode,
  paragraphNode: ParagraphNode,
};

<ReactFlow nodeTypes={nodeTypes} />
```

## Conclusión

El módulo `react-flow` proporciona una forma flexible y extensible de crear y gestionar flujos de trabajo interactivos en la aplicación `Doc-Muse`. Utilizando los componentes y funcionalidades descritos en esta documentación, puedes personalizar y extender el flujo de trabajo según tus necesidades.
