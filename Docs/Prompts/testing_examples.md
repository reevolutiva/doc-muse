# Ejemplos de Tests Unitarios para Componentes Críticos

Este documento proporciona ejemplos concretos de tests unitarios para componentes críticos de Doc-Muse. Estos ejemplos sirven como complemento al plan secuencial de prompts para el agente IA.

## Test para el Componente TemplateNode

```tsx
// __tests__/components/TemplateNode.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateNode } from '../../src/components/TemplateNode';

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

  test('muestra el panel de propiedades al hacer click en el nodo', () => {
    render(<TemplateNode data={mockData} id="node-1" />);
    
    const node = screen.getByText('Test Node');
    fireEvent.click(node);
    
    expect(screen.getByText('Propiedades')).toBeInTheDocument();
    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });
});
```

## Test para el Hook useTemplates

```tsx
// __tests__/hooks/useTemplates.test.tsx

import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplates } from '../../src/hooks/useTemplates';
import { supabase } from '../../src/lib/supabase';

// Mock del cliente Supabase
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  },
}));

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
    supabase.from().select().order().mockResolvedValue({
      data: mockTemplates,
      error: null,
    });

    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    // Inicialmente debería estar cargando
    expect(result.current.isLoading).toBe(true);
    expect(result.current.templates).toEqual([]);

    // Esperar a que se resuelva la promesa
    await waitForNextUpdate();

    // Verificar que se han cargado los templates
    expect(result.current.isLoading).toBe(false);
    expect(result.current.templates).toEqual(mockTemplates);
    expect(supabase.from).toHaveBeenCalledWith('templates');
  });

  test('maneja errores correctamente', async () => {
    // Configurar el mock para devolver un error
    supabase.from().select().order().mockResolvedValue({
      data: null,
      error: { message: 'Error al cargar templates' },
    });

    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    // Esperar a que se resuelva la promesa
    await waitForNextUpdate();

    // Verificar que se ha manejado el error
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error al cargar templates');
  });
});
```

## Test para el servicio templateApi

```tsx
// __tests__/api/templateApi.test.ts

import { saveTemplate, getTemplate, deleteTemplate } from '../../src/api/templateApi';
import { supabase } from '../../src/lib/supabase';

jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  },
}));

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

      supabase.from().insert().mockResolvedValue(mockResponse);

      const result = await saveTemplate(newTemplate);

      expect(supabase.from).toHaveBeenCalledWith('templates');
      expect(supabase.from().insert).toHaveBeenCalledWith({
        name: newTemplate.name,
        description: newTemplate.description,
        data: { nodes: newTemplate.nodes, edges: newTemplate.edges },
        created_at: expect.any(String),
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('maneja errores al guardar plantilla', async () => {
      const newTemplate = {
        name: 'Nueva Plantilla',
        description: 'Descripción',
        nodes: [],
        edges: [],
      };

      const mockError = {
        data: null,
        error: { message: 'Error al guardar la plantilla' },
      };

      supabase.from().insert().mockResolvedValue(mockError);

      await expect(saveTemplate(newTemplate)).rejects.toThrow('Error al guardar la plantilla');
    });
  });

  describe('getTemplate', () => {
    test('obtiene una plantilla por ID correctamente', async () => {
      const mockTemplate = {
        id: '123',
        name: 'Plantilla Test',
        description: 'Descripción',
        data: {
          nodes: [{ id: 'node-1', type: 'document', data: { label: 'Documento' } }],
          edges: [],
        },
      };

      supabase.from().select().eq().single.mockResolvedValue({
        data: mockTemplate,
        error: null,
      });

      const result = await getTemplate('123');

      expect(supabase.from).toHaveBeenCalledWith('templates');
      expect(supabase.from().select).toHaveBeenCalledWith('*');
      expect(supabase.from().select().eq).toHaveBeenCalledWith('id', '123');
      expect(result).toEqual({
        id: mockTemplate.id,
        name: mockTemplate.name,
        description: mockTemplate.description,
        nodes: mockTemplate.data.nodes,
        edges: mockTemplate.data.edges,
      });
    });
  });
});
```

## Test para el Componente ProjectList

```tsx
// __tests__/components/project-list.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectList } from '../../src/components/project-list';
import { useRouter } from 'next/router';

// Mocks para next/router y cualquier hook personalizado que use el componente
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../src/hooks/useProjects', () => ({
  useProjects: jest.fn().mockReturnValue({
    projects: [
      { id: '1', name: 'Proyecto 1', description: 'Descripción 1' },
      { id: '2', name: 'Proyecto 2', description: 'Descripción 2' },
    ],
    loading: false,
    error: null,
  }),
}));

describe('ProjectList Component', () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  test('renderiza la lista de proyectos correctamente', () => {
    render(<ProjectList />);
    
    expect(screen.getByText('Proyecto 1')).toBeInTheDocument();
    expect(screen.getByText('Descripción 1')).toBeInTheDocument();
    expect(screen.getByText('Proyecto 2')).toBeInTheDocument();
  });

  test('navega al detalle del proyecto al hacer click', async () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
    });

    render(<ProjectList />);
    
    const projectCard = screen.getByText('Proyecto 1').closest('div');
    fireEvent.click(projectCard);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects/1');
    });
  });

  test('muestra mensaje cuando no hay proyectos', () => {
    jest.requireMock('../../src/hooks/useProjects').useProjects.mockReturnValueOnce({
      projects: [],
      loading: false,
      error: null,
    });

    render(<ProjectList />);
    
    expect(screen.getByText('No hay proyectos disponibles')).toBeInTheDocument();
  });

  test('muestra indicador de carga', () => {
    jest.requireMock('../../src/hooks/useProjects').useProjects.mockReturnValueOnce({
      projects: [],
      loading: true,
      error: null,
    });

    render(<ProjectList />);
    
    expect(screen.getByText('Cargando proyectos...')).toBeInTheDocument();
  });
});
```

