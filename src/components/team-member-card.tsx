import React from 'react';
import { TeamMemberAvatar } from './ui/team-member-avatar';
import { SquarePenIconV3, TrashIconV3 } from './ui/figma-icons-v3';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
}

/**
 * Team Member Card Component
 * Точное воспроизведение карточки участника команды из Figma дизайна
 */
export function TeamMemberCard({ member, onEdit, onDelete }: TeamMemberCardProps) {
  return (
    <div
      className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full"
      data-name="Team Member Card"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-center justify-between p-[24px] relative w-full">
          {/* Member Info */}
          <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
            <TeamMemberAvatar initials={member.initials} />
            <div className="box-border content-stretch flex flex-col items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14px] tracking-[-0.084px]">
              <div className="css-5cyu6a font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#000000] text-left w-full">
                <p className="block leading-[20px]">{member.name}</p>
              </div>
              <div className="css-2x1u1o font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#525866] text-center w-full">
                <p className="block leading-[20px]">{member.email}</p>
              </div>
            </div>
          </div>

          {/* Role and Actions */}
          <div className="basis-0 box-border content-stretch flex flex-row gap-6 grow items-center justify-end min-h-px min-w-px p-0 relative shrink-0">
            <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px] mr-6">
              <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                {member.role}
              </p>
            </div>
            
            {/* Actions */}
            <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0">
              <button
                onClick={() => onEdit?.(member)}
                className="hover:opacity-75 transition-opacity"
                aria-label={`Редактировать ${member.name}`}
              >
                <SquarePenIconV3 />
              </button>
              <button
                onClick={() => onDelete?.(member)}
                className="hover:opacity-75 transition-opacity"
                aria-label={`Удалить ${member.name}`}
              >
                <TrashIconV3 />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}