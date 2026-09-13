export default function InstitutionalValues() {
  const row1 = [
    {
      icon: '🎓',
      title: 'Academic Excellence',
      desc: 'Commitment to the highest standards of scholarship, research, and intellectual inquiry.',
    },
    {
      icon: '🔍',
      title: 'Integrity and Accountability',
      desc: 'Dedication to honesty, transparency, professionalism, and responsible institutional conduct.',
    },
    {
      icon: '⚖️',
      title: 'Justice and Human Dignity',
      desc: 'Respect for the inherent worth, rights, and dignity of all individuals.',
    },
  ];

  const row2 = [
    {
      icon: '🏅',
      title: 'Ethical Leadership',
      desc: 'Promotion of leadership grounded in responsibility, service, integrity, and ethical principles.',
    },
    {
      icon: '🌈',
      title: 'Inclusiveness and Diversity',
      desc: 'Recognition of diverse perspectives, experiences, and backgrounds as sources of intellectual strength.',
    },
    {
      icon: '🧠',
      title: 'Intellectual Independence',
      desc: 'Commitment to academic freedom and objective inquiry free from undue influence.',
    },
    {
      icon: '📊',
      title: 'Evidence-Based Research',
      desc: 'Support for rigorous, methodologically sound, and policy-relevant scholarship.',
    },
  ];

  const row3 = [
    {
      icon: '🗳️',
      title: 'Democratic Engagement',
      desc: 'Encouragement of constructive dialogue, civic participation, and respect for democratic principles.',
    },
    {
      icon: '🌐',
      title: 'International Cooperation',
      desc: 'Commitment to collaboration across borders in pursuit of shared knowledge and common solutions.',
    },
    {
      icon: '🤲',
      title: 'Social Responsibility',
      desc: 'Recognition of the responsibility of academic institutions to contribute positively to society and the public good.',
    },
  ];

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-4 md:px-8 lg:px-16 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-12 lg:gap-[80px]">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
            <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
              What We Stand For
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[1.25]">
            Institutional Values
          </h2>
        </div>

        {/* Cards Rows */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* Row 1 (3 columns on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {row1.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#b0ebff] p-6 flex flex-col gap-6 items-start hover:border-[#00bfff] hover:shadow-sm transition-all"
              >
                <div className="bg-[#e6f9ff] border border-[#b0ebff] w-16 h-16 flex items-center justify-center text-2xl shrink-0">
                  <span>{item.icon}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[#000080] font-serif font-bold text-xl lg:text-[24px] tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[#414651] text-sm lg:text-[16px] leading-[24px] font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 (4 columns on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {row2.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#b0ebff] p-6 flex flex-col gap-6 items-start hover:border-[#00bfff] hover:shadow-sm transition-all"
              >
                <div className="bg-[#e6f9ff] border border-[#b0ebff] w-16 h-16 flex items-center justify-center text-2xl shrink-0">
                  <span>{item.icon}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[#000080] font-serif font-bold text-xl lg:text-[24px] tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[#414651] text-sm lg:text-[16px] leading-[24px] font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3 (3 columns on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {row3.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#b0ebff] p-6 flex flex-col gap-6 items-start hover:border-[#00bfff] hover:shadow-sm transition-all"
              >
                <div className="bg-[#e6f9ff] border border-[#b0ebff] w-16 h-16 flex items-center justify-center text-2xl shrink-0">
                  <span>{item.icon}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[#000080] font-serif font-bold text-xl lg:text-[24px] tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[#414651] text-sm lg:text-[16px] leading-[24px] font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
