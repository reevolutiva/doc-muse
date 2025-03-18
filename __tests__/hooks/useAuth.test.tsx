import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Mock de supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    }
  }
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuración de mocks por defecto
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null
    });
    
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      // Simular la suscripción a cambios de estado
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
  });

  test('devuelve estado inicial no autenticado', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    
    // El hook debería estar cargando inicialmente
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
    
    await waitForNextUpdate();
    
    // Después de cargar, el usuario debería seguir siendo null
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('maneja inicio de sesión exitoso', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
    };
    
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { 
        user: mockUser,
        session: { access_token: 'test-token' } 
      },
      error: null
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    await waitForNextUpdate(); // Esperar a que el estado inicial se cargue
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ 
      email: 'test@example.com', 
      password: 'password' 
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('maneja error de inicio de sesión', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' }
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    await waitForNextUpdate(); // Esperar a que el estado inicial se cargue
    
    let error;
    await act(async () => {
      error = await result.current.login('test@example.com', 'wrong-password');
    });
    
    expect(error).toEqual({ message: 'Invalid login credentials' });
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('maneja cierre de sesión exitoso', async () => {
    // Configurar estado de usuario autenticado
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { access_token: 'test-token' } },
      error: null
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    await waitForNextUpdate(); // Esperar a que el estado inicial se cargue
    
    // Verificar que el usuario está autenticado
    expect(result.current.isAuthenticated).toBe(true);
    
    // Mockear el signOut para que sea exitoso
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: null
    });
    
    // Ejecutar el logout
    await act(async () => {
      await result.current.logout();
    });
    
    // Verificar que se llamó a signOut
    expect(supabase.auth.signOut).toHaveBeenCalled();
    
    // El estado debería actualizarse a no autenticado
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  test('se suscribe a cambios de estado de autenticación', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    await waitForNextUpdate();
    
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    
    // Simular cambio de estado de autenticación
    const authStateCallback = (supabase.auth.onAuthStateChange as jest.Mock).mock.calls[0][0];
    
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { access_token: 'new-token' };
    
    // Actualizar el estado con los nuevos datos de usuario
    act(() => {
      authStateCallback('SIGNED_IN', { user: mockUser, session: mockSession });
    });
    
    // Verificar que el estado se actualizó correctamente
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});