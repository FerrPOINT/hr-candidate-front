import React from 'react';
import { generatePageNumbers } from '../helpers';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange
}) => {
	const pageNumbers = generatePageNumbers(currentPage, totalPages);
	
	return (
		<div className="flex items-center justify-center gap-1 w-full">
			{/* Previous button */}
			<button
				onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
				disabled={currentPage === 1}
				className="flex items-center justify-center w-8 h-8 rounded-lg text-[#525866] hover:bg-[#f6f8fa] disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			
			{/* Page numbers */}
			{pageNumbers.map((page, index) => (
				<React.Fragment key={index}>
					{page === '...' ? (
						<span className="flex items-center justify-center w-8 h-8 text-[#525866]">
							...
						</span>
					) : (
						<button
							onClick={() => onPageChange(page as number)}
							className={`flex items-center justify-center w-8 h-8 rounded-lg font-medium text-sm transition-colors ${
								currentPage === page
									? "bg-[#e16349] text-white"
									: "text-[#525866] hover:bg-[#f6f8fa]"
							}`}
						>
							{page}
						</button>
					)}
				</React.Fragment>
			))}
			
			{/* Next button */}
			<button
				onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
				disabled={currentPage === totalPages}
				className="flex items-center justify-center w-8 h-8 rounded-lg text-[#525866] hover:bg-[#f6f8fa] disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	);
}; 