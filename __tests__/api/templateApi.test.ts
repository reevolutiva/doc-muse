import { saveTemplate, getTemplate } from '@/api/templateApi'; // Importación nombrada
import { supabase } from '@/lib/supabase';

const mockResponse = {
  data: [{ id: '123', ...mockTemplate }],
  error: null,
};

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockResponse)
      }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockTemplate,
            error: null,
          })
        })
      })
    })
  }
}));

describe('templateApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveTemplate', () => {
    test('crea una nueva plantilla correctamente', async () => {
      const mockTemplate = {
        name: 'Nueva Plantilla Test',
        description: 'Descripción de prueba',
        nodes: [{ id: 'node-1', data: { label: 'Documento' }, type: 'document' }],
        edges: []
      };

      

      (supabase.from().insert as jest.Mock).mockResolvedValue(mockResponse);

      const result = await saveTemplate(mockTemplate);

      expect(supabase.from).toHaveBeenCalledWith('templates');
      expect(result).toEqual(mockResponse.data[0]);
    });
  });

  describe('getTemplate', () => {
    test('obtiene una plantilla correctamente', async () => {
      const templateId = '123';
      const mockTemplate = {
        id: templateId,
        name: 'Plantilla Test',
        description: 'Descripción',
        data: {
          nodes: [{ id: 'node-1', type: 'document', data: { label: 'Documento' } }],
          edges: [],
        },
      };

      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue({
        data: mockTemplate,
        error: null,
      });

      const result = await getTemplate(templateId);

      expect(supabase.from).toHaveBeenCalledWith('templates');
      expect(result).toEqual(
        expect.objectContaining({
          id: templateId,
          name: mockTemplate.name,
        })
      );
    });
  });
});
