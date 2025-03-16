# Inventario de Componentes y Hooks de Plantillas

Este documento cataloga todas las implementaciones relacionadas con plantillas en Doc-Muse para identificar duplicaciones y determinar la estructura óptima.

## Hooks

1. **useTemplateLoader**
   - Ubicación: `/src/lib/hooks/useTemplateLoader.ts`
   - Funcionalidad: Carga datos de plantillas desde Supabase basado en un projectId
   - Dependencias: `useSupabaseQuery`
   - Retorna: `{ templateData, loading, error }`

2. **useTemplates**
   - Ubicación: `/src/lib/hooks/useTemplates.ts`
   - Funcionalidad: Wrapper sobre useTemplateLoader que añade la función createDocument
   - Dependencias: `useTemplateLoader`
   - Retorna: `{ templateData, loading, error, createDocument }`

## Componentes

1. **TemplateList**
   - Ubicación: `/src/components/template-manager/template-list.tsx`
   - Funcionalidad: Componente avanzado para mostrar, editar, previsualizar y eliminar plantillas
   - Características:
     - Filtrado por tipo
     - Vista previa
     - Edición
     - Eliminación con confirmación
     - Conversión de plantillas
   - Componentes relacionados: `ConvertTemplateDialog`

2. **ProjectTemplateInfo**
   - Ubicación: `/src/components/project-edit/project-template-info.tsx`
   - Funcionalidad: Muestra información básica de una plantilla de proyecto
   - Características:
     - Muestra descripción de la plantilla
     - Lista documentos requeridos
   - Implementación propia que no reutiliza los hooks existentes

## Duplicaciones Identificadas

- **Carga de datos de plantillas**: ProjectTemplateInfo implementa su propia lógica de carga en lugar de usar useTemplateLoader
- **Manejo de errores**: Hay variaciones en cómo se manejan los errores entre componentes

## Recomendación

1. **Hooks**:
   - Mantener `useTemplateLoader` y `useTemplates` en `src/lib/hooks/templates/`
   - Refactorizar `ProjectTemplateInfo` para utilizar estos hooks

2. **Componentes**:
   - Mantener `TemplateList` como componente principal en `src/components/templates/`
   - Considerar `ProjectTemplateInfo` como una vista específica que podría utilizar componentes compartidos

3. **Estructura**:
   - Consolidar todas las definiciones de tipos en `src/lib/types/template.ts`
   - Mover servicios relacionados a `src/lib/services/templates/`
