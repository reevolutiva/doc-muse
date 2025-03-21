import React from 'react';

export const useReactFlow = jest.fn().mockReturnValue({
  getNode: jest.fn().mockReturnValue({ data: { label: 'Test Node' } }),
  getNodes: jest.fn().mockReturnValue([{ id: 'node-1', data: { label: 'Test Node' } }]),
  getEdges: jest.fn().mockReturnValue([]),
  setNodes: jest.fn(),
  setEdges: jest.fn(),
  addNodes: jest.fn(),
  addEdges: jest.fn(),
});

export const useNodesState = jest.fn().mockReturnValue([
  [{ id: 'node-1', type: 'document', data: { label: 'Test Document' } }],
  jest.fn(),
]);

export const useEdgesState = jest.fn().mockReturnValue([[], jest.fn()]);

export const Position = {
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
  Left: 'left',
};

export const Handle = ({ type, position, id, children }) => (
  <div data-testid={`handle-${id}`} data-position={position} data-type={type}>
    {children}
  </div>
);

export const Background = ({ children }) => <div data-testid="flow-background">{children}</div>;
export const Controls = () => <div data-testid="flow-controls"></div>;
export const MiniMap = () => <div data-testid="flow-minimap"></div>;
export const Panel = ({ children }) => <div data-testid="flow-panel">{children}</div>;
export const ReactFlow = ({ children }) => <div data-testid="flow-canvas">{children}</div>;