## Test para el Flujo de Creación de Documentos (E2E con Cypress)

```typescript
// cypress/e2e/document-creation.cy.ts

describe('Flujo de creación de documento', () => {
  beforeEach(() => {
    // Simular inicio de sesión
    cy.intercept('POST', '**/auth/v1/token*', {
      fixture: 'auth/login-success.json',
    }).as('login');

    cy.intercept('GET', '**/rest/v1/templates*', {
      fixture: 'templates/list.json',
    }).as('getTemplates');

    // Visitar la página de creación de documento
    cy.visit('/documents/new');
  });

  it('permite crear un nuevo documento basado en plantilla', () => {
    // Seleccionar una plantilla
    cy.wait('@getTemplates');
    cy.get('[data-testid=template-card]').first().click();
    
    // Rellenar el formulario de documento
    cy.get('[data-testid=document-title-input]').type('Documento de prueba');
    cy.get('[data-testid=document-description]').type('Descripción del documento de prueba');
    
    // Interceptar la llamada a la API para guardar
    cy.intercept('POST', '**/rest/v1/documents', {
      statusCode: 201,
      body: { id: 'new-doc-123', title: 'Documento de prueba' }
    }).as('saveDocument');
    
    // Enviar el formulario
    cy.get('[data-testid=submit-document]').click();
    
    // Verificar que se realizó la llamada a la API
    cy.wait('@saveDocument');
    
    // Verificar redirección a la vista del documento
    cy.url().should('include', '/documents/new-doc-123');
    cy.contains('Documento guardado correctamente').should('be.visible');
  });

  it('muestra errores de validación', () => {
    cy.wait('@getTemplates');
    cy.get('[data-testid=template-card]').first().click();
    
    // Intentar enviar sin completar campos requeridos
    cy.get('[data-testid=submit-document]').click();
    
    // Verificar que se muestran errores de validación
    cy.contains('El título es requerido').should('be.visible');
  });
});
```

## Mejores Prácticas para Escribir Tests

### 1. Estructura AAA (Arrange-Act-Assert)

Organiza tus tests siguiendo el patrón:

```typescript
test('descripción clara de lo que prueba', () => {
  // Arrange - Configurar el entorno y datos
  const initialValue = 'valor inicial';
  render(<MyComponent initialValue={initialValue} />);
  
  // Act - Ejecutar la acción que queremos probar
  fireEvent.click(screen.getByRole('button'));
  
  // Assert - Verificar el resultado esperado
  expect(screen.getByText('nuevo valor')).toBeInTheDocument();
});
```

### 2. Tests Enfocados en Comportamiento

Prueba el comportamiento desde la perspectiva del usuario, no la implementación:

```typescript
// ❌ Mal (prueba implementación)
test('llama a handleClick cuando se hace clic en el botón', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});

// ✅ Bien (prueba comportamiento)
test('muestra mensaje de éxito cuando se hace clic en guardar', () => {
  render(<SaveForm />);
  fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
  expect(screen.getByText('Guardado correctamente')).toBeInTheDocument();
});
```

### 3. Mocks Selectivos y Explícitos

Usa mocks solo cuando sea necesario y sé explícito sobre lo que estás mockeando:

```typescript
// Mock de módulo completo
jest.mock('../../src/lib/supabase', () => ({
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
```

### 4. Testing de Componentes Asincrónicos

Usa `findBy*` y `waitFor` para componentes que renderizan después de llamadas asincrónicas:

```typescript
test('carga y muestra datos asincrónicamente', async () => {
  render(<AsyncComponent />);
  
  // Verificar estado de carga
  expect(screen.getByText('Cargando...')).toBeInTheDocument();
  
  // Esperar a que aparezcan los datos
  await screen.findByText('Datos cargados');
  
  // Verificaciones adicionales
  expect(screen.getByText('Elemento 1')).toBeInTheDocument();
});
```

### 5. Snapshot Testing de Manera Efectiva

Usa snapshots para UI estable y componentes pequeños:

```typescript
test('coincide con el snapshot', () => {
  const { container } = render(<Button variant="primary">Click Me</Button>);
  expect(container).toMatchSnapshot();
});
```