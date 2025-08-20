import React from 'react';

// Простая заглушка для компонента FigmaTextInput
const FigmaTextInput = ({
  label,
  type = "text",
  value,
  onChange,
  width = "w-full"
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  width?: string;
}) => (
  <div className={`box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 ${width}`}>
    <label className="css-7dow9l font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left w-full">
      <p className="block leading-[20px]">{label}</p>
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full p-[16px] border border-[#e2e4e9] focus:border-[#e16349] focus:outline-none"
      placeholder={`Введите ${label.toLowerCase()}`}
    />
  </div>
);

// Используем общую константу размера
const MAIN_CONTENT_WIDTH = 1100;

interface PersonalInfo {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

/**
 * Personal Info Page Component
 * Страница личной информации с двойным боди: левая панель с табами, правая панель с контентом
 */
export function PersonalInfoPage() {
  const [formData, setFormData] = React.useState<PersonalInfo>({
    email: '',
    phone: '',
    firstName: '',
    lastName: ''
  });

  const handleFieldChange = (field: keyof PersonalInfo) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving personal info:', formData);
  };

  return (
    <div className="bg-[#e9eae2] relative min-h-screen">
      <div className="relative h-full">
        <div className="[flex-flow:wrap] box-border content-start flex gap-6 items-stretch justify-start p-0 relative w-full h-full">
          {/* Центрирующий контейнер для контента (ширина и отступы задаёт Layout) */}
          <div className="w-full h-full">

              {/* Main Content - Правая панель с контентом */}
              				<div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-[1110px] flex-1">
                {/* Content */}
                <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-10 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-full">
                  {/* Header */}
                  <div
                    className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#000000] text-[32px] text-left"
                    style={{ width: "min-content" }}
                  >
                    <p className="block leading-[40px]">Личная информация</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="box-border content-stretch flex flex-col gap-[31px] items-start justify-start p-0 relative shrink-0 w-full">
                    {/* Form Fields */}
                    <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
                      <FigmaTextInput
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleFieldChange('email')}
                        width="w-[360px]"
                      />

                      <FigmaTextInput
                        label="Телефон"
                        type="tel"
                        value={formData.phone}
                        onChange={handleFieldChange('phone')}
                        width="w-[360px]"
                      />

                      <FigmaTextInput
                        label="Имя"
                        value={formData.firstName}
                        onChange={handleFieldChange('firstName')}
                        width="w-[360px]"
                      />

                      <FigmaTextInput
                        label="Фамилия"
                        value={formData.lastName}
                        onChange={handleFieldChange('lastName')}
                        width="w-[360px]"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="bg-[#e16349] relative rounded-3xl shrink-0 inline-flex"
                      data-name="Buttons [1.0]"
                    >
                      <div className="flex flex-row items-center justify-center overflow-clip relative">
                        <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-[14px] relative">
                          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0" data-name="Text">
                            <div className="css-rpndqk font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                              <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Сохранить</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </form>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
} 