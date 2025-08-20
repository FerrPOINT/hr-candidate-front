import React from 'react';
import { SearchIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

type NavigationTab = 'vacancies' | 'statistics' | 'team';

interface StatisticsPageCompleteProps {
  onTabChange?: (tab: NavigationTab) => void;
  onUserProfileClick?: () => void;
}

interface CandidateData {
  id: string;
  name: string;
  email: string;
  position: string;
  recruiter: string;
  rating: number;
  status: 'successful' | 'in-progress' | 'failed';
  date: string;
}

/**
 * Complete Statistics Page Component
 * Полная страница статистики с заполненной таблицей кандидатов
 */
export default function StatisticsPage({ 
  onTabChange,
  onUserProfileClick
}: StatisticsPageCompleteProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedVacancy, setSelectedVacancy] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedRecruiter, setSelectedRecruiter] = React.useState('all');

  // Профессиональные данные для графика активности на основе реальных данных
  const activityData = [
    { date: '15.07', candidates: 1, interviews: 0, applications: 2 },
    { date: '16.07', candidates: 1, interviews: 1, applications: 3 },
    { date: '17.07', candidates: 4, interviews: 2, applications: 5 },
    { date: '18.07', candidates: 1, interviews: 1, applications: 2 },
    { date: '19.07', candidates: 1, interviews: 1, applications: 3 },
    { date: '20.07', candidates: 1, interviews: 1, applications: 2 },
    { date: '21.07', candidates: 1, interviews: 1, applications: 2 },
    { date: '22.07', candidates: 1, interviews: 1, applications: 2 },
    { date: '23.07', candidates: 1, interviews: 1, applications: 2 }
  ];

  // Данные кандидатов из дизайна
  const candidatesData: CandidateData[] = [
    {
      id: '1',
      name: 'Александр Иванов',
      email: 'aleksandr@alignui.com',
      position: 'Frontend разработчик',
      recruiter: 'Анна Петрова',
      rating: 6.5,
      status: 'successful',
      date: '17.07.2025'
    },
    {
      id: '2',
      name: 'София Кузнецова',
      email: 'sofia@alignui.com',
      position: 'Frontend разработчик',
      recruiter: 'Анна Петрова',
      rating: 7.5,
      status: 'in-progress',
      date: '17.07.2025'
    },
    {
      id: '3',
      name: 'Артур Смирнов',
      email: 'artur@alignui.com',
      position: 'Backend разработчик',
      recruiter: 'Максим Козлов',
      rating: 8.5,
      status: 'in-progress',
      date: '17.07.2025'
    },
    {
      id: '4',
      name: 'Эмма Соколова',
      email: 'emma@alignui.com',
      position: 'Designer',
      recruiter: 'Елена Смирнова',
      rating: 4,
      status: 'failed',
      date: '17.07.2025'
    },
    {
      id: '5',
      name: 'Михаил Попов',
      email: 'mikhail@alignui.com',
      position: 'Frontend разработчик',
      recruiter: 'Анна Петрова',
      rating: 9,
      status: 'successful',
      date: '18.07.2025'
    },
    {
      id: '6',
      name: 'Лиза Андреева',
      email: 'liza@alignui.com',
      position: 'Backend разработчик',
      recruiter: 'Максим Козлов',
      rating: 6.8,
      status: 'successful',
      date: '16.07.2025'
    },
    {
      id: '7',
      name: 'Давид Васильев',
      email: 'david@alignui.com',
      position: 'Designer',
      recruiter: 'Елена Смирнова',
      rating: 5.2,
      status: 'failed',
      date: '15.07.2025'
    },
    {
      id: '8',
      name: 'Сара Николаева',
      email: 'sara@alignui.com',
      position: 'Frontend разработчик',
      recruiter: 'Анна Петрова',
      rating: 8.1,
      status: 'successful',
      date: '19.07.2025'
    },
    {
      id: '9',
      name: 'Александр Джонсон',
      email: 'alex@alignui.com',
      position: 'Backend разработчик',
      recruiter: 'Максим Козлов',
      rating: 7.2,
      status: 'successful',
      date: '20.07.2025'
    },
    {
      id: '10',
      name: 'Мария Гарсия',
      email: 'maria@alignui.com',
      position: 'Designer',
      recruiter: 'Елена Смирнова',
      rating: 8.9,
      status: 'in-progress',
      date: '21.07.2025'
    },
    {
      id: '11',
      name: 'Роберт Смит',
      email: 'robert@alignui.com',
      position: 'DevOps инженер',
      recruiter: 'Анна Петрова',
      rating: 5.8,
      status: 'in-progress',
      date: '22.07.2025'
    },
    {
      id: '12',
      name: 'Дженнифер Уилсон',
      email: 'jennifer@alignui.com',
      position: 'DevOps инженер',
      recruiter: 'Максим Козлов',
      rating: 7.9,
      status: 'successful',
      date: '23.07.2025'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      successful: {
        label: 'Успешный',
        icon: '✓',
        bgColor: 'bg-white',
        textColor: 'text-[#525866]',
        iconColor: 'text-[#38C793]',
        border: 'border-[#e2e4e9]'
      },
      'in-progress': {
        label: 'В процессе',
        icon: '○',
        bgColor: 'bg-white',
        textColor: 'text-[#525866]',
        iconColor: 'text-[#F27B2C]',
        border: 'border-[#e2e4e9]'
      },
      failed: {
        label: 'Провал',
        icon: '✗',
        bgColor: 'bg-white',
        textColor: 'text-[#525866]',
        iconColor: 'text-[#E16349]',
        border: 'border-[#e2e4e9]'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.successful;

    return (
      <div className={`${config.bgColor} ${config.border} border border-solid rounded-lg flex items-center gap-[3.5px] px-[3.5px] py-[3.5px] pr-[7px]`}>
        <div className={`${config.iconColor} text-[14px] w-[14px] h-[14px] flex items-center justify-center`}>
          {config.icon}
        </div>
        <span className={`${config.textColor} font-medium text-[12px] leading-[16px]`}>
          {config.label}
        </span>
      </div>
    );
  };

  const handleExportPDF = () => {
    console.log('Экспорт PDF clicked');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedVacancy('all');
    setSelectedStatus('all');
    setSelectedRecruiter('all');
  };

  return (
    <div className="bg-[#e9eae2] relative min-h-screen w-full">
      <div className="relative w-full">
        <div className="max-w-[1600px] w-full flex flex-col gap-6">
              
              {/* Statistics Cards */}
              <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
                <div className="flex flex-col gap-3.5">
                  <h3 className="font-normal text-[16px] text-[#000000]">
                    Статистика кандидатов
                  </h3>
                  
                  <div className="flex gap-3.5">
                    {/* Всего кандидатов */}
                    <div className="bg-white rounded-[21px] flex-1 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-[7px]">
                        <div className="bg-[#f6f8fa] p-[7px] rounded-xl">
                          <SearchIcon className="w-[17.5px] h-[17.5px] text-[#868C98]" />
                        </div>
                        <span className="font-normal text-[16px] text-[#000000]">Всего кандидатов</span>
                      </div>
                      <span className="font-normal text-[16px] text-[#e16349]">12</span>
                    </div>

                    {/* Средний балл */}
                    <div className="bg-white rounded-[21px] flex-1 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-[7px]">
                        <div className="bg-[#f6f8fa] p-[7px] rounded-xl">
                          <SearchIcon className="w-[17.5px] h-[17.5px] text-[#868C98]" />
                        </div>
                        <span className="font-normal text-[16px] text-[#000000]">Средний балл</span>
                      </div>
                      <span className="font-normal text-[16px] text-[#38c793]">7.1</span>
                    </div>

                    {/* Активных вакансий */}
                    <div className="bg-white rounded-[21px] flex-1 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-[7px]">
                        <div className="bg-[#f6f8fa] p-[7px] rounded-xl">
                          <SearchIcon className="w-[17.5px] h-[17.5px] text-[#868C98]" />
                        </div>
                        <span className="font-normal text-[16px] text-[#000000]">Активных вакансий</span>
                      </div>
                      <span className="font-normal text-[16px] text-[#f27b2c]">4</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Section */}
              <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
                <div className="flex flex-col gap-3.5">
                  <h3 className="font-normal text-[16px] text-[#000000]">Аналитика</h3>

                    {/* Распределение по статусам */}
                    <div className="bg-white rounded-[21px] p-5 min-w-[400px]">
                      <div className="flex flex-col gap-3.5">
                        <h4 className="font-normal text-[16px] text-[#000000]">Распределение по статусам</h4>
                        
                        <div className="flex gap-[10.5px]">
                          <div className="bg-[#f6f8fa] rounded-xl p-3 flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-[10.5px]">
                              <div className="w-[10.5px] h-[10.5px] bg-[#38c793] rounded-full"></div>
                              <span className="font-medium text-[14px] text-[#525866]">Успешный</span>
                            </div>
                            <div className="flex items-center gap-[10.5px]">
                              <span className="font-medium text-[24px] text-[#000000]">6</span>
                              <span className="font-normal text-[14px] text-[#868c98]">(50%)</span>
                            </div>
                          </div>

                          <div className="bg-[#f6f8fa] rounded-xl p-3 flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-[10.5px]">
                              <div className="w-[10.5px] h-[10.5px] bg-[#f27b2c] rounded-full"></div>
                              <span className="font-medium text-[14px] text-[#525866]">В процессе</span>
                            </div>
                            <div className="flex items-center gap-[10.5px]">
                              <span className="font-medium text-[24px] text-[#000000]">4</span>
                              <span className="font-normal text-[14px] text-[#868c98]">(33%)</span>
                            </div>
                          </div>

                          <div className="bg-[#f6f8fa] rounded-xl p-3 flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-[10.5px]">
                              <div className="w-[10.5px] h-[10.5px] bg-[#e16349] rounded-full"></div>
                              <span className="font-medium text-[14px] text-[#525866]">Провал</span>
                            </div>
                            <div className="flex items-center gap-[10.5px]">
                              <span className="font-medium text-[24px] text-[#000000]">2</span>
                              <span className="font-normal text-[14px] text-[#868c98]">(17%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* График активности */}
                    <div className="bg-white rounded-[21px] p-5 flex-1">
                      <div className="flex flex-col gap-3.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-normal text-[16px] text-[#000000]">Активность за неделю</h4>
                          <div className="bg-[#f6f8fa] rounded-[10px] p-[3.5px] flex gap-[3.5px]">
                            <div className="bg-white rounded-lg px-[10.5px] py-[5.25px] shadow-sm">
                              <span className="font-medium text-[16px] text-[#e16349]">Неделя</span>
                            </div>
                            <div className="px-[10.5px] py-[5.25px]">
                              <span className="font-medium text-[16px] text-[#525866]">Месяц</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-[180px] bg-white rounded-lg p-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                              <defs>
                                <linearGradient id="candidatesGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#e16349" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#e16349" stopOpacity={0.05}/>
                                </linearGradient>
                                <linearGradient id="interviewsGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#38c793" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#38c793" stopOpacity={0.05}/>
                                </linearGradient>
                                <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f27b2c" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#f27b2c" stopOpacity={0.05}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                              <XAxis 
                                dataKey="date" 
                                stroke="#868c98" 
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                              />
                              <YAxis 
                                stroke="#868c98" 
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                domain={[0, 'dataMax + 1']}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'white',
                                  border: '1px solid #e2e4e9',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                  fontSize: '12px'
                                }}
                                labelStyle={{ 
                                  color: '#525866', 
                                  fontWeight: '600',
                                  marginBottom: '8px'
                                }}
                                formatter={(value, name) => [
                                  value, 
                                  name === 'candidates' ? 'Кандидаты' : 
                                  name === 'interviews' ? 'Интервью' : 'Заявки'
                                ]}
                                labelFormatter={(label) => `Дата: ${label}`}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="candidates" 
                                stroke="#e16349" 
                                strokeWidth={2}
                                fill="url(#candidatesGradient)"
                                dot={{ fill: '#e16349', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: '#e16349', strokeWidth: 2 }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="interviews" 
                                stroke="#38c793" 
                                strokeWidth={2}
                                fill="url(#interviewsGradient)"
                                dot={{ fill: '#38c793', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: '#38c793', strokeWidth: 2 }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="applications" 
                                stroke="#f27b2c" 
                                strokeWidth={2}
                                fill="url(#applicationsGradient)"
                                dot={{ fill: '#f27b2c', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: '#f27b2c', strokeWidth: 2 }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                          
                          {/* Профессиональная легенда графика */}
                          <div className="flex justify-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-[#e16349] rounded-full"></div>
                              <span className="text-xs text-[#525866] font-medium">Кандидаты</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-[#38c793] rounded-full"></div>
                              <span className="text-xs text-[#525866] font-medium">Интервью</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-[#f27b2c] rounded-full"></div>
                              <span className="text-xs text-[#525866] font-medium">Заявки</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Эффективность рекрутеров */}
                  <div className="bg-white rounded-[21px] p-6">
                    <div className="flex flex-col gap-6">
                      <h4 className="font-normal text-[16px] text-[#000000]">Эффективность рекрутеров</h4>
                      
                      {/* Заголовки таблицы */}
                      <div className="bg-[#f6f8fa] rounded-[10px] flex">
                        <div className="px-3.5 py-[10.5px] w-[528px]">
                          <span className="font-medium text-[14px] text-[#525866]">Рекрутер</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-[246.39px]">
                          <span className="font-medium text-[14px] text-[#525866]">Объем</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-[246.39px]">
                          <span className="font-medium text-[14px] text-[#525866]">Завершено</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-[246.39px]">
                          <span className="font-medium text-[14px] text-[#525866]">Успешность</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-[246.39px]">
                          <span className="font-medium text-[14px] text-[#525866]">Качество</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-[246.39px]">
                          <span className="font-medium text-[14px] text-[#525866]">В работе</span>
                        </div>
                      </div>

                      {/* Данные рекрутеров */}
                      <div className="flex flex-col gap-[1.8px]">
                        {/* Анна Петрова */}
                        <div className="bg-white rounded-xl min-h-16 flex border-b border-[#e2e4e9]">
                          <div className="px-3.5 py-[10.5px] w-[528px] flex items-center">
                            <span className="font-medium text-[14px] text-[#0a0d14]">Анна Петрова</span>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <div className="bg-[#f6f8fa] px-[10.5px] py-[5.25px] rounded-[10px]">
                              <span className="font-medium text-[14px] text-[#0a0d14]">5</span>
                            </div>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <span className="font-normal text-[14px] text-[#0a0d14]">3</span>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <div className="bg-[#f0f9f4] px-[10.5px] py-[5.25px] rounded-[10px]">
                              <span className="font-medium text-[14px] text-[#38c793]">100%</span>
                            </div>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <span className="font-medium text-[14px] text-[#525866]">7.4</span>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <div className="flex items-center gap-[3.5px]">
                              <div className="w-[7px] h-[7px] bg-[#f27b2c] rounded-full"></div>
                              <span className="font-normal text-[14px] text-[#868c98]">2</span>
                            </div>
                          </div>
                        </div>

                        {/* Максим Козлов */}
                        <div className="bg-white rounded-xl min-h-16 flex border-b border-[#e2e4e9]">
                          <div className="px-3.5 py-[10.5px] w-[528px] flex items-center">
                            <span className="font-medium text-[14px] text-[#0a0d14]">Максим Козлов</span>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <div className="bg-[#f6f8fa] px-[10.5px] py-[5.25px] rounded-[10px]">
                              <span className="font-medium text-[14px] text-[#0a0d14]">4</span>
                            </div>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <span className="font-normal text-[14px] text-[#0a0d14]">3</span>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <div className="bg-[#f0f9f4] px-[10.5px] py-[5.25px] rounded-[10px]">
                              <span className="font-medium text-[14px] text-[#38c793]">100%</span>
                            </div>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <span className="font-medium text-[14px] text-[#525866]">7.6</span>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <div className="flex items-center gap-[3.5px]">
                              <div className="w-[7px] h-[7px] bg-[#f27b2c] rounded-full"></div>
                              <span className="font-normal text-[14px] text-[#868c98]">1</span>
                            </div>
                          </div>
                        </div>

                        {/* Елена Смирнова */}
                        <div className="bg-white rounded-xl min-h-16 flex">
                          <div className="px-3.5 py-[10.5px] w-[528px] flex items-center">
                            <span className="font-medium text-[14px] text-[#0a0d14]">Елена Смирнова</span>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <div className="bg-[#f6f8fa] px-[10.5px] py-[5.25px] rounded-[10px]">
                              <span className="font-medium text-[14px] text-[#0a0d14]">3</span>
                            </div>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <span className="font-normal text-[14px] text-[#0a0d14]">2</span>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <div className="bg-red-50 px-[10.5px] py-[5.25px] rounded-[10px]">
                              <span className="font-medium text-[14px] text-[#e16349]">0%</span>
                            </div>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <span className="font-medium text-[14px] text-[#525866]">6.0</span>
                          </div>
                          <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                            <div className="flex items-center gap-[3.5px]">
                              <div className="w-[7px] h-[7px] bg-[#f27b2c] rounded-full"></div>
                              <span className="font-normal text-[14px] text-[#868c98]">1</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidates Table */}
              <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
                <div className="flex flex-col gap-[21px]">
                  {/* Фильтры и поиск */}
                  <div className="flex items-center justify-between">
                    {/* Поиск */}
                    <div className="bg-[#f5f6f1] border border-[#cdd0d5] rounded-[20px] p-[8.75px_12.25px] w-[400px] flex items-center gap-[7px]">
                      <SearchIcon className="w-[17.5px] h-[17.5px] text-[#868C98]" />
                      <input
                        type="text"
                        placeholder="Поиск по кандидату или вакансии..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent flex-1 text-[16px] text-[rgba(134,140,152,0.5)] placeholder:text-[rgba(134,140,152,0.5)] outline-none"
                      />
                    </div>

                    {/* Экспорт PDF */}
                    <button
                      onClick={handleExportPDF}
                      className="bg-[#e16349] rounded-[20px] px-[10.5px] py-[12.25px] flex items-center gap-[7px] hover:bg-[#d14a31] transition-colors"
                    >
                      <DownloadIcon className="w-[14px] h-[14px] text-white" />
                      <span className="font-normal text-[16px] text-white tracking-[-0.084px]">Экспорт PDF</span>
                    </button>
                  </div>

                  {/* Фильтры */}
                  <div className="flex gap-3.5">
                    {/* Все вакансии */}
                    <div className="bg-white border border-[#e2e4e9] rounded-xl shadow-sm w-[250px] relative">
                      <select
                        value={selectedVacancy}
                        onChange={(e) => setSelectedVacancy(e.target.value)}
                        className="w-full h-[42px] px-[10.5px] pr-7 bg-transparent text-[14px] text-[#525866] outline-none appearance-none"
                      >
                        <option value="all">Все вакансии</option>
                        <option value="frontend">Frontend разработчик</option>
                        <option value="backend">Backend разработчик</option>
                        <option value="designer">Designer</option>
                        <option value="devops">DevOps инженер</option>
                      </select>
                      <div className="absolute right-[10.5px] top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 14 14">
                          <path d="M3.5 4.9L7 8.4L10.5 4.9" stroke="#868C98" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Все статусы */}
                    <div className="bg-white border border-[#e2e4e9] rounded-xl shadow-sm w-[250px] relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full h-[42px] px-[10.5px] pr-7 bg-transparent text-[14px] text-[#525866] outline-none appearance-none"
                      >
                        <option value="all">Все статусы</option>
                        <option value="successful">Успешный</option>
                        <option value="in-progress">В процессе</option>
                        <option value="failed">Провал</option>
                      </select>
                      <div className="absolute right-[10.5px] top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 14 14">
                          <path d="M3.5 4.9L7 8.4L10.5 4.9" stroke="#868C98" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Все рекрутеры */}
                    <div className="bg-white border border-[#e2e4e9] rounded-xl shadow-sm w-[250px] relative">
                      <select
                        value={selectedRecruiter}
                        onChange={(e) => setSelectedRecruiter(e.target.value)}
                        className="w-full h-[42px] px-[10.5px] pr-7 bg-transparent text-[14px] text-[#525866] outline-none appearance-none"
                      >
                        <option value="all">Все рекрутеры</option>
                        <option value="anna">Анна Петрова</option>
                        <option value="maxim">Максим Козлов</option>
                        <option value="elena">Елена Смирнова</option>
                      </select>
                      <div className="absolute right-[10.5px] top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 14 14">
                          <path d="M3.5 4.9L7 8.4L10.5 4.9" stroke="#868C98" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Сбросить */}
                    <button
                      onClick={handleResetFilters}
                      className="bg-white border border-[#e2e4e9] rounded-xl shadow-sm h-[42px] px-3.5 flex items-center gap-[7px] hover:bg-[#f6f8fa] transition-colors"
                    >
                      <RefreshCwIcon className="w-[14px] h-[14px] text-[#525866]" />
                      <span className="font-normal text-[16px] text-[#525866] tracking-[-0.084px]">Сбросить</span>
                    </button>
                  </div>

                  {/* Таблица */}
                  <div className="bg-white rounded-[21px] p-6">
                    <div className="flex flex-col gap-[8.75px]">
                      {/* Заголовки таблицы */}
                      <div className="bg-[#f6f8fa] rounded-[10px] flex">
                        <div className="px-3.5 py-[10.5px] w-[528px]">
                          <span className="font-medium text-[14px] text-[#525866]">Кандидат</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-[316.8px]">
                          <span className="font-medium text-[14px] text-[#525866]">Вакансия</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-[316.8px]">
                          <span className="font-medium text-[14px] text-[#525866]">Рекрутер</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-44">
                          <span className="font-medium text-[14px] text-[#525866]">Оценка</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-[246.39px]">
                          <span className="font-medium text-[14px] text-[#525866]">Статус</span>
                        </div>
                        <div className="px-3.5 py-[10.5px] w-44">
                          <span className="font-medium text-[14px] text-[#525866]">Дата</span>
                        </div>
                      </div>

                      {/* Строки данных */}
                      <div className="flex flex-col gap-[1.8px]">
                        {candidatesData.map((candidate, index) => (
                          <div key={candidate.id} className="flex flex-col gap-[1.75px]">
                            <div className="bg-white rounded-xl min-h-16 flex">
                              {/* Кандидат */}
                              <div className="px-3.5 py-[10.5px] w-[528px] flex items-center">
                                <div className="flex flex-col gap-[3.5px] w-full">
                                  <span className="font-medium text-[14px] text-[#0a0d14] truncate">{candidate.name}</span>
                                  <span className="font-normal text-[12px] text-[#525866] leading-[18px] truncate">{candidate.email}</span>
                                </div>
                              </div>

                              {/* Вакансия */}
                              <div className="px-3.5 py-[10.5px] w-[316.8px] flex items-center">
                                <span className="font-normal text-[14px] text-[#0a0d14] truncate">{candidate.position}</span>
                              </div>

                              {/* Рекрутер */}
                              <div className="px-3.5 py-[10.5px] w-[316.8px] flex items-center">
                                <span className="font-normal text-[14px] text-[#0a0d14] truncate">{candidate.recruiter}</span>
                              </div>

                              {/* Оценка */}
                              <div className="px-3.5 py-[10.5px] w-44 flex items-center">
                                <span className="font-medium text-[14px] text-[#0a0d14]">{candidate.rating}</span>
                              </div>

                              {/* Статус */}
                              <div className="px-3.5 py-[10.5px] w-[246.39px] flex items-center">
                                {getStatusBadge(candidate.status)}
                              </div>

                              {/* Дата */}
                              <div className="px-3.5 py-[10.5px] w-44 flex items-center">
                                <span className="font-normal text-[14px] text-[#0a0d14]">{candidate.date}</span>
                              </div>
                            </div>
                            
                            {/* Разделитель */}
                            {index < candidatesData.length - 1 && (
                              <div className="h-px bg-[#e2e4e9] w-full"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}