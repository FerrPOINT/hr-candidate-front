import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// Константа для ширины контента
const MAIN_CONTENT_WIDTH = 1100;

// Заглушка для SVG путей (будет заменена на реальные иконки)
const svgPaths = {
  p3f40a580: "M26 5.77806L26 67.1062",
  p1f792c00: "M8 6L8 18",
  p44c480: "M12 6L12 18", 
  p2d042680: "M16 6L16 18",
  p691da80: "M20 6L20 18",
  p2dd09c80: "M24 6L24 18",
  p63a2500: "M28 6L28 18",
  pc67f500: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
  p36f39ec0: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
  p23d6a00: "M12 3l1.09 4.26L22 12l-4.26 1.09L12 17.4l-1.09-4.26L2 12l4.26-1.09L12 3z",
  p781d6b0: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  p2c6f4a00: "M10 6L8 8l2 2",
  p33c74a80: "M2 2h16v16H2z",
  p51b4880: "M2 2h16v16H2z",
  p2229a570: "M6 10l2 2 6-6",
  p30968300: "M10 8l-2 2 2 2M8 8l2 2-2 2",
  p301d0e00: "M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z"
};

interface Question {
  id: string;
  text: string;
  evaluationCriteria: string;
  weight: number;
  isRequired: boolean;
  order: number;
}

interface VacancyCreateProps {
  onClose?: () => void;
}

type VacancyStatus = "active" | "paused" | "archived";
type QuestionType = "hard-skills" | "soft-skills" | "mixed";

const ITEM_TYPE = "question";

interface DragItem {
  id: string;
  index: number;
}

