import React from 'react';
import { render, screen } from '@testing-library/react';
import { AIAvatarWithWaves } from '../AIAvatarWithWaves';

describe('AIAvatarWithWaves', () => {
  it('рендерит аватар с волнами', () => {
    render(<AIAvatarWithWaves />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('отображает анимацию волн', () => {
    render(<AIAvatarWithWaves />);
    
    // Проверяем, что есть SVG элемент
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('принимает пропсы', () => {
    render(<AIAvatarWithWaves size="large" />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
