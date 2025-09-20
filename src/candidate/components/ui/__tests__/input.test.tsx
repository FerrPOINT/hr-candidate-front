import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../input';

describe('Input', () => {
  it('рендерит input с placeholder', () => {
    render(<Input placeholder="Введите текст" />);
    
    expect(screen.getByPlaceholderText('Введите текст')).toBeInTheDocument();
  });

  it('отображает значение', () => {
    render(<Input value="Тестовое значение" onChange={() => {}} />);
    
    expect(screen.getByDisplayValue('Тестовое значение')).toBeInTheDocument();
  });

  it('вызывает onChange при изменении', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'новое значение' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('поддерживает disabled состояние', () => {
    render(<Input disabled />);
    
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('поддерживает разные типы', () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');

    rerender(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
  });

  it('применяет правильные CSS классы', () => {
    render(<Input className="custom-class" />);
    
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    expect(screen.getByRole('textbox')).toHaveClass('w-full');
    expect(screen.getByRole('textbox')).toHaveClass('transition-all');
  });

  it('передает дополнительные пропсы', () => {
    render(<Input data-testid="custom-input" aria-label="Custom input" />);
    
    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('aria-label', 'Custom input');
  });

  it('поддерживает ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

