# Roadmap de Implementación de Testing para Doc-Muse

Este roadmap presenta un plan estructurado y secuencial para implementar un sistema de testing completo para el proyecto Doc-Muse. El plan está diseñado para ser ejecutado en fases progresivas, construyendo sobre la base existente documentada en `test.md`.

## Resumen Ejecutivo

| Fase                        | Duración | Recursos       | Dependencias | Estado      |
|-----------------------------|----------|----------------|--------------|-------------|
| 1. Evaluación y Configuración | 1 semana | 1 desarrollador| Ninguna      | ✅ Completado |
| 2. Tests Unitarios          | 2 semanas| 1-2 desarrolladores | Fase 1   | 🟡 En progreso |
| 3. Automatización CI/CD     | 1 semana | 1 desarrollador| Fase 2      | ⬜ Pendiente |
| 4. Tests Integración/E2E    | 2 semanas| 1-2 desarrolladores | Fase 3  | ⬜ Pendiente |
| 5. Optimización y Documentación | 1 semana | 1 desarrollador | Fase 4   | ⬜ Pendiente |

## Progreso Actual

**Fecha de actualización**: [CURRENT_DATE]

### Tests Implementados:
- ✅ Button component (`__tests__/components/ui/Button.test.tsx`)
- ✅ Input component (`__tests__/components/ui/Input.test.tsx`)
- ✅ Canvas component (`__tests__/components/Canvas.test.tsx`)
- ✅ Badge component (`__tests__/components/ui/Badge.test.tsx`)

### Cobertura Actual:
- Button: 100%
- Input: 100%
- Badge: 83.33%
- Canvas: 42.25%
- **Global**: ~1.65% (se espera incrementar con tests adicionales)

### Problemas Resueltos:
- ✅ Configuración de moduleNameMapper en Jest para mapear correctamente los alias `@/components/` a `<rootDir>/src/components/`
- ✅ Instalación y configuración de `@testing-library/user-event` para simular interacciones de usuario
- ✅ Implementación de mocks para componentes externos como ReactFlow/XYFlow

## Próximos Tests Prioritarios

A continuación se presenta una lista de los 10 tests más prioritarios a implementar para aumentar la cobertura:

1. **Card Component** (`src/components/ui/card.tsx`)
   - Componente UI básico reutilizado en múltiples vistas
   - Pruebas: renderizado básico, aplicación de clases personalizadas, renderizado de subcomponentes (CardHeader, CardContent, etc)

2. **Dialog Component** (`src/components/ui/dialog.tsx`)
   - Componente crítico para interacciones modales en la aplicación
   - Pruebas: apertura/cierre, interacción con botones, manejo de contenido dinámico

3. **Select Component** (`src/components/ui/select.tsx`)
   - Componente de formulario esencial usado en múltiples flujos de usuario
   - Pruebas: selección de opciones, cambios de estado, accesibilidad

4. **useTemplates Hook** (`src/hooks/useTemplates.ts`)
   - Hook crítico para la gestión de plantillas
   - Pruebas: carga de datos, manejo de errores, actualización de plantillas

5. **TemplateNode Component** (`src/components/TemplateNode.tsx`)
   - Componente fundamental para el editor de plantillas
   - Pruebas: renderizado con diferentes tipos de datos, interacciones de usuario, conexiones con otros nodos

6. **Sidebar Component** (`src/components/Sidebar.tsx`)
   - Componente de navegación principal
   - Pruebas: renderizado de links, estados activos, colapso/expansión

7. **DocumentList Component** (`src/components/DocumentList.tsx`)
   - Componente crítico para mostrar listas de documentos
   - Pruebas: renderizado con datos, filtrado, ordenamiento

8. **Breadcrumbs Component** (`src/components/ui/breadcrumbs.tsx`)
   - Componente de navegación importante 
   - Pruebas: renderizado de rutas, navegación entre páginas

