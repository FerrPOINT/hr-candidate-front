import React from 'react';
import { render, screen } from '@testing-library/react';
import { Logo } from '../ui/Logo';

describe('Logo', () => {
  it('рендерит логотип с размером по умолчанию', () => {
    render(<Logo />);
    
    expect(screen.getByAltText('Company Logo')).toBeInTheDocument();
  });

  it('рендерит логотип с заданным размером', () => {
    render(<Logo size="large" />);
    
    expect(screen.getByAltText('Company Logo')).toBeInTheDocument();
  });

  it('применяет правильные CSS классы для размера', () => {
    const { rerender } = render(<Logo size="small" />);
    expect(screen.getByAltText('Company Logo')).toHaveClass('w-full');

    rerender(<Logo size="medium" />);
    expect(screen.getByAltText('Company Logo')).toHaveClass('w-full');

    rerender(<Logo size="large" />);
    expect(screen.getByAltText('Company Logo')).toHaveClass('w-full');
  });

  it('передает дополнительные пропсы', () => {
    render(<Logo data-testid="logo" className="custom-class" />);
    
    const logoContainer = screen.getByTestId('logo');
    expect(logoContainer).toHaveClass('custom-class');
  });
});
