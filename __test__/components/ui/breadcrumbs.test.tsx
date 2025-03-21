import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import clsx from 'clsx';

describe('Breadcrumbs Component', () => {
  test('renders Breadcrumbs with links', () => {
    render(<Breadcrumbs links={[{ name: 'Home', href: '/' }, { name: 'Docs', href: '/docs' }]} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<Breadcrumbs className={clsx("custom-class", "transition-colors hover:text-foreground font-medium text-foreground pointer-events-none")} links={[{ name: 'Home', href: '/' }]} />);
    expect(screen.getByText('Home')).toHaveClass('custom-class');
  });
});
