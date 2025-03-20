## Objetivo: Guardar en BDD una lista de bloques

### Descripcion:
- La aplicacion estaba preparada para almacenar la lista de bloques pero en un alamacenamiento temporal ( Estado React )

### Acciones:
- Se intervino el flujo de creacion y actualizacion y Lectura para que la lista de bloques se lea y escriba en supabase.

- [ Mier 19 de Marzo a 12:53 ]
    - Guardamos en Supabase un repersentacion de los bloques en ReactFlow

## Objetivo: Modificar nodos desde el sidebar de Canvas

### Descripcion: 
- La interfaz cuenta un con sidebar que permite configurar las propidades del nodo antes de añadrilo al canvas. 
- Queremos conseguir que si carga una lista de nodos en el canvas, hace hacer click en el boton de editar se actulizen los campos del sidebar y podamos actulizarlos tanto el Canvas como en Supabse.

### Plan de Acción

#### Seleccionar Nodo en el Canvas:

- Asegurarse de que al hacer clic en un nodo en el TemplateCanvas, el PropertiesPanel se actualice con las propiedades del nodo seleccionado. 
- Esto ya está implementado en TemplateCanvas.tsx con la función onNodeClick y el estado selectedNode.
- Mostrar Datos del Nodo en el Sidebar:

#### Crear un nuevo estado en TemplateCanvas para controlar el nodo que se va a editar en el sidebar.
- Cuando se selecciona un nodo en el canvas, actualizar este nuevo estado con los datos del nodo seleccionado.
- Pasar los datos del nodo seleccionado al componente SideBar.
- Modificar el componente SideBar para que muestre los datos del nodo seleccionado en los campos del formulario.

#### Actualizar el Nodo en el Canvas:

- Modificar la función handleNodeUpdate en TemplateCanvas para que también actualice el nodo en el estado nodes cuando se cambian las propiedades en el SideBar.
- Asegurarse de que la función onSave se llama después de actualizar el nodo en el estado nodes para guardar los cambios en Supabase.

#### Comunicar Cambios del Sidebar al Canvas:
- Crear una función en TemplateCanvas que reciba los datos actualizados del nodo desde el SideBar.
- Esta función debe actualizar el estado del nodo correspondiente en el canvas.
- Pasar esta función al componente SideBar como una prop.

#### Modificar el Componente SideBar:

- Recibir la función de actualización del nodo como una prop.
- Modificar el estado local del componente para que se inicialice con los datos del nodo seleccionado.
- Cuando se cambien los valores de los campos del formulario, actualizar el estado local del componente.
- Añadir un botón "Guardar" al componente.
- Cuando se haga clic en el botón "Guardar", llamar a la función de actualización del nodo que se recibió como prop, pasando los datos actualizados del nodo.

#### Actualizar el Nodo en Supabase:

- Dentro de la función handleNodeUpdate en TemplateCanvas, realizar una llamada a Supabase para actualizar el nodo en la base de datos.
- Utilizar el id del nodo para identificar el nodo que se va a actualizar.
- Actualizar los campos correspondientes en la base de datos con los nuevos valores.

#### Rutas involucradas

- TemplateCanvas.tsx
- SideBar.tsx
- custom_nodes.md