import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';
import { Heart } from 'lucide-react';

describe('EmptyState Component', () => {
  test('renders with default props', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('Aucune donnée disponible')).toBeInTheDocument();
    expect(screen.getByText(/Les informations seront bientôt disponibles/)).toBeInTheDocument();
  });

  test('renders with custom props', () => {
    render(
      <EmptyState 
        title="Custom Title"
        message="Custom message"
        icon={Heart}
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(<EmptyState className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});