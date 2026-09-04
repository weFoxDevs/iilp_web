import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-transparent font-sans">
      {/* Top Contact Bar */}
      <div className="bg-secondary-900 text-white text-xs py-2 hidden md:block font-inter">
        <div className="container mx-auto flex justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +1 (800) 123-4567
            </span>
            <span className="flex items-center gap-2 border-l border-white/20 pl-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              info@demo.edu
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              123 University Lane, New City, California, USA
            </span>
            <span className="border-l border-white/20 pl-6">
              Empowering Futures Since 1890
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 md:px-6 pt-4 pb-2">
        <div className="bg-white rounded-[16px] shadow-[0px_37px_81px_0px_rgba(0,0,0,0.06)] flex h-[65px] items-center justify-between px-[30px] py-[9px]">
          <Link href="/" className="flex items-center">
            <Image src="/assets/logo.png" alt="IILP Logo" width={127} height={56} className="object-contain w-auto h-[56px]" priority />
          </Link>
          
          {/* Navigation & Action Buttons Wrapper */}
          <div className="hidden lg:flex items-center gap-10">
            {/* Links */}
            <nav className="flex items-center gap-4 text-[16px] font-normal text-gray-950 font-inter">
              <Link href="/about" className="hover:text-primary-500 transition-colors">About IILP</Link>
              <Link href="/governance" className="hover:text-primary-500 transition-colors">Governance</Link>
              <Link href="/academics" className="hover:text-primary-500 transition-colors">Academics</Link>
              <Link href="/fellowships" className="hover:text-primary-500 transition-colors">Fellowships</Link>
              <Link href="#" className="hover:text-primary-500 transition-colors flex items-center gap-1">
                Others 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </nav>
            
            {/* Buttons */}
            <div className="flex items-center gap-2 font-inter">
              <Link href="/donate" className="text-[14px] font-semibold text-gray-900 hover:text-primary-500 px-4 py-2.5 transition-colors rounded-full">
                Donate
              </Link>
              <Link href="/contact" className="text-[14px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 px-4 py-2.5 rounded-full transition-colors shadow-sm">
                Contact
              </Link>
              <Link href="/apply" className="inline-flex items-center justify-center rounded-full bg-primary-500 px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
