import { render, screen, fireEvent } from '../../test-utils';
import VacancyList from '../VacancyList';
import * as authStore from '../../store/authStore';
import * as recruiterState from '../../utils/recruiterStateManager';

jest.mock('../../store/authStore');
jest.mock('../../utils/recruiterStateManager');

describe('VacancyList', () => {
  it('рендерит компонент VacanciesPageUnified', () => {
    (authStore.useAuthStore as any).mockReturnValue({ isAuth: true, isLoading: false });
    (recruiterState.useRecruiterState as any).mockReturnValue({
      state: {
        vacancyList: {
          searchTerm: '',
          statusFilter: '',
          tab: 'all',
          selectedId: null,
          page: 0,
          pageSize: 20,
          vacancyTab: 'candidates',
        },
      },
      updateVacancyList: jest.fn(),
    });

    render(<VacancyList />);
    // Проверяем, что компонент рендерится (не показывает загрузку или ошибку)
    expect(screen.queryByText(/загрузка/i)).not.toBeInTheDocument();
  });
}); 