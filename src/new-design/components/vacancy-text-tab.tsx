import React, { useState } from "react";
import svgPaths from "../imports/svg-oafxgir8bp";

function ChevronLeft({
  onClick,
  disabled,
}: {
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative shrink-0 size-4 cursor-pointer transition-all rounded-sm ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-muted hover:opacity-75"
      }`}
      data-name="chevron-left"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <path
          d="M10 4L6 8L10 12"
          stroke={disabled ? "#a1a1aa" : "#525866"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}

function ChevronRight({
  onClick,
  disabled,
}: {
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative shrink-0 size-4 cursor-pointer transition-all rounded-sm ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-muted hover:opacity-75"
      }`}
      data-name="chevron-right"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <path
          d="M6 4L10 8L6 12"
          stroke={disabled ? "#a1a1aa" : "#525866"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}

function NavigationControls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}) {
  return (
    <div className="bg-muted/50 border border-border rounded-lg flex flex-row gap-0.5 items-center justify-center relative shrink-0 p-[5px] m-[5px]">
      <ChevronLeft onClick={onUndo} disabled={!canUndo} />
      <ChevronRight onClick={onRedo} disabled={!canRedo} />
    </div>
  );
}

function FileCopyLine({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-muted/50 border border-border rounded-lg p-1.5 relative shrink-0 cursor-pointer hover:bg-muted/75 transition-all"
      data-name="file-copy-line"
    >
      <svg
        className="block size-4"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="file-copy-line">
          <path
            d={svgPaths.p20c0f400}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </button>
  );
}

function Frame104({ onCopy }: { onCopy?: () => void }) {
  return <FileCopyLine onClick={onCopy} />;
}

function Frame115({
  onUndo,
  onRedo,
  onCopy,
  canUndo,
  canRedo,
}: {
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}) {
  return (
    <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0">
      <NavigationControls
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  );
}

