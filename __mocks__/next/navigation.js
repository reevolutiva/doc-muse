export const useRouter = jest.fn().mockReturnValue({
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  forward: jest.fn(),
});

export const usePathname = jest.fn().mockReturnValue('/');
export const useSearchParams = jest.fn().mockReturnValue(new URLSearchParams());
export const redirect = jest.fn();