import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentList from '@/components/DocumentList';

describe('DocumentList Component', () => {
  test('renders DocumentList with documents', () => {
    render(<DocumentList documents={[{ id: 1, name: 'Doc 1' }, { id: 2, name: 'Doc 2' }]} />);
    expect(screen.getByText('Doc 1')).toBeInTheDocument();
    expect(screen.getByText('Doc 2')).toBeInTheDocument();
  });

  test('filters documents', () => {
    render(<DocumentList documents={[{ id: 1, name: 'Doc 1' }, { id: 2, name: 'Doc 2' }]} />);
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Doc 1' } });
    expect(screen.getByText('Doc 1')).toBeInTheDocument();
    expect(screen.queryByText('Doc 2')).toBeNull();
  });

  test('sorts documents', () => {
    render(<DocumentList documents={[{ id: 2, name: 'Doc 2' }, { id: 1, name: 'Doc 1' }]} />);
    fireEvent.click(screen.getByRole('button', { name: /Sort/i })); // Usar getByRole
    const sortedDocs = screen.getAllByTestId('document-item');
    expect(sortedDocs[0]).toHaveTextContent('Doc 1');
    expect(sortedDocs[1]).toHaveTextContent('Doc 2');
  });
});
