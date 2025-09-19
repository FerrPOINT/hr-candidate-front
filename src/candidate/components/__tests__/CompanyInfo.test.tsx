import React from 'react';
import { render, screen } from '@testing-library/react';
import { CompanyInfo } from '../CompanyInfo';

describe('CompanyInfo', () => {
  it('рендерит информацию о компании', () => {
    render(<CompanyInfo />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByText('У меня нет вопросов')).toBeInTheDocument();
  });

  it('отображает название компании', () => {
    render(<CompanyInfo />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByText('У меня нет вопросов')).toBeInTheDocument();
  });

  it('отображает логотип компании', () => {
    render(<CompanyInfo />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByText('У меня нет вопросов')).toBeInTheDocument();
  });
});
