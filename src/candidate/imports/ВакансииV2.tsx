import svgPaths from "./svg-c7p9ld99sr";

function Synergy() {
  return (
    <div className="relative shrink-0 size-[52px]" data-name="Synergy">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 52 52"
      >
        <g filter="url(#filter0_i_1_30639)" id=" Synergy">
          <rect fill="var(--fill-0, #E1634A)" height="52" rx="26" width="52" />
          <rect
            fill="var(--fill-1, white)"
            fillOpacity="0.1"
            height="52"
            rx="26"
            width="52"
          />
          <path
            d={svgPaths.p3f40a580}
            fill="url(#paint0_linear_1_30639)"
            fillOpacity="0.88"
            id="Vector"
            stroke="url(#paint1_linear_1_30639)"
          />
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="56"
            id="filter0_i_1_30639"
            width="52"
            x="0"
            y="-4"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.64 0"
            />
            <feBlend
              in2="shape"
              mode="normal"
              result="effect1_innerShadow_1_30639"
            />
          </filter>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint0_linear_1_30639"
            x1="26"
            x2="26"
            y1="5.77806"
            y2="67.1062"
          >
            <stop offset="0.313079" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint1_linear_1_30639"
            x1="97.3882"
            x2="-21.6094"
            y1="-92.3854"
            y2="4.15067"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
      <Synergy />
      <div className="css-sqkidj flex flex-col font-['Inter_Display:SemiBold',_sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#000000] text-[24px] text-left text-nowrap">
        <p className="block leading-[32px] whitespace-pre">WMT Рекрутер</p>
      </div>
    </div>
  );
}

function SuitcaseLine() {
  return (
    <div className="relative shrink-0 size-5" data-name="suitcase-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="suitcase-line">
          <path
            d={svgPaths.p20c0f400}
            fill="var(--fill-0, #E16349)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[16px] text-center text-nowrap tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
          Вакансии
        </p>
      </div>
    </div>
  );
}

function Buttons10() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-3xl shrink-0 w-[143px]"
      data-name="Buttons [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative w-[143px]">
        <SuitcaseLine />
        <Text />
      </div>
      <div className="absolute border border-[#e16349] border-solid inset-0 pointer-events-none rounded-3xl" />
    </div>
  );
}

function PieChartLine() {
  return (
    <div className="relative shrink-0 size-5" data-name="pie-chart-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="pie-chart-line">
          <path
            d={svgPaths.p5fe3080}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
          Статистика
        </p>
      </div>
    </div>
  );
}

function Buttons11() {
  return (
    <div
      className="bg-[#f5f6f1] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shadow-[0px_1px_2px_0px_rgba(55,93,251,0.08)] shrink-0"
      data-name="Buttons [1.0]"
    >
      <PieChartLine />
      <Text1 />
    </div>
  );
}

function TeamLine() {
  return (
    <div className="relative shrink-0 size-5" data-name="team-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="team-line">
          <path
            d={svgPaths.pf5f7400}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
          Команда
        </p>
      </div>
    </div>
  );
}

function Buttons12() {
  return (
    <div
      className="bg-[#f5f6f1] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shadow-[0px_1px_2px_0px_rgba(55,93,251,0.08)] shrink-0"
      data-name="Buttons [1.0]"
    >
      <TeamLine />
      <Text2 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
      <Buttons10 />
      <Buttons11 />
      <Buttons12 />
    </div>
  );
}

function Notification4Line() {
  return (
    <div className="relative shrink-0 size-6" data-name="notification-4-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="notification-4-line">
          <path
            d={svgPaths.p120a9500}
            fill="var(--fill-0, #0A0D14)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#f5f6f1] box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[14px] relative rounded-[100px] shrink-0">
      <Notification4Line />
    </div>
  );
}

function Avatar10() {
  return (
    <div
      className="bg-[#fbdfb1] relative rounded-[999px] shrink-0 size-10"
      data-name="Avatar [1.0]"
    >
      <div
        className="absolute bg-center bg-cover bg-no-repeat inset-0 rounded-[980px]"
        data-name="image"
        style={{ backgroundImage: `url('')` }}
      />
    </div>
  );
}

function MyContactsQuickTransfer10() {
  return (
    <div
      className="bg-[#f5f6f1] relative rounded-3xl shrink-0"
      data-name="My Contacts [Quick Transfer] [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start overflow-clip pl-1.5 pr-[18px] py-1.5 relative">
        <Avatar10 />
        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
          <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
            Наталья
          </p>
        </div>
      </div>
      <div className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-3xl shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-row gap-2 grow items-center justify-end min-h-px min-w-px p-0 relative shrink-0">
      <Frame1 />
      <MyContactsQuickTransfer10 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[179px] items-center justify-start p-0 relative shrink-0 w-[1856px]">
      <Frame2 />
      <Frame10 />
      <Frame4 />
    </div>
  );
}

function Frame139() {
  return (
    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2 py-0 relative shrink-0">
      <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-center text-nowrap">
        <p className="block leading-[40px] whitespace-pre">Вакансии</p>
      </div>
    </div>
  );
}

