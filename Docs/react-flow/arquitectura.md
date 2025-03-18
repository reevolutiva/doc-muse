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

Este componente define el flujo de trabajo principal para la creación y gestión de plantillas utilizando `ReactFlow`. Actúa como el lienzo donde los usuarios pueden diseñar visualmente la estructura de sus documentos.

#### Funcionalidades:

-   Renderiza un flujo de trabajo interactivo con nodos y bordes, permitiendo la manipulación visual de la estructura del documento.
-   Permite agregar, eliminar y conectar nodos para definir la disposición del contenido.
-   Utiliza `ReactFlow` para manejar el estado de los nodos y bordes, proporcionando una interfaz intuitiva para la creación de plantillas.
-   Integra un selector de plantillas existentes y un modal para crear nuevas plantillas.

#### Uso:

Para integrar el componente `TemplatesReactFlow` en tu aplicación, simplemente impórtalo y renderízalo:

```tsx
import TemplatesReactFlow from './template';

function MyComponent() {
  return (
    <TemplatesReactFlow />
  );
}
```

Este componente gestiona el estado del flujo de trabajo, permitiendo a los usuarios interactuar con los nodos y bordes.

### 2. `forms/AddNodeForm.tsx`

Este componente proporciona un formulario para agregar nuevos nodos al flujo de trabajo. Facilita la adición de diferentes tipos de nodos (párrafos, encabezados, imágenes, etc.) al lienzo de diseño.

#### Funcionalidades:

-   Renderiza un formulario con un selector para elegir el tipo de nodo que se va a agregar.
-   Permite ingresar texto o una URL (en el caso de imágenes) para personalizar el contenido del nodo.
-   Agrega el nodo al flujo de trabajo al enviar el formulario, actualizando el estado de `ReactFlow`.

#### Uso:

Para utilizar el componente `AddNodeForm`, impórtalo y pásale las funciones `addNode`, `nodes` y `setNodes`:

```tsx
import { AddNodeForm } from './forms/AddNodeForm';

function MyComponent() {
  const [nodes, setNodes] = useNodesState([]);

  const addNode = (type, content) => {
    // Lógica para agregar un nuevo nodo al estado 'nodes'
  };

  return (
    <AddNodeForm nodes={nodes} setNodes={setNodes} addNode={addNode} />
  );
}
```

### 3. `general-docs/nodes.tsx`

Este archivo define la clase `Node` y los nodos iniciales para el flujo de trabajo general de documentos.

#### Uso:

La clase `Node` se utiliza para crear instancias de nodos con propiedades como `id`, `position`, `type` y `data`. Los nodos iniciales definidos en `intialnodes_general_docs` se utilizan para poblar el flujo de trabajo al inicio.

```tsx
import { Node } from './general-docs/nodes';

const myNode = new Node('5', 100, 100, "paragraphNode", 'Mi párrafo');
```

### 4. `general-docs/edges.tsx`

Este archivo define los bordes iniciales para el flujo de trabajo general de documentos.

#### Uso:

Los bordes definidos en `intialedges_general_docs` se utilizan para conectar los nodos iniciales en el flujo de trabajo.

```tsx
import { intialedges_general_docs } from './general-docs/edges';

// Ejemplo de cómo se podrían agregar bordes dinámicamente:
const newEdge = { id: 'e5-6', source: '5', target: '6' };
const edges = [...intialedges_general_docs, newEdge];
```

### 5. Nodos Personalizados (`deleterNode.tsx`, `HeadingNode.tsx`, `ParagraphNode.tsx`, `ImageNode.tsx`, `SubtitleNode.tsx`)

Estos componentes definen nodos personalizados con funcionalidades y estilos específicos.

#### Funcionalidades Comunes:

-   Renderizan un nodo con un estilo visual particular.
-   Incluyen conectores (`Handle`) para permitir la conexión con otros nodos.
-   Implementan la lógica para eliminar el nodo del flujo de trabajo.

#### Uso:

Para utilizar estos nodos personalizados, debes importarlos y registrarlos en el objeto `nodeTypes` de `ReactFlow`.

```tsx
import HeadingNode from './general-docs/HeadingNode';
import ParagraphNode from './general-docs/ParagraphNode';
import ImageNode from './general-docs/ImageNode';
import SubtitleNode from './general-docs/SubtitleNode';

const nodeTypes = {
  headingNode: HeadingNode,
  paragraphNode: ParagraphNode,
  imageNode: ImageNode,
  subtitleNode: SubtitleNode,
};

<ReactFlow nodeTypes={nodeTypes} />
```

Luego, puedes agregar estos nodos al flujo de trabajo utilizando la función `addNode` del componente `template.tsx`, especificando el tipo de nodo y el contenido deseado.

## Conclusión

El módulo `react-flow` proporciona una forma flexible y extensible de crear y gestionar flujos de trabajo interactivos en la aplicación `Doc-Muse`. Utilizando los componentes y funcionalidades descritos en esta documentación, puedes personalizar y extender el flujo de trabajo según tus necesidades.
