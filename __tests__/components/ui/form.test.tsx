import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from '@/components/ui/form';

describe('Form Component', () => {
  test('renders Form with inputs', () => {
    render(
      <Form>
        <input name="test-input" placeholder="Test Input" />
      </Form>
    );
    expect(screen.getByPlaceholderText('Test Input')).toBeInTheDocument();
  });

  test('validates input fields', () => {
    render(
      <Form>
        <input name="test-input" placeholder="Test Input" required />
      </Form>
    );
    fireEvent.submit(screen.getByRole('form'));
    expect(screen.getByPlaceholderText('Test Input')).toBeInvalid();
  });

  test('submits form data', () => {
    const handleSubmit = jest.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <input name="test-input" placeholder="Test Input" />
      </Form>
    );
    fireEvent.change(screen.getByPlaceholderText('Test Input'), { target: { value: 'Test Value' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(handleSubmit).toHaveBeenCalledWith({ 'test-input': 'Test Value' });
  });
});