function AddFill() {
  return (
    <div className="relative shrink-0 size-5" data-name="add-fill">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="add-fill">
          <path
            d={svgPaths.p301d0e00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Buttons13() {
  return (
    <div
      className="bg-[#e16349] box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shadow-[0px_1px_2px_0px_rgba(55,93,251,0.08)] shrink-0"
      data-name="Buttons [1.0]"
    >
      <AddFill />
    </div>
  );
}

function Frame80() {
  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
      <Frame139 />
      <Buttons13 />
    </div>
  );
}

function SwitchToggleItems10() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-[20px] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)] shrink-0"
      data-name="Switch Toggle Items [1.0]"
    >
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-3 py-2.5 relative w-full">
          <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[16px] text-left text-nowrap tracking-[-0.176px]">
            <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
              Все
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwitchToggleItems11() {
  return (
    <div
      className="basis-0 bg-[#f5f6f1] grow min-h-px min-w-px relative rounded-[20px] shrink-0"
      data-name="Switch Toggle Items [1.0]"
    >
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-3 py-2.5 relative w-full">
          <div className="css-lkao9s font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#868c98] text-[16px] text-left text-nowrap tracking-[-0.176px]">
            <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
              Мои
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewToggle10() {
  return (
    <div
      className="bg-[#f5f6f1] relative rounded-3xl shrink-0 w-full"
      data-name="View Toggle [1.0]"
    >
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-[4px] relative w-full">
          <SwitchToggleItems10 />
          <SwitchToggleItems11 />
        </div>
      </div>
      <div className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl" />
    </div>
  );
}

function SwitchToggle10() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1.5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Switch Toggle [1.0]"
    >
      <ViewToggle10 />
    </div>
  );
}

function ArrowDownSLine() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-down-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-down-s-line">
          <path
            d={svgPaths.p2c6f4a00}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function DefaultDropdown() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full"
      data-name="Default Dropdown"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-3.5 pr-3 py-3.5 relative w-full">
          <div className="basis-0 css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#525866] text-[16px] text-left tracking-[-0.176px]">
            <p className="block leading-[24px]">Все статусы</p>
          </div>
          <ArrowDownSLine />
        </div>
      </div>
      <div className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]" />
    </div>
  );
}

function Dropdowns10() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Dropdowns [1.0]"
    >
      <DefaultDropdown />
    </div>
  );
}

function Search2Line() {
  return (
    <div className="relative shrink-0 size-5" data-name="search-2-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="search-2-line">
          <path
            d={svgPaths.p34d12c00}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function DropdownMiscItems10() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-3xl shrink-0"
      data-name="Dropdown Misc Items [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[14px] relative w-full">
          <Search2Line />
          <div className="basis-0 css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#525866] text-[16px] text-left tracking-[-0.176px]">
            <p className="block leading-[24px]">Поиск...</p>
          </div>
        </div>
      </div>
      <div className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl" />
    </div>
  );
}

function Frame23() {
  return (
    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
      <DropdownMiscItems10 />
    </div>
  );
}

function Frame81() {
  return (
    <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-0 relative shrink-0 w-full">
      <SwitchToggle10 />
      <Dropdowns10 />
      <Frame23 />
    </div>
  );
}

function Frame83() {
  return (
    <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full">
      <Frame80 />
      <Frame81 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
      <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left text-nowrap">
        <p className="block leading-[28px] whitespace-pre">
          Frontend разработчик
        </p>
      </div>
    </div>
  );
}

function Avatar11() {
  return (
    <div
      className="bg-[#cac2ff] relative rounded-[1165.5px] shrink-0 size-7"
      data-name="Avatar [1.0]"
    >
      <div className="absolute inset-0" data-name="BG">
        <div
          className="absolute inset-0"
          style={
            { "--fill-0": "rgba(202, 194, 255, 1)" } as React.CSSProperties
          }
        />
      </div>
      <div className="absolute bottom-[15.476%] css-ip4j4q font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-0 not-italic right-0 text-[#2b1664] text-[14px] text-center top-[16.667%]">
        <p className="block leading-[18.667px]">M</p>
      </div>
    </div>
  );
}

function Frame112() {
  return (
    <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0 w-full">
      <Frame40 />
      <Avatar11 />
    </div>
  );
}

function FluentPeople20Regular() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="fluent:people-20-regular"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="fluent:people-20-regular">
          <path
            d={svgPaths.p53b5880}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame113() {
  return (
    <div className="bg-[#f6f8fa] box-border content-stretch flex flex-row items-center justify-start px-1.5 py-1 relative rounded-2xl shrink-0">
      <FluentPeople20Regular />
      <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-center tracking-[-0.176px] w-[33px]">
        <p className="adjustLetterSpacing block leading-[24px]">26</p>
      </div>
    </div>
  );
}

function Dot() {
  return (
    <div className="relative shrink-0 size-4" data-name="Dot">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="Dot">
          <circle
            cx="8"
            cy="8"
            fill="var(--fill-0, #38C793)"
            id="Dot_2"
            r="3"
          />
        </g>
      </svg>
    </div>
  );
}

function StatusBadge10() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-2xl shrink-0"
      data-name="Status Badge [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip pl-1 pr-2 py-2 relative">
        <Dot />
        <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-left text-nowrap">
          <p className="block leading-[16px] whitespace-pre">Активная</p>
        </div>
      </div>
      <div className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-2xl" />
    </div>
  );
}

function Frame114() {
  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
      <Frame113 />
      <StatusBadge10 />
    </div>
  );
}

function Frame105() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[24px] relative rounded-[32px] shrink-0 w-[412px]">
      <div className="absolute border border-[#e16349] border-solid inset-[-1px] pointer-events-none rounded-[33px]" />
      <Frame112 />
      <Frame114 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left text-nowrap">
      <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] relative shrink-0 text-[#000000] text-[20px]">
        <p className="block leading-[28px] text-nowrap whitespace-pre">
          Frontend разработчик
        </p>
      </div>
      <div
        className="css-uh5y02 font-['Inter:Regular',_sans-serif] font-normal min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[#525866] text-[16px] tracking-[-0.176px]"
        style={{ width: "min-content" }}
      >
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[24px] overflow-inherit">
          Разработка
        </p>
      </div>
    </div>
  );
}

