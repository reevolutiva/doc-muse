import React from 'react';
import { render, screen } from '@testing-library/react';
import { TemplateNode } from '@/components/TemplateNode';

// Mock dependencies
jest.mock('reactflow', () => ({
  Handle: ({ type, position, ...props }) => (
    <div data-testid={`handle-${type}`} data-type={type} data-position={position} {...props} />
  ),
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
  },
}));

describe('TemplateNode Component', () => {
  test('renderiza correctamente con los datos proporcionados', () => {
    const mockData = {
      title: 'Test Node',
      type: 'document',
      description: '',
    };
    
    render(<TemplateNode data={mockData} id="node-1" />);
    expect(screen.getByText('Test Node')).toBeInTheDocument();
    expect(screen.getByText('document')).toBeInTheDocument();
    expect(screen.getByTestId('handle-source')).toHaveAttribute('data-type', 'source');
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
