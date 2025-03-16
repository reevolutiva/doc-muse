# Bug Fixer

Este documento rastrea bugs y problemas en la aplicación Doc-Muse que necesitan resolución.

# Bug Fixer Documentation

## Estructura del Repositorio

La aplicación Doc-Muse está organizada con la siguiente estructura:

### Directorios Principales
- **src/**: Código fuente principal de la aplicación
  - **app/**: Rutas y páginas de la aplicación utilizando Next.js App Router
  - **components/**: Componentes React reutilizables
  - **hooks/**: Custom hooks para lógica compartida
  - **lib/**: Funciones de utilidad y configuración
    - **supabase.ts**: Cliente y configuración de Supabase
    - **types/**: Definiciones de tipos TypeScript
    - **utils/**: Funciones de utilidad general
  - **styles/**: Estilos globales

- **supabase/**: Configuración y funciones relacionadas con Supabase
  - **functions/**: Funciones Edge de Supabase (serverless)
  - **migrations/**: Scripts SQL para la inicialización de la base de datos
  - **config.toml**: Configuración del proyecto Supabase

- **public/**: Archivos estáticos accesibles públicamente
- **Docs/**: Documentación del proyecto
- **scripts/**: Scripts de utilidad para desarrollo y despliegue

### Archivos de Configuración
- **next.config.js**: Configuración de Next.js
- **package.json**: Dependencias y scripts del proyecto
- **docker-compose.yml** y **Dockerfile**: Configuración para despliegue con Docker
- **tailwind.config.ts**: Configuración de Tailwind CSS
- **.env.local**: Variables de entorno locales (gitignored)

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
