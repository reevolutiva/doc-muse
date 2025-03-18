import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Canvas } from '@/components/Canvas';
import { Node, Edge } from '@xyflow/react';

// Mocks para ReactFlow
jest.mock('@xyflow/react', () => {
  const originalModule = jest.requireActual('@xyflow/react');
  
  return {
    __esModule: true,
    ...originalModule,
    ReactFlow: ({ 
      children, 
      nodes, 
      edges, 
      onNodeClick, 
      onEdgeClick,
      onPaneClick 
    }: any) => (
      <div data-testid="react-flow">
        <div data-testid="node-container">
          {nodes.map((node: Node) => (
            <div 
              key={node.id} 
              data-testid={`node-${node.id}`}
              onClick={(e) => onNodeClick && onNodeClick(e, node)}
            >
              Node: {node.data?.label}
            </div>
          ))}
        </div>
        <div data-testid="edge-container">
          {edges.map((edge: Edge) => (
            <div 
              key={edge.id} 
              data-testid={`edge-${edge.id}`}
              onClick={(e) => onEdgeClick && onEdgeClick(e, edge)}
            >
              Edge: {edge.source} to {edge.target}
            </div>
          ))}
        </div>
        <div data-testid="pane" onClick={onPaneClick}></div>
        {children}
      </div>
    ),
    Background: () => <div data-testid="flow-background"></div>,
    Controls: () => <div data-testid="flow-controls"></div>,
    useNodesState: jest.fn().mockImplementation(initialNodes => {
      return [initialNodes, jest.fn(), jest.fn()];
    }),
    useEdgesState: jest.fn().mockImplementation(initialEdges => {
      return [initialEdges, jest.fn(), jest.fn()];
    }),
    addEdge: jest.fn().mockImplementation((edge, edges) => [...edges, edge]),
    MarkerType: {
      ArrowClosed: 'arrowClosed'
    }
  };
});

// Mock para el componente Select de UI
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="dependency-select" data-value={value}>
      <button 
        data-testid="select-dependency-button"
        onClick={() => onValueChange && onValueChange('references')}
      >
        Select dependency type
      </button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ placeholder }: any) => <div data-testid="select-value">{placeholder}</div>,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  )
}));

// Mock para sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

describe('Canvas Component', () => {
  const mockInitialData = {
    nodes: [
      { id: 'node-1', type: 'templateNode', position: { x: 100, y: 100 }, data: { label: 'Template 1' } },
      { id: 'node-2', type: 'templateNode', position: { x: 300, y: 100 }, data: { label: 'Template 2' } }
    ],
    edges: [
      { 
        id: 'edge-1', 
        source: 'node-1', 
        target: 'node-2', 
        type: 'template',
        data: { dependencyType: 'depends' },
        animated: true 
      }
    ]
  };

  const mockOnNodeSelect = jest.fn();
  const mockOnFlowChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza con nodos y aristas iniciales', () => {
    render(
      <Canvas 
        initialData={mockInitialData} 
        onNodeSelect={mockOnNodeSelect} 
        onFlowChange={mockOnFlowChange} 
      />
    );
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByTestId('node-container')).toBeInTheDocument();
    expect(screen.getByTestId('edge-container')).toBeInTheDocument();
    expect(screen.getByTestId('flow-background')).toBeInTheDocument();
    expect(screen.getByTestId('flow-controls')).toBeInTheDocument();
    
    // Verificamos que los nodos se rendericen
    expect(screen.getByTestId('node-node-1')).toBeInTheDocument();
    expect(screen.getByTestId('node-node-2')).toBeInTheDocument();
    
    // Verificamos que las aristas se rendericen
    expect(screen.getByTestId('edge-edge-1')).toBeInTheDocument();
  });

  test('llama a onNodeSelect cuando se hace click en un nodo', () => {
    render(
      <Canvas 
        initialData={mockInitialData} 
        onNodeSelect={mockOnNodeSelect} 
        onFlowChange={mockOnFlowChange} 
      />
    );
    
    fireEvent.click(screen.getByTestId('node-node-1'));
    expect(mockOnNodeSelect).toHaveBeenCalledWith(mockInitialData.nodes[0]);
  });

  test('muestra el selector de tipo de dependencia cuando se hace click en una arista', () => {
    render(
      <Canvas 
        initialData={mockInitialData} 
        onNodeSelect={mockOnNodeSelect} 
        onFlowChange={mockOnFlowChange} 
      />
    );
    
    // Inicialmente no debe mostrarse el selector
    expect(screen.queryByTestId('dependency-select')).not.toBeInTheDocument();
    
    // Click en la arista para seleccionarla
    fireEvent.click(screen.getByTestId('edge-edge-1'));
    
    // Ahora debe mostrarse el selector
    expect(screen.getByTestId('dependency-select')).toBeInTheDocument();
  });

  test('oculta el selector de dependencia al hacer click en el panel', async () => {
    render(
      <Canvas 
        initialData={mockInitialData} 
        onNodeSelect={mockOnNodeSelect} 
        onFlowChange={mockOnFlowChange} 
      />
    );
    
    // Seleccionamos una arista
    fireEvent.click(screen.getByTestId('edge-edge-1'));
    
    // Verificamos que aparezca el selector
    expect(screen.getByTestId('dependency-select')).toBeInTheDocument();
    
    // Click en el panel para deseleccionar
    fireEvent.click(screen.getByTestId('pane'));
    
    // El selector debería desaparecer
    expect(screen.queryByTestId('dependency-select')).not.toBeInTheDocument();
  });
});