9. **Avatar Component** (`src/components/ui/avatar.tsx`)
   - Componente UI básico reutilizado en áreas clave
   - Pruebas: renderizado con diferentes props, fallbacks para imágenes

10. **Form Components** (`src/components/ui/form.tsx` y componentes relacionados)
    - Componentes críticos para entradas de usuario
    - Pruebas: validación, envío de formularios, manejo de errores

## Fase 1: Evaluación y Configuración Inicial (Semana 1)

### 1.1 Análisis del Estado Actual

**Actividades:**
- ✅ Ejecutar evaluación de cobertura inicial para establecer línea base
- ✅ Identificar componentes críticos que requieren pruebas prioritarias
- ✅ Mapear flujos de usuario principales para pruebas E2E
- ✅ Revisar configuración actual de Jest y TypeScript

**Comandos:**
```bash
# Ejecutar cobertura inicial
pnpm test:coverage
```

**Entregables:**
- ✅ Informe de estado actual de testing con métricas de cobertura
- ✅ Lista priorizada de componentes para implementación de tests
- ✅ Mapa de flujos de usuario críticos para tests E2E

### 1.2 Configuración del Entorno Base

**Actividades:**
- ✅ Verificar y actualizar dependencias necesarias para testing
- ✅ Configurar estructuras de directorios para tests
- ✅ Implementar configuración básica de Jest y RTL

**Comandos:**
```bash
# Instalación de dependencias
pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest identity-obj-proxy

# Crear estructura de directorios
mkdir -p __tests__/components
mkdir -p __tests__/pages
mkdir -p __tests__/hooks
mkdir -p __tests__/api
```

**Archivos a configurar:**

1. `jest.config.js` (actualizar):
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
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
};

module.exports = createJestConfig(customJestConfig);
```

2. `jest.setup.js` (actualizar):
```javascript
import '@testing-library/jest-dom';

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

3. `package.json` (actualizar scripts):
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

**Entregables:**
- ✅ Entorno de testing configurado y funcional
- ✅ Scripts de testing integrados en el flujo de trabajo

## Fase 2: Implementación de Tests Unitarios (Semanas 2-3)

### 2.1 Tests para Componentes UI Básicos

**Actividades:**
- 🟡 Implementar tests para componentes UI fundamentales
- ⬜ Priorizar componentes reutilizables y críticos para el negocio
- ⬜ Implementar tests para layout y navegación

**Componentes prioritarios:**
1. ✅ Button
2. ✅ Input
3. ✅ Badge
4. ⬜ Card (Próximo)
5. ⬜ Dialog (Próximo)
6. ⬜ Select (Próximo)
7. ⬜ Avatar
8. ⬜ Breadcrumbs

**Ejemplo de test:**
```tsx
// __tests__/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  test('renderiza correctamente', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('maneja eventos onClick', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('aplica clases de variante correctamente', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button', { name: /primary button/i });
    expect(button).toHaveClass('bg-primary');
  });
});
```

### 2.2 Tests para Componentes Específicos de Plantillas

**Actividades:**
- Implementar tests para componentes de plantillas, editor de documentos y React Flow

**Componentes prioritarios:**
1. TemplateNode.jsx
2. Palette.tsx
3. PropertiesPanel.tsx
4. Canvas.tsx

**Ejemplo de test:**
```tsx
// __tests__/components/TemplateNode.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateNode } from '@/components/TemplateNode';

// Mock de ReactFlow necesario ya que TemplateNode usa sus hooks
jest.mock('reactflow', () => ({
  useReactFlow: () => ({
    getNode: jest.fn().mockReturnValue({ data: { label: 'Test Node' } }),
    setNodes: jest.fn(),
  }),
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
  Handle: ({ type, position, id }) => (
    <div data-testid={`handle-${id}`} data-position={position} data-type={type} />
  ),
}));

describe('TemplateNode Component', () => {
  const mockData = {
    id: 'node-1',
    label: 'Test Node',
    type: 'document',
    properties: { title: 'Test Document' },
  };

  test('renderiza correctamente con los datos proporcionados', () => {
    render(<TemplateNode data={mockData} id="node-1" />);
    
    expect(screen.getByText('Test Node')).toBeInTheDocument();
    expect(screen.getByTestId('handle-source')).toHaveAttribute('data-type', 'source');
    expect(screen.getByTestId('handle-target')).toHaveAttribute('data-type', 'target');
  });
});
```

