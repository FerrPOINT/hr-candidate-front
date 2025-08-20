import React from 'react';

// Простые заглушки для компонентов
const FileUploadArea = ({ onFileSelect, onFilesDrop }: { 
  onFileSelect: (file: File) => void; 
  onFilesDrop: (files: FileList) => void; 
}) => (
  <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full p-[24px] border-2 border-dashed border-[#e2e4e9]">
    <div className="text-center">
      <div className="text-[#525866] text-sm mb-2">
        Перетащите файл сюда или нажмите для выбора
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="bg-[#e16349] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#d1553f]">
        Выбрать файл
      </label>
    </div>
  </div>
);

const FigmaTextInput = ({ label, value, onChange }: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
}) => (
  <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
    <label className="css-7dow9l font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left w-full">
      <p className="block leading-[20px]">{label}</p>
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full p-[16px] border border-[#e2e4e9] focus:border-[#e16349] focus:outline-none"
      placeholder="Введите название компании"
    />
  </div>
);

// Используем общую константу размера
const MAIN_CONTENT_WIDTH = 1100;

interface BrandingData {
  companyName: string;
  logo: File | null;
}

/**
 * Branding Page Component
 * Страница брендирования с двойным боди: левая панель с табами, правая панель с контентом
 */
export function BrandingPage() {
  const [formData, setFormData] = React.useState<BrandingData>({
    companyName: '',
    logo: null
  });

  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file);
    setFormData(prev => ({ ...prev, logo: file }));
  };

  const handleFilesDrop = (files: FileList) => {
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleCompanyNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, companyName: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving branding data:', formData);
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
                  <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-left w-full">
                    <p className="block leading-[40px]">Брендирование</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="box-border content-stretch flex flex-col gap-10 items-start justify-start p-0 relative shrink-0 w-full">
                    {/* File Upload and Company Name */}
                    <div className="box-border content-stretch flex flex-col gap-10 items-start justify-start p-0 relative shrink-0 w-full">
                      {/* File Upload Section */}
                      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
                        <FileUploadArea 
                          onFileSelect={handleFileSelect}
                          onFilesDrop={handleFilesDrop}
                        />
                        
                        {/* Disclaimer */}
                        <div className="bg-[#e2e4e9] relative rounded-3xl shrink-0 w-full">
                          <div className="flex flex-row items-center justify-center relative size-full">
                            <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[16px] relative w-full">
                              <div className="css-7dow9l font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[12px] text-left w-full">
                                <p className="block leading-[16px]">
                                  Загружая логотип вы подтверждаете, что имеете право на его
                                  использование и не нарушаете прав третьих лиц
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Company Name Input */}
                      <FigmaTextInput
                        label="Название компании"
                        value={formData.companyName}
                        onChange={handleCompanyNameChange}
                      />
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      className="bg-[#e16349] h-[52px] relative rounded-3xl shrink-0 w-full"
                      data-name="Buttons [1.0]"
                    >
                      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
                        <div className="box-border content-stretch flex flex-row gap-1 h-[52px] items-center justify-center p-[14px] relative w-full">
                          <div
                            className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
                            data-name="Text"
                          >
                            <div className="css-rpndqk font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                              <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                                Сохранить
                              </p>
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