function Synergy({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center gap-4">
      {/* Кнопка назад */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Back button clicked!', e);
          if (onClose) {
            onClose?.();
          }
        }}
        className="bg-white border border-[#e2e4e9] rounded-lg p-2 hover:bg-[#f6f8fa] transition-colors shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] flex items-center justify-center"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 16 16"
          stroke="#525866"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 12L6 8L10 4" />
        </svg>
      </button>

      {/* Логотип Synergy */}
      <div
        className="relative shrink-0 size-[52px]"
        data-name="Synergy"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 52 52"
        >
          <g filter="url(#filter0_i_1_29717)" id=" Synergy">
            <rect
              fill="var(--fill-0, #E1634A)"
              height="52"
              rx="26"
              width="52"
            />
            <rect
              fill="var(--fill-1, white)"
              fillOpacity="0.1"
              height="52"
              rx="26"
              width="52"
            />
            <path
              d={svgPaths.p3f40a580}
              fill="url(#paint0_linear_1_29717)"
              fillOpacity="0.88"
              id="Vector"
              stroke="url(#paint1_linear_1_29717)"
            />
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="56"
              id="filter0_i_1_29717"
              width="52"
              x="0"
              y="-4"
            >
              <feFlood
                floodOpacity="0"
                result="BackgroundImageFix"
              />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                mode="normal"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="-4" />
              <feGaussianBlur stdDeviation="4" />
              <feComposite
                in2="hardAlpha"
                k2="-1"
                k3="1"
                operator="arithmetic"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.64 0"
              />
              <feBlend
                in2="shape"
                mode="normal"
                result="effect1_innerShadow_1_29717"
              />
            </filter>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint0_linear_1_29717"
              x1="26"
              x2="26"
              y1="5.77806"
              y2="67.1062"
            >
              <stop offset="0.313079" stopColor="white" />
              <stop
                offset="1"
                stopColor="white"
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint1_linear_1_29717"
              x1="97.3882"
              x2="-21.6094"
              y1="-92.3854"
              y2="4.15067"
            >
              <stop stopColor="white" />
              <stop
                offset="1"
                stopColor="white"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  moveQuestion,
  isWeightDropdownOpen,
  onToggleWeightDropdown,
}: {
  question: Question;
  index: number;
  moveQuestion: (dragIndex: number, hoverIndex: number) => void;
  isWeightDropdownOpen: boolean;
  onToggleWeightDropdown: () => void;
}) {
  const [questionText, setQuestionText] = useState(
    question.text,
  );
  const [evaluationCriteria, setEvaluationCriteria] = useState(
    question.evaluationCriteria,
  );
  const [isRequired, setIsRequired] = useState(
    question.isRequired,
  );
  const [questionWeight, setQuestionWeight] = useState(
    question.weight,
  );

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { id: question.id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: DragItem) => {
      if (!item) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveQuestion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const weightOptions = [
    { value: 1, label: "Низкий", icon: "○" },
    { value: 3, label: "Средний", icon: "◐" },
    { value: 5, label: "Высокий", icon: "●" },
  ];

  const getCurrentWeight = () => {
    return (
      weightOptions.find((w) => w.value === questionWeight) ||
      weightOptions[2]
    );
  };

  return (
    <div
      ref={(node) => {
        preview(drop(node));
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
            {/* Question header with drag handle */}
            <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0 w-full">
              <div
                ref={(node) => {
                  drag(node);
                }}
                className="cursor-move relative shrink-0 size-6"
              >
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <g id="lucide/grip-vertical">
                    <g id="Vector">
                      <path
                        d={svgPaths.p1f792c00}
                        stroke="#868C98"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d={svgPaths.p44c480}
                        stroke="#868C98"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d={svgPaths.p2d042680}
                        stroke="#868C98"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d={svgPaths.p691da80}
                        stroke="#868C98"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d={svgPaths.p2dd09c80}
                        stroke="#868C98"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d={svgPaths.p63a2500}
                        stroke="#868C98"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </g>
                  </g>
                </svg>
              </div>
              <div className="basis-0 box-border content-stretch flex flex-row gap-[842px] grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left text-nowrap">
                  <p className="block leading-[28px] whitespace-pre">
                    Вопрос {index + 1}/5
                  </p>
                </div>
              </div>
            </div>

            {/* Question input */}
            <div className="box-border content-stretch flex flex-col gap-1 h-[150px] items-center justify-start p-0 relative shrink-0 w-full">
              <div className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-[32px] shrink-0 w-full">
                <div className="overflow-clip relative size-full">
                  <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[24px] relative size-full">
                    <textarea
                      value={questionText}
                      onChange={(e) =>
                        setQuestionText(e.target.value)
                      }
                      placeholder="Введите текст вопроса"
                      className="css-e2obls font-['Inter:Regular',_sans-serif] font-normal not-italic relative shrink-0 text-[#0a0d14] text-[16px] text-left tracking-[-0.176px] w-full h-full resize-none border-none outline-none bg-transparent"
                    />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                />
              </div>
            </div>

            {/* Control buttons */}
            <div className="relative shrink-0 w-full">
              <div className="flex flex-row items-center relative size-full">
                <div className="box-border content-stretch flex flex-row items-center justify-between px-6 py-0 relative w-full">
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                    <button
                      onClick={() => {
                        console.log("Undo clicked");
                      }}
                      className="relative shrink-0 size-4 cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 16 16"
                      >
                        <g id="lucide/rotate-ccw">
                          <path
                            d={svgPaths.pc67f500}
                            id="Vector"
                            stroke="#525866"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        console.log("Redo clicked");
                      }}
                      className="relative shrink-0 size-4 cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 16 16"
                      >
                        <g id="lucide/rotate-cw">
                          <path
                            d={svgPaths.p36f39ec0}
                            id="Vector"
                            stroke="#525866"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                  <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0">
                    <button
                      onClick={() => {
                        console.log(
                          "Regenerate question clicked",
                        );
                      }}
                      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      <div className="relative shrink-0 size-4">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 16 16"
                        >
                          <g
                            clipPath="url(#clip0_1_29606)"
                            id="lucide/sparkles"
                          >
                            <path
                              d={svgPaths.p23d6a00}
                              id="Vector"
                              stroke="#E16349"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1_29606">
                              <rect
                                fill="white"
                                height="16"
                                width="16"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="css-cf07vu font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-center text-nowrap tracking-[-0.084px]">
                        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                          Сген��риов��ть снова
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        console.log("Delete question clicked");
                      }}
                      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      <div className="relative shrink-0 size-4">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 16 16"
                        >
                          <g id="delete-bin-line">
                            <path
                              d={svgPaths.p781d6b0}
                              fill="#E16349"
                              id="Vector"
                            />
                          </g>
                        </svg>
                      </div>
                      <div className="css-cf07vu font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-center text-nowrap tracking-[-0.084px]">
                        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                          Удалить
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation criteria */}
            <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full">
              <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
                <div className="overflow-clip relative size-full">
                  <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[24px] relative w-full">
                    <textarea
                      value={evaluationCriteria}
                      onChange={(e) =>
                        setEvaluationCriteria(e.target.value)
                      }
                      placeholder="Укажите ключевые точки на которые ИИ должен опираться при оценке. Это не обязательно, но может улучшить точность оценки."
                      className="css-lkao9s font-['Inter:Regular',_sans-serif] font-normal not-italic relative shrink-0 text-foreground placeholder:text-muted-foreground text-[16px] text-left tracking-[-0.176px] w-full min-h-[80px] resize-none border-none outline-none bg-transparent focus:ring-0"
                    />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                />
              </div>
            </div>

            {/* Question settings */}
            <div className="relative shrink-0 w-full">
              <div className="flex flex-row items-center relative size-full">
                <div className="box-border content-stretch flex flex-row items-center justify-between px-6 py-0 relative w-full">
                  <div className="box-border content-stretch flex flex-row gap-5 items-center justify-start p-0 relative shrink-0">
                    <div className="css-sb4kmc font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                      <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                        Вес вопроса:
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={onToggleWeightDropdown}
                        className="bg-[#ffffff] relative rounded-lg shrink-0 cursor-pointer hover:bg-[#f6f8fa] transition-colors"
                      >
                        <div className="box-border content-stretch flex flex-row gap-0.5 items-center justify-start overflow-clip p-[6px] relative">
                          <div className="relative shrink-0 size-5 flex items-center justify-center text-[#E16349] text-sm">
                            {getCurrentWeight().icon}
                          </div>
                          <div
                            className={`relative shrink-0 size-5 transition-transform ${isWeightDropdownOpen ? "rotate-180" : ""}`}
                          >
                            <svg
                              className="block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 20 20"
                            >
                              <g id="arrow-down-s-line">
                                <path
                                  d={svgPaths.p2c6f4a00}
                                  fill="#868C98"
                                  id="Vector"
                                />
                              </g>
                            </svg>
                          </div>
                        </div>
                        <div
                          aria-hidden="true"
                          className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-lg shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                        />
                      </button>

                      {/* Weight Dropdown Menu */}
                      {isWeightDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-[#ffffff] border border-[#e2e4e9] rounded-[12px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)] z-50 min-w-[120px]">
                          {weightOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setQuestionWeight(option.value);
                                onToggleWeightDropdown();
                              }}
                              className={`w-full flex flex-row gap-2 items-center justify-start p-[8px] first:rounded-t-[12px] last:rounded-b-[12px] transition-colors ${
                                questionWeight === option.value
                                  ? "bg-[#f6f8fa]"
                                  : "hover:bg-[#f6f8fa]"
                              }`}
                            >
                              <div className="text-[#E16349] text-sm">
                                {option.icon}
                              </div>
                              <div className="css-sb4kmc font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[12px] text-left text-nowrap tracking-[-0.084px]">
                                <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">
                                  {option.label}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsRequired(!isRequired)}
                    className="box-border content-stretch flex flex-row gap-2 h-5 items-center justify-start p-0 relative shrink-0 w-[210px] cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <div className="relative shrink-0 size-5">
                      {isRequired ? (
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 20 20"
                        >
                          <g id="Checkbox [1.0]">
                            <g id="Rectangle">
                              <mask
                                fill="white"
                                id="path-1-inside-1_23_29575"
                              >
                                <path d={svgPaths.p33c74a80} />
                              </mask>
                              <g filter="url(#filter0_i_23_29575)">
                                <path
                                  d={svgPaths.p33c74a80}
                                  fill="#E16349"
                                />
                              </g>
                              <path
                                d={svgPaths.p51b4880}
                                fill="#B14731"
                                mask="url(#path-1-inside-1_23_29575)"
                              />
                            </g>
                            <path
                              clipRule="evenodd"
                              d={svgPaths.p2229a570}
                              fill="white"
                              fillRule="evenodd"
                              id="Check"
                            />
                          </g>
                          <defs>
                            <filter
                              colorInterpolationFilters="sRGB"
                              filterUnits="userSpaceOnUse"
                              height="18"
                              id="filter0_i_23_29575"
                              width="16"
                              x="2"
                              y="2"
                            >
                              <feFlood
                                floodOpacity="0"
                                result="BackgroundImageFix"
                              />
                              <feBlend
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                mode="normal"
                                result="shape"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                result="hardAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              />
                              <feOffset dy="2" />
                              <feGaussianBlur stdDeviation="1" />
                              <feComposite
                                in2="hardAlpha"
                                k2="-1"
                                k3="1"
                                operator="arithmetic"
                              />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.0864 0 0 0 0 0.14784 0 0 0 0 0.3936 0 0 0 0.32 0"
                              />
                              <feBlend
                                in2="shape"
                                mode="normal"
                                result="effect1_innerShadow_23_29575"
                              />
                            </filter>
                          </defs>
                        </svg>
                      ) : (
                        <div className="size-5 border-2 border-[#e2e4e9] rounded bg-[#ffffff]"></div>
                      )}
                    </div>
                    <div className="box-border content-stretch flex flex-row gap-1 h-full items-center justify-start p-0 relative shrink-0">
                      <div className="css-sb4kmc font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                          Вопрос нельзя пропустить
                        </p>
                      </div>
                    </div>
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

