import Link from 'next/link';
import Image from 'next/image';
import { CallToAction } from './CallToAction';
import { useSiteLayout } from './SiteLayoutContext';

interface FooterProps {
  withCta?: boolean;
}

export function Footer({ withCta = true }: FooterProps = {}) {
  const { footer } = useSiteLayout();

  // Helper for social icon
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'twitter':
      case 'x':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.47 1.47 0 0 0 1.47-1.46c0-.81-.66-1.47-1.47-1.47-.81 0-1.47.66-1.47 1.47 0 .8.66 1.46 1.47 1.46m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
    }
  };

  return (
    <>
      {withCta && <CallToAction />}
      <footer className="relative bg-[#000036] text-white pt-[95px] pb-[70px] overflow-hidden">
        {/* Background Watermark Image */}
        {footer.watermarkUrl && (
          <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none flex items-center justify-center overflow-hidden">
            <Image 
              src={footer.watermarkUrl} 
              alt="IILP Background Logo" 
              width={1440}
              height={627}
              className="w-full max-w-[1440px] h-auto object-contain"
              priority
            />
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1440px] relative z-10 flex flex-col gap-[80px] lg:gap-[100px]">
          
          {/* Top Section: Logo & Links */}
          <div className="flex flex-col lg:flex-row items-start gap-[48px] lg:gap-[80px] w-full">
            
            {/* Logo & Address Column */}
            <div className="flex flex-col gap-[32px] md:gap-[40px] shrink-0">
              <Link href="/" className="inline-block">
                <Image 
                  src={footer.logoUrl || "/assets/footer-logo.png"} 
                  alt="IILP Logo" 
                  width={358} 
                  height={156} 
                  className="w-[280px] md:w-[358px] h-auto object-contain"
                  priority
                />
              </Link>
              {footer.address && (
                <p className="font-satoshi font-normal text-[#f8f4f1] text-[14px] leading-[23.8px] w-full max-w-[202px]">
                  {footer.address}
                </p>
              )}
              
              {/* Social Icons */}
              {footer.socialLinks && footer.socialLinks.length > 0 && (
                <div className="flex items-center gap-[12px]">
                  {footer.socialLinks
                    .filter((item) => item.isActive !== false && item.url)
                    .map((item) => (
                      <Link 
                        key={item.platform + item.url}
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={item.platform}
                        className="w-[20px] h-[18px] flex items-center justify-center text-white/80 hover:text-white transition-colors"
                      >
                        {renderSocialIcon(item.platform)}
                      </Link>
                    ))}
                </div>
              )}
            </div>

            {/* Links Columns */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 w-full justify-between">
              {footer.columns.map((col, idx) => (
                <div key={col.title + idx} className="flex flex-col gap-[16px]">
                  <h3 className="font-satoshi font-medium text-[14px] leading-[23.8px] text-white">
                    {col.title}
                  </h3>
                  <ul className="flex flex-col gap-[8px]">
                    {col.links.map((link) => (
                      <li key={link.label + link.href}>
                        <Link 
                          href={link.href} 
                          className="font-satoshi font-normal text-[14px] leading-[23.8px] text-white/70 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
          </div>

          {/* Middle Section: Stay Informed (Newsletter) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
            <div className="flex flex-col gap-[4px] max-w-[440px]">
              <h3 className="font-merriweather font-semibold text-[18px] leading-[28px] text-white">
                {footer.newsletter?.title || "Stay Informed"}
              </h3>
              <p className="font-inter font-normal text-[14px] leading-[20px] text-[#bedbff]">
                {footer.newsletter?.description || "Subscribe to the IILP newsletter for research, events, and updates."}
              </p>
            </div>
            
            {/* Newsletter Input Capsule */}
            <form 
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center w-full max-w-[430px] h-[50px] rounded-full border border-[#00bfff] overflow-hidden pl-[20px] pr-[1px] bg-transparent"
            >
              <input 
                type="email" 
                placeholder={footer.newsletter?.placeholder || "YOUR EMAIL..."} 
                className="bg-transparent border-none text-[#fdfdfd] placeholder-[#fdfdfd]/60 font-inter text-[16px] focus:outline-none focus:ring-0 flex-1 min-w-0 pr-2" 
                required
              />
              <button 
                type="submit" 
                className="bg-[#00bfff] hover:bg-[#00a8e0] text-white font-inter font-semibold text-[16px] leading-[17.6px] uppercase h-[48px] px-[20px] rounded-full transition-colors shrink-0 flex items-center gap-[10px]"
              >
                <div className="w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00bfff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
                <span>{footer.newsletter?.buttonText || "SUBSCRIBE"}</span>
              </button>
            </form>
          </div>

          {/* Bottom Meta & Copyright Section */}
          <div className="flex flex-col w-full">
            {/* Row 1: Email, Established, Status */}
            <div className="border-t border-white/15 pt-[24px] pb-[24px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[12px] leading-[16px]">
              <div>
                <span className="font-inter font-medium text-white">Email: </span>
                <span className="font-inter font-normal text-[#bedbff]">{footer.meta?.email || "info@iilp.org"}</span>
              </div>
              <div>
                <span className="font-inter font-medium text-white">Established: </span>
                <span className="font-inter font-normal text-[#bedbff]">{footer.meta?.established || "1 January 2026"}</span>
              </div>
              <div>
                <span className="font-inter font-medium text-white">Status: </span>
                <span className="font-inter font-normal text-[#bedbff]">{footer.meta?.status || "Independent, Non-Profit Academic Institute"}</span>
              </div>
            </div>

            {/* Row 2: Copyright & Legal Links */}
            <div className="border-t border-white/10 pt-[16px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[12px] leading-[16px]">
              <p className="font-inter font-normal text-[#bedbff]">
                {footer.legal?.copyright || "© 2026 International Institute for Law and Politics (IILP). All rights reserved."}
              </p>
              {footer.legal?.links && footer.legal.links.length > 0 && (
                <div className="flex items-center gap-[16px]">
                  {footer.legal.links.map((item) => (
                    <Link 
                      key={item.label + item.href}
                      href={item.href} 
                      className="font-inter font-normal text-[#bedbff] hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