function Avatar12() {
  return (
    <div
      className="bg-[#cac2ff] relative rounded-[1165.5px] shrink-0 size-7"
      data-name="Avatar [1.0]"
    >
      <div className="absolute inset-0" data-name="BG">
        <div
          className="absolute inset-0"
          style={
            { "--fill-0": "rgba(202, 194, 255, 1)" } as React.CSSProperties
          }
        />
      </div>
      <div className="absolute bottom-[15.476%] css-ip4j4q font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-0 not-italic right-0 text-[#2b1664] text-[14px] text-center top-[16.667%]">
        <p className="block leading-[18.667px]">M</p>
      </div>
    </div>
  );
}

function Frame115() {
  return (
    <div className="box-border content-stretch flex flex-row gap-1.5 items-start justify-start p-0 relative shrink-0 w-full">
      <Frame41 />
      <Avatar12 />
    </div>
  );
}

function FluentPeople20Regular1() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="fluent:people-20-regular"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="fluent:people-20-regular">
          <path
            d={svgPaths.p53b5880}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame117() {
  return (
    <div className="bg-[#f6f8fa] box-border content-stretch flex flex-row items-center justify-start px-1.5 py-1 relative rounded-2xl shrink-0">
      <FluentPeople20Regular1 />
      <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-center tracking-[-0.176px] w-[33px]">
        <p className="adjustLetterSpacing block leading-[24px]">26</p>
      </div>
    </div>
  );
}

function Dot1() {
  return (
    <div className="relative shrink-0 size-4" data-name="Dot">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="Dot">
          <circle
            cx="8"
            cy="8"
            fill="var(--fill-0, #F27B2C)"
            id="Dot_2"
            r="3"
          />
        </g>
      </svg>
    </div>
  );
}

function StatusBadge11() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-2xl shrink-0"
      data-name="Status Badge [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip pl-1 pr-2 py-2 relative">
        <Dot1 />
        <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-left text-nowrap">
          <p className="block leading-[16px] whitespace-pre">Пауза</p>
        </div>
      </div>
      <div className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-2xl" />
    </div>
  );
}

function Frame118() {
  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
      <Frame117 />
      <StatusBadge11 />
    </div>
  );
}

function Frame102() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[24px] relative rounded-[32px] shrink-0 w-[412px]">
      <Frame115 />
      <Frame118 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
      <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left text-nowrap">
        <p className="block leading-[28px] whitespace-pre">
          Frontend разработчик
        </p>
      </div>
    </div>
  );
}

function Avatar13() {
  return (
    <div
      className="bg-[#cac2ff] relative rounded-[1165.5px] shrink-0 size-7"
      data-name="Avatar [1.0]"
    >
      <div className="absolute inset-0" data-name="BG">
        <div
          className="absolute inset-0"
          style={
            { "--fill-0": "rgba(202, 194, 255, 1)" } as React.CSSProperties
          }
        />
      </div>
      <div className="absolute bottom-[15.476%] css-ip4j4q font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-0 not-italic right-0 text-[#2b1664] text-[14px] text-center top-[16.667%]">
        <p className="block leading-[18.667px]">M</p>
      </div>
    </div>
  );
}

function Frame119() {
  return (
    <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0 w-full">
      <Frame42 />
      <Avatar13 />
    </div>
  );
}

function FluentPeople20Regular2() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="fluent:people-20-regular"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="fluent:people-20-regular">
          <path
            d={svgPaths.p53b5880}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame120() {
  return (
    <div className="bg-[#f6f8fa] box-border content-stretch flex flex-row items-center justify-start px-1.5 py-1 relative rounded-2xl shrink-0">
      <FluentPeople20Regular2 />
      <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-center tracking-[-0.176px] w-[33px]">
        <p className="adjustLetterSpacing block leading-[24px]">26</p>
      </div>
    </div>
  );
}

function Dot2() {
  return (
    <div className="relative shrink-0 size-4" data-name="Dot">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="Dot">
          <circle
            cx="8"
            cy="8"
            fill="var(--fill-0, #38C793)"
            id="Dot_2"
            r="3"
          />
        </g>
      </svg>
    </div>
  );
}

function StatusBadge12() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-2xl shrink-0"
      data-name="Status Badge [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip pl-1 pr-2 py-2 relative">
        <Dot2 />
        <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-left text-nowrap">
          <p className="block leading-[16px] whitespace-pre">Активная</p>
        </div>
      </div>
      <div className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-2xl" />
    </div>
  );
}

function Frame121() {
  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
      <Frame120 />
      <StatusBadge12 />
    </div>
  );
}

function Frame107() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[24px] relative rounded-[32px] shrink-0 w-[412px]">
      <Frame119 />
      <Frame121 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left text-nowrap">
      <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] relative shrink-0 text-[#000000] text-[20px]">
        <p className="block leading-[28px] text-nowrap whitespace-pre">
          Frontend разработчик
        </p>
      </div>
      <div
        className="css-uh5y02 font-['Inter:Regular',_sans-serif] font-normal min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[#525866] text-[16px] tracking-[-0.176px]"
        style={{ width: "min-content" }}
      >
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[24px] overflow-inherit">
          Разработка
        </p>
      </div>
    </div>
  );
}

function Avatar14() {
  return (
    <div
      className="bg-[#cac2ff] relative rounded-[1165.5px] shrink-0 size-7"
      data-name="Avatar [1.0]"
    >
      <div className="absolute inset-0" data-name="BG">
        <div
          className="absolute inset-0"
          style={
            { "--fill-0": "rgba(202, 194, 255, 1)" } as React.CSSProperties
          }
        />
      </div>
      <div className="absolute bottom-[15.476%] css-ip4j4q font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-0 not-italic right-0 text-[#2b1664] text-[14px] text-center top-[16.667%]">
        <p className="block leading-[18.667px]">M</p>
      </div>
    </div>
  );
}