### 2.3 Tests para Hooks Personalizados

**Actividades:**
- Implementar tests para hooks de manejo de estado, autenticación y datos

**Hooks prioritarios:**
1. Hooks de autenticación
2. Hooks de gestión de plantillas
3. Hooks de gestión de documentos
4. Hooks de integración con Supabase

**Ejemplo de test:**
```tsx
// __tests__/hooks/useTemplates.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplates } from '@/hooks/useTemplates';
import { supabase } from '@/lib/supabase';

// Mock del cliente Supabase
jest.mock('@/lib/supabase');

describe('useTemplates Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('carga templates correctamente', async () => {
    const mockTemplates = [
      { id: '1', name: 'Template 1', description: 'Description 1' },
      { id: '2', name: 'Template 2', description: 'Description 2' },
    ];

    // Configurar el mock para devolver templates
    (supabase.from().select().order() as jest.Mock).mockResolvedValue({
      data: mockTemplates,
      error: null,
    });

    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    // Inicialmente debería estar cargando
    expect(result.current.isLoading).toBe(true);
    
    // Esperar a que se resuelva la promesa
    await waitForNextUpdate();

    // Verificar que se han cargado los templates
    expect(result.current.isLoading).toBe(false);
    expect(result.current.templates).toEqual(mockTemplates);
  });
});
```

### 2.4 Tests para APIs y Servicios

**Actividades:**
- Implementar tests para servicios API y funciones de utilidad

**APIs prioritarias:**
1. templateApi.ts
2. Servicios de documentos
3. Servicios de proyectos
4. Funciones de autenticación

**Ejemplo de test:**
```tsx
// __tests__/api/templateApi.test.ts
import { saveTemplate, getTemplate } from '@/api/templateApi';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('templateApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveTemplate', () => {
    test('crea una nueva plantilla correctamente', async () => {
      const newTemplate = {
        name: 'Nueva Plantilla',
        description: 'Descripción de la nueva plantilla',
        nodes: [{ id: 'node-1', type: 'document', data: { label: 'Documento' } }],
        edges: [],
      };

      const mockResponse = {
        data: { id: '123', ...newTemplate },
        error: null,
      };

      (supabase.from().insert() as jest.Mock).mockResolvedValue(mockResponse);

      const result = await saveTemplate(newTemplate);

      expect(supabase.from).toHaveBeenCalledWith('templates');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
```

**Entregables:**
- Tests unitarios para componentes UI críticos
- Tests para hooks y servicios principales
- Documentación básica de patrones de testing

## Fase 3: Automatización de CI/CD (Semana 4)

### 3.1 Configuración de GitHub Actions

**Actividades:**
- Implementar workflows de GitHub Actions para pruebas automatizadas
- Configurar integración continua para PRs y branches principales

**Pasos:**
1. Crear directorio `.github/workflows`
2. Implementar workflow para tests unitarios
3. Implementar workflow para análisis de cobertura

**Archivos a crear:**

1. `.github/workflows/test.yml`:
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

### 3.2 Implementación de Husky y Pre-commit Hooks

**Actividades:**
- Configurar Husky para ejecutar tests antes de cada commit
- Implementar lint-staged para verificar solo archivos modificados

