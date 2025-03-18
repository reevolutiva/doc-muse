import React from 'react';
import { render, screen } from '@testing-library/react';
import { TemplateNode } from '@/components/TemplateNode';

// Mock necesario para ReactFlow
jest.mock('reactflow', () => ({
  Handle: ({ type, position, id }) => (
    <div data-testid={`handle-${id}`} data-type={type} data-position={position} />
  ),
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
  useReactFlow: () => ({
    getNode: jest.fn().mockReturnValue({ data: { label: 'Test Node' } }),
    setNodes: jest.fn(),
  }),
}));

describe('TemplateNode Component', () => {
  test('renderiza correctamente con los datos proporcionados', () => {
    const mockData = {
      id: 'node-1',
      label: 'Test Node',
      type: 'document',
      properties: { title: 'Test Document' },
    };
    
    render(<TemplateNode data={mockData} id="node-1" />);
    expect(screen.getByText('Test Node')).toBeInTheDocument();
    expect(screen.getByText('document')).toBeInTheDocument();
    expect(screen.getByTestId('handle-source')).toHaveAttribute('data-type', 'source');
    expect(screen.getByTestId('handle-target')).toHaveAttribute('data-type', 'target');
  });
  
  test('renderiza con title directo como prop', () => {
    render(<TemplateNode title="Direct Title" />);
    expect(screen.getByText('Direct Title')).toBeInTheDocument();
  });
  
  test('renderiza con descripción cuando se proporciona', () => {
    render(<TemplateNode title="With Description" description="Node description" />);
    expect(screen.getByText('With Description')).toBeInTheDocument();
    expect(screen.getByText('Node description')).toBeInTheDocument();
  });
  
  test('aplica clase personalizada', () => {
    render(<TemplateNode title="With Custom Class" className="custom-class" />);
    expect(screen.getByTestId('template-node')).toHaveClass('custom-class');
  });
});
