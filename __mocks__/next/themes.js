export const useTheme = jest.fn().mockReturnValue({
  theme: 'light',
  setTheme: jest.fn(),
  themes: ['light', 'dark'],
});