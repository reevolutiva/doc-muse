import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Mock del cliente Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('obtiene usuario actual correctamente', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    
    // Configurar el mock para devolver un usuario
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ 
      data: { user: mockUser },
      error: null 
    });
    
    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    
    // Inicialmente debería estar cargando
    expect(result.current.isLoading).toBe(true);
    
    // Esperar a que se resuelva la promesa
    await waitForNextUpdate();
    
    // Verificar que se ha cargado el usuario
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
  });
  
  test('signIn funciona correctamente', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({ 
      data: { provider: 'google' },
      error: null 
    });
    
    // Renderizar el hook
    const { result } = renderHook(() => useAuth());
    
    // Llamar a signIn
    await act(async () => {
      await result.current.signIn();
    });
    
    // Verificar que se llamó a signInWithOAuth
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({ 
      provider: 'google', 
      options: expect.any(Object) 
    });
  });
  
  test('signOut funciona correctamente', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
    
    // Renderizar el hook
    const { result } = renderHook(() => useAuth());
    
    // Llamar a signOut
    await act(async () => {
      await result.current.signOut();
    });
    
    // Verificar que se llamó a signOut
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});