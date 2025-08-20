import React, { useState } from 'react';
import { TeamManagementContent } from './TeamManagementContent';
import { CompanyInfoPage } from './CompanyInfoPage';
import { BrandingPage } from './BrandingPage';
import { PersonalInfoPage } from './PersonalInfoPage';

type ManagementSection = 'branding' | 'team' | 'personal' | 'company';

/**
 * Team Management Page Component
 * Главная страница управления с двойным боди: левая панель с табами, правая панель с контентом
 */
export function TeamManagementPage() {
  const [activeSection, setActiveSection] = useState<ManagementSection>('branding');

  // Простые SVG иконки для каждого таба
  const CompanyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L18 6V18H2V6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 10L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 10V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const BrandingIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L12.09 8.26L20 9L12.09 9.74L10 16L7.91 9.74L0 9L7.91 8.26L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const TeamIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 14C8.13401 14 5 17.134 5 21" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15.5 19C15.5 17.6193 16.6193 16.5 18 16.5C19.3807 16.5 20.5 17.6193 20.5 19C20.5 20.3807 19.3807 21.5 18 21.5C16.6193 21.5 15.5 20.3807 15.5 19Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M17.5 21C17.5 19.6193 18.6193 18.5 20 18.5C21.3807 18.5 22.5 19.6193 22.5 21C22.5 22.3807 21.3807 23.5 20 23.5C18.6193 23.5 17.5 22.3807 17.5 21Z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );

  const PersonalIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 14C8.13401 14 5 17.134 5 21" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );

  const managementItems = [
    { id: 'company', label: 'О компании', icon: CompanyIcon },
    { id: 'branding', label: 'Брендирование', icon: BrandingIcon },
    { id: 'team', label: 'Моя команда', icon: TeamIcon },
    { id: 'personal', label: 'Личная информация', icon: PersonalIcon }
  ];

  return (
    <div className="bg-[#e9eae2] relative min-h-screen">
      <div className="relative h-full">
        <div className="[flex-flow:wrap] box-border content-start flex gap-6 items-stretch justify-start p-0 relative w-full h-full">
          {/* Центрирующий контейнер для контента (ширина и отступы задаёт Layout) */}
          <div className="w-full h-full">
            <div className="flex gap-6 w-full h-full">
              {/* Management Sidebar - Левая панель с заголовком и табами */}
              <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-[460px] h-full self-stretch">
                {/* Sidebar Header */}
                <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2 py-0 relative shrink-0">
                  <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-center text-nowrap">
                    <p className="block leading-[40px] whitespace-pre">Управление</p>
                  </div>
                </div>
                
                {/* Content Toggle - Табы в левой панели с оригинальными стилями */}
                <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full">
                  {managementItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as ManagementSection)}
                        className={`${
                          isActive 
                            ? 'bg-[#ffffff] border border-[#e16349]' 
                            : 'bg-[#ffffff] border border-transparent hover:border-[#e2e4e9]'
                        } box-border content-stretch flex flex-row gap-3 items-center justify-start p-[20px] relative rounded-3xl shrink-0 w-full transition-all duration-200`}
                      >
                        <div className="w-[20px] h-[20px] flex items-center justify-center">
                          <Icon />
                        </div>
                        <div className={`font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] ${
                          isActive ? 'text-[#e16349]' : 'text-[#525866]'
                        }`}>
                          <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">{item.label}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content - Правая панель с контентом вкладок */}
              				<div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-[1110px] flex-1">
                {/* Tab Content */}
                <div className="w-full">
                  {activeSection === 'branding' && <BrandingPage />}
                  {activeSection === 'team' && <TeamManagementContent />}
                  {activeSection === 'personal' && <PersonalInfoPage />}
                  {activeSection === 'company' && <CompanyInfoPage />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}