import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Properly mock Radix UI without using React in the mock factory
jest.mock('@radix-ui/react-select', () => {
  const mockComponent = (name) => {
    const component = ({ children, ...props }) => {
      const dataTestId = `select-${name.toLowerCase()}`;
      return <div data-testid={dataTestId} {...props}>{children}</div>;
    };
    if (name === 'Trigger' || name === 'Value' || name === 'Content' || name === 'Item') {
      return jest.fn().mockImplementation(
        function forwardRef(props, ref) {
          return component({ ...props, ref });
        }
      );
    }
    return component;
  };
  
  return {
    Root: mockComponent('Root'),
    Trigger: mockComponent('Trigger'),
    Value: mockComponent('Value'),
    Content: mockComponent('Content'),
    Item: mockComponent('Item'),
    Portal: mockComponent('Portal'),
    Viewport: mockComponent('Viewport'),
    ItemText: mockComponent('ItemText'),
    ItemIndicator: mockComponent('ItemIndicator'),
    Group: mockComponent('Group'),
    Label: mockComponent('Label'),
    Separator: mockComponent('Separator'),
    Icon: mockComponent('Icon'),
    ScrollUpButton: mockComponent('ScrollUpButton'),
    ScrollDownButton: mockComponent('ScrollDownButton')
  };
});

describe('Select Component', () => {
  test('SelectTrigger renderiza correctamente con las clases por defecto', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test Option</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveClass('flex h-10 w-full items-center justify-between rounded-md border');
  });

  test('SelectContent renderiza y muestra las opciones correctamente', () => {
    render(
      <Select defaultOpen>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test Content</SelectItem>
        </SelectContent>
      </Select>
    );

    const content = screen.getByTestId('select-content');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('SelectItem renderiza con las clases correctas', () => {
    render(
      <Select defaultOpen>
        <SelectContent>
          <SelectItem data-testid="select-item" value="test">Item</SelectItem>
        </SelectContent>
      </Select>
    );

    const item = screen.getByTestId('select-item');
    expect(item).toBeInTheDocument();
    expect(item).toHaveClass('relative flex w-full cursor-default select-none items-center');
  });

  test('muestra las opciones al hacer click y selecciona correctamente', async () => {
    const user = userEvent.setup();
    const onValueChangeMock = jest.fn();

    render(
      <Select onValueChange={onValueChangeMock}>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Seleccionar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    // Abrir el select
    await user.click(screen.getByTestId('select-trigger'));

    // Seleccionar una opción
    await user.click(screen.getByText('Option 1'));

    // Verificar que se llamó al callback con el valor esperado
    expect(onValueChangeMock).toHaveBeenCalledWith('option1');
  });
});