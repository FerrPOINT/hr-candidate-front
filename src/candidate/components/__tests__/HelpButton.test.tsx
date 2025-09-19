import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelpButton } from '../common/HelpButton';

describe('HelpButton', () => {
  it('рендерит кнопку помощи', () => {
    const mockOnClick = jest.fn();
    render(<HelpButton onClick={mockOnClick} />);
    
    expect(screen.getByRole('button', { name: /помощь/i })).toBeInTheDocument();
  });

  it('вызывает onClick при клике', () => {
    const mockOnClick = jest.fn();
    render(<HelpButton onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('отображает иконку помощи', () => {
    const mockOnClick = jest.fn();
    render(<HelpButton onClick={mockOnClick} />);
    
    // Проверяем, что есть SVG иконка
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Помощь')).toBeInTheDocument();
  });

  it('применяет правильные CSS классы', () => {
    const mockOnClick = jest.fn();
    render(<HelpButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('gap-2');
  });
});