function Frame122() {
  return (
    <div className="box-border content-stretch flex flex-row gap-1.5 items-start justify-start p-0 relative shrink-0 w-full">
      <Frame43 />
      <Avatar14 />
    </div>
  );
}

function FluentPeople20Regular3() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="fluent:people-20-regular"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="fluent:people-20-regular">
          <path
            d={svgPaths.p53b5880}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame123() {
  return (
    <div className="bg-[#f6f8fa] box-border content-stretch flex flex-row items-center justify-start px-1.5 py-1 relative rounded-2xl shrink-0">
      <FluentPeople20Regular3 />
      <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-center tracking-[-0.176px] w-[33px]">
        <p className="adjustLetterSpacing block leading-[24px]">26</p>
      </div>
    </div>
  );
}

function Dot3() {
  return (
    <div className="relative shrink-0 size-4" data-name="Dot">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="Dot">
          <circle
            cx="8"
            cy="8"
            fill="var(--fill-0, #DF1C41)"
            id="Dot_2"
            r="3"
          />
        </g>
      </svg>
    </div>
  );
}

function StatusBadge13() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-2xl shrink-0"
      data-name="Status Badge [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip pl-1 pr-2 py-2 relative">
        <Dot3 />
        <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-left text-nowrap">
          <p className="block leading-[16px] whitespace-pre">Архив</p>
        </div>
      </div>
      <div className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-2xl" />
    </div>
  );
}

function Frame124() {
  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
      <Frame123 />
      <StatusBadge13 />
    </div>
  );
}

function Frame106() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[24px] relative rounded-[32px] shrink-0 w-[412px]">
      <Frame122 />
      <Frame124 />
    </div>
  );
}

function Frame116() {
  return (
    <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0">
      <Frame105 />
      <Frame102 />
      <Frame107 />
      <Frame106 />
      <Frame107 />
    </div>
  );
}

function Frame82() {
  return (
    <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-[460px]">
      <Frame83 />
      <Frame116 />
    </div>
  );
}

function Text3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-rpndqk font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
          Создать интервью
        </p>
      </div>
    </div>
  );
}

function Buttons14() {
  return (
    <div
      className="bg-[#e16349] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0"
      data-name="Buttons [1.0]"
    >
      <Text3 />
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 size-5" data-name="link">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="link">
          <path
            d={svgPaths.p18924d00}
            fill="var(--fill-0, #E16349)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
          Ссылка на интервью
        </p>
      </div>
    </div>
  );
}

function Buttons15() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0"
      data-name="Buttons [1.0]"
    >
      <Link />
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
          Редактировать
        </p>
      </div>
    </div>
  );
}

function Buttons16() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0"
      data-name="Buttons [1.0]"
    >
      <Text5 />
    </div>
  );
}

function ChartLegendDots10() {
  return (
    <div
      className="relative shrink-0 size-5"
      data-name="Chart Legend Dots [1.0]"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g clipPath="url(#clip0_1_30450)" id="Chart Legend Dots [1.0]">
          <g filter="url(#filter0_d_1_30450)" id="Ellipse">
            <circle cx="10" cy="10" fill="var(--fill-0, #38C793)" r="6" />
          </g>
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="20"
            id="filter0_d_1_30450"
            width="20"
            x="0"
            y="2"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.105882 0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0.04 0"
            />
            <feBlend
              in2="BackgroundImageFix"
              mode="normal"
              result="effect1_dropShadow_1_30450"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_1_30450"
              mode="normal"
              result="shape"
            />
          </filter>
          <clipPath id="clip0_1_30450">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
          Активная
        </p>
      </div>
    </div>
  );
}

function ArrowDownSLine1() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-down-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-down-s-line">
          <path
            d={svgPaths.p2c6f4a00}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Buttons17() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0"
      data-name="Buttons [1.0]"
    >
      <ChartLegendDots10 />
      <Text6 />
      <ArrowDownSLine1 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-row gap-2 grow items-center justify-end min-h-px min-w-px p-0 relative shrink-0">
      <Buttons14 />
      <Buttons15 />
      <Buttons16 />
      <Buttons17 />
    </div>
  );
}

function Frame85() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[220px] items-center justify-start p-0 relative shrink-0 w-full">
      <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-center text-nowrap">
        <p className="block leading-[40px] whitespace-pre">
          Frontend Разработчик
        </p>
      </div>
      <Frame8 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px]">
      <div className="css-bbeeyw relative shrink-0 text-[#525866]">
        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
          Созданно
        </p>
      </div>
      <div className="css-8vheua relative shrink-0 text-[#000000]">
        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
          17.07.2025
        </p>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
      <div className="css-bbeeyw relative shrink-0 text-[#525866]">
        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
          Топик
        </p>
      </div>
      <div className="css-8vheua relative shrink-0 text-[#000000]">
        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
          Разработка
        </p>
      </div>
    </div>
  );
}

function Frame56() {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[181px]">
      <Frame52 />
      <Frame51 />
    </div>
  );
}

function Frame53() {
  return (
    <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
      <div className="css-bbeeyw relative shrink-0 text-[#525866]">
        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
          Минимальный балл
        </p>
      </div>
      <div className="css-8vheua relative shrink-0 text-[#000000]">
        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
          5.0
        </p>
      </div>
    </div>
  );
}

function Frame54() {
  return (
    <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
      <div className="css-bbeeyw relative shrink-0 text-[#525866]">
        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
          Средний балл
        </p>
      </div>
      <div className="css-8vheua relative shrink-0 text-[#000000]">
        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
          6.5
        </p>
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[188px]">
      <Frame53 />
      <Frame54 />
    </div>
  );
}

