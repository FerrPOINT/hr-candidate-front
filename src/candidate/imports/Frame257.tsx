import svgPaths from "./svg-ragxbkl2lv";

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="css-oe5i85 flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#162137] text-[12px] text-center text-nowrap">
        <p className="block leading-[16px] whitespace-pre">Вопрос 1 из 10</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-end justify-start p-0 relative shrink-0"
      data-name="Container"
      style={{ marginRight: "-1.42109e-14px" }}
    >
      <Container />
    </div>
  );
}

function Separator() {
  return (
    <div className="bg-[#e2e4e9] h-px shrink-0 w-full" data-name="Separator" />
  );
}

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-4 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Separator />
    </div>
  );
}

function Margin() {
  return (
    <div
      className="basis-0 grow min-h-px min-w-px relative shrink-0"
      data-name="Margin"
      style={{ marginRight: "-1.42109e-14px" }}
    >
      <div className="flex flex-col justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-center pl-6 pr-0 py-0 relative w-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-6 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container1 />
      <Margin />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start min-w-[641.6px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="css-oez9t3 flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center tracking-[-0.27px] w-full">
        <p className="block leading-[24px]">
          Расскажите о вашем опыте работы и о проектах на последних двух местах
          работы.
        </p>
      </div>
    </div>
  );
}

function Done4De41F02Svg() {
  return (
    <div className="relative shrink-0 size-4" data-name="done-4de41f02.svg">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="done-4de41f02.svg">
          <path
            d={svgPaths.p6688500}
            id="Vector"
            stroke="var(--stroke-0, #2DB978)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
          />
        </g>
      </svg>
    </div>
  );
}

function Done4De41F02SvgFill() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[20.8px] items-center justify-center overflow-clip px-0 py-[2.4px] relative shrink-0 w-4"
      data-name="done-4de41f02.svg fill"
    >
      <Done4De41F02Svg />
    </div>
  );
}

function Done4De41F02Svg1() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px overflow-clip p-0 relative shrink-0 w-4"
      data-name="done-4de41f02.svg"
    >
      <Done4De41F02SvgFill />
    </div>
  );
}

function ImgMargin() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-full items-start justify-center pl-0 pr-1.5 py-0 relative shrink-0 w-[22px]"
      data-name="Img:margin"
    >
      <Done4De41F02Svg1 />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-full items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="css-8vheua flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] max-h-[20.8px] not-italic relative shrink-0 text-[#000000] text-[16px] text-center text-nowrap tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
          Сохранено
        </p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="box-border content-stretch flex flex-row h-5 items-start justify-start p-0 relative shrink-0 w-[108px]"
      data-name="Container"
    >
      <ImgMargin />
      <Container5 />
    </div>
  );
}

function Overlay() {
  return (
    <div
      className="bg-[#ffffff] h-[156px] max-w-[842px] relative rounded-3xl shrink-0 w-full"
      data-name="Overlay"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-3xl"
      />
      <div className="flex flex-col items-center max-w-inherit relative size-full">
        <div className="box-border content-stretch flex flex-col gap-8 h-[156px] items-center justify-start max-w-inherit px-8 py-10 relative w-full">
          <Container4 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

export default function Frame257() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative size-full">
      <Container3 />
      <Overlay />
    </div>
  );
}
