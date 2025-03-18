// Importar extensiones de jest-dom
require('@testing-library/jest-dom');

// Mock de módulos usando CommonJS
jest.mock('next/navigation', () => require('./__mocks__/next/navigation'));
jest.mock('next/router', () => require('./__mocks__/next/router'));
jest.mock('next-themes', () => require('./__mocks__/next/themes'));
jest.mock('@/lib/supabase', () => require('./__mocks__/lib/supabase'));
jest.mock('reactflow', () => require('./__mocks__/reactflow'));

// Configuración global de Jest para el ambiente del navegador
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

// Mock global para ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock para MutationObserver (usado por algunos componentes de UI)
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn()
}));

// Suprimir errores y advertencias durante las pruebas
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  // Mantener log para debugging en caso necesario
  // log: jest.fn(),
};

// Configurar mock para reactflow
jest.mock('reactflow', () => ({
  Handle: ({ type, position, ...props }) => (
    <div data-testid={`handle-${type}`} data-position={position} {...props} />
  ),
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
  },
  useReactFlow: () => ({
    fitView: jest.fn(),
    setNodes: jest.fn(),
    setEdges: jest.fn(),
    getNodes: jest.fn().mockReturnValue([]),
    getEdges: jest.fn().mockReturnValue([]),
  }),
  Background: (props) => <div data-testid="rf__background" {...props} />,
  Controls: (props) => <div data-testid="rf__controls" {...props} />,
  ReactFlowProvider: ({ children }) => <div data-testid="rf__provider">{children}</div>,
  ReactFlow: ({ children, ...props }) => <div data-testid="rf__wrapper" {...props}>{children}</div>,
}));
