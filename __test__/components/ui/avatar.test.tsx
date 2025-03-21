import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from '@/components/ui/avatar';

describe('Avatar Component', () => {
  test('renders Avatar with image', () => {
    render(<Avatar src="avatar.png" alt="User Avatar" />);
    expect(screen.getByAltText('User Avatar')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<Avatar className="custom-class" src="avatar.png" alt="User Avatar" />);
    expect(screen.getByAltText('User Avatar')).toHaveClass('custom-class');
  });
});
