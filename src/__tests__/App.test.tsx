import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('рендерит логин на корневом маршруте', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });
}); 