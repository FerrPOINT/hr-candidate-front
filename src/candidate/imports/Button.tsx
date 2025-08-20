function Frame254() {
  return <div className="bg-[#df1c41] rounded shrink-0 size-5" />;
}

function Frame255() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-center overflow-clip p-[8px] relative rounded-[100px] shrink-0 size-12">
      <Frame254 />
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-[#df1c41] relative rounded-[60px] size-full" data-name="Button">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start pl-2 pr-8 py-2 relative size-full">
          <Frame255 />
          <div className="css-m0na0f flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-center text-nowrap tracking-[-0.27px]">
            <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Остановить запись</p>
          </div>
        </div>
      </div>
    </div>
  );
}
