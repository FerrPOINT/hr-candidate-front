import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
// Use the logo to match visuals
import { SynergyLogoFigma } from './ui/synergy-logo-figma';
import { SuitcaseLineIconV7, PieChartLineIconV7, TeamLineIconV7 } from './ui/figma-icons-v7';

const Layout: React.FC = () => {
	const { isAuth } = useAuthStore();
	const navigate = useNavigate();
	const location = useLocation();
	const pageRendersOwnHeader = false;

	if (isAuth === null) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-gray-500">Проверка аутентификации...</div>
			</div>
		);
	}

	if (!isAuth) {
		navigate('/recruiter/login');
		return null;
	}

	const navItems: { id: string; label: string; to: string; Icon: React.ComponentType<{ color?: string }> }[] = [
		{ id: 'vacancies', label: 'Вакансии', to: '/recruiter/vacancies', Icon: SuitcaseLineIconV7 },
		{ id: 'statistics', label: 'Статистика', to: '/recruiter/reports', Icon: PieChartLineIconV7 },
		{ id: 'team', label: 'Управление', to: '/recruiter/team', Icon: TeamLineIconV7 },
	];
	const isActive = (to: string) => location.pathname.startsWith(to);

	return (
		<div className="bg-[#e9eae2] min-h-screen w-full">
			{!pageRendersOwnHeader && (
				<div className="w-full px-8 py-8">
					<div className="flex items-center justify-between max-w-[1600px] w-full mx-auto">
						<div onClick={() => navigate('/recruiter/vacancies')} className="flex items-center gap-3 cursor-pointer">
							<div className="shrink-0">
								<SynergyLogoFigma />
							</div>
							<div className="text-[24px] font-semibold text-[#000]">WMT Рекрутер</div>
						</div>

						{/* Center: navigation */}
						<div className="flex items-center gap-2 justify-center flex-1">
							{navItems.map(({ id, label, to, Icon }) => {
								const active = isActive(to);
								return (
									<button
										key={id}
										onClick={() => navigate(to)}
										className={`box-border flex flex-row items-center justify-center rounded-3xl px-[14px] py-[14px] shadow-[0px_1px_2px_0px_rgba(55,93,251,0.08)] ${
											active
												? 'bg-[#ffffff] text-[#e16349] border border-[#e16349]'
												: 'bg-[#f5f6f1] text-[#525866] hover:bg-[#edeef0]'
										}`}
									>
										<Icon color={active ? '#e16349' : '#525866'} />
										<span className="ml-2 text-[16px] font-medium tracking-[-0.176px]">{label}</span>
									</button>
								);
							})}
						</div>

						{/* Right: profile */}
						<div className="flex items-center gap-2">
							<div className="bg-[#f5f6f1] rounded-3xl pl-1.5 pr-[18px] py-1.5 flex items-center gap-1.5">
								<div className="bg-[#fbdfb1] rounded-full w-10 h-10" />
								<div className="text-[#525866] text-[16px]">Наталья</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Body container (same width as header) */}
			<div className="w-full px-8 pb-8">
				<div className="max-w-[1600px] w-full mx-auto">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default Layout; 