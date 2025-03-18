# Estado Actual del Sistema de Testing

## Configuración Actual

- **Framework de Testing**: Jest
- **Integración con Next.js**: Configuración actualizada para Next.js 14.2.x utilizando `next/jest`.
- **Entorno de Pruebas**: `jest-environment-jsdom` para pruebas en el navegador.
- **Cobertura de Código**:
  - Se recopilan métricas de cobertura para todos los archivos en `src/`.
  - Se excluyen archivos `.d.ts`, `_*.{js,jsx,ts,tsx}`, y directorios como `node_modules` y `.next`.
  - Umbral global de cobertura: 70% para declaraciones, ramas, funciones y líneas.

## Problemas Resueltos

1. ✅ **Actualización de Configuración Jest**: La configuración ha sido actualizada para ser compatible con Next.js 14.2.x (sintaxis de importación corregida).
2. **Cobertura Baja**: Algunos módulos clave no alcanzan el umbral de cobertura del 70%.
3. **Falta de Pruebas Unitarias**: Varias funciones críticas no tienen pruebas unitarias.
4. **Falta de Documentación**: No existe una guía centralizada para ejecutar y escribir pruebas.

## Tareas Pendientes

- [ ] **Actualizar Pruebas Existentes**: Revisar y actualizar las pruebas para que sean compatibles con la nueva configuración.
- [ ] **Añadir Pruebas Unitarias**: Crear pruebas para módulos críticos que actualmente no están cubiertos.
- [ ] **Implementar Pruebas de Integración**: Asegurar que las rutas y componentes principales funcionan correctamente.
- [ ] **Documentar el Sistema de Testing**: Crear un archivo `test.md` como única fuente de la verdad para pruebas.

## Próximos Pasos

1. **Revisar Cobertura**:
   - Ejecutar `pnpm test --coverage` para identificar áreas con baja cobertura.
   - Priorizar módulos con menos del 70% de cobertura.

2. **Añadir Pruebas**:
   - Escribir pruebas unitarias para los hooks personalizados (`useAuth`, `useProjects`, etc.).
   - Implementar pruebas de integración para rutas críticas (`/projects`, `/templates`).

3. **Optimizar Configuración**:
   - Configurar `jest.setup.js` para inicializar mocks y configuraciones globales.
   - Integrar herramientas como `@testing-library/react` para pruebas de componentes.

4. **Documentar**:
   - Consolidar toda la información en `Docs/test_docs.md`.

---

## Instrucciones para Ejecutar Pruebas

1. **Instalar Dependencias**:
   ```bash
   pnpm install
   ```

2. **Ejecutar Pruebas**:
   ```bash
   pnpm test
   ```

3. **Generar Reporte de Cobertura**:
   ```bash
   pnpm test --coverage
   ```

4. **Depurar Pruebas**:
   ```bash
   pnpm test --watch
   ```

## Notas Adicionales

- Asegúrate de que las variables de entorno en `.env.local` estén configuradas correctamente para pruebas que dependan de Supabase.
- Utiliza `jest.mock` para simular dependencias externas como `supabase` y evitar llamadas reales a la base de datos.
- Si encuentras advertencias de punycode, puedes usar la opción `--no-warnings` en tu comando de prueba (`pnpm test --no-warnings`).

## Configuración Jest Actual

```javascript
// jest.config.js
const createJestConfig = require('next/jest');

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
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
