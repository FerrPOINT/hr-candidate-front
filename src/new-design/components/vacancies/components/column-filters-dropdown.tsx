import React from 'react';
import { Search2LineIconV7, ArrowDownSLineIconV7 } from '../../ui/figma-icons-v7';
import { ColumnFilters } from '../types';

interface ColumnFiltersDropdownProps {
	isOpen: boolean;
	localFilters: ColumnFilters;
	onLocalFiltersChange: (filters: ColumnFilters) => void;
	onApplyFilters: (filters: ColumnFilters) => void;
	onClose: () => void;
}

export const ColumnFiltersDropdown: React.FC<ColumnFiltersDropdownProps> = ({
	isOpen,
	localFilters,
	onLocalFiltersChange,
	onApplyFilters,
	onClose
}) => {
	if (!isOpen) return null;

	return (
		<div className="relative">
			<div 
				data-dropdown="column-filters"
				className="absolute top-full left-0 mt-2 w-[250px] bg-white rounded-xl border border-border shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] z-[9999] p-3"
			>
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-foreground">Фильтры</span>
						<button
							onClick={onClose}
							className="text-muted-foreground hover:text-foreground transition-colors p-1"
						>
							<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 12 12">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3L3 9M3 3l6 6" />
							</svg>
						</button>
					</div>
					
					{/* Name filter */}
					<div className="flex flex-col gap-1">
						<label className="text-xs font-medium text-foreground">Имя кандидата</label>
						<div className="relative">
							<Search2LineIconV7 className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none w-3 h-3 text-muted-foreground" />
							<input
								type="text"
								value={localFilters.name}
								onChange={(e) => onLocalFiltersChange({ ...localFilters, name: e.target.value })}
								placeholder="Поиск по имени..."
								className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
								style={{ fontSize: '12px', lineHeight: '16px' }}
							/>
						</div>
					</div>
					
					{/* Status filter */}
					<div className="flex flex-col gap-1">
						<label className="text-xs font-medium text-foreground">Статус</label>
						<div className="relative">
							<select
								value={localFilters.status}
								onChange={(e) => onLocalFiltersChange({ ...localFilters, status: e.target.value })}
								className="w-full px-2.5 py-1.5 text-xs bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
							>
								<option value="all">Все статусы</option>
								<option value="screening">Скрининг</option>
								<option value="interview">Интервью</option>
								<option value="offer">Предложение</option>
								<option value="rejected">Отклонен</option>
							</select>
							<ArrowDownSLineIconV7 className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none w-3 h-3" />
						</div>
					</div>
					
					{/* Rating filter */}
					<div className="flex flex-col gap-1">
						<label className="text-xs font-medium text-foreground">Рейтинг</label>
						<div className="relative">
							<select
								value={localFilters.rating}
								onChange={(e) => onLocalFiltersChange({ ...localFilters, rating: e.target.value })}
								className="w-full px-2.5 py-1.5 text-xs bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring appearance:none cursor-pointer"
							>
								<option value="all">Все рейтинги</option>
								<option value="high">Высокий (7+)</option>
								<option value="medium">Средний (5-6.9)</option>
								<option value="low">Низкий (&lt;5)</option>
							</select>
							<ArrowDownSLineIconV7 className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none w-3 h-3" />
						</div>
					</div>
					
					{/* Date filter */}
					<div className="flex flex-col gap-1">
						<label className="text-xs font-medium text-foreground">Дата</label>
						<div className="relative">
							<select
								value={localFilters.date}
								onChange={(e) => onLocalFiltersChange({ ...localFilters, date: e.target.value })}
								className="w-full px-2.5 py-1.5 text-xs bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
							>
								<option value="all">Все даты</option>
								<option value="today">Сегодня</option>
								<option value="week">Неделя</option>
								<option value="month">Месяц</option>
							</select>
							<ArrowDownSLineIconV7 className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none w-3 h-3" />
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-2 pt-1.5 border-t border-border">
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								const resetFilters = { name: "", status: "all", rating: "all", date: "all" };
								onLocalFiltersChange(resetFilters);
								onApplyFilters(resetFilters);
							}}
							className="flex-1 px-2 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors cursor-pointer"
						>
							Сброс
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								onApplyFilters(localFilters);
								onClose();
							}}
							className="flex-1 px-2 py-1 text-xs font-medium text-white bg-[#e16349] rounded-md hover:bg-[#d14a31] transition-colors cursor-pointer"
						>
							OK
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}; 