function Frame57() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[68px] items-center justify-start p-0 relative shrink-0">
      <Frame56 />
      <Frame55 />
    </div>
  );
}

function AccountCircleLine() {
  return (
    <div className="relative shrink-0 size-5" data-name="account-circle-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="account-circle-line">
          <path
            d={svgPaths.p37b3e300}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Title() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0"
      data-name="Title"
    >
      <div className="css-2x1u1o font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-center text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Не выбран
        </p>
      </div>
    </div>
  );
}

function ArrowDownSLine2() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-down-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-down-s-line">
          <path
            d={svgPaths.p2c6f4a00}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Arrow() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-start justify-start overflow-clip p-0 relative rounded-3xl shrink-0"
      data-name="Arrow"
    >
      <ArrowDownSLine2 />
    </div>
  );
}

function TabMenuHorizontalItems10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-center justify-center p-0 relative shrink-0"
      data-name="Tab Menu Horizontal Items [1.0]"
    >
      <AccountCircleLine />
      <Title />
      <Arrow />
    </div>
  );
}

function Frame48() {
  return (
    <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0">
      <div className="css-8vheua font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
          Испольнитель:
        </p>
      </div>
      <TabMenuHorizontalItems10 />
    </div>
  );
}

function Frame101() {
  return (
    <div className="box-border content-stretch flex flex-row items-start justify-between p-0 relative shrink-0 w-full">
      <Frame57 />
      <Frame48 />
    </div>
  );
}

function Frame59() {
  return (
    <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
          <Frame101 />
        </div>
      </div>
    </div>
  );
}

function Frame86() {
  return (
    <div className="bg-[#f5f6f1] relative rounded-[44px] shrink-0 w-full">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
          <Frame85 />
          <Frame59 />
        </div>
      </div>
    </div>
  );
}

function SwitchToggleItems12() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1.5 items-center justify-center p-[12px] relative rounded-[20px] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)] shrink-0"
      data-name="Switch Toggle Items [1.0]"
    >
      <div className="css-cf07vu font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Кандидаты
        </p>
      </div>
    </div>
  );
}

function SwitchToggleItems13() {
  return (
    <div
      className="bg-[#f5f6f1] box-border content-stretch flex flex-row gap-1.5 items-center justify-center overflow-clip p-[12px] relative rounded-[20px] shrink-0"
      data-name="Switch Toggle Items [1.0]"
    >
      <div className="css-z8d4os font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#868c98] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Текст вакансии
        </p>
      </div>
    </div>
  );
}

function SwitchToggleItems14() {
  return (
    <div
      className="bg-[#f5f6f1] box-border content-stretch flex flex-row gap-1.5 items-center justify-center overflow-clip p-[12px] relative rounded-[20px] shrink-0"
      data-name="Switch Toggle Items [1.0]"
    >
      <div className="css-z8d4os font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#868c98] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Вопросы собеседования
        </p>
      </div>
    </div>
  );
}

function ViewToggle11() {
  return (
    <div
      className="bg-[#f5f6f1] relative rounded-3xl shrink-0"
      data-name="View Toggle [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start overflow-clip p-[4px] relative">
        <SwitchToggleItems12 />
        <SwitchToggleItems13 />
        <SwitchToggleItems14 />
      </div>
      <div className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl" />
    </div>
  );
}

function SwitchToggle11() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1.5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Switch Toggle [1.0]"
    >
      <ViewToggle11 />
    </div>
  );
}

function Search2Line1() {
  return (
    <div className="relative shrink-0 size-5" data-name="search-2-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="search-2-line">
          <path
            d={svgPaths.p34d12c00}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function SearchInput() {
  return (
    <div
      className="bg-[#f5f6f1] relative rounded-[20px] shrink-0 w-[280px]"
      data-name="Search Input"
    >
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start overflow-clip px-2.5 py-3.5 relative w-[280px]">
        <Search2Line1 />
        <div className="basis-0 css-z8d4os font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#868c98] text-[14px] text-left tracking-[-0.084px]">
          <p className="block leading-[20px]">Поиск...</p>
        </div>
      </div>
      <div className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Text7() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-cf07vu font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-center text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Скачать pdf
        </p>
      </div>
    </div>
  );
}

function FilePdf2Line() {
  return (
    <div className="relative shrink-0 size-5" data-name="file-pdf-2-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="file-pdf-2-line">
          <path
            d={svgPaths.p31e0cc80}
            fill="var(--fill-0, #E16349)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Buttons18() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-[20px] shrink-0"
      data-name="Buttons [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip px-2.5 py-3.5 relative">
        <Text7 />
        <FilePdf2Line />
      </div>
      <div className="absolute border border-[#e16349] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Text8() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-dh74q0 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Отправить письмо
        </p>
      </div>
    </div>
  );
}

function Buttons19() {
  return (
    <div
      className="bg-[#e16349] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip px-2.5 py-3.5 relative rounded-[20px] shrink-0"
      data-name="Buttons [1.0]"
    >
      <Text8 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
      <Buttons18 />
      <Buttons19 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="box-border content-stretch flex flex-row gap-10 items-start justify-end p-0 relative shrink-0">
      <Frame69 />
    </div>
  );
}

function Frame87() {
  return (
    <div className="box-border content-stretch flex flex-row items-start justify-between p-0 relative shrink-0 w-full">
      <SearchInput />
      <Frame70 />
    </div>
  );
}

function SwitchToggleItems15() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-md shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)] shrink-0"
      data-name="Switch Toggle Items [1.0]"
    >
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-0.5 py-1 relative w-full">
          <div className="css-sb4kmc font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
            <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
              Все
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwitchToggleItems16() {
  return (
    <div
      className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative rounded-md shrink-0"
      data-name="Switch Toggle Items [1.0]"
    >
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-0.5 py-1 relative w-full">
          <div className="css-z8d4os font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#868c98] text-[14px] text-left text-nowrap tracking-[-0.084px]">
            <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
              Успешные
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwitchToggleItems17() {
  return (
    <div
      className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative rounded-md shrink-0"
      data-name="Switch Toggle Items [1.0]"
    >
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-0.5 py-1 relative w-full">
          <div className="css-z8d4os font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#868c98] text-[14px] text-left text-nowrap tracking-[-0.084px]">
            <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
              Провал
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwitchToggleItems18() {
  return (
    <div
      className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative rounded-md shrink-0"
      data-name="Switch Toggle Items [1.0]"
    >
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-0.5 py-1 relative w-full">
          <div className="css-z8d4os font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#868c98] text-[14px] text-left text-nowrap tracking-[-0.084px]">
            <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
              Архив
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewToggle12() {
  return (
    <div
      className="bg-[#f6f8fa] relative rounded-[10px] shrink-0 w-full"
      data-name="View Toggle [1.0]"
    >
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-[4px] relative w-full">
          <SwitchToggleItems15 />
          <SwitchToggleItems16 />
          <SwitchToggleItems17 />
          <SwitchToggleItems18 />
        </div>
      </div>
    </div>
  );
}

function SwitchToggle12() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1.5 items-start justify-start p-0 relative shrink-0 w-[400px]"
      data-name="Switch Toggle [1.0]"
    >
      <ViewToggle12 />
    </div>
  );
}

function Filter3Line() {
  return (
    <div className="relative shrink-0 size-5" data-name="filter-3-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="filter-3-line">
          <path
            d={svgPaths.p3f0b980}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-2x1u1o font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-center text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Фильтр
        </p>
      </div>
    </div>
  );
}

function Buttons20() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0"
      data-name="Buttons [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip pl-2.5 pr-2 py-2 relative">
        <Filter3Line />
        <Text9 />
      </div>
      <div className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-lg shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)]" />
    </div>
  );
}

