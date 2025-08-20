import { readingText } from './constants';

export function ReadingTestCard() {
  return (
    <div className="bg-[#ffffff] relative rounded-br-[24px] rounded-tl-[24px] rounded-tr-[24px] max-w-[421px] w-full">
      <div
        aria-hidden="true"
        className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-br-[24px] rounded-tl-[24px] rounded-tr-[24px]"
      />
      <div className="flex flex-col items-center relative w-full">
        <div className="box-border content-stretch flex flex-col gap-16 items-center justify-start px-8 py-6 relative w-full">
          <div className="box-border content-stretch flex flex-col font-['Inter:Medium',_sans-serif] font-medium gap-4 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full">
            <div className="css-nbtvww flex flex-col justify-center relative shrink-0 text-[#e16349] text-[16px] tracking-[0.96px] uppercase w-full">
              <p className="block leading-[24px]">Прочитай предложение</p>
            </div>
            <div className="css-5cyu6a flex flex-col justify-center relative shrink-0 text-[#000000] text-[14px] tracking-[-0.084px] w-full">
              <p className="block leading-[20px]">"{readingText}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
