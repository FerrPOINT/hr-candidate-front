import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('рендерит кнопку с текстом', () => {
    render(<Button>Тестовая кнопка</Button>);
    
    expect(screen.getByRole('button', { name: 'Тестовая кнопка' })).toBeInTheDocument();
  });

  it('вызывает onClick при клике', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Кликни меня</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('отображает disabled состояние', () => {
    render(<Button disabled>Отключенная кнопка</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('применяет правильные CSS классы', () => {
    render(<Button variant="destructive" size="lg">Большая кнопка</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('h-10');
  });

  it('поддерживает разные варианты', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent');
  });

  it('поддерживает разные размеры', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');
  });

  it('передает дополнительные пропсы', () => {
    render(<Button data-testid="custom-button" aria-label="Custom button">Test</Button>);
    
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
  });

  it('поддерживает asChild prop', () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    );
    
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });
});
