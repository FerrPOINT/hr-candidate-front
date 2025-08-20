import React from 'react';
import { ArrowDownSLineIconV7 } from '../../ui/figma-icons-v7';
import { SortField } from '../types';
import { sortFieldLabels, defaultSortFieldsOrder } from '../constants';

interface SortDropdownProps {
	isOpen: boolean;
	sortFieldsOrder: SortField[];
	onSortFieldsChange: (fields: SortField[]) => void;
	onClose: () => void;
	draggedItem: number | null;
	onDragStart: (index: number) => void;
	onDragOver: (e: React.DragEvent, index: number) => void;
	onDragEnd: () => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
	isOpen,
	sortFieldsOrder,
	onSortFieldsChange,
	onClose,
	draggedItem,
	onDragStart,
	onDragOver,
	onDragEnd
}) => {
	const toggleSortField = (index: number) => {
		onSortFieldsChange(sortFieldsOrder.map((field, i) => 
			i === index ? { ...field, active: !field.active } : field
		));
	};

	const toggleSortDirection = (index: number) => {
		onSortFieldsChange(sortFieldsOrder.map((field, i) => 
			i === index ? { ...field, direction: field.direction === "asc" ? "desc" : "asc" } : field
		));
	};

	const resetSort = () => {
		onSortFieldsChange(defaultSortFieldsOrder);
	};

	if (!isOpen) return null;

	return (
		<div className="relative">
			{/* Backdrop to prevent overflow clipping */}
			<div className="fixed inset-0 z-[9998]" onClick={onClose} />
			<div 
				data-dropdown="sort"
				className="absolute top-full right-0 mt-2 w-[320px] bg-[#ffffff] rounded-[20px] border border-[#e2e4e9] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] z-[9999] p-2"
			>
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[13px] text-left">
							<p className="block leading-[18px]">Сортировка</p>
						</div>
						<button
							onClick={onClose}
							className="text-[#525866] hover:text-[#000000] transition-colors"
						>
							<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 12 12">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3L3 9M3 3l6 6" />
							</svg>
						</button>
					</div>
					
					{/* Sort fields list */}
					<div className="flex flex-col gap-0.5">
						{sortFieldsOrder.map((field, index) => (
							<div 
								key={field.key} 
								draggable
								onDragStart={() => onDragStart(index)}
								onDragOver={(e) => onDragOver(e, index)}
								onDragEnd={onDragEnd}
								className={`flex items-center justify-between py-1 px-1.5 rounded-[6px] transition-all cursor-move hover:bg-[#f6f8fa] ${
									draggedItem === index ? 'opacity-50 bg-[#f0f1f3]' : ''
								}`}
							>
								<div className="flex items-center gap-1.5">
									{/* Drag handle */}
									<div className="flex flex-col gap-0.5 text-[#868c98] cursor-move">
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
									</div>
									
									{/* Checkbox */}
									<div
										className="relative shrink-0 size-3.5 cursor-pointer"
										onClick={() => toggleSortField(index)}
									>
										{field.active ? (
											<svg
												className="block size-full"
												fill="none"
												preserveAspectRatio="none"
												viewBox="0 0 20 20"
											>
												<g>
													<path
														d="M2 6C2 3.79086 3.79086 2 6 2H14C16.2091 2 18 3.79086 18 6V14C18 16.2091 16.2091 18 14 18H6C3.79086 18 2 16.2091 2 14V6Z"
														fill="#e16349"
													/>
													<path
														clipRule="evenodd"
														d="M14.5303 8.03033L9 13.5607L5.46967 10.0303L6.53033 8.96967L9 11.4393L13.4697 6.96967L14.5303 8.03033Z"
														fill="white"
														fillRule="evenodd"
													/>
												</g>
											</svg>
										) : (
											<div className="absolute bg-[#e2e4e9] inset-[10%] rounded">
												<div className="absolute bg-[#ffffff] inset-[17.5%] rounded-[2px] shadow-[0px_1px_1px_0px_rgba(27,28,29,0.12)]" />
											</div>
										)}
									</div>
									
									{/* Field label */}
									<span className="font-['Inter:Regular',_sans-serif] font-normal text-[#0a0d14] text-[12px]">
										{sortFieldLabels[field.key as keyof typeof sortFieldLabels]}
									</span>
								</div>
								
								{/* ASC/DESC Toggle */}
								<button
									onClick={() => toggleSortDirection(index)}
									className={`px-1.5 py-0.5 rounded-[6px] font-['Inter:Medium',_sans-serif] font-medium text-[10px] transition-colors ${
										field.active
											? field.direction === "asc"
												? "bg-[#e16349] text-[#ffffff]"
												: "bg-[#525866] text-[#ffffff]"
											: "bg-[#f6f8fa] text-[#868c98]"
									}`}
									disabled={!field.active}
								>
									{field.direction === "asc" ? "ASC" : "DESC"}
								</button>
							</div>
						))}
					</div>
					
					{/* Hint */}
					<div className="px-1.5 py-0.5 bg-[#f6f8fa] rounded-[6px]">
						<p className="text-[#868c98] text-[11px] font-['Inter:Regular',_sans-serif]">
							Перетащите элементы для изменения порядка сортировки
						</p>
					</div>
					
					{/* Actions */}
					<div className="flex gap-1.5 pt-1 border-t border-[#f0f1f3]">
						<button
							onClick={resetSort}
							className="flex-1 px-2 py-1.5 font-['Inter:Medium',_sans-serif] font-medium text-[#525866] text-[13px] bg-[#f6f8fa] rounded-[16px] hover:bg-[#edeef0] transition-colors"
						>
							Сбросить
						</button>
						<button
							onClick={onClose}
							className="flex-1 px-2 py-1.5 font-['Inter:Medium',_sans-serif] font-medium text-[#ffffff] text-[13px] bg-[#e16349] rounded-[16px] hover:bg-[#d14a31] transition-colors"
						>
							Применить
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}; 