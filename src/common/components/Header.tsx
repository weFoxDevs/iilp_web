import NavBar from './NavBar';
import { useSiteLayout } from './SiteLayoutContext';

export function Header() {
  const { topBar } = useSiteLayout();

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-transparent font-sans">
      {/* Top Contact Bar */}
      {topBar.isVisible && (
        <div className="bg-[#000080] text-white text-[14px] h-[39.8px] hidden md:flex items-center justify-center overflow-clip px-6 lg:px-[30px] font-sans">
          <div className="max-w-[1440px] w-full flex items-center justify-between text-[#f8f4f1]">
            <div className="flex items-center">
              {topBar.phone && (
                <span className="flex items-center gap-2 pr-6 border-r border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {topBar.phone}
                </span>
              )}
              {topBar.email && (
                <span className="flex items-center gap-2 px-6 border-r border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  {topBar.email}
                </span>
              )}
              {topBar.address && (
                <span className="flex items-center gap-2 pl-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {topBar.address}
                </span>
              )}
            </div>
            {topBar.tagline && (
              <div>
                <span>{topBar.tagline}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main Navigation Bar */}
      <NavBar />
    </header>
  );
}
