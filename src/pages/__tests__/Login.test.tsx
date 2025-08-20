import { render, screen, fireEvent } from '../../test-utils';
import Login from '../Login';
import * as authStore from '../../store/authStore';

jest.mock('../../store/authStore');

describe('Login page', () => {
  it('рендерит форму логина и вызывает loginAdmin', async () => {
    const loginAdmin = jest.fn().mockResolvedValue(undefined);
    (authStore.useAuthStore as any).mockReturnValue({ loginAdmin });

    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    // Выбираем именно input пароля
    const passwordInput = screen.getByLabelText(/^пароль$/i, { selector: 'input' });
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    expect(loginAdmin).toHaveBeenCalledWith('test@example.com', 'password', false);
  });
}); 