function SortDesc() {
  return (
    <div className="relative shrink-0 size-5" data-name="sort-desc">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="sort-desc">
          <path
            d={svgPaths.p2c79f680}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ArrowDownSLine3() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-down-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-down-s-line">
          <path
            d={svgPaths.p2c6f4a00}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function DefaultDropdown1() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Default Dropdown"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-2.5 pr-2 py-2 relative w-full">
          <SortDesc />
          <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
            <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
              Соритровать
            </p>
          </div>
          <ArrowDownSLine3 />
        </div>
      </div>
      <div className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-lg shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]" />
    </div>
  );
}

function Dropdowns11() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Dropdowns [1.0]"
    >
      <DefaultDropdown1 />
    </div>
  );
}

function Right() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-end min-h-px min-w-px p-0 relative shrink-0"
      data-name="Right"
    >
      <Buttons20 />
      <Dropdowns11 />
    </div>
  );
}

function Filter() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Filter"
    >
      <SwitchToggle12 />
      <Right />
    </div>
  );
}

function Checkbox10() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox [1.0]">
      <div
        className="absolute bg-[#e2e4e9] inset-[10%] rounded"
        data-name="Rectangle"
      />
      <div
        className="absolute bg-[#ffffff] inset-[17.5%] rounded-[2.6px] shadow-[0px_2px_2px_0px_rgba(27,28,29,0.12)]"
        data-name="Rectangle"
      />
    </div>
  );
}

function Label() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-0.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Label"
    >
      <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Имя
        </p>
      </div>
    </div>
  );
}

function TableHeaderCell10() {
  return (
    <div
      className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative shrink-0"
      data-name="Table Header Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative w-full">
          <Checkbox10 />
          <Label />
        </div>
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-0.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Label"
    >
      <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Оценка
        </p>
      </div>
    </div>
  );
}

function TableHeaderCell11() {
  return (
    <div
      className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative shrink-0"
      data-name="Table Header Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative w-full">
          <Label1 />
        </div>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-0.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Label"
    >
      <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Статус
        </p>
      </div>
    </div>
  );
}

function TableHeaderCell12() {
  return (
    <div
      className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative shrink-0"
      data-name="Table Header Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative w-full">
          <Label2 />
        </div>
      </div>
    </div>
  );
}

function SortingIcons10() {
  return (
    <div className="relative shrink-0 size-5" data-name="Sorting Icons [1.0]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="expand-up-down-fill">
          <path
            d={svgPaths.p192db800}
            fill="var(--fill-0, #868C98)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Label3() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-0.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Label"
    >
      <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Завершено
        </p>
      </div>
      <SortingIcons10 />
    </div>
  );
}

function TableHeaderCell13() {
  return (
    <div
      className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative shrink-0"
      data-name="Table Header Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative w-full">
          <Label3 />
        </div>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div
      className="bg-[#f6f8fa] box-border content-stretch flex flex-row h-9 items-start justify-start overflow-clip p-0 relative rounded-lg shrink-0 w-full"
      data-name="Table Header"
    >
      <TableHeaderCell10 />
      <TableHeaderCell11 />
      <TableHeaderCell12 />
      <TableHeaderCell13 />
    </div>
  );
}

