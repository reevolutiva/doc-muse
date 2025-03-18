import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas } from '@/components/Canvas';
import { TemplateProvider } from '@/contexts/TemplateContext';

// Agregar mocks necesarios para ReactFlow
jest.mock('reactflow', () => ({
  ReactFlow: ({ children }) => <div data-testid="rf__wrapper">{children}</div>,
  Background: () => <div data-testid="rf__background"></div>,
  Controls: () => <div data-testid="rf__controls"></div>,
  useReactFlow: () => ({
    fitView: jest.fn(),
    zoomIn: jest.fn(),
    zoomOut: jest.fn(),
  }),
  // Otros elementos necesarios...
}));

describe('Canvas Component', () => {
  test('renderiza correctamente con controles', () => {
    const initialData = { nodes: [], edges: [] };
    render(
      <TemplateProvider>
        <Canvas initialData={initialData} />
      </TemplateProvider>
    );
    
    expect(screen.getByTestId('rf__wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('rf__background')).toBeInTheDocument();
    expect(screen.getByTestId('rf__controls')).toBeInTheDocument();
  });
  
  // Añadir más tests para funcionalidades específicas
  test('maneja eventos de nodo correctamente', () => {
    // Implementar test...
  });
  
  test('maneja eventos de conexión entre nodos', () => {
    // Implementar test...
  });
});