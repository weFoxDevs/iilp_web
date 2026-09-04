export function Stats() {
  const stats = [
    { value: "6", suffix: "+", label: "Academic Departments" },
    { value: "18", suffix: "+", label: "Leadership Positions" },
    { value: "3", suffix: "+", label: "Fellowship Types" },
    { value: "5", suffix: "+", label: "Partnership Tracks" },
  ];

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center gap-1 flex-1 min-w-[150px]">
              <div className="text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-900 flex items-baseline font-inter">
                {stat.value}
                <span className="text-primary-900 ml-1">{stat.suffix}</span>
              </div>
              <div className="text-base lg:text-lg text-gray-950 text-center max-w-[150px] leading-tight font-inter">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
