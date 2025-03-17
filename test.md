# Sistema de Testing para Doc-Muse

## Configuración Actual

El proyecto Doc-Muse utiliza [Jest](https://jestjs.io/) como framework de testing principal junto con [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) para pruebas de componentes React.

### Archivos de Configuración

- [`jest.config.js`](jest.config.js): Configuración principal de Jest
- [`jest.setup.js`](jest.setup.js): Configuración adicional que se ejecuta antes de cada prueba
  - Incluye configuración para `@testing-library/jest-dom`
  - Contiene mocks para `next/router` y para el cliente de Supabase

### Estructura de Directorios

```
doc-muse/
└── __tests__/             # Directorio principal de tests
    ├── pages/             # Tests para páginas
    │   └── index.test.tsx # Test para la página principal
    ├── components/        # Tests para componentes
    └── hooks/             # Tests para hooks personalizados
```

## Cómo Escribir Tests

### Tests de Componentes React

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { ComponentName } from '../src/components/path/to/component';

describe('ComponentName', () => {
  test('renderiza correctamente', () => {
    render(<ComponentName />);
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
  });
  
  test('maneja interacciones', async () => {
    render(<ComponentName />);
    const button = screen.getByRole('button', { name: 'Nombre del botón' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Resultado esperado')).toBeInTheDocument();
    });
  });
});
```

### Tests de Hooks

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useMyHook } from '../src/hooks/useMyHook';

describe('useMyHook', () => {
  test('devuelve el estado inicial correcto', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(initialValue);
  });
  
  test('actualiza el estado correctamente', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.updateValue('nuevo valor');
    });
    
    expect(result.current.value).toBe('nuevo valor');
  });
});
```

### Tests con Supabase

Para pruebas que involucran Supabase, utilizamos mocks para simular respuestas del servidor:

```tsx
import { render, screen } from '@testing-library/react';
import { supabase } from '../src/lib/supabase';
import { ComponentWithSupabase } from '../src/components/ComponentWithSupabase';

jest.mock('../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: { id: '123', name: 'Test Document' },
      error: null
    })
  }
}));

test('carga datos de Supabase correctamente', async () => {
  render(<ComponentWithSupabase />);
  await waitFor(() => {
    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });
});
```

## Ejecución de Tests

### Comandos Disponibles

- Ejecutar todos los tests:
  ```bash
  pnpm test
  ```

- Ejecutar tests en modo watch (desarrollo):
  ```bash
  pnpm test:watch
  ```

- Ejecutar tests con coverage:
  ```bash
  pnpm test:coverage
  ```

### Herramientas Adicionales

- **ESLint con jest-plugin**: Ayuda a detectar errores comunes en los tests
- **jest-dom**: Proporciona matchers personalizados para hacer assertions sobre el DOM

## Plan de Optimización y Automatización

### 1. Mejoras Inmediatas

- **Ampliar cobertura de tests**:
  - Crear tests para todos los componentes críticos
  - Priorizar tests para hooks relacionados con Supabase
  - Añadir tests para flujos de usuario completos

- **Integrar pruebas de snapshot**:
  ```tsx
  test('coincide con el snapshot', () => {
    const { container } = render(<MyComponent />);
    expect(container).toMatchSnapshot();
  });
  ```

### 2. Automatización

- **Configurar GitHub Actions para CI/CD**:
  ```yaml
  # .github/workflows/test.yml
  name: Tests
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: pnpm/action-setup@v2
        - uses: actions/setup-node@v3
          with:
            node-version: 18
            cache: 'pnpm'
        - run: pnpm install
        - run: pnpm test
  ```

- **Configurar Husky para ejecutar tests antes de commits**:
  ```bash
  pnpm add -D husky
  npx husky install
  npx husky add .husky/pre-commit "pnpm test"
  ```

### 3. Integración con Supabase Local

- **Configuración de ambiente de prueba con Supabase local**:
  ```bash
  # Scripts para inicializar Supabase local antes de los tests
  supabase start
  # Ejecutar pruebas contra Supabase local
  pnpm test:integration
  # Detener Supabase local después de los tests
  supabase stop
  ```

### 4. Implementación de Testing E2E

- **Incorporar Cypress para pruebas end-to-end**:
  ```bash
  pnpm add -D cypress
  ```

  Estructura de pruebas E2E:
  ```
  cypress/
  ├── e2e/
  │   ├── auth.cy.ts
  │   ├── documents.cy.ts
  │   └── projects.cy.ts
  ├── fixtures/
  └── support/
  ```

### 5. Monitoreo de Cobertura

- **Establecer umbrales mínimos de cobertura**:
  ```js
  // En jest.config.js
  module.exports = {
    // ...
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    }
  };
  ```

- **Añadir reporte visual de cobertura** con herramientas como Codecov

## Mejores Prácticas

1. **Enfoque en comportamiento**: Probar cómo los usuarios interactúan con los componentes
2. **Evitar probar implementaciones**: Centrarse en la API pública de los componentes
3. **Tests aislados**: Cada test debe poder ejecutarse de forma independiente
4. **Mocks selectivos**: Utilizar mocks solo cuando sea necesario
5. **Usar findBy* para elementos asincrónicos**: Para componentes que renderizan después de llamadas API

## Conclusiones y Próximos Pasos

El sistema de testing actual proporciona una base sólida pero requiere expansión sistemática para cubrir más funcionalidad. Implementando el plan de mejoras propuesto, se logrará una mayor confiabilidad en las pruebas automatizadas y una mejor experiencia de desarrollo.

### Próximos Pasos Inmediatos:

1. Ejecutar evaluación de cobertura actual para identificar áreas críticas sin tests
2. Implementar tests para los hooks de gestión de documentos
3. Configurar GitHub Actions para CI/CD
4. Documentar patrones de testing específicos para componentes compartidos
