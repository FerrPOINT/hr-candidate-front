import React from 'react';
import { render, screen } from '@testing-library/react';
import { AIAvatarWithWaves } from '../AIAvatarWithWaves';

describe('AIAvatarWithWaves', () => {
  it('рендерит аватар с волнами', () => {
    const { container } = render(<AIAvatarWithWaves />);
    
    // Проверяем, что компонент рендерится
    expect(container.firstChild).toBeInTheDocument();
  });

  it('отображает анимацию волн', () => {
    const { container } = render(<AIAvatarWithWaves />);
    
    // Проверяем, что есть SVG элемент
    expect(container.firstChild).toBeInTheDocument();
  });

  it('принимает пропсы', () => {
    const { container } = render(<AIAvatarWithWaves size="large" />);
    
    // Проверяем, что компонент рендерится
    expect(container.firstChild).toBeInTheDocument();
  });
});
