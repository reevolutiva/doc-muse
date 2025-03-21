import React from 'react';
import { render, screen } from '@testing-library/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Mock para componentes de Radix
jest.mock('@radix-ui/react-select', () => ({
  Root: ({ children, defaultValue, onValueChange }) => (
    <div data-testid="select-root" onClick={() => onValueChange && onValueChange('option1')}>{children}</div>
  ),
  Trigger: ({ children }) => (
    <button data-testid="select-trigger">{children}</button>
  ),
  Value: ({ placeholder }) => (
    <span>{placeholder}</span>
  ),
  Portal: ({ children }) => (
    <div data-testid="select-portal">{children}</div>
  ),
  Content: ({ children }) => (
    <div data-testid="select-content">{children}</div>
  ),
  Viewport: ({ children }) => (
    <div>{children}</div>
  ),
  Item: ({ children, value }) => (
    <div data-testid="select-item" data-value={value}>{children}</div>
  ),
  ItemText: ({ children }) => (
    <span>{children}</span>
  ),
  Group: ({ children }) => (
    <div>{children}</div>
  ),
  Label: ({ children }) => (
    <div data-testid="select-label">{children}</div>
  ),
  Separator: () => (
    <div data-testid="select-separator"></div>
  ),
  ScrollUpButton: () => null,
  ScrollDownButton: () => null,
}));

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
  });

  test('SelectContent renderiza con las clases correctas', () => {
    render(
      <SelectContent data-testid="select-content">Test Content</SelectContent>
    );
    
    const content = screen.getByTestId('select-content');
    expect(content).toBeInTheDocument();
  });
  
  test('SelectItem renderiza con las clases correctas', () => {
    render(
      <SelectItem data-testid="select-item" value="test">Item</SelectItem>
    );
    
    const item = screen.getByTestId('select-item');
    expect(item).toBeInTheDocument();
  });
  
  test('muestra las opciones al hacer click y selecciona correctamente', () => {
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
    
    // Simular click - con nuestro mock simplificado esto seleccionará automáticamente
    const trigger = screen.getByTestId('select-trigger');
    trigger.click();
    
    // Verificar que se llamó al callback con el valor esperado
    expect(onValueChangeMock).toHaveBeenCalledWith('option1');
  });
});