import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single instance of Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!supabaseInstance && typeof window !== 'undefined') {
    // Only create the client in browser environments
    console.log('Creating new Supabase instance');
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        storageKey: 'docmuse-auth',
        detectSessionInUrl: true,
        autoRefreshToken: true,
      }
    });
  }
  return supabaseInstance || createClient(supabaseUrl, supabaseKey);
};

// Export the singleton instance
export const supabase = getSupabase();

// Helper para mocks
export const mockSupabase = {
  from: typeof jest !== 'undefined' ? jest.fn(() => mockSupabase) : (() => mockSupabase),
  select: typeof jest !== 'undefined' ? jest.fn(() => mockSupabase) : (() => mockSupabase),
  insert: typeof jest !== 'undefined' ? jest.fn(() => mockSupabase) : (() => mockSupabase),
  update: typeof jest !== 'undefined' ? jest.fn(() => mockSupabase) : (() => mockSupabase),
  delete: typeof jest !== 'undefined' ? jest.fn(() => mockSupabase) : (() => mockSupabase),
  auth: {
    signIn: typeof jest !== 'undefined' ? jest.fn() : (() => {}),
    signOut: typeof jest !== 'undefined' ? jest.fn() : (() => {}),
    getSession: typeof jest !== 'undefined' ? jest.fn() : (() => {}),
    onAuthStateChange: typeof jest !== 'undefined' ? jest.fn(() => ({
      data: { subscription: { unsubscribe: typeof jest !== 'undefined' ? jest.fn() : (() => {}) } }
    })) : (() => ({
      data: { subscription: { unsubscribe: () => {} } }
    }))
  }
};

// Existing functions
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
