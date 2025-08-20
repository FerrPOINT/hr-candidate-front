import React, { useState } from 'react';

interface CreateInterviewModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateInterviewModal({ onClose, onSuccess }: CreateInterviewModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    console.log('Saving interview:', {
      firstName,
      lastName,
      email
    });
    
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative rounded-[44px] shrink-0 w-full max-w-[600px]">
      {/* Main Content */}
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
        
        {/* Unified Card */}
        <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-full">
          
          {/* Header */}
          <div className="font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-left w-full">
            <p className="block leading-[40px]">Новое собеседование</p>
          </div>

          {/* Form Section */}
          <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
            <div className="relative size-full">
              <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
                
                {/* First Name Input */}
                <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-full">
                    <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                      <p className="block leading-[20px] whitespace-pre">
                        Имя кандидата
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#ffffff] relative rounded-[20px] shrink-0 w-full">
                    <div className="flex flex-row items-center overflow-clip relative size-full">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Введите имя"
                        className="w-full px-4 py-3 text-foreground placeholder:text-muted-foreground text-[14px] border-none outline-none bg-transparent focus:ring-0"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                    />
                  </div>
                </div>

                {/* Last Name Input */}
                <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-full">
                    <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                      <p className="block leading-[20px] whitespace-pre">
                        Фамилия кандидата
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#ffffff] relative rounded-[20px] shrink-0 w-full">
                    <div className="flex flex-row items-center overflow-clip relative size-full">
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Введите фамилию"
                        className="w-full px-4 py-3 text-foreground placeholder:text-muted-foreground text-[14px] border-none outline-none bg-transparent focus:ring-0"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-full">
                    <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                      <p className="block leading-[20px] whitespace-pre">
                        Email
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#ffffff] relative rounded-[20px] shrink-0 w-full">
                    <div className="flex flex-row items-center overflow-clip relative size-full">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введите email"
                        className="w-full px-4 py-3 text-foreground placeholder:text-muted-foreground text-[14px] border-none outline-none bg-transparent focus:ring-0"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-start w-full pt-4">
                  <button
                    onClick={handleSave}
                    className="bg-[#e16349] text-white px-6 py-4 rounded-3xl font-medium hover:bg-[#d14a31] transition-colors cursor-pointer px-[30px] py-[14px] py-[10px]"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-[#ffffff] text-[#525866] px-6 py-4 rounded-3xl font-medium border border-[#e2e4e9] hover:bg-[#f6f8fa] transition-colors cursor-pointer"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 