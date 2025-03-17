// Optional: configure or set up a testing framework before each test
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Mock para next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      query: {},
      asPath: '',
      route: '/',
    };
  },
}));

// Mock para Supabase si es necesario
jest.mock('./src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    }
  }
}));
