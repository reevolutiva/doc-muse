# Bug vitácora
## Problemas Activos

### Problemas Nº 6: Manejo de Errores Incompleto
- Prioridad: 3
- **Descripción:** Mejorar el manejo de errores en componentes y APIs. `src/components/`, `src/app/api/`
    **Tareas Pendientes**
    - Implementar bloques try/catch en todos los componentes.
    - Asegurar que todos los endpoints API devuelven códigos de estado HTTP apropiados.
    - Implementar un sistema de log de errores para depuración.
    **Pruebas:**
    - Probar componentes con datos inválidos.
    - Probar endpoints API con requests mal formados.

### Problemas Nº 2: Inconsistencia en Estilos
- Prioridad: 4
- **Descripción:** Estandarizar el enfoque de estilización en toda la aplicación. `src/components/`, `styles/`
    **Tareas Pendientes**
    - Documentar guía de estilos de Tailwind CSS.
    - Asegurar que todos los componentes cumplen con la guía de estilos.
    - Configurar e implementar un linter para mantener la consistencia.

### Problemas Nº 3: Problemas de Seguridad de Tipos (En Progreso)
- Prioridad: 1
- [x] **Descripción:** Problemas de seguridad de tipos en componentes y hooks relacionados con plantillas: `src/components/TemplateNode.tsx`, `src/components/TemplateCanvas.tsx`, `src/hooks/useTemplateLoader.ts`, `src/hooks/useTemplates.ts`, `src/hooks/useTemplateValidation.ts`, `src/hooks/useTemplateOperations.ts`
    **Pasos**
    1. ✓ Centralizar tipos en `/src/lib/types/templates/`
    2. ✓ Crear interfaces base y tipos comunes en `base.ts`
    3. ✓ Crear interfaces para operaciones en `operations.ts`
    4. ✓ Actualizar componentes para usar tipos centralizados
    5. ✓ Actualizar hooks para usar tipos centralizados
    6. [✓] Implementar pruebas de tipos para los componentes
    7. [✓] Validar tipos en tiempo de compilación
    **Pruebas**
    a. ✓ Confirmar que no hay errores de tipo en la compilación
    b. ✓ Verificar que todos los componentes tienen props tipados correctamente
    c. ✓ Asegurar que los tipos están centralizados en archivos dedicados
    **Listo**
    [✓] No hay errores de tipo en la compilación de los componentes principales
    [✓] Los componentes tienen props tipados correctamente
    [✓] Tipos centralizados en archivos dedicados
    [✓] Componentes React Flow usan tipos correctamente
    **Progreso**
    * Creada estructura centralizada de tipos en `/src/lib/types/templates/`
    * Implementadas interfaces base y operaciones
    * Actualizados componentes TemplateNode y TemplateCanvas
    * Actualizados hooks useTemplateLoader, useTemplateOperations y useTemplateValidation
    * Corregidos problemas de compatibilidad con React Flow
    * Añadido soporte para Record<string, unknown> en TemplateNodeData
    * Mejorada la validación de tipos en los hooks
    **Siguiente**
    * (Todos los pasos completados)

### Problemas Nº 6: Documentación de Arquitectura Insuficiente entre componentes
- Prioridad: 2
- **Descripción:** Crear documentación clara sobre las interacciones entre componentes. `docs/`, `src/components/`
    **Tareas Pendientes**
    - Crear el diagrama de arquitectura.
    - Completar la documentación de cada componente.
    - Definir estándares de implementación.
    **Pruebas:**
    - Revisar la documentación con el equipo para validar la claridad.

### Problemas Nº 7: Error en renderizado de DocumentDependencyEditor
- Prioridad: 2
- **Descripción:** Corregir el error de renderizado del componente `DocumentDependencyEditor` cuando la cantidad de documentos es inferior a dos.
    **Tareas Pendientes**
    - Validar la cantidad de documentos antes de renderizar la matriz de dependencias.
    - Mostrar un mensaje informativo cuando la cantidad de documentos sea insuficiente.
    **Pruebas:**
    - Renderizar el componente con 0, 1 y 2 o más documentos.

  **Ejecución**
  * Documentación unificada en [Docs/rfp_templates.md]. [✓]
  * Retiro progresivo de componentes en `/project-templates/` y `/templates/` completado. [✓]
  * Migración a TypeScript finalizada para todos los componentes. [✓]
  * Incorporación de prompts IA básicos implementada. [✓]
  * Validaciones y tooltips en diagrama y panel completados. [✓]
  * Pruebas unitarias e integración finalizadas. [✓]
  * Cambios documentados en este y archivos relacionados. [✓]

