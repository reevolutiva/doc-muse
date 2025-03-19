# Problema o Feature Warning: Maximum update depth exceeded en ValidationPanel

Assignees:
Labels: bug, react, useEffect
Milestone: Template Visual Editor
Projects: Kimfe

## Descripción del problema o feature

El componente `ValidationPanel` está entrando en un bucle infinito de actualizaciones de estado, lo que provoca el error "Maximum update depth exceeded". Esto ocurre cuando un `useEffect` llama a `setState` y las dependencias del `useEffect` cambian en cada renderizado, creando un bucle.

## Plan de Acción

Para solucionar este problema, sigue estos pasos:

[]- [ ] **Paso 1: Analizar el componente `ValidationPanel`**
    - Revisa el código de [`ValidationPanel`](src/components/template-manager/validation-panel.tsx) para identificar el `useEffect` que está causando el problema.
    - Examina las dependencias de este `useEffect` y determina si alguna de ellas está cambiando en cada renderizado.

[]- [ ] **Paso 2: Identificar las dependencias problemáticas**
    - Las dependencias del `useEffect` deben ser valores que solo cambien cuando sea necesario realizar una nueva validación.
    - Si las dependencias incluyen objetos o arrays creados en cada renderizado, estos siempre serán diferentes y causarán el bucle.

[]- [ ] **Paso 3: Corregir las dependencias del `useEffect`**
    - Utiliza `useCallback` para memoizar las funciones que se utilizan como dependencias. Esto asegura que la función solo cambie cuando sus propias dependencias cambien.
    - Utiliza `useMemo` para memoizar los objetos o arrays que se utilizan como dependencias. Esto asegura que el objeto o array solo cambie cuando sus valores internos cambien.
    - Asegúrate de que las dependencias del `useEffect` sean primitivas (strings, números, booleanos) o referencias a objetos/funciones memoizadas.

[]- [ ] **Paso 4: Verificar el flujo de datos**
    - Asegúrate de que los datos que se pasan al componente `ValidationPanel` (especialmente `visualData`) no estén cambiando innecesariamente.
    - Si `visualData` cambia en cada renderizado, considera memoizarlo en el componente padre utilizando `useMemo`.

[]- [ ] **Paso 5: Implementar la corrección**
    - Aplica las correcciones necesarias al código del componente `ValidationPanel`.
    - Asegúrate de que el `useEffect` solo se ejecute cuando sea necesario realizar una nueva validación.

[]- [ ] **Paso 6: Probar la solución**
    - Ejecuta la aplicación y verifica que el error "Maximum update depth exceeded" ya no ocurra.
    - Realiza pruebas exhaustivas para asegurarte de que la validación del template funcione correctamente.

[]- [ ] **Paso 7: Documentar los cambios**
    - Documenta los cambios realizados en el código y explica por qué se realizaron.
    - Actualiza cualquier documentación relacionada con el componente `ValidationPanel`.

## Rutas involucradas

1.- [`src/components/template-manager/validation-panel.tsx`](src/components/template-manager/validation-panel.tsx)
2.- [`src/lib/hooks/useTemplateValidation.ts`](src/lib/hooks/useTemplateValidation.ts)
3.- [`src/app/templates/visual-editor/page.tsx`](src/app/templates/visual-editor/page.tsx)

## Pruebas y definición de listos

[]- [ ] Comprobar que el error "Maximum update depth exceeded" no ocurre.
[]- [ ] Verificar que la validación del template funciona correctamente.
[]- [ ] Asegurarse de que no se introducen nuevos errores.

## Notas adocionales

El problema parece estar relacionado con el hook [`useTemplateValidation`](src/lib/hooks/useTemplateValidation.ts) y cómo se utiliza en [`ValidationPanel`](src/components/template-manager/validation-panel.tsx). Asegúrate de que las dependencias de [`useTemplateValidation`](src/lib/hooks/useTemplateValidation.ts) estén correctamente gestionadas.


## Solucion
Eliminar customRule como dependencia de useTemplateValidation