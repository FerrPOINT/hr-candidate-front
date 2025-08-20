import React from 'react';
import { ArrowDownSLineIconV7 } from '../../ui/figma-icons-v7';

interface StatusDropdownProps {
	status: string;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ status }) => (
	<button
		onClick={() => {
			console.log("Changing status for:", status);
		}}
		className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-[8px] relative rounded-lg shrink-0 border border-[#cdd0d5] hover:bg-[#f6f8fa] transition-colors cursor-pointer"
	>
		<div className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 w-[85px]">
			<div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-center text-nowrap">
				<p className="block leading-[16px] whitespace-pre">
					Скрининг
				</p>
			</div>
		</div>
		<div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-start justify-start overflow-clip p-0 relative rounded-3xl shrink-0">
			<ArrowDownSLineIconV7 />
		</div>
	</button>
); 