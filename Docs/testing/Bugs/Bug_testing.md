# Plan de Acción: Optimización del Sistema de Testing con ESM

## Problema o Feature [Optimización del Sistema de Testing en Proyecto con ESM]

Assignees: 
Labels: bug, testing, setup
Milestone: Configuración de Testing
Projects: Kimfe

## Descripción del problema o feature

El proyecto Kimfe está enfrentando múltiples problemas con la configuración de testing debido al conflicto entre:

1. El proyecto está configurado como ESM (`"type": "module"` en package.json).
2. La configuración de Jest utiliza sintaxis CommonJS (`require()`).
3. Hay errores de módulos no encontrados como `@testing-library/jest-dom/extend-expect`.
4. Aparecen advertencias de módulo obsoleto (`punycode`).
5. Existen archivos duplicados de configuración (`jest.config.js` y `jest.config.cjs`).

Estos problemas impiden ejecutar las pruebas correctamente y están bloqueando el desarrollo.

## Plan de Acción

### Fase 1: Análisis y Preparación
- [x] Documentar los errores actuales y su origen.
- [x] Revisar la configuración del proyecto en `package.json` y archivos de Jest.
- [x] Determinar la estrategia para resolver conflictos entre ESM y CommonJS.

### Fase 2: Consolidación de Archivos de Configuración
- [x] Elegir una nomenclatura consistente para archivos de configuración.
  - [x] Eliminar `jest.config.js` y usar únicamente `jest.config.cjs`.
  - [x] Verificar que no haya otros archivos redundantes.
- [x] Actualizar la documentación para reflejar estos cambios.

### Fase 3: Implementación de la Solución
- [x] Actualizar `jest.config.cjs` para usar la sintaxis correcta con Next.js 14.
- [x] Actualizar `jest.setup.js`:
  - [x] Renombrarlo a `jest.setup.cjs` para mantener coherencia.
  - [x] Corregir importaciones problemáticas de bibliotecas como `@testing-library/jest-dom`.
- [x] Revisar e instalar dependencias faltantes.
- [x] Actualizar los mocks para que funcionen correctamente con ESM.

### Fase 4: Optimización de Comandos
- [x] Actualizar scripts en `package.json` para usar la configuración correcta.
  - [x] Añadir flags relevantes como `--no-warnings` para suprimir advertencias de punycode.
- [ ] Crear scripts específicos para diferentes tipos de tests (unitarios, integración).

### Fase 5: Documentación y Verificación
- [x] Actualizar `test.md` y otros documentos de testing.
- [ ] Crear ejemplos de tests que funcionen correctamente con la nueva configuración.
- [ ] Verificar la ejecución exitosa de pruebas existentes.

## Rutas involucradas

1. [package.json](/Users/giorgiolapietra/Documents/GitHub/Kimfe/package.json) - Configuración del proyecto y scripts.
2. [jest.config.cjs](/Users/giorgiolapietra/Documents/GitHub/Kimfe/jest.config.cjs) - Configuración principal de Jest.
3. [jest.setup.cjs](/Users/giorgiolapietra/Documents/GitHub/Kimfe/jest.setup.cjs) - Configuración de setup para tests.
4. [Docs/testing/testing-inform.md](/Users/giorgiolapietra/Documents/GitHub/Kimfe/Docs/testing/testing-inform.md) - Documentación de testing.
5. [Docs/testing/test_docs.md](/Users/giorgiolapietra/Documents/GitHub/Kimfe/Docs/testing/test_docs.md) - Fuente única de la verdad para testing.

## Pasos de implementación detallados

### 1. Consolidar archivos de configuración

```bash
# Asegurarse de que jest.config.cjs es el único archivo de config
rm jest.config.js  # Si existe
```

### 2. Actualizar jest.config.cjs

```javascript
// jest.config.cjs
const createJestConfig = require('next/jest');

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],  // Actualizar extensión
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};

module.exports = createJestConfig({ dir: './' })(customJestConfig);
```

### 3. Actualizar jest.setup.js a jest.setup.cjs

```javascript
// jest.setup.cjs
require('@testing-library/jest-dom');

// Mock para next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock para supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: {}, error: null }),
  },
}));
```

### 4. Actualizar scripts en package.json

```json
"scripts": {
  "test": "node --no-warnings node_modules/.bin/jest",
  "test:watch": "node --no-warnings node_modules/.bin/jest --watch",
  "test:coverage": "node --no-warnings node_modules/.bin/jest --coverage",
  "test:ci": "node --no-warnings node_modules/.bin/jest --ci --coverage --reporters='default' --reporters='jest-junit'"
}
```

## Pruebas y definición de listos

- [x] El comando `pnpm test` se ejecuta sin errores de configuración.
- [x] Los errores de "require is not defined" están resueltos.
- [x] No hay errores relacionados con módulos no encontrados.
- [x] Las advertencias de punycode están suprimidas.
- [ ] Los tests existentes funcionan correctamente.
- [ ] La documentación de testing está actualizada y es consistente.

## Notas adicionales

### Problema raíz
El problema principal es la incompatibilidad entre la configuración del proyecto como ESM y las herramientas de testing que utilizan CommonJS. En lugar de cambiar la configuración global del proyecto (lo que afectaría múltiples archivos), estamos adoptando un enfoque que mantiene la configuración ESM pero utiliza archivos `.cjs` para las configuraciones específicas que necesitan sintaxis CommonJS.

### Consideraciones para el futuro
1. Si los problemas persisten, considerar usar `@jest/globals` para importar Jest en archivos ESM.
2. Evaluar la posibilidad de migrar completamente a ESM en el futuro (usando `.mjs` para configuraciones).
3. Mantener documentación actualizada sobre el sistema dual ESM/CommonJS.

### Registro de Progreso

| Fecha       | Tarea                           | Estado     | Notas                       |
|-------------|---------------------------------|------------|-----------------------------|
| 2025-03-18  | Consolidación de archivos       | ✅ Completado | Configuración unificada     |
| 2025-03-19  | Actualización de jest.setup.cjs | ✅ Completado | Mock de Supabase actualizado |
| 2025-03-20  | Actualización de scripts        | ✅ Completado | Scripts optimizados         |
| 2025-03-21  | Verificación de pruebas         | 🟡 En progreso | Tests existentes en revisión |