**Comandos:**
```bash
# Instalación
pnpm add -D husky lint-staged

# Configuración
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

**Archivos a modificar:**

1. `package.json` (añadir configuración):
```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "jest --bail --findRelatedTests"
  ]
}
```

**Entregables:**
- Workflows de GitHub Actions configurados
- Integración de pre-commit hooks con Husky
- Documentación de proceso CI/CD

## Fase 4: Tests de Integración y E2E (Semanas 5-6)

### 4.1 Configuración de Tests de Integración con Supabase Local

**Actividades:**
- Configurar entorno para tests con Supabase local
- Implementar tests que interactúen con la base de datos local

**Comandos:**
```bash
# Añadir scripts a package.json
```

**Archivos a modificar:**

1. `package.json` (añadir scripts):
```json
"scripts": {
  "supabase:start": "supabase start",
  "supabase:stop": "supabase stop",
  "test:integration": "jest --testMatch='**/*.integration.test.{ts,tsx}'"
}
```

2. Crear test de integración:
```tsx
// __tests__/integration/templates.integration.test.ts
import { getTemplate, saveTemplate } from '@/api/templateApi';
import { supabase } from '@/lib/supabase';

// Estos tests utilizan el Supabase local real
// No se mockea el cliente de Supabase

describe('Template API Integration', () => {
  let createdTemplateId;

  afterAll(async () => {
    // Limpiar datos de prueba
    if (createdTemplateId) {
      await supabase.from('templates').delete().eq('id', createdTemplateId);
    }
  });

  test('crea y recupera una plantilla correctamente', async () => {
    // Crear una nueva plantilla
    const newTemplate = {
      name: `Test Template ${Date.now()}`,
      description: 'Template for integration testing',
      nodes: [{ id: 'node-1', type: 'document', data: { label: 'Test Document' } }],
      edges: [],
    };

    // Guardar la plantilla
    const savedTemplate = await saveTemplate(newTemplate);
    createdTemplateId = savedTemplate.id;

    expect(savedTemplate.id).toBeDefined();
    expect(savedTemplate.name).toBe(newTemplate.name);

    // Recuperar la plantilla guardada
    const retrievedTemplate = await getTemplate(savedTemplate.id);

    expect(retrievedTemplate.id).toBe(savedTemplate.id);
    expect(retrievedTemplate.nodes).toEqual(newTemplate.nodes);
  });
});
```

### 4.2 Implementación de Tests E2E con Cypress

**Actividades:**
- Configurar Cypress para tests end-to-end
- Implementar tests para flujos de usuario principales

**Comandos:**
```bash
# Instalación de Cypress
pnpm add -D cypress

# Inicialización
npx cypress open
```

**Estructura de archivos:**
```
cypress/
├── e2e/
│   ├── auth.cy.ts
│   ├── documents.cy.ts
│   ├── project-management.cy.ts
│   └── templates.cy.ts
├── fixtures/
│   ├── auth/
│   │   └── login-success.json
│   └── templates/
│       └── list.json
└── support/
    ├── commands.ts
    └── e2e.ts
