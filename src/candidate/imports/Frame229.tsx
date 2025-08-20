import svgPaths from "./svg-e0ulkuzu8b";

function QuestionLine() {
  return (
    <div className="relative shrink-0 size-5" data-name="question-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="question-line">
          <path
            d={svgPaths.p1c8c0100}
            fill="var(--fill-0, #E16349)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function LinkButtons10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0"
      data-name="Link Buttons [1.0]"
    >
      <QuestionLine />
      <div className="css-cf07vu font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-nowrap text-right tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Помощь
        </p>
      </div>
    </div>
  );
}

export default function Frame229() {
  return (
    <div className="backdrop-blur-[10px] backdrop-filter bg-[rgba(255,255,255,0.04)] relative size-full">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-center justify-between px-[120px] py-6 relative size-full">
          <div
            className="bg-center bg-cover bg-no-repeat h-14 shrink-0 w-[117px]"
            data-name="image 20"
            style={{ backgroundImage: `url('')` }}
          />
          <LinkButtons10 />
        </div>
      </div>
    </div>
  );
}
