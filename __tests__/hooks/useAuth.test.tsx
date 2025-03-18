import { renderHook, act } from '@testing-library/react-hooks';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Mock de supabase
jest.mock('@/lib/supabase');

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
    const { result } = renderHook(() => useAuth());
    
    // El hook debería estar cargando inicialmente
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Después de cargar, el usuario debería seguir siendo null
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
    
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false)); // Esperar a que el estado inicial se cargue
    
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
    
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false)); // Esperar a que el estado inicial se cargue
    
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
    
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false)); // Esperar a que el estado inicial se cargue
    
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
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
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

  test('returns null user initially', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  test('logs in user successfully', async () => {
    supabase.auth.signIn.mockResolvedValue({ user: { id: '123' }, error: null });

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.login('test@example.com', 'password');
    });
    await waitForNextUpdate();

    expect(result.current.user).toEqual({ id: '123' });
  });

  test('handles login error', async () => {
    supabase.auth.signIn.mockResolvedValue({ user: null, error: 'Login error' });

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.login('test@example.com', 'password');
    });
    await waitForNextUpdate();

    expect(result.current.error).toBe('Login error');
  });

  test('logs out user successfully', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.logout();
    });
    await waitForNextUpdate();

    expect(result.current.user).toBeNull();
  });

  test('handles logout error', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: 'Logout error' });

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.logout();
    });
    await waitForNextUpdate();

    expect(result.current.error).toBe('Logout error');
  });
});