import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  test('renderiza correctamente con atributos básicos', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('permite escribir texto', async () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    
    await userEvent.type(input, 'Hello world');
    expect(input).toHaveValue('Hello world');
  });

  test('maneja eventos onChange', async () => {
    const handleChange = jest.fn();
    render(<Input placeholder="Enter text" onChange={handleChange} />);
    
    await userEvent.type(screen.getByPlaceholderText('Enter text'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  test('aplica clases personalizadas', () => {
    render(<Input className="custom-class" data-testid="custom-input" />);
    const input = screen.getByTestId('custom-input');
    
    expect(input).toHaveClass('custom-class');
    // También debería tener las clases base
    expect(input).toHaveClass('rounded-md');
    expect(input).toHaveClass('border');
  });

  test('permite deshabilitar el input', () => {
    render(<Input disabled data-testid="disabled-input" />);
    expect(screen.getByTestId('disabled-input')).toBeDisabled();
  });

  test('acepta diferentes tipos de input', () => {
    render(<Input type="password" data-testid="password-input" />);
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');
  });
});