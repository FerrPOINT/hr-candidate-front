import React from 'react';
import { toast } from 'react-hot-toast';

interface InterviewCreationFormProps {
  selectedPositionId: number | null;
  interviewFormData: {
    candidateFirstName: string;
    candidateLastName: string;
    candidateEmail: string;
  };
  handleInterviewFieldChange: (field: string, value: string) => void;
  handleCreateInterviewSubmit: () => void;
}

export function InterviewCreationForm({
  selectedPositionId,
  interviewFormData,
  handleInterviewFieldChange,
  handleCreateInterviewSubmit,
  onBack
}: InterviewCreationFormProps & { onBack: () => void }) {
  return (
    <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-medium text-[#000000]">
            Создать интервью
          </h2>
          <button
            onClick={onBack}
            className="text-[#e16349] hover:text-[#d14a31] transition-colors text-[14px] font-medium"
          >
            ← Назад к вакансиям
          </button>
        </div>

        {!selectedPositionId && (
          <div className="bg-[#fff3cd] border border-[#ffeaa7] rounded-lg p-4">
            <div className="text-[#856404] text-[14px]">
              Выберите вакансию слева для добавления кандидата
            </div>
          </div>
        )}

        <div className="bg-[#ffffff] rounded-[32px] p-6 space-y-6">
          {/* Candidate First Name */}
          <div className="space-y-2">
            <label className="text-[16px] font-medium text-[#0a0d14]">
              Имя кандидата *
            </label>
            <input
              type="text"
              value={interviewFormData.candidateFirstName}
              onChange={(e) => handleInterviewFieldChange('candidateFirstName', e.target.value)}
              className="w-full px-3.5 py-3.5 border border-[#e2e4e9] rounded-[30px] text-[16px] text-[#525866] focus:border-[#e16349] focus:outline-none placeholder:text-[#525866]"
              placeholder="Введите имя кандидата"
            />
          </div>

          {/* Candidate Last Name */}
          <div className="space-y-2">
            <label className="text-[16px] font-medium text-[#0a0d14]">
              Фамилия кандидата *
            </label>
            <input
              type="text"
              value={interviewFormData.candidateLastName}
              onChange={(e) => handleInterviewFieldChange('candidateLastName', e.target.value)}
              className="w-full px-3.5 py-3.5 border border-[#e2e4e9] rounded-[30px] text-[16px] text-[#525866] focus:border-[#e16349] focus:outline-none placeholder:text-[#525866]"
              placeholder="Введите фамилию кандидата"
            />
          </div>

          {/* Candidate Email */}
          <div className="space-y-2">
            <label className="text-[16px] font-medium text-[#0a0d14]">
              Email кандидата *
            </label>
            <input
              type="email"
              value={interviewFormData.candidateEmail}
              onChange={(e) => handleInterviewFieldChange('candidateEmail', e.target.value)}
              className="w-full px-3.5 py-3.5 border border-[#e2e4e9] rounded-[30px] text-[16px] text-[#525866] focus:border-[#e16349] focus:outline-none placeholder:text-[#525866]"
              placeholder="Введите email кандидата"
            />
          </div>



          {/* Submit Button */}
          <button
            onClick={handleCreateInterviewSubmit}
            disabled={!selectedPositionId || !interviewFormData.candidateFirstName || !interviewFormData.candidateLastName || !interviewFormData.candidateEmail}
            className="w-full bg-[#e16349] text-white px-3.5 py-3.5 rounded-[30px] font-medium hover:bg-[#d14a31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Создать интервью
          </button>
        </div>
      </div>
    </div>
  );
} 