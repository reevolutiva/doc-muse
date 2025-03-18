# Sistema de Testing - Fuente de la Verdad

Este documento centraliza toda la información relacionada con el sistema de testing en el proyecto Kimfe.

---

## Diseño del Sistema de Testing

### Framework y Herramientas

- **Framework Principal**: Jest
- **Bibliotecas Complementarias**:
  - `@testing-library/react`: Para pruebas de componentes React.
  - `@testing-library/jest-dom`: Extensiones para aserciones en el DOM.
  - `jest-environment-jsdom`: Entorno de pruebas para simulación del navegador.

### Configuración

- **Archivo de Configuración**: `jest.config.js`
- **Setup Global**: `jest.setup.js` para inicializar mocks y configuraciones globales.
- **Cobertura de Código**:
  - Umbral global: 70% para declaraciones, ramas, funciones y líneas.
  - Directorio de salida: `coverage/`.

### Configuración de Jest para Next.js 14

```javascript
// jest.config.js
const createJestConfig = require('next/jest');

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  // Configuración adicional...
};

module.exports = createJestConfig({ dir: './' })(customJestConfig);
```

> **Nota importante**: En Next.js 14, `createJestConfig` es una exportación por defecto, no una exportación nombrada. Utilizar la sintaxis correcta es fundamental para evitar errores de tipo.

---

## Instrucciones para Ejecutar Pruebas

### Instalación de Dependencias

Asegúrate de instalar todas las dependencias necesarias antes de ejecutar las pruebas:

```bash
pnpm install
```

### Comandos Principales

1. **Ejecutar Todas las Pruebas**:
   ```bash
   pnpm test
   ```

2. **Ejecutar Pruebas en Modo Observador**:
   ```bash
   pnpm test --watch
   ```

3. **Generar Reporte de Cobertura**:
   ```bash
   pnpm test --coverage
   ```

4. **Depurar Pruebas**:
   Ejecuta pruebas específicas con el flag `--testNamePattern`:
   ```bash
   pnpm test --testNamePattern="nombre_de_la_prueba"
   ```

5. **Suprimir Advertencias** (como la deprecación de punycode):
   ```bash
   pnpm test --no-warnings
   ```

---

## Buenas Prácticas

1. **Escribir Pruebas Unitarias**:
   - Cubre funciones y hooks personalizados.
   - Usa mocks para dependencias externas como `supabase`.

2. **Implementar Pruebas de Integración**:
   - Asegura que las rutas principales (`/projects`, `/templates`) funcionan correctamente.

3. **Mantener Cobertura**:
   - Revisa el reporte de cobertura regularmente.
   - Prioriza módulos con menos del 70% de cobertura.

4. **Documentar Casos de Prueba**:
   - Añade descripciones claras para cada prueba.
   - Usa comentarios para explicar lógica compleja.

---

## Problemas Comunes y Soluciones

### 1. Error con sintaxis de importación en `next/jest`

**Error:**
```
Type error: Module '"next/jest.js"' has no exported member 'createJestConfig'.
```

**Solución:**
Usar la sintaxis de importación correcta para Next.js 14:
```javascript
const createJestConfig = require('next/jest');
// NO usar: const { createJestConfig } = require('next/jest');
```

### 2. Advertencias de deprecación de punycode

**Error:**
```
[DEP0040] DeprecationWarning: The `punycode` module is deprecated.
```

**Solución:**
Estas advertencias provienen de dependencias internas y no afectan la funcionalidad. Puedes suprimirlas usando la bandera `--no-warnings` en tu comando de prueba.

---

## Notas Adicionales

- Configura las variables de entorno en `.env.local` antes de ejecutar pruebas que dependan de Supabase.
- Utiliza `jest.mock` para evitar llamadas reales a servicios externos.
- Consulta `Docs/testing/testing-inform.md` para más detalles sobre el estado actual del sistema de testing.
- Considera actualizar periódicamente tus dependencias de testing para mantener compatibilidad con las últimas versiones de Next.js.
