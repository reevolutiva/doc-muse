const mockSubscription = {
  unsubscribe: jest.fn()
};

const mockAuth = {
  onAuthStateChange: jest.fn(() => ({
    data: { subscription: mockSubscription }
  })),
  getSession: jest.fn(() => ({
    data: { session: null },
    error: null
  })),
  signInWithPassword: jest.fn(),
  signOut: jest.fn(),
  getUser: jest.fn()
};

const mockSupabase = {
  auth: mockAuth,
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    execute: jest.fn()
  }))
};

module.exports = {
  supabase: mockSupabase
};