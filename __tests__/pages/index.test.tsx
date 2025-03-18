import { render, screen, waitFor } from '@testing-library/react';
import IndexPage from '../../src/pages/index'; // Ruta corregida
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/router';

// Mock de dependencias
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    }
  }
}));

jest.mock('../../src/components/auth/auth-form', () => ({
  AuthForm: () => <div data-testid="auth-form">Auth Form</div>
}));

describe('Home Page', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('muestra el indicador de carga inicialmente', () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ 
      data: { session: null } 
    });
    
    render(<IndexPage />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  test('redirige a /projects cuando el usuario está autenticado', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ 
      data: { session: { user: { id: '123' } } } 
    });
    
    render(<IndexPage />);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects');
    });
  });

  test('muestra el formulario de autenticación cuando el usuario no está autenticado', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ 
      data: { session: null } 
    });
    
    render(<IndexPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    });
  });
});