export function VacancyCreate({
  onClose,
}: VacancyCreateProps) {
  // Form state
  const [aiDescription, setAiDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [searchTags, setSearchTags] = useState("");
  const [tags, setTags] = useState([
    "HTML/CSS",
    "Node.JS",
    "React",
  ]);
  const [minScore, setMinScore] = useState(5);
  const [timePerAnswer, setTimePerAnswer] = useState("1 мин");
  const [level, setLevel] = useState("Junior");
  const [questionCount, setQuestionCount] = useState(5);
  const [questionType, setQuestionType] =
    useState<QuestionType>("hard-skills");
  const [
    isQuestionTypeDropdownOpen,
    setIsQuestionTypeDropdownOpen,
  ] = useState(false);
  const [openWeightDropdowns, setOpenWeightDropdowns] =
    useState<Set<string>>(new Set());

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "Можете объяснить, как вы подходите к написанию юнит тестов для приложения на Swift, и какие инструменты вы предпочитаете использовать?",
      evaluationCriteria: "",
      weight: 5,
      isRequired: true,
      order: 1,
    },
    {
      id: "2",
      text: "Можете объяснить, как вы подходите к написанию юнит тестов для приложения на Swift, и какие инструменты вы предпочитаете использовать?",
      evaluationCriteria: "",
      weight: 5,
      isRequired: false,
      order: 2,
    },
  ]);

  const timeOptions = [
    "1 мин",
    "1 мин 30 сек",
    "2 мин",
    "2 мин 30 сек",
    "3 мин",
    "3 мин 30 сек",
    "4 мин",
    "5 мин",
  ];
  const levelOptions = ["Junior", "Middle", "Senior", "Lead"];

  const questionTypeOptions = [
    {
      id: "hard-skills" as QuestionType,
      label: "В основном хард-скиллы",
    },
    {
      id: "soft-skills" as QuestionType,
      label: "В основном софт-скиллы",
    },
    { id: "mixed" as QuestionType, label: "Смешанный тип" },
  ];

  const getCurrentQuestionTypeLabel = () => {
    return (
      questionTypeOptions.find(
        (option) => option.id === questionType,
      )?.label || "В основном хард-скиллы"
    );
  };

  const moveQuestion = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setQuestions((prev) => {
        const newQuestions = [...prev];
        const draggedQuestion = newQuestions[dragIndex];
        newQuestions.splice(dragIndex, 1);
        newQuestions.splice(hoverIndex, 0, draggedQuestion);
        return newQuestions.map((q, index) => ({
          ...q,
          order: index + 1,
        }));
      });
    },
    [],
  );

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) =>
      prev.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleAddTag = () => {
    if (topic.trim() && !tags.includes(topic.trim())) {
      setTags((prev) => [...prev, topic.trim()]);
      setTopic("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  const handleGenerateWithAI = () => {
    console.log("Generating with AI:", {
      description: aiDescription,
      jobTitle,
      tags,
      minScore,
      timePerAnswer,
      level,
      questionCount,
      questionType,
    });
  };

  const handleAddQuestionManually = () => {
    const newQuestion: Question = {
      id: `${Date.now()}`,
      text: "Новый вопрос",
      evaluationCriteria: "",
      weight: 5,
      isRequired: false,
      order: questions.length + 1,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleCreateVacancy = () => {
    console.log("Creating vacancy:", {
      jobTitle,
      topic,
      tags,
      searchTags,
      minScore,
      timePerAnswer,
      level,
      questionCount,
      questionType,
      questions,
    });
    onClose?.();
  };

  const handleToggleWeightDropdown = (questionId: string) => {
    setOpenWeightDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.clear(); // Close all others
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const closeAllWeightDropdowns = () => {
    setOpenWeightDropdowns(new Set());
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* ИСПОЛЬЗУЕМ КОНСТАНТУ MAIN_CONTENT_WIDTH ДЛЯ КОНСИСТЕНТНОСТИ */}
      <div
        className={`box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative rounded-[44px] shrink-0 w-[${MAIN_CONTENT_WIDTH}px]`}
      >
        {/* Main Content */}
        <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
          {/* AI Generator Section */}
          <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start pb-8 pt-6 px-6 relative rounded-[44px] shrink-0 w-full">
            <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
              <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0 w-full">
                <Synergy />
                <div className="basis-0 bg-[#ffdac2] grow min-h-px min-w-px relative rounded-br-[12px] rounded-tl-[12px] rounded-tr-[12px] shrink-0">
                  <div className="flex flex-row items-center justify-center relative size-full">
                    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[10px] relative w-full">
                      <div className="basis-0 css-8vheua font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#000000] text-[16px] text-left tracking-[-0.176px]">
                        <p className="block leading-[24px]">
                          Я помогу! Введите описание вакансии в
                          поле ниже и нажмите Сгенерировать
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-border content-stretch flex flex-col gap-1 h-[210px] items-center justify-start p-0 relative shrink-0 w-full">
                <div className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-[32px] shrink-0 w-full">
                  <div className="overflow-clip relative size-full">
                    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[24px] relative size-full">
                      <textarea
                        value={aiDescription}
                        onChange={(e) =>
                          setAiDescription(e.target.value)
                        }
                        placeholder="Введите описание или ключевые навыки"
                        className="w-full h-full resize-none border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground focus:ring-0"
                      />
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleGenerateWithAI}
              className="bg-gradient-to-b box-border content-stretch flex flex-row from-[#e16349] gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-[20px] shrink-0 to-[#df1c41] to-[134.62%] hover:from-[#d14a31] hover:to-[#c81636] transition-colors cursor-pointer"
            >
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                <div className="css-dh74q0 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-0.084px]">
                  <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                    Сгенирировать
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Job Details Section */}
          <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="basis-0 bg-[#f5f6f1] grow min-h-px min-w-px relative rounded-[44px] shrink-0">
              <div className="relative size-full">
                <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
                  <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left w-full">
                    <p className="block leading-[28px]">
                      Детали вакансии
                    </p>
                  </div>
                  <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
                    <div className="relative size-full">
                      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
                        {/* Job Title Input */}
                        <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full">
                          <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-full">
                            <div className="css-sb4kmc flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                Название
                              </p>
                            </div>
                          </div>
                          <div className="bg-[#ffffff] relative rounded-[20px] shrink-0 w-full">
                            <div className="flex flex-row items-center overflow-clip relative size-full">
                              <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) =>
                                  setJobTitle(e.target.value)
                                }
                                placeholder="Название вакансии"
                                className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-3.5 pr-3 py-3.5 relative w-full basis-0 css-aslzhm font-['Inter:Regular',_sans-serif] font-normal leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden shrink-0 text-[#868c98] text-[14px] text-left text-nowrap tracking-[-0.084px] border-none outline-none bg-transparent"
                              />
                            </div>
                            <div
                              aria-hidden="true"
                              className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                            />
                          </div>
                        </div>

                        {/* Topic Input */}
                        <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full">
                          <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-full">
                            <div className="css-sb4kmc flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                Топик
                              </p>
                            </div>
                          </div>
                          <div className="bg-[#ffffff] relative rounded-[20px] shrink-0 w-full">
                            <div className="flex flex-row items-center overflow-clip relative size-full">
                              <input
                                type="text"
                                value={topic}
                                onChange={(e) =>
                                  setTopic(e.target.value)
                                }
                                onKeyPress={handleKeyPress}
                                placeholder="Добавить топик"
                                className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-3.5 pr-3 py-3.5 relative w-full basis-0 css-crfmwu font-['Inter:Regular',_sans-serif] font-normal leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px] border-none outline-none bg-transparent"
                              />
                            </div>
                            <div
                              aria-hidden="true"
                              className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                            />
                          </div>
                          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pb-0 pt-1 px-0 relative shrink-0 w-full">
                            {/* Tags */}
                            {tags.map((tag) => (
                              <div
                                key={tag}
                                className="bg-[#ffffff] relative rounded-xl shrink-0"
                              >
                                <div className="box-border content-stretch flex flex-row gap-[3px] items-center justify-center overflow-clip pl-2 pr-[5px] py-1 relative">
                                  <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-left text-nowrap">
                                    <p className="block leading-[16px] whitespace-pre">
                                      {tag}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleRemoveTag(tag)
                                    }
                                    className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-px relative rounded-[96px] shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                                  >
                                    <div className="relative shrink-0 size-3">
                                      <svg
                                        className="block size-full"
                                        fill="none"
                                        preserveAspectRatio="none"
                                        viewBox="0 0 12 12"
                                      >
                                        <g id="close-line">
                                          <path
                                            d={
                                              svgPaths.p30968300
                                            }
                                            fill="#868C98"
                                            id="Vector"
                                          />
                                        </g>
                                      </svg>
                                    </div>
                                  </button>
                                </div>
                                <div
                                  aria-hidden="true"
                                  className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-xl"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Search Tags Input */}
                        <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full">
                          <div className="box-border content-stretch flex flex-row gap-px items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
                            <div className="css-sb4kmc flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center relative shrink-0 text-[#0a0d14]">
                              <p className="adjustLetterSpacing block leading-[20px] text-nowrap whitespace-pre">
                                Теги для поиска
                              </p>
                            </div>
                            <div className="css-2x1u1o flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center relative shrink-0 text-[#525866]">
                              <p className="adjustLetterSpacing block leading-[20px] text-nowrap whitespace-pre">
                                (Опционально)
                              </p>
                            </div>
                          </div>
                          <div className="bg-[#ffffff] relative rounded-[20px] shrink-0 w-full">
                            <div className="flex flex-row items-center overflow-clip relative size-full">
                              <input
                                type="text"
                                value={searchTags}
                                onChange={(e) =>
                                  setSearchTags(e.target.value)
                                }
                                placeholder="Введите или создайте тег"
                                className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-3.5 pr-3 py-3.5 relative w-full basis-0 css-aslzhm font-['Inter:Regular',_sans-serif] font-normal leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden shrink-0 text-[#868c98] text-[14px] text-left text-nowrap tracking-[-0.084px] border-none outline-none bg-transparent"
                              />
                            </div>
                            <div
                              aria-hidden="true"
                              className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conditions Section */}
          <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-full">
            <div
              className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#000000] text-[20px] text-left"
              style={{ width: "min-content" }}
            >
              <p className="block leading-[28px]">Условия</p>
            </div>
            <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[32px] shrink-0 w-full">
              {/* Minimum Score */}
              <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
                <div
                  className="css-sb4kmc flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left tracking-[-0.084px]"
                  style={{ width: "min-content" }}
                >
                  <p className="block leading-[20px]">
                    Минимальная оценка
                  </p>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                    (score) => (
                      <button
                        key={score}
                        onClick={() => setMinScore(score)}
                        className={`box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-2xl shrink-0 cursor-pointer hover:opacity-90 transition-opacity ${
                          score === minScore
                            ? "bg-[#e16349]"
                            : "bg-[#f6f8fa]"
                        } ${score === 10 ? "w-[47px]" : ""}`}
                      >
                        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                          <div
                            className={`css-e2obls font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap tracking-[-0.176px] ${
                              score === minScore
                                ? "text-[#ffffff]"
                                : "text-[#0a0d14]"
                            }`}
                          >
                            <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                              {score}
                            </p>
                          </div>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Time per Answer */}
              <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
                <div
                  className="css-sb4kmc flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left tracking-[-0.084px]"
                  style={{ width: "min-content" }}
                >
                  <p className="block leading-[20px]">
                    Время на один ответ
                  </p>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 flex-wrap">
                  {timeOptions.slice(0, 4).map((time) => (
                    <button
                      key={time}
                      onClick={() => setTimePerAnswer(time)}
                      className={`box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 cursor-pointer hover:opacity-90 transition-opacity ${
                        time === timePerAnswer
                          ? "bg-[#e16349]"
                          : "bg-[#f6f8fa]"
                      }`}
                    >
                      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                        <div
                          className={`css-e2obls font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap tracking-[-0.176px] ${
                            time === timePerAnswer
                              ? "text-[#ffffff]"
                              : "text-[#0a0d14]"
                          }`}
                        >
                          <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                            {time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 flex-wrap">
                  {timeOptions.slice(4).map((time) => (
                    <button
                      key={time}
                      onClick={() => setTimePerAnswer(time)}
                      className={`box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 cursor-pointer hover:opacity-90 transition-opacity ${
                        time === timePerAnswer
                          ? "bg-[#e16349]"
                          : "bg-[#f6f8fa]"
                      }`}
                    >
                      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                        <div
                          className={`css-e2obls font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap tracking-[-0.176px] ${
                            time === timePerAnswer
                              ? "text-[#ffffff]"
                              : "text-[#0a0d14]"
                          }`}
                        >
                          <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                            {time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
                <div
                  className="css-sb4kmc flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left tracking-[-0.084px]"
                  style={{ width: "min-content" }}
                >
                  <p className="block leading-[20px]">
                    Уровень
                  </p>
                </div>
                <div className="[flex-flow:wrap] box-border content-center flex gap-2 items-center justify-start p-0 relative shrink-0">
                  {levelOptions.map((levelOption) => (
                    <button
                      key={levelOption}
                      onClick={() => setLevel(levelOption)}
                      className={`box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 cursor-pointer hover:opacity-90 transition-opacity ${
                        levelOption === level
                          ? "bg-[#e16349]"
                          : "bg-[#f6f8fa]"
                      }`}
                    >
                      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                        <div
                          className={`css-e2obls font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap tracking-[-0.176px] ${
                            levelOption === level
                              ? "text-[#ffffff]"
                              : "text-[#0a0d14]"
                          }`}
                        >
                          <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                            {levelOption}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="basis-0 bg-[#f5f6f1] grow min-h-px min-w-px relative rounded-[44px] shrink-0">
              <div className="relative size-full">
                <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-[32px] relative w-full">
                  <div
                    className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#000000] text-[20px] text-left"
                    style={{ width: "min-content" }}
                  >
                    <p className="block leading-[28px]">
                      Вопросы для интервью
                    </p>
                  </div>

                  {/* Question settings */}
                  <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
                    <div className="relative size-full">
                      <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-[24px] relative w-full">
                        <div className="[flex-flow:wrap] box-border content-end flex gap-2 items-end justify-start p-0 relative shrink-0">
                          <div className="css-sb4kmc flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                            <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                              Сколько вопросов сгенерировать?
                            </p>
                          </div>
                          {[5, 10, 15].map((count) => (
                            <button
                              key={count}
                              onClick={() =>
                                setQuestionCount(count)
                              }
                              className={`box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-2xl shrink-0 cursor-pointer hover:opacity-90 transition-opacity ${
                                count === questionCount
                                  ? "bg-[#e16349]"
                                  : "bg-[#f6f8fa]"
                              } ${count === 10 || count === 15 ? "w-[47px]" : ""}`}
                            >
                              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                                <div
                                  className={`css-e2obls font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap tracking-[-0.176px] ${
                                    count === questionCount
                                      ? "text-[#ffffff]"
                                      : "text-[#0a0d14]"
                                  }`}
                                >
                                  <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                                    {count}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full">
                          <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-full">
                            <div className="css-sb4kmc flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                Что проверяем?
                              </p>
                            </div>
                          </div>
                          <div className="relative bg-[#ffffff] rounded-[20px] shrink-0 w-full">
                            <button
                              onClick={() =>
                                setIsQuestionTypeDropdownOpen(
                                  !isQuestionTypeDropdownOpen,
                                )
                              }
                              className="flex flex-row items-center overflow-clip relative size-full w-full cursor-pointer hover:bg-[#f6f8fa] transition-colors"
                            >
                              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-3.5 pr-3 py-3.5 relative w-full">
                                <div className="basis-0 css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#525866] text-[14px] text-left tracking-[-0.084px]">
                                  <p className="block leading-[20px]">
                                    {getCurrentQuestionTypeLabel()}
                                  </p>
                                </div>
                                <div
                                  className={`relative shrink-0 size-5 transition-transform ${isQuestionTypeDropdownOpen ? "rotate-180" : ""}`}
                                >
                                  <svg
                                    className="block size-full"
                                    fill="none"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 20 20"
                                  >
                                    <g id="arrow-down-s-line">
                                      <path
                                        d={svgPaths.p2c6f4a00}
                                        fill="#868C98"
                                        id="Vector"
                                      />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isQuestionTypeDropdownOpen && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-[#ffffff] border border-[#e2e4e9] rounded-[20px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)] z-50">
                                {questionTypeOptions.map(
                                  (option) => (
                                    <button
                                      key={option.id}
                                      onClick={() => {
                                        setQuestionType(
                                          option.id,
                                        );
                                        setIsQuestionTypeDropdownOpen(
                                          false,
                                        );
                                      }}
                                      className={`w-full text-left px-4 py-3 first:rounded-t-[20px] last:rounded-b-[20px] transition-colors ${
                                        questionType ===
                                        option.id
                                          ? "bg-[#f6f8fa]"
                                          : "hover:bg-[#f6f8fa]"
                                      }`}
                                    >
                                      <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#525866] text-[14px] text-left tracking-[-0.084px]">
                                        <p className="block leading-[20px]">
                                          {option.label}
                                        </p>
                                      </div>
                                    </button>
                                  ),
                                )}
                              </div>
                            )}

                            <div
                              aria-hidden="true"
                              className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-6 w-full">
                    {questions.map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        index={index}
                        moveQuestion={moveQuestion}
                        isWeightDropdownOpen={openWeightDropdowns.has(
                          question.id,
                        )}
                        onToggleWeightDropdown={() =>
                          handleToggleWeightDropdown(
                            question.id,
                          )
                        }
                      />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                    <button
                      onClick={handleGenerateWithAI}
                      className="bg-gradient-to-b box-border content-stretch flex flex-row from-[#e16349] gap-1 items-center justify-center overflow-clip px-3.5 py-5 relative rounded-3xl shrink-0 to-[#df1c41] to-[134.62%] hover:from-[#d14a31] hover:to-[#c81636] transition-colors cursor-pointer"
                    >
                      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                        <div className="css-rpndqk font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                          <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                            Сгенерировать �� AI
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={handleAddQuestionManually}
                      className="bg-[#ffffff] relative rounded-3xl shrink-0 cursor-pointer hover:bg-[#f6f8fa] transition-colors"
                    >
                      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip px-3.5 py-5 relative">
                        <div className="relative shrink-0 size-5">
                          <svg
                            className="block size-full"
                            fill="none"
                            preserveAspectRatio="none"
                            viewBox="0 0 20 20"
                          >
                            <g id="add-fill">
                              <path
                                d={svgPaths.p301d0e00}
                                fill="#E16349"
                                id="Vector"
                              />
                            </g>
                          </svg>
                        </div>
                        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                          <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                            <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                              Добавить вручную
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        aria-hidden="true"
                        className="absolute border border-[#e16349] border-solid inset-0 pointer-events-none rounded-3xl"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex gap-2 justify-start mt-[0px] mr-[0px] mb-[14px] ml-[0px] pt-[0px] pr-[0px] pb-[14px] pl-[0px]">
            <button
              onClick={handleCreateVacancy}
              className="bg-[#e16349] text-white px-6 py-4 rounded-3xl font-medium hover:bg-[#d14a31] transition-colors cursor-pointer"
            >
              Создать вакансию
            </button>
            <button
              onClick={() => onClose?.()}
              className="bg-[#ffffff] text-[#525866] px-6 py-4 rounded-3xl font-medium border border-[#e2e4e9] hover:bg-[#f6f8fa] transition-colors cursor-pointer"
            >
              Отмена
            </button>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {isQuestionTypeDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsQuestionTypeDropdownOpen(false)}
          />
        )}

        {/* Click outside to close weight dropdowns in question cards */}
        {openWeightDropdowns.size > 0 && (
          <div
            className="fixed inset-0 z-40"
            onClick={closeAllWeightDropdowns}
          />
        )}
      </div>
    </DndProvider>
  );
}
