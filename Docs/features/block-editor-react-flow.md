# Tarea: Crear una Caja de Controles para Nodos Personalizados en React Flow

## Descripción

Se creará una caja de controles que permita escoger un tipo de nodo personalizado, configurar su contenido e insertarlo en el canvas de React Flow. Además, la caja de controles debe tener un botón que obtenga la lista actualizada de nodos.

## Requisitos

1. **Selector de Tipo de Nodo**: Un dropdown que permita seleccionar el tipo de nodo a insertar (e.g., `HeadingNode`, `ParagraphNode`, `DeleterNode`).
2. **Campo de Configuración de Contenido**: Un campo de texto que permita configurar el contenido del nodo seleccionado.
3. **Botón de Inserción**: Un botón que inserte el nodo configurado en el canvas de React Flow.
4. **Botón de Actualización de Nodos**: Un botón que obtenga la lista actualizada de nodos y la muestre en la caja de controles.

## Implementación

### 1. Crear el Componente de la Caja de Controles

**Descripción:**

El componente `ControlBox` permite a los usuarios seleccionar un tipo de nodo (Paragraph, Heading, Deleter Node) desde un menú desplegable, configurar el contenido del nodo a través de un campo de texto y añadir el nodo al canvas de React Flow mediante un botón. También incluye un botón para actualizar la lista de nodos, aunque la lógica para esta funcionalidad aún necesita ser implementada.

### 2. Integrar la Caja de Controles en el Componente Principal
**Descripción:**

El componente `TemplatesReactFlow` integra el componente `ControlBox`.  El estado de los nodos se gestiona utilizando `useNodesState`. Los tipos de nodos personalizados (DeleterNode, HeadingNode, ParagraphNode) se definen utilizando `useMemo`. La función `onConnect` permite la creación de aristas entre los nodos.

### 3. Implementar la Lógica de Inserción de Nodos

#### 3.1. Implementar los Handlers de los Inputs del Formulario

Se actualizaron los handlers en `AddNodeForm.tsx` para capturar la información del tipo de nodo seleccionado y el contenido del nodo.

#### 3.2. Crear una Función para Crear un Nuevo Nodo

Se creó la función `addNode` en `template.tsx` que toma la información capturada y crea un nuevo nodo con esa información.

### Conclusión

Con esta implementación, se ha creado la lógica para capturar la información del tipo de nodo y el contenido del nodo, y se ha integrado la función de creación de nodos con el canvas de React Flow para insertar el nuevo nodo.

## Lista de Tareas para la Implementación de la Caja de Controles en React Flow

## Tareas

1. **Crear el Componente de la Caja de Controles**
   - [x] Crear un nuevo componente `ControlBox` que permita seleccionar el tipo de nodo, configurar su contenido e insertarlo en el canvas de React Flow.
   - [x] Asegurarse de que el componente tenga un botón para obtener la lista actualizada de nodos.
   - [x] **Actualizar**: Documentar el código en `block-editor-react-flow.md`.

2. **Integrar la Caja de Controles en el Componente Principal**
   - [x] Integrar el componente `ControlBox` en el componente principal `TemplatesReactFlow`.
   - [x] Asegurarse de que la integración funcione correctamente y que los nodos se inserten y actualicen en el canvas de React Flow.
   - [x] **Actualizar**: Documentar el código en `block-editor-react-flow.md`.

