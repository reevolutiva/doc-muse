// Optional: configure or set up a testing framework before each test
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// Importar mocks modularizados
jest.mock('next/router', () => require('./__mocks__/next/router'));
jest.mock('next/navigation', () => require('./__mocks__/next/navigation'));
jest.mock('next-themes', () => require('./__mocks__/next/themes'));
jest.mock('@/lib/supabase', () => require('./__mocks__/lib/supabase'));
jest.mock('reactflow', () => require('./__mocks__/components/reactflow.js'));

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

// Mock para ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suprimir errores de consola durante las pruebas para evitar ruido en los reportes de testing
console.error = jest.fn();
console.warn = jest.fn();
