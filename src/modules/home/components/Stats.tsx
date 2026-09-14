export function Stats() {
  const stats = [
    { number: "6+", label: "Academic Departments", progress: "58%" },
    { number: "18+", label: "Leadership Positions", progress: "58%" },
    { number: "3+", label: "Fellowship Types", progress: "58%" },
    { number: "5+", label: "Partnership Tracks", progress: "58%" },
  ];

  return (
    <section className="w-full bg-white py-12 px-4 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12 w-full">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-[40px] items-start max-w-[243px] w-full">
            <div className="flex flex-col gap-[5px] items-start w-full">
              <div className="font-inter font-semibold text-4xl sm:text-5xl lg:text-[64px] leading-none text-[#00506b]">
                {stat.number}
              </div>
              <p className="font-inter font-normal text-base md:text-lg lg:text-[20px] leading-snug lg:leading-[30px] text-[#0a0d12]/70">
                {stat.label}
              </p>
            </div>

            <div className="w-full max-w-[243px] h-[2px] bg-[#8ae2ff] relative overflow-hidden">
              <div
                className="h-full bg-[#00506b]"
                style={{ width: stat.progress }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
