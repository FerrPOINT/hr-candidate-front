import React from 'react';
import { SynergyLogoFigma } from '../ui/synergy-logo-figma';
import { Notification4LineIconV7 } from '../ui/figma-icons-v7';
import { NavigationItem } from './types';

interface VacancyHeaderProps {
  activeTab: string;
  onTabChange?: (tab: any) => void;
  onUserProfileClick?: () => void;
  navigationItems: NavigationItem[];
}

export function VacancyHeader({ 
  activeTab, 
  onTabChange, 
  onUserProfileClick, 
  navigationItems 
}: VacancyHeaderProps) {
  // Fallback transparent image for avatar (data URI)
  const imgImage = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

  return (
    <div className="w-full px-8 py-[32px]">
      <div className="flex items-center justify-between max-w-[1440px] w-full mx-auto pr-0">
        {/* Logo and Title */}
        <div 
          className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onTabChange?.('vacancies')}
        >
          <SynergyLogoFigma />
          <div className="css-sqkidj flex flex-col font-['Inter_Display:SemiBold',_sans-serif] font-semibold justify-end leading-[0] not-italic relative shrink-0 text-[#000000] text-[24px] text-left text-nowrap">
            <p className="block leading-[32px] whitespace-pre">
              WMT Рекрутер
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (isActive) {
              return (
                <div
                  key={item.id}
                  className="bg-[#ffffff] relative rounded-3xl shrink-0"
                >
                  <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative">
                    <Icon color="#e16349" />
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                      <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange?.(item.id)}
                className="bg-[#f5f6f1] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shadow-[0px_1px_2px_0px_rgba(55,93,251,0.08)] shrink-0"
              >
                <Icon color="#525866" />
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                  <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                    <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                      {item.label}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* User Section */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-end p-0 relative shrink-0 ml-auto">
          {/* Notifications */}
          <div className="bg-[#f5f6f1] box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[14px] relative rounded-[100px] shrink-0">
            <Notification4LineIconV7 />
          </div>

          {/* User Profile */}
          <button
            onClick={onUserProfileClick}
            className="bg-[#f5f6f1] relative rounded-3xl shrink-0 cursor-pointer hover:bg-[#edeef0] transition-colors duration-200"
          >
            <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start overflow-clip pl-1.5 pr-4 py-1.5 relative">
              <div className="bg-[#fbdfb1] relative rounded-[999px] shrink-0 size-10">
                <div
                  className="absolute bg-center bg-cover bg-no-repeat inset-0 rounded-[980px]"
                  style={{
                    backgroundImage: `url('${imgImage}')`,
                  }}
                />
              </div>
              <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                  Наталья
                </p>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-3xl shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
            />
          </button>
        </div>
      </div>
    </div>
  );
} 