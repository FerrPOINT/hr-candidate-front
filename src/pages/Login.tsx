import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SynergyLogoFigma } from '../components/ui/synergy-logo-figma';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
	const navigate = useNavigate();
	const { loginAdmin } = useAuthStore();

	const [email, setEmail] = React.useState('admin@wmt.ai');
	const [password, setPassword] = React.useState('password123');
	const [rememberMe, setRememberMe] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState<string>('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage('');
		try {
			await loginAdmin(email, password, rememberMe);
			navigate('/recruiter');
		} catch (error: any) {
			console.error('Login error:', error);
			// Показать локальное сообщение над кнопкой
			setErrorMessage('Неверный email или пароль');
			// Сохранить существующее поведение (toast)
			toast.error('Ошибка входа. Проверьте email и пароль.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#e9eae2] via-[#f0f1ea] to-[#e5e6de] flex items-center justify-center p-8">
			<div className="w-full max-w-md">
				<div className="bg-[#f5f6f1] rounded-[44px] p-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] border border-[#e2e4e9]">
					<div className="flex flex-col items-center mb-8">
						<div className="mb-6">
							<SynergyLogoFigma />
						</div>
						<h1 className="text-[24px] font-['Inter_Display:Medium',_sans-serif] font-medium text-[#000000] text-center mb-2">
							Вас приветствует AI-ассистент WMT
						</h1>
						<p className="text-[14px] font-['Inter:Regular',_sans-serif] text-[#525866] text-center leading-[20px]">
							Войдите, чтобы начать<br />
							автоматизированный подбор персонала
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="email" className="block text-[14px] font-['Inter:Medium',_sans-serif] font-medium text-[#000000] mb-2 pl-3">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									if (errorMessage) setErrorMessage('');
								}}
								placeholder="admin@wmt.ai"
								className="w-full px-4 py-3 bg-[#ffffff] border border-[#e2e4e9] rounded-3xl text-[16px] font-['Inter:Regular',_sans-serif] text-[#000000] placeholder:text-[#868c98] focus:outline-none focus:ring-2 focus:ring-[#e16349] focus:border-transparent transition-all"
								required
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-[14px] font-['Inter:Medium',_sans-serif] font-medium text-[#000000] mb-2 pl-3">
								Пароль
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									if (errorMessage) setErrorMessage('');
								}}
								placeholder="••••"
								className="w-full px-4 py-3 bg-[#ffffff] border border-[#e2e4e9] rounded-3xl text-[16px] font-['Inter:Regular',_sans-serif] text-[#000000] placeholder:text-[#868c98] focus:outline-none focus:ring-2 focus:ring-[#e16349] focus:border-transparent transition-all"
								required
							/>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									className="w-4 h-4 rounded border-2 border-[#e2e4e9] text-[#e16349] focus:ring-[#e16349] focus:ring-2"
								/>
								<span className="text-[14px] font-['Inter:Regular',_sans-serif] text-[#525866]">
									Запомнить меня
								</span>
							</label>

							<button
								type="button"
								className="text-[14px] font-['Inter:Regular',_sans-serif] text-[#e16349] hover:underline"
							>
								Забыли пароль?
							</button>
						</div>

						{errorMessage && (
							<div className="text-[#df1c41] text-[14px] font-['Inter:Medium',_sans-serif] text-center -mt-2">
								{errorMessage}
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-[#e16349] hover:bg-[#d14a31] disabled:bg-[#f0f1ea] text-white disabled:text-[#868c98] py-3 px-6 rounded-3xl text-[16px] font-['Inter:Medium',_sans-serif] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e16349] focus:ring-offset-2"
						>
							{isLoading ? 'Вход...' : 'Войти'}
						</button>

						<div className="mt-4 pt-4 border-t border-[#e2e4e9]">
							<button
								type="button"
								onClick={() => navigate('/candidate/login')}
								className="w-full bg-[#35b9e9] hover:bg-[#2a9bd8] text-white py-3 px-6 rounded-3xl text-[16px] font-['Inter:Medium',_sans-serif] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#35b9e9] focus:ring-offset-2"
							>
								Тест: Интервью кандидата
							</button>
						</div>
					</form>
				</div>

				<div className="text-center mt-6">
					<p className="text-[12px] font-['Inter:Regular',_sans-serif] text-[#868c98]">
						© {new Date().getFullYear()} WMT AI Рекрутер. Все права защищены.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;