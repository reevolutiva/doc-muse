// Optional: configure or set up a testing framework before each test
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Mock para next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      reload: jest.fn(),
      query: {},
      asPath: '',
      pathname: '/',
      route: '/',
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock actualizado para supabase con los métodos correctos
jest.mock('@/lib/supabase', () => ({
  supabase: {
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
  },
}));

// Mock para next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue('/'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
  redirect: jest.fn(),
}));

// Mock para next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn().mockReturnValue({
    theme: 'light',
    setTheme: jest.fn(),
    themes: ['light', 'dark'],
  }),
}));

// Mock para reactflow/xyflow
jest.mock('reactflow', () => ({
  useReactFlow: jest.fn().mockReturnValue({
    getNode: jest.fn().mockReturnValue({ data: { label: 'Test Node' } }),
    getNodes: jest.fn().mockReturnValue([{ id: 'node-1', data: { label: 'Test Node' } }]),
    getEdges: jest.fn().mockReturnValue([]),
    setNodes: jest.fn(),
    setEdges: jest.fn(),
    addNodes: jest.fn(),
    addEdges: jest.fn(),
  }),
  useNodesState: jest.fn().mockReturnValue([
    [{ id: 'node-1', type: 'document', data: { label: 'Test Document' } }],
    jest.fn(),
  ]),
  useEdgesState: jest.fn().mockReturnValue([[], jest.fn()]),
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
  Handle: ({ type, position, id, children }) => (
    <div data-testid={`handle-${id}`} data-position={position} data-type={type}>
      {children}
    </div>
  ),
  Background: ({ children }) => <div data-testid="flow-background">{children}</div>,
  Controls: () => <div data-testid="flow-controls"></div>,
  MiniMap: () => <div data-testid="flow-minimap"></div>,
  Panel: ({ children }) => <div data-testid="flow-panel">{children}</div>,
  ReactFlow: ({ children }) => <div data-testid="flow-canvas">{children}</div>,
}));

// Configuración global de Jest para evitar errores con matchMedia (necesario para algunos componentes)
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

// Suprimir errores de consola durante las pruebas para evitar ruido en los reportes de testing
console.error = jest.fn();
console.warn = jest.fn();
