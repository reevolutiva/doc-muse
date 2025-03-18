## Sincronización de Plantillas con Supabase

**Descripción de la tarea:**

Esta característica permite sincronizar las plantillas de documentos creadas en el editor de React Flow con la base de datos de Supabase. Al presionar el botón "Guardar", el array de nodos actual en el editor se envía a Supabase para actualizar la tabla `document_templates`. Esto asegura que las plantillas de documentos se almacenen de forma persistente y puedan ser recuperadas posteriormente.

**Cambios realizados:**

1.  **Modificación de la función `generarDocRaw` en `template.tsx`:**
    *   Se modificó la función `generarDocRaw` para recopilar los datos necesarios de los nodos (id, type, data, position) y los edges y enviarlos a Supabase dentro de un objeto `content` para actualizar la tabla `document_templates`.
    *   Se implementó un manejo de errores básico para informar al usuario si la actualización falla.
2.  **Consideraciones sobre la estructura de datos:**
    *   Se aseguró de que la estructura de datos enviada a Supabase coincida con la estructura esperada por la tabla `document_templates`, enviando un objeto `content` que contiene `blocks` (nodos) y `edges`.
3.  **Manejo de errores:**
    *   Se implementó un manejo de errores básico para informar al usuario si la actualización falla.
4.  **Adición de la función `buildNode`:**
    *   Se agregó la función `buildNode` para construir los nodos a partir de los datos recuperados de Supabase.
5.  **Modificación de la función `onChangeHandler`:**
    *   Se modificó la función `onChangeHandler` para utilizar la función `buildNode` y actualizar los nodos en el estado del componente.
6.  **Adición del estado `currentTemplate`:**
    *   Se agregó el estado `currentTemplate` para mantener el ID de la plantilla actual seleccionada.
7.  **Modificación del componente `TemplateSelector`:**
    *   Se modificó el componente `TemplateSelector` para pasar la función `setCurrentTemplate` y actualizar el estado `currentTemplate` al seleccionar una plantilla.
