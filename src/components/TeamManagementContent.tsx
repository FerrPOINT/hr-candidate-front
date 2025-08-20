import React from 'react';
import { TeamMemberCard, TeamMember } from './team-member-card';
import { AddLineIconV3 } from './ui/figma-icons-v3';

// Константа больше не нужна - используем w-full

/**
 * Team Management Content Component
 * Точное воспроизведение страницы управления командой из Figma дизайна
 */
export function TeamManagementContent() {
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([
    {
      id: '1',
      name: 'WMT group',
      email: 'hrwmt@wmtgroup.ru',
      role: 'Администратор',
      initials: 'MJ'
    },
    {
      id: '2',
      name: 'WMT group',
      email: 'hrwmt@wmtgroup.ru',
      role: 'Рекрутер',
      initials: 'MJ'
    },
    {
      id: '3',
      name: 'WMT group',
      email: 'hrwmt@wmtgroup.ru',
      role: 'Наблюдатель',
      initials: 'MJ'
    }
  ]);

  const handleEdit = (member: TeamMember) => {
    console.log('Edit member:', member);
    // Здесь можно добавить логику редактирования
  };

  const handleDelete = (member: TeamMember) => {
    console.log('Delete member:', member);
    setTeamMembers(prev => prev.filter(m => m.id !== member.id));
  };

  const handleInvite = () => {
    console.log('Invite team member');
    // Здесь можно добавить логику приглашения
  };

  return (
    <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-full">
      {/* Header with Invite Button */}
      <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
        <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-center text-nowrap">
          <p className="block leading-[40px] whitespace-pre">Моя команда</p>
        </div>
        
        <button
          onClick={handleInvite}
          className="bg-[#e16349] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#d14a31] transition-colors"
          data-name="Invite Button"
        >
          <AddLineIconV3 />
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
            <div className="css-rpndqk font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.176px]">
              <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                Пригласить в команду
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Team Members List */}
      <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full overflow-hidden">
        {teamMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
} 