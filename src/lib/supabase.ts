import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper para mocks
export const mockSupabase = {
  from: jest.fn(() => mockSupabase),
  select: jest.fn(() => mockSupabase),
  insert: jest.fn(() => mockSupabase),
  update: jest.fn(() => mockSupabase),
  delete: jest.fn(() => mockSupabase),
  auth: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } }
    }))
  }
};

export async function fetchData() {
  try {
    const { data, error } = await supabase
      .from('table')
      .select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export const getProjectTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('project_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching project templates:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching project templates:", error);
    return [];
  }
};

export const getProjectTemplateById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('project_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching project template by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching project template by ID:", error);
    return null;
  }
};