```

**Ejemplo de test E2E:**
```typescript
// cypress/e2e/templates.cy.ts
describe('Gestión de Plantillas', () => {
  beforeEach(() => {
    // Simular inicio de sesión
    cy.intercept('POST', '**/auth/v1/token*', {
      fixture: 'auth/login-success.json',
    }).as('login');

    // Interceptar listado de plantillas
    cy.intercept('GET', '**/rest/v1/templates*', {
      fixture: 'templates/list.json',
    }).as('getTemplates');

    // Visitar la página de plantillas
    cy.visit('/templates');
    cy.wait('@login');
    cy.wait('@getTemplates');
  });

  it('permite crear una nueva plantilla', () => {
    // Click en botón de nueva plantilla
    cy.get('[data-testid=new-template-button]').click();
    
    // Verificar navegación a la página de creación
    cy.url().should('include', '/templates/new');
    
    // Rellenar el formulario
    cy.get('[data-testid=template-name-input]').type('Nueva Plantilla E2E');
    cy.get('[data-testid=template-description]').type('Descripción de prueba E2E');
    
    // Interceptar la llamada a la API para guardar
    cy.intercept('POST', '**/rest/v1/templates', {
      statusCode: 201,
      body: { id: 'new-template-123', name: 'Nueva Plantilla E2E' }
    }).as('saveTemplate');
    
    // Enviar el formulario
    cy.get('[data-testid=save-template-button]').click();
    
    // Verificar llamada a la API
    cy.wait('@saveTemplate');
    
    // Verificar redirección y mensaje de éxito
    cy.url().should('include', '/templates/new-template-123');
    cy.contains('Plantilla guardada correctamente').should('be.visible');
  });

  it('permite editar una plantilla existente', () => {
    // Seleccionar primera plantilla de la lista
    cy.get('[data-testid=template-card]').first().click();
    
    // Click en botón de editar
    cy.get('[data-testid=edit-template-button]').click();
    
    // Modificar nombre
    cy.get('[data-testid=template-name-input]').clear().type('Plantilla Actualizada E2E');
    
    // Guardar cambios
    cy.get('[data-testid=save-template-button]').click();
    
    // Verificar mensaje de éxito
    cy.contains('Cambios guardados correctamente').should('be.visible');
  });
});
```

**Entregables:**
- Tests de integración con Supabase local
- Suite de tests E2E con Cypress
- Documentación de tests E2E

## Fase 5: Optimización y Documentación (Semana 7)

### 5.1 Optimización de Cobertura de Tests

**Actividades:**
- Evaluar cobertura actual y áreas de mejora
- Implementar tests adicionales para zonas de baja cobertura
- Configurar umbrales mínimos de cobertura

**Archivos a modificar:**

1. `jest.config.js` (añadir umbrales de cobertura):
```javascript
coverageThreshold: {
  global: {
    statements: 60,
    branches: 60,
    functions: 60,
    lines: 60,
  },
}
```

### 5.2 Documentación Completa

**Actividades:**
- Actualizar documentación de testing con ejemplos específicos
- Crear guías para patrones comunes de testing
- Documentar proceso completo CI/CD

**Archivos a crear/actualizar:**

1. Actualizar `test.md` con nuevos ejemplos y patrones
2. Crear documentación específica para testing con React Flow
3. Crear documentación para mocks de Supabase

**Entregables:**
- Informe final de cobertura de tests
- Documentación completa del sistema de testing
- Guías para diferentes tipos de tests

## Criterios de Éxito

La implementación del sistema de testing se considerará exitosa cuando:

1. ✅ Se alcance una cobertura mínima del 60% en código crítico
2. ✅ Se implementen tests unitarios para todos los componentes principales
3. ✅ La integración continua ejecute tests automáticamente para cada PR
4. ✅ Se implementen tests E2E para los flujos críticos de usuario
5. ✅ La documentación de testing esté actualizada y sea comprensible

## Riesgos y Mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|-------------|------------|
| Problemas al mockear componentes complejos (React Flow) | Alto | Media | Crear mocks específicos y documentados para componentes complejos |
| Falsos positivos/negativos en pruebas asíncronas | Medio | Alta | Usar patrones recomendados para testing asíncrono y waitFor |
| Tests lentos en CI | Medio | Media | Implementar paralelismo y caching en GitHub Actions |
| Manejo inconsistente de mocks de Supabase | Alto | Media | Centralizar configuración de mocks en helpers reutilizables |

## Referencias y Recursos

- [Documentación de Jest](https://jestjs.io/docs/getting-started)
- [Documentación de React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Guía de GitHub Actions](https://docs.github.com/en/actions)
- [Documentación de Cypress](https://docs.cypress.io/)
- [Mejores prácticas para mockear Supabase](https://supabase.com/docs/reference/javascript/testing)