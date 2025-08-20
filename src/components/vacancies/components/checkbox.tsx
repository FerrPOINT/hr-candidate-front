import React from 'react';

interface CheckboxProps {
	checked: boolean;
	onChange: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => (
	<div
		className="relative shrink-0 size-5 cursor-pointer"
		onClick={onChange}
	>
		{checked ? (
			<svg
				className="block size-full"
				fill="none"
				preserveAspectRatio="none"
				viewBox="0 0 20 20"
			>
				<g>
					<mask fill="white" id={`path-${Math.random()}`}>
						<path d="M2 6C2 3.79086 3.79086 2 6 2H14C16.2091 2 18 3.79086 18 6V14C18 16.2091 16.2091 18 14 18H6C3.79086 18 2 16.2091 2 14V6Z" />
					</mask>
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
				<div className="absolute bg-[#ffffff] inset-[17.5%] rounded-[2.6px] shadow-[0px_2px_2px_0px_rgba(27,28,29,0.12)]" />
			</div>
		)}
	</div>
); 