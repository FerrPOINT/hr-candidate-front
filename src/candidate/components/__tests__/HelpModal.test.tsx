import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelpModal } from '../common/HelpModal';

describe('HelpModal', () => {
  it('не отображается когда isOpen=false', () => {
    render(<HelpModal isOpen={false} onClose={jest.fn()} />);
    
    expect(screen.queryByText('Если возникли технические проблемы во время собеседования:')).not.toBeInTheDocument();
  });

  it('отображается когда isOpen=true', () => {
    render(<HelpModal isOpen={true} onClose={jest.fn()} />);
    
    expect(screen.getByText('Если возникли технические проблемы во время собеседования:')).toBeInTheDocument();
  });

  it('вызывает onClose при клике на кнопку закрытия', () => {
    const mockOnClose = jest.fn();
    render(<HelpModal isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('вызывает onClose при клике на фон модального окна', () => {
    const mockOnClose = jest.fn();
    render(<HelpModal isOpen={true} onClose={mockOnClose} />);
    
    const backdrop = screen.getByRole('button');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('отображает содержимое помощи', () => {
    render(<HelpModal isOpen={true} onClose={jest.fn()} />);
    
    expect(screen.getByText('Если возникли технические проблемы во время собеседования:')).toBeInTheDocument();
    expect(screen.getByText('Запустите на другом устройстве')).toBeInTheDocument();
  });
});
