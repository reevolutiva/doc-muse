import { renderHook, waitFor } from '@testing-library/react';
import { useTemplates } from '@/hooks/useTemplates';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('useTemplates Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('carga templates correctamente', async () => {
    const mockTemplates = [
      { id: '1', title: 'Template 1', description: 'Description 1' },
      { id: '2', title: 'Template 2', description: 'Description 2' },
    ];

    // Configurar el mock adecuadamente
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockTemplates,
          error: null
        })
      })
    });

    const { result } = renderHook(() => useTemplates());
    
    // Esperar a que se actualice el estado
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.templates).toEqual(mockTemplates);
    expect(supabase.from).toHaveBeenCalledWith(expect.any(String));
  });
});