3. **Implementar la Lógica de Inserción de Nodos**
   - [x] Implementar los handlers de los inputs del formulario para capturar la información del tipo de nodo seleccionado y el contenido del nodo.
   - [x] Crear una función que tome la información capturada y cree un nuevo nodo con esa información.
   - [x] Integrar la función de creación de nodos con el canvas de React Flow para insertar el nuevo nodo.
   - [x] **Actualizar**: Documentar el código en `block-editor-react-flow.md`.

  ## Tareas Adicionales: Nodos Personalizados de Imagen y Subtítulo

  1. **Crear Nodos Personalizados de Imagen y Subtítulo**
    - [x] Crear un nuevo tipo de nodo personalizado llamado `ImageNode` que permita insertar una imagen en el canvas de React Flow.
      - [X] El `ImageNode` debe tener un campo para la URL de la imagen.
      - [X] El `ImageNode` debe mostrar la imagen en el canvas.
    - [X] Crear un nuevo tipo de nodo personalizado llamado `SubtitleNode` que permita insertar un subtítulo en el canvas de React Flow.
      - [X] El `SubtitleNode` debe tener un campo para el texto del subtítulo.
      - [X] El `SubtitleNode` debe mostrar el subtítulo en el canvas.
    - [X] **Actualizar**: Documentar el código en `block-editor-react-flow.md`.

  2. **Integrar los Nuevos Nodos en la Caja de Controles**
    - [X] Añadir los nuevos tipos de nodos (`ImageNode` y `SubtitleNode`) al dropdown de selección de tipo de nodo en el componente `ControlBox`.
    - [X] Asegurarse de que la selección de `ImageNode` y `SubtitleNode` funcione correctamente y que los nodos se inserten en el canvas de React Flow.
    - [X] **Actualizar**: Documentar el código en `block-editor-react-flow.md`.

  3. **Implementar la Lógica de Inserción de Nodos de Imagen y Subtítulo**
    - [X] Implementar los handlers de los inputs del formulario para capturar la información de la URL de la imagen y el texto del subtítulo.
    - [X] Crear una función que tome la información capturada y cree un nuevo nodo de imagen o subtítulo con esa información.
    - [X] Integrar la función de creación de nodos con el canvas de React Flow para insertar el nuevo nodo.
    - [X] **Actualizar**: Documentar el código en `block-editor-react-flow.md`.

## Pruebas

### Pruebas de la Caja de Controles

1. **Selección de Tipo de Nodo**:
   - **Objetivo**: Verificar que el dropdown permite seleccionar diferentes tipos de nodos (Paragraph, Heading, Deleter Node).
   - **Procedimiento**:
     1. Abrir el dropdown de selección de tipo de nodo.
     2. Seleccionar cada tipo de nodo uno por uno.
     3. Verificar que el estado `selectedNodeType` se actualiza correctamente con cada selección.
   - **Resultado Esperado**: El dropdown debe permitir seleccionar cada tipo de nodo y el estado `selectedNodeType` debe reflejar la selección actual.

2. **Configuración de Contenido del Nodo**:
   - **Objetivo**: Verificar que el campo de texto permite configurar el contenido del nodo.
   - **Procedimiento**:
     1. Introducir texto en el campo de texto de configuración de contenido.
     2. Verificar que el estado `nodeContent` se actualiza correctamente con el texto introducido.
   - **Resultado Esperado**: El campo de texto debe permitir introducir texto y el estado `nodeContent` debe reflejar el texto introducido.

3. **Inserción de Nodos**:
   - **Objetivo**: Verificar que el botón de inserción añade un nuevo nodo al canvas de React Flow con el tipo y contenido configurados.
   - **Procedimiento**:
     1. Seleccionar un tipo de nodo en el dropdown.
     2. Introducir contenido en el campo de texto.
     3. Hacer clic en el botón de inserción.
     4. Verificar que un nuevo nodo aparece en el canvas de React Flow con el tipo y contenido configurados.
   - **Resultado Esperado**: Un nuevo nodo debe aparecer en el canvas con el tipo y contenido configurados.

4. **Actualización de Nodos**:
   - **Objetivo**: Verificar que el botón de actualización de nodos obtiene la lista actualizada de nodos y la muestra en la caja de controles.
   - **Procedimiento**:
     1. Añadir varios nodos al canvas.
     2. Hacer clic en el botón de actualización de nodos.
     3. Verificar que la consola muestra la lista actualizada de nodos.
   - **Resultado Esperado**: La consola debe mostrar la lista actualizada de nodos.

## Nota
- Mantener `block-editor-react-flow.md` actualizado en cada corrección y cambio realizado.
- Seguir las instrucciones y lineamientos establecidos en `block-editor-react-flow.md` para asegurar la consistencia y calidad del trabajo.
