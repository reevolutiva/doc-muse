# Informe de Refactorización del Sistema de Testing - Doc-Muse

## 1. Resumen Ejecutivo

Este informe presenta un análisis detallado del estado actual del sistema de testing en el proyecto Doc-Muse, identificando problemas, inconsistencias y duplicaciones. Se propone un plan completo de refactorización para unificar, organizar y optimizar el sistema de testing, mejorando la mantenibilidad, cobertura y eficiencia.

## 2. Diagnóstico del Sistema Actual

### 2.1 Configuración

- **Archivos duplicados**: Se identificaron dos configuraciones de Jest ([`jest.config.js`](jest.config.js) y [`jest.config.cjs`](jest.config.cjs)) con configuraciones diferentes y potencialmente conflictivas.
- **Setup inconsistente**: [`jest.setup.js`](jest.setup.js) contiene todos los mocks centralizados, dificultando el mantenimiento.
- **Scripts redundantes**: Múltiples scripts en [`package.json`](package.json) relacionados con testing con propósitos superpuestos.

### 2.2 Organización

- **Estructura desordenada**: Los tests en [`__tests__`](__tests__) no reflejan la estructura de directorios de [`src`](src).
- **Mocks globales**: Todos los mocks están definidos en un solo archivo, sin separación por dominio o funcionalidad.
- **Scripts dispersos**: Scripts relacionados con testing distribuidos en diferentes carpetas sin organización clara.

### 2.3 Documentación

- **Docs desactualizados**: [`Docs/testing/test.md`](Docs/testing/test.md) no refleja el estado actual del sistema de testing.
- **Roadmap parcial**: [`Docs/testing/testing_roadmap.md`](Docs/testing/testing_roadmap.md) contiene información más reciente pero incompleta.

### 2.4 Cobertura

- **Umbrales inconsistentes**: 60% en `jest.config.js` vs 80% en `jest.config.cjs`.
- **Cobertura actual baja**: Aproximadamente 1.65% según el roadmap.

## 3. Problemas Identificados

1. **Configuración duplicada y contradictoria**: Múltiples archivos de configuración con diferentes parámetros.
2. **Mapeo de módulos inconsistente**: Diferentes patrones de `moduleNameMapper` entre archivos.
3. **Mocks centralizados y difíciles de mantener**: Todos los mocks en un solo archivo.
4. **Scripts redundantes y complejos**: Múltiples scripts con funcionalidades superpuestas.
5. **Estructura desorganizada de tests**: No refleja la estructura de código fuente.
6. **Documentación desactualizada**: No concuerda con la implementación actual.
7. **Pre-procesamiento innecesariamente complejo**: Scripts de shell que podrían simplificarse.

## 4. Plan de Refactorización

### 4.1 Unificación de Configuración

#### 4.1.1 Jest Configuration

```javascript
// filepath: /Users/giorgiolapietra/dev/Apps/kimfe/doc-muse/jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

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
  reporters: ['default', 'jest-junit'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### 4.1.2 Jest Setup

```javascript
// filepath: /Users/giorgiolapietra/dev/Apps/kimfe/doc-muse/jest.setup.js
import '@testing-library/jest-dom';

// Configuración global para evitar errores con matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Importar mocks modularizados
jest.mock('next/router', () => require('./__mocks__/next/router'));
jest.mock('@/lib/supabase', () => require('./__mocks__/lib/supabase'));
```

### 4.2 Reorganización de Mocks

#### 4.2.1 Estructura de directorios para mocks

```
doc-muse/
├── __mocks__/
│   ├── lib/
│   │   └── supabase.js
│   ├── next/
│   │   ├── router.js
│   │   └── navigation.js
│   └── components/
│       └── ui/
```

#### 4.2.2 Mock de Supabase

```javascript
// filepath: __mocks__/lib/supabase.js
export const supabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user-id' } } } }),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: {}, error: null }),
};
```

#### 4.2.3 Mock de Next Router

```javascript
// filepath: __mocks__/next/router.js
export const useRouter = jest.fn().mockReturnValue({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
});
```

### 4.3 Optimización de Scripts

#### 4.3.1 Scripts en package.json

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:ui": "jest --coverage --coverageReporters=html && open coverage/lcov-report/index.html",
  "test:ci": "jest --ci --coverage --reporters='default' --reporters='jest-junit'",
  "verify:test-files": "node scripts/verify-test-files.js"
}
```

#### 4.3.2 Script de verificación de archivos

```javascript
// filepath: scripts/verify-test-files.js
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/components/TemplateNode.tsx',
  'src/components/ui/avatar.tsx',
  'src/components/ui/breadcrumbs.tsx',
  'src/components/ui/form.tsx',
  'src/components/Sidebar.tsx',
  'src/components/DocumentList.tsx',
  'src/contexts/TemplateContext.tsx',
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));

if (missingFiles.length > 0) {
  console.error('⚠️ Archivos faltantes:');
  missingFiles.forEach(file => console.error(`  - ${file}`));
  process.exit(1);
}

console.log('✅ Todos los archivos necesarios existen');
```

### 4.4 Estandarización de Estructura de Tests

#### 4.4.1 Estructura de directorios para tests