### Problemas Nº 1: Error en importación de módulos en `src/lib/hooks/templates/index.ts`
- Prioridad: 1
- [ ] **Descripción:** El problema se debe a rutas incorrectas en las importaciones de los módulos `useTemplateLoader` y `useTemplates`.
  **Pasos**
  1. Verificar que los archivos `useTemplateLoader.ts` y `useTemplates.ts` existen en el directorio `src/lib/hooks/templates/templates/`.
  2. Actualizar las rutas de importación en `src/lib/hooks/templates/index.ts`.
  3. Asegurarse de que `useTemplateLoader` y `useTemplates` están correctamente exportados en sus respectivos archivos.
  4. Limpiar la caché de Next.js y reconstruir el proyecto.
  **Pruebas**
  a. Ejecutar `pnpm build` y verificar que no haya errores de importación.
  **Listo**
  [] Verificar que el proyecto se construye correctamente sin errores de importación.

### Problemas Nº 2: Error en variables de entorno de Supabase
- Prioridad: 1
- [ ] **Descripción:** El problema se debe a la falta de definición de las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  **Pasos**
  1. Agregar las variables de entorno en el archivo `.env.local`.
  2. Asegurarse de que `src/lib/supabase.ts` utilice estas variables correctamente.
  3. Reiniciar la aplicación.
  **Pruebas**
  a. Verificar que la aplicación se inicie sin errores relacionados con Supabase.
  **Listo**
  [] Verificar que la aplicación funcione correctamente con Supabase.

### Problemas Nº 3: Carácter inesperado en `src/lib/hooks/templates/index.ts`
- Prioridad: 2
- [ ] **Descripción:** El problema se debe a un carácter inesperado (∫) en el archivo `src/lib/hooks/templates/index.ts`.
  **Pasos**
  1. Eliminar el carácter inesperado del archivo.
  2. Guardar y validar que el archivo se compile correctamente.
  **Pruebas**
  a. Verificar que no haya errores de sintaxis al compilar el proyecto.
  **Listo**
  [] Verificar que el archivo se compile sin errores.

### Problemas Nº 4: Error de renderizado en `DocumentDependencyEditor` con menos de dos documentos
- Prioridad: 1
- [ ] **Descripción:** El problema se debe a que el componente `DocumentDependencyEditor` no valida adecuadamente que existan al menos dos documentos antes de intentar renderizar la matriz de dependencias.
  **Pasos**
  1. Reproducir el error ejecutando la aplicación con `docker compose up` y `pnpm run dev`.
  2. Revisar el código de `DocumentDependencyEditor.tsx` para entender cómo se carga y renderiza la lista de documentos.
  3. Agregar una comprobación al inicio del renderizado para evaluar si la cantidad de documentos es menor a 2.
  4. Si no se cumple el requisito, renderizar un mensaje informativo en lugar del contenido esperado.
  5. Actualizar las pruebas unitarias para cubrir los casos de 0, 1 y 2 o más documentos.
  6. Realizar pruebas manuales y automáticas para garantizar que el cambio soluciona el error sin introducir nuevos problemas.
  7. Actualizar la documentación de bug fixer reflejando los cambios y el estado del problema.
  8. Confirmar que el componente y las pruebas se ejecutan correctamente, realizar el commit de los cambios y lanzar la aplicación.
  **Pruebas**
  a. Renderizar el componente con 0 documento: debe mostrar el mensaje informativo.
  b. Renderizar con 1 documento: comportamiento similar.
  c. Renderizar con 2 o más documentos: el componente debe comportarse como se espera (renderizando la matriz de dependencias).
  **Listo**
  [] Verificar que el componente se renderiza correctamente con 0, 1 y 2 o más documentos.
  [] Confirmar que no se introducen nuevos errores.

