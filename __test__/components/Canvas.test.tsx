import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas } from '@/components/Canvas';
import { TemplateProvider } from '@/contexts/TemplateContext';

// Agregar mocks necesarios para ReactFlow
jest.mock('reactflow', () => ({
  ReactFlow: ({ children }) => <div data-testid="reactflow">{children}</div>,
  Background: () => <div data-testid="background"></div>,
  Controls: () => <div data-testid="controls"></div>,
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
    
    expect(screen.getByTestId('reactflow')).toBeInTheDocument();
    expect(screen.getByTestId('background')).toBeInTheDocument();
    expect(screen.getByTestId('controls')).toBeInTheDocument();
  });
  
  // Añadir más tests para funcionalidades específicas
  test('maneja eventos de nodo correctamente', () => {
    // Implementar test...
  });
  
  test('maneja eventos de conexión entre nodos', () => {
    // Implementar test...
  });
});