import React from 'react';
import { render, screen } from '@testing-library/react';
import TemplateNode from '@/components/TemplateNode';

describe('TemplateNode Component', () => {
  test('renders TemplateNode with title', () => {
    render(<TemplateNode title="Test Node" />);
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<TemplateNode className="custom-class" title="Test Node" />);
    expect(screen.getByText('Test Node')).toHaveClass('custom-class');
  });

  test('renders with different props', () => {
    render(<TemplateNode title="Another Node" description="Node description" />);
    expect(screen.getByText('Another Node')).toBeInTheDocument();
    expect(screen.getByText('Node description')).toBeInTheDocument();
  });

  test('handles connections', () => {
    const mockConnect = jest.fn();
    render(<TemplateNode title="Connect Node" onConnect={mockConnect} />);
    // Simulate connection logic here
    expect(mockConnect).toHaveBeenCalled();
  });
});
