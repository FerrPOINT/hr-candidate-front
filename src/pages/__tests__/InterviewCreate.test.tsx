import { render, screen, fireEvent, waitFor } from '../../test-utils';
import InterviewCreate from '../InterviewCreate';
import * as authStore from '../../store/authStore';
import * as recruiterState from '../../utils/recruiterStateManager';
import * as apiService from '../../services/apiService';

jest.mock('../../store/authStore');
jest.mock('../../utils/recruiterStateManager');
jest.mock('../../services/apiService');

describe('InterviewCreate', () => {
  beforeEach(() => {
    (authStore.useAuthStore as any).mockReturnValue({ isAuth: true });
    (recruiterState.useRecruiterState as any).mockReturnValue({
      state: { interviewCreate: { formData: { firstName: '', lastName: '', email: '', vacancyId: '', scheduledDate: '' } } },
      updateInterviewCreate: jest.fn(),
    });
    (apiService.apiService.getPositions as any).mockResolvedValue({ items: [{ id: 101, title: 'Frontend Dev' }], total: 1 });
    (apiService.apiService.createInterview as any).mockResolvedValue({ id: 1 });
    (apiService.apiService.createInterview as any).mockImplementation(() => Promise.resolve({ id: 1 }));
    // startInterview no longer called during creation
  });

  it('рендерит форму создания интервью', () => {
    render(<InterviewCreate />);
    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/фамил/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /создать собеседование/i })).toBeInTheDocument();
  });

  it('обрабатывает сабмит формы', async () => {
    render(<InterviewCreate />);
    fireEvent.change(screen.getByLabelText(/имя/i), { target: { value: 'Иван' } });
    fireEvent.change(screen.getByLabelText(/фамил/i), { target: { value: 'Иванов' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ivan@example.com' } });

    // Выбрать вакансию
    const select = await screen.findByLabelText(/вакансия/i);
    fireEvent.change(select, { target: { value: '101' } });

    fireEvent.click(screen.getByRole('button', { name: /создать собеседование/i }));

    await waitFor(() => expect(apiService.apiService.createInterview).toHaveBeenCalled());
    // No startInterview call expected now
  });
}); 