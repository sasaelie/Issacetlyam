import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataError from '../DataError';

describe('DataError Component', () => {
  test('renders error message', () => {
    render(<DataError message="Test error message" />);
    
    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('renders retry button when retry function provided', () => {
    const mockRetry = jest.fn();
    render(<DataError message="Test error" retry={mockRetry} />);
    
    const retryButton = screen.getByText('Réessayer');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  test('does not render retry button when no retry function provided', () => {
    render(<DataError message="Test error" />);
    
    expect(screen.queryByText('Réessayer')).not.toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(<DataError message="Test" className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});