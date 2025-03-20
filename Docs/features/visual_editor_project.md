## Objetivo: Modificar TempalteCanva para despleegar un Sidebar y un nodeType Diferentes dependedidno de el type en GET

## Ficheros involucrados:
- src/app/templates/visual-editor/page.tsx
- src/components/templates/TemplatesManager.tsx

## Estado actual:
Pagina Visual Editor soporta construccion de documentos y projectos. Pasa por GET la variabel type( project - docuemtnos )

# Problema o Feature Modificar TemplateCanvas para desplegar un Sidebar y un nodeType Diferentes dependiendo del type en GET

Assignees:
Labels: feature
Milestone: 1.0
Projects: Kimfe

## Descripción del problema o feature
<!-- El componente `TemplateCanvas` actualmente despliega el mismo sidebar y nodeType independientemente del parámetro `type` en la petición GET. Se requiere modificar el componente para que renderice un sidebar y nodeType distintos basados en el valor del parámetro `type`. -->

## Plan de Acción
- [ ] 1. Obtener el parámetro `type` de la URL utilizando `useSearchParams` de `react-router-dom`.
- [ ] 2. Crear un objeto de configuración que mapee los valores de `type` a los componentes de sidebar y nodeType correspondientes.
- [ ] 3. Utilizar el valor de `type` para seleccionar el sidebar y nodeType correctos del objeto de configuración.
- [ ] 4. Renderizar el sidebar y nodeType seleccionados en el componente `TemplateCanvas`.

## Rutas involucradas
1.- [`src/components/TemplateCanvas.tsx`](src/components/TemplateCanvas.tsx)

## Pruebas y definición de listos
- [ ] - [ ] Comprobar que el sidebar y nodeType correctos se renderizan para cada valor de `type` soportado.
- [ ] - [ ] Comprobar que el componente `TemplateCanvas` se renderiza correctamente si el parámetro `type` no está presente en la URL.
- [ ] - [ ] Comprobar que el componente `TemplateCanvas` maneja correctamente los valores de `type` no soportados (por ejemplo, mostrando un error o utilizando un sidebar y nodeType por defecto).

## Notas adocionales

<!-- Es importante asegurarse de que el objeto de configuración esté bien definido y sea fácil de mantener. También es importante considerar cómo manejar los valores de `type` no soportados. -->

