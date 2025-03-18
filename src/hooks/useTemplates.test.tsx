import { renderHook, act } from '@testing-library/react-hooks';
import useTemplates from '@/hooks/useTemplates';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('useTemplates Hook', () => {
  test('fetches templates successfully', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [{ id: 1, name: 'Template 1' }], error: null })
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());
    await waitForNextUpdate();

    expect(result.current.templates).toEqual([{ id: 1, name: 'Template 1' }]);
    expect(result.current.error).toBeNull();
  });

  test('handles fetch error', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: null, error: 'Error fetching templates' })
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());
    await waitForNextUpdate();

    expect(result.current.templates).toBeNull();
    expect(result.current.error).toBe('Error fetching templates');
  });

  test('creates a new template', async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: { id: 2, name: 'New Template' }, error: null })
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());
    act(() => {
      result.current.createTemplate({ name: 'New Template' });
    });
    await waitForNextUpdate();

    expect(result.current.templates).toContainEqual({ id: 2, name: 'New Template' });
  });

  test('handles create template error', async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: null, error: 'Error creating template' })
    });

    const { result, waitForNextUpdate } = renderHook(() => useTemplates());
    act(() => {
      result.current.createTemplate({ name: 'New Template' });
    });
    await waitForNextUpdate();

    expect(result.current.error).toBe('Error creating template');
  });
});
