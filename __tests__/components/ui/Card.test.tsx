import React from 'react';
import { render, screen } from '@testing-library/react';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';

describe('Card Component', () => {
  test('Card renderiza correctamente con clases por defecto', () => {
    render(<Card data-testid="test-card">Card content</Card>);
    const card = screen.getByTestId('test-card');
    
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('text-card-foreground');
    expect(card).toHaveClass('shadow');
    expect(card).toHaveTextContent('Card content');
  });

  test('Card acepta clases personalizadas', () => {
    render(<Card className="custom-class" data-testid="test-card">Card content</Card>);
    const card = screen.getByTestId('test-card');
    
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('rounded-xl'); // Aseguramos que las clases por defecto se mantienen
  });

  test('CardHeader renderiza correctamente', () => {
    render(<CardHeader data-testid="test-header">Header content</CardHeader>);
    const header = screen.getByTestId('test-header');
    
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('space-y-1.5');
    expect(header).toHaveClass('p-6');
    expect(header).toHaveTextContent('Header content');
  });

  test('CardTitle renderiza correctamente', () => {
    render(<CardTitle data-testid="test-title">Title content</CardTitle>);
    const title = screen.getByTestId('test-title');
    
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('leading-none');
    expect(title).toHaveClass('tracking-tight');
    expect(title).toHaveTextContent('Title content');
  });

  test('CardDescription renderiza correctamente', () => {
    render(<CardDescription data-testid="test-description">Description content</CardDescription>);
    const description = screen.getByTestId('test-description');
    
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm');
    expect(description).toHaveClass('text-muted-foreground');
    expect(description).toHaveTextContent('Description content');
  });

  test('CardContent renderiza correctamente', () => {
    render(<CardContent data-testid="test-content">Content here</CardContent>);
    const content = screen.getByTestId('test-content');
    
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('pt-0');
    expect(content).toHaveTextContent('Content here');
  });

  test('CardFooter renderiza correctamente', () => {
    render(<CardFooter data-testid="test-footer">Footer content</CardFooter>);
    const footer = screen.getByTestId('test-footer');
    
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
    expect(footer).toHaveClass('p-6');
    expect(footer).toHaveClass('pt-0');
    expect(footer).toHaveTextContent('Footer content');
  });

  test('Card compuesto renderiza todos sus subcomponentes correctamente', () => {
    render(
      <Card data-testid="test-card">
        <CardHeader data-testid="test-header">
          <CardTitle data-testid="test-title">Card Title</CardTitle>
          <CardDescription data-testid="test-description">Card Description</CardDescription>
        </CardHeader>
        <CardContent data-testid="test-content">Card Content</CardContent>
        <CardFooter data-testid="test-footer">Card Footer</CardFooter>
      </Card>
    );
    
    expect(screen.getByTestId('test-card')).toBeInTheDocument();
    expect(screen.getByTestId('test-header')).toBeInTheDocument();
    expect(screen.getByTestId('test-title')).toBeInTheDocument();
    expect(screen.getByTestId('test-description')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('test-footer')).toBeInTheDocument();
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });
});