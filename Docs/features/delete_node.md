# Problema o Feature Eliminar Nodos del Canvas de React Flow

Assignees:
Labels: feature, react-flow, delete-node
Milestone: 1.0
Projects: Kimfe

## Descripción del problema o feature
Se necesita implementar la funcionalidad para eliminar nodos del canvas de React Flow. Esto implica eliminar el nodo visualmente del canvas, actualizar el estado global de la aplicación para reflejar la eliminación del nodo, y eliminar el nodo correspondiente de la base de datos. El nodo personalizado [`TemplateNode`](src/components/template-editor/TemplateNode.tsx) contiene un botón de eliminar con un handler `handleDelete()` que ejecuta el método `onDelete`, pasando el ID del nodo a eliminar. El método `onDelete` es parte de la prop `data` con el tipo [`TemplateNodeData`](src/components/template-editor/TemplateNode.tsx) que se entrega al componente [`TemplateNode`](src/components/template-editor/TemplateNode.tsx). `data` es el propio objeto `node` en la lista `nodes` en [`src/components/template-editor/TemplateCanvas.tsx`](src/components/template-editor/TemplateCanvas.tsx).

## Plan de Acción
- [ ] 1. **Verificar la Prop `onDelete`:** Asegurarse de que la prop `onDelete` se está pasando correctamente al componente [`TemplateNode`](src/components/template-editor/TemplateNode.tsx) desde [`TemplateCanvas`](src/components/template-editor/TemplateCanvas.tsx).
- [ ] 2. **Implementar la Lógica de Eliminación en `TemplateCanvas`:** Dentro de [`TemplateCanvas`](src/components/template-editor/TemplateCanvas.tsx), implementar la lógica para eliminar el nodo del estado local (lista de nodos) cuando se llama a la función `onDelete`. Esto puede implicar el uso de `useState` y su función de actualización para filtrar el nodo que se va a eliminar.
- [ ] 3. **Actualizar el Estado Global:** Integrar la actualización del estado global (por ejemplo, usando Redux, Zustand, o Context API) para reflejar la eliminación del nodo. Esto asegura que otros componentes que dependen de este estado también se actualicen.
- [ ] 4. **Implementar la Eliminación en la Base de Datos:** Implementar la lógica para eliminar el nodo de la base de datos. Esto probablemente involucrará una llamada a una API (backend) que maneje la eliminación del nodo basado en su ID.
- [ ] 5. **Manejo de Errores:** Implementar un manejo de errores adecuado para la llamada a la API de eliminación. Esto incluye mostrar mensajes de error al usuario si la eliminación falla.
- [ ] 6. **Pruebas:** Escribir pruebas unitarias y de integración para asegurar que la funcionalidad de eliminación funciona correctamente y que no hay efectos secundarios no deseados.

## Rutas involucradas
1.- [`src/components/template-editor/TemplateNode.tsx`](src/components/template-editor/TemplateNode.tsx)
2.- [`src/components/template-editor/TemplateCanvas.tsx`](src/components/template-editor/TemplateCanvas.tsx)
3.- [Backend API endpoint for deleting nodes]()
4.- [Global state management file(s)]()

## Pruebas y definición de listos
- [ ] - [ ] La eliminación del nodo en el canvas debe ser visualmente inmediata.
- [ ] - [ ] El estado global debe reflejar la eliminación del nodo.
- [ ] - [ ] El nodo debe ser eliminado de la base de datos.
- [ ] - [ ] Se deben mostrar mensajes de error adecuados si la eliminación falla.
- [ ] - [ ] Las pruebas unitarias y de integración deben pasar sin errores.

## Notas adocionales

Asegurarse de que la eliminación del nodo también maneje la eliminación de cualquier conexión (edges) asociada a ese nodo. Considerar la posibilidad de usar una transacción en la base de datos para asegurar que la eliminación del nodo y sus conexiones sean atómicas.