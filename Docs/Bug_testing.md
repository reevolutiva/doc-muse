# Problema o Feature [Optimización del Sistema de Testing en Proyecto con ESM]

Assignees: 
Labels: bug, testing, setup
Milestone: Configuración de Testing
Projects: Kimfe

## Descripción del problema o feature

El proyecto Kimfe enfrenta problemas con la configuración de testing debido a conflictos entre ESM y CommonJS. Los errores incluyen:

1. Configuración inconsistente entre `"type": "module"` en `package.json` y Jest.
2. Errores de módulos no encontrados como `@testing-library/jest-dom/extend-expect`.
3. Advertencias de módulos obsoletos (`punycode`).
4. Archivos de configuración duplicados (`jest.config.js` y `jest.config.cjs`).

Estos problemas bloquean la ejecución de pruebas y afectan el desarrollo.

## Plan de Acción

### Fase 1: Análisis y Preparación
- Documentar errores actuales y su origen.
- Revisar configuración en `package.json` y archivos de Jest.
- Determinar estrategia para resolver conflictos entre ESM y CommonJS.

### Fase 2: Consolidación de Archivos de Configuración
- Eliminar `jest.config.js` y usar solo `jest.config.cjs`.
- Verificar que no haya archivos redundantes.
- Actualizar documentación para reflejar estos cambios.

### Fase 3: Implementación de la Solución
- Actualizar `jest.config.cjs` con sintaxis correcta.
- Renombrar `jest.setup.js` a `jest.setup.cjs` y corregir importaciones.
- Instalar dependencias faltantes.
- Actualizar mocks para compatibilidad con ESM.

### Fase 4: Optimización de Comandos
- Actualizar scripts en `package.json` para usar configuración correcta.
- Añadir flags como `--no-warnings` para suprimir advertencias.
- Crear scripts específicos para diferentes tipos de tests.

### Fase 5: Documentación y Verificación
- Actualizar documentación de testing.
- Crear ejemplos de tests funcionales.
- Verificar ejecución exitosa de pruebas existentes.

## Rutas involucradas

1. [package.json](/Users/giorgiolapietra/Documents/GitHub/Kimfe/package.json)
2. [jest.config.cjs](/Users/giorgiolapietra/Documents/GitHub/Kimfe/jest.config.cjs)
3. [jest.setup.cjs](/Users/giorgiolapietra/Documents/GitHub/Kimfe/jest.setup.cjs)
4. [Docs/testing/testing-inform.md](/Users/giorgiolapietra/Documents/GitHub/Kimfe/Docs/testing/testing-inform.md)
5. [Docs/testing/test_docs.md](/Users/giorgiolapietra/Documents/GitHub/Kimfe/Docs/testing/test_docs.md)

## Pruebas y definición de listos

- [ ] El comando `pnpm test` se ejecuta sin errores de configuración.
- [ ] Los errores de "Cannot find module '@testing-library/jest-dom/extend-expect'" están resueltos.
- [ ] No hay errores relacionados con módulos no encontrados.
- [ ] Las advertencias de punycode están suprimidas con `--no-warnings`.
- [ ] Los tests existentes funcionan correctamente.
- [ ] La documentación de testing está actualizada y es consistente.

## Notas adicionales

### Problemas detectados
1. Persistencia de referencias a `jest.setup.js` en lugar de `jest.setup.cjs`.
2. Importaciones problemáticas de bibliotecas como `@testing-library/jest-dom`.

### Consideraciones futuras
- Evaluar migración completa a ESM usando `.mjs`.
- Mantener documentación actualizada sobre compatibilidad ESM/CommonJS.