### Problemas Nº 5: Advertencia sobre CSS en Next.js
- Prioridad: 2
- [ ] **Descripción:** Next.js advierte que se ha deshabilitado el soporte built-in para CSS debido a la configuración personalizada.
  **Pasos**
  1. Consultar la documentación de Next.js sobre la advertencia de CSS deshabilitado.
  2. Verificar la configuración de PostCSS o Tailwind.
  **Pruebas**
  a. Asegurarse de que la configuración de CSS personalizada funciona correctamente.
  **Listo**
  [] Verificar que no haya advertencias sobre CSS en la compilación.

### Problemas Nº 6: Error en las importaciones y prerenderizado
- Prioridad: 1
- [ ] **Descripción:** El archivo de índice de hooks en `src/lib/hooks/templates/index.ts` no está exportando correctamente `useTemplateLoader` y `useTemplates`. Además, hay un error de prerenderización en la página "/_not-found".
  **Pasos**
  1. Actualizar las rutas de exportación en `src/lib/hooks/templates/index.ts`.
  2. Asegurarse de que `className` esté definido en el componente de la página de error `_not-found`.
  3. Ejecutar `pnpm build` y `docker compose up --build` para verificar los cambios.
  **Pruebas**
  a. Verificar que las importaciones de `useTemplateLoader` y `useTemplates` funcionen correctamente.
  b. Asegurarse de que la página de error se prerenderice sin errores.
  **Listo**
  [] Verificar que las importaciones y la prerenderización funcionen correctamente.

# Plan de Corrección y Mejora

## 1. Manejo de Errores en Componentes y APIs
- Ubicación relevante: [`src/components/`](src/components/), [`src/app/api/`](src/app/api/)
- Objetivos:
  - Agregar bloques try/catch en cada componente y endpoint API.
  - Garantizar la devolución de códigos de estado HTTP apropiados en las APIs.
  - Implementar un sistema de registro de errores (logging) para depuración.
- Pruebas recomendadas:
  - Suministrar datos inválidos a los componentes.
  - Enviar requests mal formados a los endpoints de la API.

## 2. Inconsistencia en Estilos
- Ubicación relevante: [`src/components/`](src/components/), [styles/](styles/)
- Objetivos:
  - Documentar una guía de estilos con Tailwind CSS.
  - Aplicar la guía de estilos de forma uniforme en todos los componentes.
  - Configurar e integrar un linter o comprobador de estilos.

## 3. Seguridad de Tipos en Plantillas
- Ubicación relevante: [`src/components/TemplateNode.tsx`](src/components/TemplateNode.tsx), [`src/components/TemplateCanvas.tsx`](src/components/TemplateCanvas.tsx), [`src/hooks/useTemplateLoader.ts`](src/hooks/useTemplateLoader.ts), [`src/hooks/useTemplates.ts`](src/hooks/useTemplates.ts), [`src/hooks/useTemplateValidation.ts`](src/hooks/useTemplateValidation.ts), [`src/hooks/useTemplateOperations.ts`](src/hooks/useTemplateOperations.ts)
- Objetivos:
  - Centralizar definiciones de tipos en [src/lib/types/templates/](src/lib/types/templates/).
  - Implementar y reforzar interfaces base y tipos comunes.
  - Asegurar la compatibilidad con componentes React Flow.
- Pruebas recomendadas:
  - Verificar que la compilación no devuelva errores de tipo.
  - Validar que todos los componentes reciban props estrictamente tipados.

## 4. Documentación de Arquitectura
- Ubicación relevante: [docs/](docs/), [`src/components/`](src/components/)
- Objetivos:
  - Crear diagramas de arquitectura que expliquen las interacciones clave.
  - Documentar cada componente para facilitar su mantenimiento.
  - Definir estándares de implementación comunes en todo el proyecto.
- Pruebas recomendadas:
  - Revisar la claridad de la arquitectura con el equipo.
  - Validar la existencia de ejemplos y referencias cruzadas.

## 5. Error en Renderizado de DocumentDependencyEditor
- Ubicación relevante: [`src/components/DocumentDependencyEditor.tsx`](src/components/DocumentDependencyEditor.tsx)
- Objetivos:
  - Validar la cantidad de documentos antes de renderizar dependencias.
  - Mostrar un aviso cuando los documentos no alcancen el mínimo requerido.
- Pruebas recomendadas:
  - Renderizar el componente con 0 y 1 documento para verificar el comportamiento esperado.
  - Renderizar con 2 o más documentos para confirmar la funcionalidad correcta.
