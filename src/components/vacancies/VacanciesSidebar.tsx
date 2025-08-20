import React from 'react';
import { AddFillIconV7, ArrowDownSLineIconV7 } from '../ui/figma-icons-v7';
import { TabToggle } from '../ui/tab-toggle';

interface VacanciesSidebarProps {
  filterTab: string;
  setFilterTab: (tab: string) => void;
  statusDropdownOpen: boolean;
  setStatusDropdownOpen: (open: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleCreateVacancy: () => void;
  positions: any[];
  selectedPositionId: number | null;
  setSelectedPositionId: (id: number | null) => void;
  positionsLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPositions: number;
  itemsPerPage: number;
}

export function VacanciesSidebar({
  filterTab,
  setFilterTab,
  statusDropdownOpen,
  setStatusDropdownOpen,
  searchValue,
  setSearchValue,
  handleCreateVacancy,
  positions,
  selectedPositionId,
  setSelectedPositionId,
  positionsLoading,
  currentPage,
  setCurrentPage,
  totalPositions,
  itemsPerPage
}: VacanciesSidebarProps) {
  const totalPages = Math.ceil((totalPositions || 0) / itemsPerPage);
  const paginatedPositions = positions;

  return (
    <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-[460px]">
      {/* Sidebar Header */}
      <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full">
        <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2 py-0 relative shrink-0">
            <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative text-[#000000] text-[32px] text-left truncate max-w-[680px]">
              <p className="block leading-[40px] line-clamp-2 whitespace-normal break-words">
                Вакансии
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateVacancy}
            className="bg-[#e16349] box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shadow-[0px_1px_2px_0px_rgba(55,93,251,0.08)] shrink-0 hover:bg-[#d14a31] transition-colors"
          >
            <AddFillIconV7 />
          </button>
        </div>

        {/* Filters */}
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-0 relative shrink-0 w-full">
          {/* Toggle Filter */}
          <div className="bg-[#f5f6f1] relative rounded-3xl shrink-0 w-full">
            <div className="overflow-clip relative size-full">
              <TabToggle
                options={[
                  { id: "all", label: "Все" },
                  { id: "my", label: "Мои" },
                ]}
                activeTab={filterTab}
                onTabChange={setFilterTab}
                className="w-full"
                radius="rounded-3xl"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl"
            />
          </div>

          {/* Status Dropdown */}
          <button
            onClick={() =>
              setStatusDropdownOpen(
                !statusDropdownOpen,
              )
            }
            className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full cursor-pointer transition-all hover:bg-[#f6f8fa]"
          >
            <div className="flex flex-row items-center overflow-clip relative size-full">
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-3.5 pr-3 py-3.5 relative w-full">
                <div className="basis-0 css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#525866] text-[16px] text-left tracking-[-0.176px]">
                  <p className="block leading-[24px]">
                    Все статусы
                  </p>
                </div>
                <ArrowDownSLineIconV7
                  className={`${statusDropdownOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
            />
          </button>

          {/* Search */}
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
            <div className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-3xl shrink-0">
              <div className="flex flex-row items-center overflow-clip relative size-full">
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[14px] relative w-full">
                  <div className="basis-0 css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#525866] text-[16px] text-left tracking-[-0.176px]">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Поиск вакансий..."
                      className="w-full bg-transparent border-none outline-none text-[#525866] placeholder-[#868c98]"
                    />
                  </div>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vacancies List */}
      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full">
        {positionsLoading ? (
          <div className="w-full text-center py-8">
            <div className="text-[#525866]">Загрузка вакансий...</div>
          </div>
        ) : paginatedPositions.length === 0 ? (
          <div className="w-full text-center py-8">
            <div className="text-[#525866]">Вакансии не найдены</div>
          </div>
        ) : (
          <div className="w-full space-y-3">
            {paginatedPositions.map((position) => (
              <div
                key={position.id}
                onClick={() => setSelectedPositionId(position.id)}
                className={`bg-[#ffffff] relative rounded-3xl shrink-0 w-full cursor-pointer transition-all hover:shadow-md ${
                  selectedPositionId === position.id
                    ? 'ring-2 ring-[#e16349] shadow-lg'
                    : 'hover:bg-[#f8f9fa]'
                }`}
              >
                <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[20px] relative w-full">
                  {/* Position Title */}
                  <div className="box-border content-stretch flex flex-row items-start justify-between p-0 relative shrink-0 w-full">
                    <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative text-[#000000] text-[18px] text-left flex-1 min-w-0">
                      <p className="block leading-[24px] line-clamp-2 whitespace-normal break-words">
                        {position.title || 'Название вакансии'}
                      </p>
                    </div>
                  </div>

                  {/* Position Details */}
                  <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
                    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                      <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                        <p className="block leading-[20px]">Статус</p>
                      </div>
                      <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#38c793] text-[14px] text-center">
                        <p className="block leading-[20px]">
                          {position.status === 'ACTIVE' ? 'Активна' : 
                           position.status === 'PAUSED' ? 'Приостановлена' : 
                           position.status === 'ARCHIVED' ? 'Архивирована' : 'Неизвестно'}
                        </p>
                      </div>
                    </div>

                    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                      <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                        <p className="block leading-[20px]">Кандидаты</p>
                      </div>
                      <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-center">
                        <p className="block leading-[20px]">
                          {position.candidateCount || 0}
                        </p>
                      </div>
                    </div>

                    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                      <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                        <p className="block leading-[20px]">Создано</p>
                      </div>
                      <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-center">
                        <p className="block leading-[20px]">
                          {position.createdAt ? new Date(position.createdAt).toLocaleDateString('ru-RU') : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-full">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-[#ffffff] text-[#525866] px-3 py-2 rounded-lg font-medium border border-[#e2e4e9] hover:bg-[#f6f8fa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>
          
          <span className="text-[#525866] text-[14px]">
            {currentPage} из {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="bg-[#ffffff] text-[#525866] px-3 py-2 rounded-lg font-medium border border-[#e2e4e9] hover:bg-[#f6f8fa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
} 