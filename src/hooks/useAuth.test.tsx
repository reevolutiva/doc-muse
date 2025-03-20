import { renderHook, act } from '@testing-library/react-hooks';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('useAuth Hook', () => {
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