function VacancyTextDisplay({
  generatedText,
  setGeneratedText,
}: {
  generatedText: string;
  setGeneratedText: (text: string) => void;
}) {
  const [textHistory, setTextHistory] = useState<string[]>([
    generatedText,
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  React.useEffect(() => {
    if (
      generatedText &&
      generatedText !== textHistory[historyIndex]
    ) {
      const newHistory = [...textHistory, generatedText];
      setTextHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [generatedText]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGeneratedText(textHistory[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < textHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGeneratedText(textHistory[newIndex]);
    }
  };

  const handleCopy = async () => {
    if (generatedText) {
      try {
        await navigator.clipboard.writeText(generatedText);
        console.log("Текст скопирован в буфер обмена");
      } catch (err) {
        console.error("Не удалось скопировать текст: ", err);
      }
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newText = e.target.value;
    setGeneratedText(newText);

    const newHistory = textHistory.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setTextHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  return (
    <div className="basis-0 bg-[#ffffff] grow h-[542px] min-h-px min-w-px relative rounded-3xl shrink-0">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[12px] relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 items-start justify-end p-0 relative shrink-0 w-full">
            <Frame115
              onUndo={handleUndo}
              onRedo={handleRedo}
              onCopy={handleCopy}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < textHistory.length - 1}
            />
          </div>

          <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
            <textarea
              value={generatedText}
              onChange={handleTextChange}
              placeholder="Здесь будет отображен сгенерированный текст вакансии..."
              className="w-full h-full resize-none border-none outline-none bg-transparent placeholder:text-[#868c98] text-[#0a0d14] text-[14px] leading-[20px] font-['Inter:Regular',_sans-serif] tracking-[-0.084px] p-[15px]"
            />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-3xl shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
      />
    </div>
  );
}

function Frame90({
  generatedText,
  setGeneratedText,
}: {
  generatedText: string;
  setGeneratedText: (text: string) => void;
}) {
  return (
    <VacancyTextDisplay
      generatedText={generatedText}
      setGeneratedText={setGeneratedText}
    />
  );
}

function Resize() {
  return (
    <div
      className="relative shrink-0 size-3"
      data-name="Resize"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 12 12"
      >
        <g id="Resize">
          <path
            d={svgPaths.p20c3d500}
            id="Vector"
            stroke="var(--stroke-0, #868C98)"
          />
        </g>
      </svg>
    </div>
  );
}

function CharacterCounter10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-center justify-end p-0 relative shrink-0 w-full"
      data-name="Character Counter [1.0]"
    >
      <Resize />
    </div>
  );
}

function Input({
  aiPrompt,
  setAiPrompt,
}: {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
}) {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-[20px] shrink-0 w-full"
      data-name="Input"
    >
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[12px] relative size-full">
          <div className="basis-0 css-z8d4os font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#868c98] text-[14px] text-left tracking-[-0.084px] w-full">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Расскажите мне, как изменить текст"
              className="w-full h-full resize-none border-none outline-none bg-transparent placeholder:text-[#868c98] text-[14px] leading-[20px] font-['Inter:Regular',_sans-serif] tracking-[-0.084px]"
            />
          </div>
          <CharacterCounter10 />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
      />
    </div>
  );
}

function TextArea10({
  aiPrompt,
  setAiPrompt,
}: {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
}) {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 h-[164px] items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Text Area [1.0]"
    >
      <Input aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} />
    </div>
  );
}

function Frame93({
  aiPrompt,
  setAiPrompt,
}: {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
}) {
  return (
    <div className="box-border content-stretch flex flex-col gap-3.5 items-center justify-start p-0 relative shrink-0 w-[472px]">
      <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[10px] relative w-full">
        <div className="basis-0 css-8vheua font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#000000] text-[16px] text-left tracking-[-0.176px]">
          <p className="block leading-[24px]">
            Готов помочь создать привлекательное описание
            вакансии, чтобы привлечь больше откликов
          </p>
        </div>
      </div>
      <TextArea10
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
      />
    </div>
  );
}

function Text6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-dh74q0 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Сгенирировать
        </p>
      </div>
    </div>
  );
}

function Buttons17({ onGenerate }: { onGenerate: () => void }) {
  return (
    <button
      onClick={onGenerate}
      className="bg-[#e16349] relative rounded-[20px] shrink-0 w-full hover:bg-[#d14a31] transition-colors cursor-pointer"
      data-name="Buttons [1.0]"
    >
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-[10px] relative w-full">
          <Text6 />
        </div>
      </div>
    </button>
  );
}

function Frame103({
  aiPrompt,
  setAiPrompt,
  onGenerate,
}: {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0">
      <Frame93 aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} />
      <Buttons17 onGenerate={onGenerate} />
    </div>
  );
}

function Frame94({
  generatedText,
  setGeneratedText,
  aiPrompt,
  setAiPrompt,
  onGenerate,
}: {
  generatedText: string;
  setGeneratedText: (text: string) => void;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full">
      <Frame90
        generatedText={generatedText}
        setGeneratedText={setGeneratedText}
      />
      <Frame103
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        onGenerate={onGenerate}
      />
    </div>
  );
}

export function VacancyTextTab() {
  const [generatedText, setGeneratedText] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  const handleGenerate = () => {
    if (aiPrompt.trim()) {
      const mockGeneratedText = `Описание вакансии сгенерированное на основе: "${aiPrompt}"

Мы ищем талантливого специалиста, который разделяет наши ценности и готов внести свой вклад в развитие компании.

Основные требования:
• Опыт работы от 3 лет
• Знание современных технологий
• Коммуникабельность и ответственность

Условия:
• Конкурентная заработная плата
• Полный социальный пакет
• Возможности профессионального роста`;

      setGeneratedText(mockGeneratedText);
    }
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full">
      <Frame94
        generatedText={generatedText}
        setGeneratedText={setGeneratedText}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        onGenerate={handleGenerate}
      />
    </div>
  );
} 