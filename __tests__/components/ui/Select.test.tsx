import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
  SelectValue
} from '@/components/ui/select';

// Componente de prueba para Select
const TestSelect = ({
  defaultValue,
  onValueChange = jest.fn(),
  disabled = false,
  items = ['Item 1', 'Item 2', 'Item 3'],
  placeholder = "Seleccionar opción"
}) => (
  <Select defaultValue={defaultValue} onValueChange={onValueChange}>
    <SelectTrigger data-testid="select-trigger" disabled={disabled}>
      <SelectValue placeholder={placeholder} data-testid="select-value" />
    </SelectTrigger>
    <SelectContent data-testid="select-content">
      <SelectGroup>
        <SelectLabel data-testid="select-label">Test Label</SelectLabel>
        {items.map((item, index) => (
          <SelectItem key={index} value={item.toLowerCase().replace(' ', '-')} data-testid={`select-item-${index}`}>
            {item}
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectSeparator data-testid="select-separator" />
      <SelectItem value="extra-item" data-testid="select-item-extra">Extra Item</SelectItem>
    </SelectContent>
  </Select>
);

describe('Select Component', () => {
  test('SelectTrigger renderiza correctamente con las clases por defecto', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>
      </Select>
    );
    
    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveClass('flex');
    expect(trigger).toHaveClass('h-10');
    expect(trigger).toHaveClass('w-full');
    expect(trigger).toHaveClass('rounded-md');
    expect(trigger).toHaveClass('border');
    expect(trigger).toHaveClass('border-input');
    expect(trigger).toHaveClass('bg-background');
  });

  test('SelectTrigger acepta clases personalizadas', () => {
    render(
      <Select>
        <SelectTrigger className="custom-class" data-testid="select-trigger">
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>
      </Select>
    );
    
    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toHaveClass('custom-class');
  });

  test('SelectTrigger respeta el estado disabled', () => {
    render(
      <Select>
        <SelectTrigger disabled data-testid="select-trigger">
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>
      </Select>
    );
    
    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass('disabled:cursor-not-allowed');
    expect(trigger).toHaveClass('disabled:opacity-50');
  });

  test('SelectContent renderiza con las clases correctas', async () => {
    render(
      <Select defaultValue="test">
        <SelectTrigger data-testid="select-trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent data-testid="select-content">
          <SelectGroup>
            Content
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    
    await userEvent.click(screen.getByTestId('select-trigger'));
    const content = screen.getByTestId('select-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('relative');
    expect(content).toHaveClass('z-50');
    expect(content).toHaveClass('min-w-[8rem]');
    expect(content).toHaveClass('overflow-hidden');
    expect(content).toHaveClass('rounded-md');
    expect(content).toHaveClass('border');
    expect(content).toHaveClass('bg-popover');
  });

  test('SelectLabel renderiza con las clases correctas', () => {
    render(
      <Select>
        <SelectGroup>
          <SelectLabel data-testid="select-label">Label</SelectLabel>
        </SelectGroup>
      </Select>
    );
    
    const label = screen.getByTestId('select-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('py-1.5');
    expect(label).toHaveClass('pl-8');
    expect(label).toHaveClass('pr-2');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('font-semibold');
    expect(label).toHaveTextContent('Label');
  });

  test('SelectItem renderiza con las clases correctas', async () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem data-testid="select-item" value="test">Item</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    
    await userEvent.click(screen.getByTestId('select-trigger'));
    const item = screen.getByTestId('select-item');
    expect(item).toBeInTheDocument();
    expect(item).toHaveClass('relative');
    expect(item).toHaveClass('flex');
    expect(item).toHaveClass('w-full');
    expect(item).toHaveClass('cursor-default');
    expect(item).toHaveClass('select-none');
    expect(item).toHaveClass('items-center');
    expect(item).toHaveClass('rounded-sm');
    expect(item).toHaveClass('py-1.5');
    expect(item).toHaveClass('pl-8');
    expect(item).toHaveClass('pr-2');
    expect(item).toHaveClass('text-sm');
    expect(item).toHaveClass('outline-none');
    expect(item).toHaveTextContent('Item');
  });

  test('SelectSeparator renderiza con las clases correctas', () => {
    render(
      <Select>
        <SelectSeparator data-testid="select-separator" />
      </Select>
    );
    
    const separator = screen.getByTestId('select-separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('-mx-1');
    expect(separator).toHaveClass('my-1');
    expect(separator).toHaveClass('h-px');
    expect(separator).toHaveClass('bg-muted');
  });

  test('Select compuesto renderiza correctamente', () => {
    render(<TestSelect defaultValue="item-1" />);
    
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('select-value')).toBeInTheDocument();
  });
});