```
doc-muse/
├── __tests__/
│   ├── api/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.test.tsx
│   │   │   ├── Input.test.tsx
│   │   │   └── ...
│   │   └── Canvas.test.tsx
│   ├── hooks/
│   │   ├── useAuth.test.tsx
│   │   └── useTemplates.test.tsx
│   └── pages/
│       └── index.test.tsx
```

#### 4.4.2 Plantilla para tests de componentes

```typescript
// filepath: templates/component-test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '@/components/path/to/component';

describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
  
  test('handles user interactions correctly', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

#### 4.4.3 Plantilla para tests de hooks

```typescript
// filepath: templates/hook-test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useHookName } from '@/hooks/useHookName';

describe('useHookName', () => {
  test('returns initial state correctly', () => {
    const { result } = renderHook(() => useHookName());
    expect(result.current.state).toEqual(expectedInitialState);
  });
  
  test('updates state correctly when action is called', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useHookName());
    
    act(() => {
      result.current.action();
    });
    
    await waitForNextUpdate();
    expect(result.current.state).toEqual(expectedUpdatedState);
  });
});
```

### 4.5 Configuración CI/CD

#### 4.5.1 GitHub Actions workflow

```yaml
# filepath: .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main, development]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Run tests
        run: pnpm test:ci
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

#### 4.5.2 Configuración de Husky

```json
// filepath: package.json (sección husky)
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "jest --bail --findRelatedTests"
  ]
}
```

## 5. Plan de Implementación

### Fase 1: Limpieza y Unificación (1-2 días)

1. Eliminar archivos redundantes:
   ```bash
   rm jest.config.cjs
   ```

2. Unificar configuración de Jest:
   - Actualizar `jest.config.js` con la configuración consolidada
   - Ajustar los umbrales de cobertura a un valor realista (70%)

3. Reorganizar scripts en `package.json`:
   - Simplificar y aclarar los propósitos de cada script
   - Eliminar scripts redundantes

### Fase 2: Estructura y Organización (2-3 días)

1. Crear estructura de directorios para mocks:
   ```bash
   mkdir -p __mocks__/lib __mocks__/next __mocks__/components
   ```

2. Implementar mocks modulares:
   - Crear mocks individuales para Supabase, Next.js, etc.
   - Actualizar `jest.setup.js` para importar estos mocks

3. Reorganizar estructura de tests para reflejar `src`:
   ```bash
   mkdir -p __tests__/api __tests__/hooks __tests__/components/ui
   ```

### Fase 3: Automatización y CI/CD (1-2 días)

1. Configurar GitHub Actions:
   ```bash
   mkdir -p .github/workflows
   touch .github/workflows/test.yml
   ```

2. Implementar Husky para pre-commit hooks:
   - Actualizar configuración en `package.json`
   - Verificar que los tests se ejecuten antes de cada commit

### Fase 4: Documentación y Finalización (1-2 días)

1. Crear documentación actualizada:
   ```bash
   mkdir -p docs/testing
   touch docs/testing/guide.md docs/testing/best-practices.md
   ```

2. Actualizar `testing_roadmap.md` con el estado actual
3. Crear ejemplos y plantillas para nuevos tests

## 6. Estructura Final Propuesta

```
doc-muse/
├── __mocks__/                   # Mocks organizados por dominio
│   ├── lib/
│   │   └── supabase.js
│   ├── next/
│   │   ├── router.js
│   │   └── navigation.js
│   └── components/
├── __tests__/                   # Tests organizados reflejando src/
│   ├── api/
│   ├── components/
│   │   ├── ui/
│   │   └── ...
│   ├── hooks/
│   └── pages/
├── .github/
│   └── workflows/
│       └── test.yml             # Workflow de GitHub Actions
├── docs/
│   └── testing/
│       ├── guide.md             # Guía de testing actualizada
│       ├── best-practices.md    # Mejores prácticas
│       └── testing_roadmap.md   # Roadmap actualizado
├── scripts/
│   └── verify-test-files.js     # Script simplificado
├── templates/                   # Plantillas para nuevos tests
│   ├── component-test.tsx
│   └── hook-test.tsx
├── jest.config.js               # Configuración unificada
├── jest.setup.js                # Setup global simplificado
└── package.json                 # Scripts optimizados
```

## 7. Dependencias Necesarias

```json
"devDependencies": {
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^14.3.1",
  "@testing-library/react-hooks": "^8.0.1",
  "@testing-library/user-event": "^14.6.1",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",
  "jest-junit": "^16.0.0",
  "ts-jest": "^29.2.6",
  "husky": "^7.0.4",
  "lint-staged": "^12.1.2"
}
```

## 8. Conclusiones y Recomendaciones

1. **Enfoque progresivo**: Implementar los cambios por fases para minimizar interrupciones.
2. **Documentación continua**: Mantener la documentación actualizada a medida que evoluciona el sistema.
3. **Revisión regular**: Programar revisiones trimestrales del sistema de testing.
4. **Capacitación**: Asegurar que todos los desarrolladores conozcan las nuevas convenciones y estructura.
5. **Mejora continua**: Utilizar métricas de cobertura para identificar áreas de mejora.

Esta refactorización permitirá un sistema de testing más organizado, mantenible y efectivo, facilitando la incorporación de nuevos tests y mejorando la confiabilidad del código.