function Checkbox14() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox [1.0]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="Checkbox [1.0]">
          <g id="Rectangle">
            <mask fill="white" id="path-1-inside-1_1_30354">
              <path d={svgPaths.p33c74a80} />
            </mask>
            <g filter="url(#filter0_i_1_30354)">
              <path d={svgPaths.p33c74a80} fill="var(--fill-0, #375DFB)" />
            </g>
            <path
              d={svgPaths.p51b4880}
              fill="var(--stroke-0, #253EA7)"
              mask="url(#path-1-inside-1_1_30354)"
            />
          </g>
          <path
            clipRule="evenodd"
            d={svgPaths.p2229a570}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Check"
          />
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="18"
            id="filter0_i_1_30354"
            width="16"
            x="2"
            y="2"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0864 0 0 0 0 0.14784 0 0 0 0 0.3936 0 0 0 0.32 0"
            />
            <feBlend
              in2="shape"
              mode="normal"
              result="effect1_innerShadow_1_30354"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left text-nowrap"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Medium',_sans-serif] font-medium overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          James Brown
        </p>
      </div>
      <div className="css-u1gx4j font-['Inter:Regular',_sans-serif] font-normal overflow-ellipsis overflow-hidden relative shrink-0 text-[#525866] text-[12px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[16px] overflow-inherit">
          james@alignui.com
        </p>
      </div>
    </div>
  );
}

function TableRowCell10() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Checkbox14 />
          <Text10 />
        </div>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow h-10 items-start justify-center min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          6.5
        </p>
      </div>
    </div>
  );
}

function TableRowCell11() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Text11 />
        </div>
      </div>
    </div>
  );
}

function Title1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 w-[85px]"
      data-name="Title"
    >
      <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-center text-nowrap">
        <p className="block leading-[16px] whitespace-pre">Скрининг</p>
      </div>
    </div>
  );
}

function ArrowDownSLine4() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-down-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-down-s-line">
          <path
            d={svgPaths.p2c6f4a00}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Arrow1() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-start justify-start overflow-clip p-0 relative rounded-3xl shrink-0"
      data-name="Arrow"
    >
      <ArrowDownSLine4 />
    </div>
  );
}

function TabMenuVerticalItems10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Tab Menu Vertical Items [1.0]"
    >
      <div className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-lg" />
      <Title1 />
      <Arrow1 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[12px] relative w-full">
          <TabMenuVerticalItems10 />
        </div>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow h-10 items-start justify-center min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          17.07.2025
        </p>
      </div>
    </div>
  );
}

function TableRowCell12() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Text12 />
        </div>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-start overflow-clip p-0 relative rounded-xl shrink-0 w-full"
      data-name="Row"
    >
      <TableRowCell10 />
      <TableRowCell11 />
      <Frame68 />
      <TableRowCell12 />
    </div>
  );
}

function ContentDivider10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-0 py-[1.5px] relative shrink-0 w-full"
      data-name="Content Divider [1.0]"
    >
      <div
        className="basis-0 bg-[#e2e4e9] grow h-px min-h-px min-w-px shrink-0"
        data-name="Line"
      />
    </div>
  );
}

function Checkbox17() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox [1.0]">
      <div
        className="absolute bg-[#e2e4e9] inset-[10%] rounded"
        data-name="Rectangle"
      />
      <div
        className="absolute bg-[#ffffff] inset-[17.5%] rounded-[2.6px] shadow-[0px_2px_2px_0px_rgba(27,28,29,0.12)]"
        data-name="Rectangle"
      />
    </div>
  );
}

function Text13() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow h-10 items-start justify-center leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left text-nowrap"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Medium',_sans-serif] font-medium overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          Sophia Williams
        </p>
      </div>
      <div className="css-u1gx4j font-['Inter:Regular',_sans-serif] font-normal overflow-ellipsis overflow-hidden relative shrink-0 text-[#525866] text-[12px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[16px] overflow-inherit">
          sophia@alignui.com
        </p>
      </div>
    </div>
  );
}

function TableRowCell13() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Checkbox17 />
          <Text13 />
        </div>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          7.5
        </p>
      </div>
    </div>
  );
}

function TableRowCell14() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Text14 />
        </div>
      </div>
    </div>
  );
}

function Title2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 w-[85px]"
      data-name="Title"
    >
      <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-center text-nowrap">
        <p className="block leading-[16px] whitespace-pre">Скрининг</p>
      </div>
    </div>
  );
}

function ArrowDownSLine5() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-down-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-down-s-line">
          <path
            d={svgPaths.p2c6f4a00}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Arrow2() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-start justify-start overflow-clip p-0 relative rounded-3xl shrink-0"
      data-name="Arrow"
    >
      <ArrowDownSLine5 />
    </div>
  );
}

function TabMenuVerticalItems11() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Tab Menu Vertical Items [1.0]"
    >
      <div className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-lg" />
      <Title2 />
      <Arrow2 />
    </div>
  );
}

function Frame71() {
  return (
    <div className="basis-0 grow h-16 min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 h-16 items-start justify-center p-[12px] relative w-full">
          <TabMenuVerticalItems11 />
        </div>
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          17.07.2025
        </p>
      </div>
    </div>
  );
}

function TableRowCell15() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Text15 />
        </div>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-start justify-start overflow-clip p-0 relative rounded-xl shrink-0 w-full"
      data-name="Row"
    >
      <TableRowCell13 />
      <TableRowCell14 />
      <Frame71 />
      <TableRowCell15 />
    </div>
  );
}

function Checkbox20() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox [1.0]">
      <div
        className="absolute bg-[#e2e4e9] inset-[10%] rounded"
        data-name="Rectangle"
      />
      <div
        className="absolute bg-[#ffffff] inset-[17.5%] rounded-[2.6px] shadow-[0px_2px_2px_0px_rgba(27,28,29,0.12)]"
        data-name="Rectangle"
      />
    </div>
  );
}

function Text16() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow h-10 items-start justify-center leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left text-nowrap"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Medium',_sans-serif] font-medium overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          Arthur Taylor
        </p>
      </div>
      <div className="css-u1gx4j font-['Inter:Regular',_sans-serif] font-normal overflow-ellipsis overflow-hidden relative shrink-0 text-[#525866] text-[12px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[16px] overflow-inherit">
          arthur@alignui.com
        </p>
      </div>
    </div>
  );
}

