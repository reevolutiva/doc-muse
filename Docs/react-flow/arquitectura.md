# Documentación de Componentes: `block-editor/react-flow`

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

### 2. `general-docs/nodes.tsx`

Este archivo define los nodos iniciales para el flujo de trabajo general de documentos.

#### Código:
```tsx
// ...existing code...
```

### 3. `general-docs/edges.tsx`

Este archivo define los bordes iniciales para el flujo de trabajo general de documentos.

#### Código:
```tsx
// ...existing code...
```

### 4. `general-docs/deleterNode.tsx`


Este componente define un nodo personalizado que puede ser eliminado del flujo de trabajo.

#### Funcionalidades:
- Renderiza un nodo con un botón para eliminarlo.
- Utiliza `ReactFlow` para manejar los nodos.
- El botón de eliminación solo es visible cuando se pasa el cursor sobre el nodo.
- Al hacer clic en el botón de eliminación, el nodo se elimina del flujo de trabajo.

#### Funcionalidades:
- Renderiza un nodo con un botón para eliminarlo.
- Utiliza `ReactFlow` para manejar los nodos.

#### Código:
```tsx
// ...existing code...
```

### 5. `general-docs/HeadingNode.tsx`

Este componente define un nodo personalizado para encabezados en el flujo de trabajo.

#### Funcionalidades:
- Renderiza un nodo con estilo de encabezado H2
- Incluye conectores en la parte superior e inferior
- Permite personalizar el texto del encabezado mediante `data.label`
- Utiliza estilos CSS personalizados definidos en `headingNode.css`
- Toma el ancho dinamicamente segun su contenido :: NEW Feature

#### Código:
```tsx
// ...existing code...
```

### 6. `general-docs/ParagraphNode.tsx`

Este componente define un nodo personalizado para párrafos de texto en el flujo de trabajo.

#### Funcionalidades:
- Renderiza un nodo con estilo de párrafo
- Incluye conectores en la parte superior e inferior
- Permite personalizar el texto mediante `data.label`
- Utiliza estilos CSS personalizados definidos en `paragraphNode.css`
- Toma el ancho dinamicamente segun su contenido con ancho maximo de 400px :: NEW Feature

#### Código:
```tsx
// ...existing code...
```
