# Configuración de GitHub Actions para CI/CD en Doc-Muse

Este documento proporciona instrucciones detalladas para configurar GitHub Actions para CI/CD en el proyecto Doc-Muse, con enfoque en la automatización de tests.

## Estructura del Workflow

Crearemos dos workflows principales:
1. **Test Workflow**: Para ejecutar tests unitarios y de integración
2. **E2E Workflow**: Para ejecutar tests end-to-end con Cypress

## Test Workflow

Crear el archivo `.github/workflows/test.yml`:

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: Run Test Suite
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run type checking
        run: pnpm tsc --noEmit
      
      - name: Run tests
        run: pnpm test
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          directory: ./coverage
          fail_ci_if_error: false
```

## E2E Workflow

Crear el archivo `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  cypress:
    name: Cypress E2E Tests
    runs-on: ubuntu-latest
    
    services:
      # Configuración de Supabase local para las pruebas E2E
      supabase:
        image: supabase/supabase-local:latest
        ports:
          - 54321:54321
          - 54322:54322
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Setup environment variables
        run: |
          echo "NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321" >> $GITHUB_ENV
          echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." >> $GITHUB_ENV
      
      - name: Setup Supabase database
        run: |
          pnpm supabase db push
      
      - name: Build Next.js app
        run: pnpm build
      
      - name: Start Next.js app in background
        run: pnpm start & sleep 10
      
      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          browser: chrome
          headed: false
          wait-on: 'http://localhost:3000'
      
      - name: Upload Cypress screenshots on failure
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
      
      - name: Upload Cypress videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
```

## Pull Request Workflow para Tests Unitarios

Crear el archivo `.github/workflows/pr-tests.yml` para ejecutar tests unitarios rápidos en cada PR:

```yaml
name: PR Tests

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests for changed files only
        uses: ArtiomTr/jest-coverage-report-action@v2
        with:
          package-manager: pnpm
          test-script: jest --coverage --changedSince=origin/main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          annotations: failed-tests
```

## Configuración para Test Coverage

Para habilitar la cobertura de código y la integración con Codecov:

1. Modificar el archivo `jest.config.js`:

```javascript
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
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

2. Añadir script a `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## Configuración de Husky para Pre-commit Hooks

Para ejecutar tests antes de cada commit:

1. Instalar Husky y lint-staged:

```bash
pnpm add -D husky lint-staged
```

2. Configurar Husky:

```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

3. Configurar lint-staged en `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "jest --bail --findRelatedTests"
  ]
}
```

## Visualización de Resultados de Tests en GitHub

Para aprovechar al máximo la integración con GitHub:

1. **GitHub Status Checks**: Los workflows crearán automáticamente status checks en los PRs.

2. **PR Comments**: Usar acciones como `ArtiomTr/jest-coverage-report-action` para agregar comentarios con resultados de tests:

```yaml
- name: Report test coverage
  uses: ArtiomTr/jest-coverage-report-action@v2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    test-script: pnpm test:coverage
    package-manager: pnpm
    annotations: coverage,failed-tests
```

3. **Test Summaries**: Configurar GitHub Actions para generar informes:

```yaml
- name: Test Summary
  uses: test-summary/action@v2
  with:
    paths: "jest-junit.xml"
  if: always()
```

## Integración con Codecov

Para visualizar tendencias de cobertura y mostrar badges:

1. Registrar el proyecto en [Codecov](https://codecov.io)
2. Generar un token y agregarlo como secreto `CODECOV_TOKEN` en GitHub
3. Incluir el badge en el README:

```markdown
[![codecov](https://codecov.io/gh/username/doc-muse/branch/main/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/username/doc-muse)
```

## Optimización de Rendimiento

Para acelerar los pipelines de CI/CD:

1. **Caché de dependencias**:
```yaml
- name: Cache pnpm dependencies
  uses: actions/cache@v3
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-
```

2. **Test splitting** para tests largos:
```yaml
- name: Split tests
  uses: jwalton/gh-find-current-pr@v1
  id: findPr

- name: Run tests (parallel)
  uses: nick-fields/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: pnpm test --shard=${{ matrix.shard }}/${{ matrix.total }}
  strategy:
    matrix:
      shard: [1, 2, 3, 4]
      total: [4]
```

## Notificaciones de Fallos

Para notificar fallos en los tests:

```yaml
- name: Notify Slack on failure
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,eventName,ref,workflow
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
  if: failure()
```

## Pasos de Implementación

1. Crear la estructura de directorios:
   ```bash
   mkdir -p .github/workflows
   ```

2. Crear los archivos de workflow
3. Configurar Husky para pre-commit hooks
4. Configurar Codecov
5. Actualizar README con badges de status de CI

## Resolución de Problemas Comunes

### Problema: Tests no ejecutados en CI

**Solución:** Verificar que los tests están utilizando la extensión correcta (`.test.ts` o `.spec.ts`) y que los patrones en la configuración de Jest los incluyen.

### Problema: Tests que funcionan localmente pero fallan en CI

**Solución:** Verificar diferencias de entorno, especialmente:
- Versiones de Node.js
- Variables de entorno faltantes
- Problemas de zona horaria
- Problemas de permisos de archivos

### Problema: Tests lentos en CI

**Solución:**
- Utilizar paralelismo con la estrategia matrix de GitHub Actions
- Optimizar los mocks para reducir dependencias externas
- Utilizar `--changedSince` para ejecutar solo los tests relevantes