function TableRowCell16() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Checkbox20 />
          <Text16 />
        </div>
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          8.5
        </p>
      </div>
    </div>
  );
}

function TableRowCell17() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Text17 />
        </div>
      </div>
    </div>
  );
}

function Title3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 w-[85px]"
      data-name="Title"
    >
      <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-center text-nowrap">
        <p className="block leading-[16px] whitespace-pre">Скрининг</p>
      </div>
    </div>
  );
}

function ArrowDownSLine6() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-down-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-down-s-line">
          <path
            d={svgPaths.p2c6f4a00}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Arrow3() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-start justify-start overflow-clip p-0 relative rounded-3xl shrink-0"
      data-name="Arrow"
    >
      <ArrowDownSLine6 />
    </div>
  );
}

function TabMenuVerticalItems12() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Tab Menu Vertical Items [1.0]"
    >
      <div className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-lg" />
      <Title3 />
      <Arrow3 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="basis-0 grow h-16 min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 h-16 items-start justify-center p-[12px] relative w-full">
          <TabMenuVerticalItems12 />
        </div>
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          17.07.2025
        </p>
      </div>
    </div>
  );
}

function TableRowCell18() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Text18 />
        </div>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-start justify-start overflow-clip p-0 relative rounded-xl shrink-0 w-full"
      data-name="Row"
    >
      <TableRowCell16 />
      <TableRowCell17 />
      <Frame73 />
      <TableRowCell18 />
    </div>
  );
}

function Checkbox23() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox [1.0]">
      <div
        className="absolute bg-[#e2e4e9] inset-[10%] rounded"
        data-name="Rectangle"
      />
      <div
        className="absolute bg-[#ffffff] inset-[17.5%] rounded-[2.6px] shadow-[0px_2px_2px_0px_rgba(27,28,29,0.12)]"
        data-name="Rectangle"
      />
    </div>
  );
}

function Text19() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow h-10 items-start justify-center leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left text-nowrap"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Medium',_sans-serif] font-medium overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          Emma Wright
        </p>
      </div>
      <div className="css-u1gx4j font-['Inter:Regular',_sans-serif] font-normal overflow-ellipsis overflow-hidden relative shrink-0 text-[#525866] text-[12px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[16px] overflow-inherit">
          emma@alignui.com
        </p>
      </div>
    </div>
  );
}

function TableRowCell19() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Checkbox23 />
          <Text19 />
        </div>
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          4.0
        </p>
      </div>
    </div>
  );
}

function TableRowCell20() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Text20 />
        </div>
      </div>
    </div>
  );
}

function Title4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 w-[85px]"
      data-name="Title"
    >
      <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-center text-nowrap">
        <p className="block leading-[16px] whitespace-pre">Скрининг</p>
      </div>
    </div>
  );
}

function ArrowDownSLine7() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-down-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-down-s-line">
          <path
            d={svgPaths.p2c6f4a00}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Arrow4() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-start justify-start overflow-clip p-0 relative rounded-3xl shrink-0"
      data-name="Arrow"
    >
      <ArrowDownSLine7 />
    </div>
  );
}

function TabMenuVerticalItems13() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Tab Menu Vertical Items [1.0]"
    >
      <div className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-lg" />
      <Title4 />
      <Arrow4 />
    </div>
  );
}

function Frame74() {
  return (
    <div className="basis-0 grow h-16 min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 h-16 items-start justify-center p-[12px] relative w-full">
          <TabMenuVerticalItems13 />
        </div>
      </div>
    </div>
  );
}

function Text21() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
        <p className="[text-overflow:inherit] [text-wrap-mode:inherit]\' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
          17.07.2025
        </p>
      </div>
    </div>
  );
}

function TableRowCell21() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0"
      data-name="Table Row Cell [1.0]"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
          <Text21 />
        </div>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-start justify-start overflow-clip p-0 relative rounded-xl shrink-0 w-full"
      data-name="Row"
    >
      <TableRowCell19 />
      <TableRowCell20 />
      <Frame74 />
      <TableRowCell21 />
    </div>
  );
}

function TableContent() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Table Content"
    >
      <Row />
      <ContentDivider10 />
      <Row1 />
      <ContentDivider10 />
      <Row2 />
      <ContentDivider10 />
      <Row3 />
    </div>
  );
}

function MembersTable() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full"
      data-name="Members Table"
    >
      <div className="flex flex-col items-end overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-end justify-start p-[24px] relative w-full">
          <Filter />
          <TableHeader />
          <TableContent />
        </div>
      </div>
    </div>
  );
}

function Frame88() {
  return (
    <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full">
      <Frame87 />
      <MembersTable />
    </div>
  );
}

function Frame89() {
  return (
    <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full">
      <SwitchToggle11 />
      <Frame88 />
    </div>
  );
}

function Frame72() {
  return (
    <div className="bg-[#f5f6f1] relative rounded-[44px] shrink-0 w-full">
      <div className="flex flex-col items-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[21px] items-center justify-start p-[24px] relative w-full">
          <Frame89 />
        </div>
      </div>
    </div>
  );
}

function Frame90() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-6 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
      <Frame86 />
      <Frame72 />
    </div>
  );
}

export default function V2() {
  return (
    <div className="bg-[#e9eae2] relative size-full" data-name="Вакансии v2">
      <div className="relative size-full">
        <div className="[flex-flow:wrap] box-border content-start flex gap-6 items-start justify-start p-[32px] relative size-full">
          <Frame11 />
          <Frame82 />
          <Frame90 />
        </div>
      </div>
    </div>
  );
}
