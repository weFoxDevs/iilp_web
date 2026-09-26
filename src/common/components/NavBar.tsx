import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSiteLayout } from "./SiteLayoutContext";

export default function NavBar() {
  const router = useRouter();
  const { navbar } = useSiteLayout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-detect whether image is square with padding (like logo.png) or tight horizontal
  const [isSquareLogo, setIsSquareLogo] = useState<boolean>(true);

  const othersGroups = navbar.dropdownGroups;
  const navLinks = navbar.navLinks;
  const allOthersItems = othersGroups.flatMap((g) => g.items || []);

  const logoUrl = navbar.logo.url || "/assets/logo.png";
  const logoHeight = navbar.logo.height || 56;
  const logoFit = navbar.logo.fit || "auto";
  const shouldZoom = logoFit === "zoom" || (logoFit === "auto" && isSquareLogo);

  const handleLogoLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      // If ratio is between 0.75 and 1.35, it is a square image with centered logo like logo.png
      setIsSquareLogo(ratio >= 0.75 && ratio <= 1.35);
    }
  };

  const [mobileOthersOpen, setMobileOthersOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.asPath]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOthersActive = allOthersItems.some((item) =>
    router.pathname.startsWith(item.href)
  );

  return (
    <div className="w-full bg-white drop-shadow-[0px_37px_40.5px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-[30px] py-[9px] relative z-40">
      <div className="w-full max-w-[1440px] h-[65px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href={navbar.logo.href || "/"}
          className="flex items-center shrink-0"
          aria-label={navbar.logo.alt || "IILP Home"}
        >
          {shouldZoom ? (
            <div
              className="relative shrink-0 overflow-hidden flex items-center justify-center"
              style={{
                width: `${Math.round(logoHeight * 2.27)}px`,
                height: `${logoHeight}px`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={navbar.logo.alt || "IILP Logo"}
                onLoad={handleLogoLoad}
                className="absolute h-[275%] w-[122%] max-w-none left-[-10%] top-[-86%] pointer-events-none select-none"
              />
            </div>
          ) : (
            <div
              className="relative shrink-0 flex items-center justify-start"
              style={{
                height: `${logoHeight}px`,
                minWidth: "120px",
                maxWidth: "240px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={navbar.logo.alt || "IILP Logo"}
                onLoad={handleLogoLoad}
                style={{ maxHeight: `${logoHeight}px` }}
                className="w-auto max-w-full object-contain pointer-events-none select-none"
              />
            </div>
          )}
        </Link>

        {/* Desktop Navigation & Action Buttons */}
        <div className="hidden lg:flex items-center gap-[32px] xl:gap-[40px]">
          {/* Links */}
          <nav className="flex items-center gap-[16px] text-[16px] font-sans">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href || (link.href !== "/" && router.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1 transition-colors ${
                    isActive
                      ? "text-primary-500 font-semibold"
                      : "text-[#0a0d12] hover:text-primary-500 font-normal"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Others Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-[8px] py-1 text-[16px] transition-colors focus:outline-none cursor-pointer ${
                  isOthersActive
                    ? "text-primary-500 font-semibold"
                    : "text-[#0a0d12] hover:text-primary-500 font-normal"
                }`}
                aria-expanded={dropdownOpen}
              >
                <span>Others</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180 text-primary-500" : ""
                  }`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dropdown 2-Column Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 lg:left-0 lg:right-auto top-full mt-2 w-[620px] bg-white rounded-2xl shadow-[0px_20px_45px_rgba(0,0,0,0.14)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-2 gap-4 p-5">
                    {othersGroups.map((group) => (
                      <div key={group.category} className="flex flex-col gap-2">
                        <div className="px-2 pb-1 border-b border-gray-100">
                          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#00698c]">
                            {group.category}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {group.items.map((item) => {
                            const isCurrent = router.pathname === item.href || (item.href !== "/" && router.pathname.startsWith(item.href));
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setDropdownOpen(false)}
                                className={`flex flex-col gap-0.5 px-3 py-2 rounded-xl transition-all group ${
                                  isCurrent
                                    ? "bg-[#e6f9ff] text-[#00698c]"
                                    : "hover:bg-[#f4faff] text-[#0a0d12] hover:text-[#00698c]"
                                }`}
                              >
                                <span className="font-semibold text-[14px] font-sans flex items-center justify-between">
                                  {item.name}
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#00bfff]"
                                  >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </span>
                                <span className="text-[12px] text-gray-500 group-hover:text-[#00506b]/80 line-clamp-1 font-sans">
                                  {item.description}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dropdown Footer Quick Links */}
                  <div className="bg-gray-50/80 border-t border-gray-100 px-6 py-3 flex items-center justify-between text-xs font-sans">
                    <span className="text-gray-500">Explore IILP programs &amp; initiatives</span>
                    <div className="flex items-center gap-4 font-semibold">
                      <Link
                        href="/contact"
                        onClick={() => setDropdownOpen(false)}
                        className="text-[#00698c] hover:text-[#00bfff] transition-colors flex items-center gap-1"
                      >
                        Contact Us
                        <span>→</span>
                      </Link>
                      <Link
                        href="/donate"
                        onClick={() => setDropdownOpen(false)}
                        className="text-[#00698c] hover:text-[#00bfff] transition-colors flex items-center gap-1"
                      >
                        Support &amp; Donate
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action Buttons */}
          {/* Action Buttons */}
          <div className="flex items-center gap-[8px] font-sans">
            {navbar.actionButtons.map((btn) => {
              if (btn.variant === "primary") {
                return (
                  <Link
                    key={btn.name + btn.href}
                    href={btn.href}
                    className="bg-[#00bfff] hover:bg-sky-400 rounded-full px-[16px] py-[10px] text-[14px] font-semibold text-white transition-colors drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)]"
                  >
                    {btn.name}
                  </Link>
                );
              }
              if (btn.variant === "outline") {
                return (
                  <Link
                    key={btn.name + btn.href}
                    href={btn.href}
                    className="bg-[#f9fafb] border border-[#e5e7eb] rounded-full px-[16px] py-[10px] text-[14px] font-semibold text-[#4a5565] hover:bg-white hover:text-gray-900 transition-colors drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)]"
                  >
                    {btn.name}
                  </Link>
                );
              }
              return (
                <Link
                  key={btn.name + btn.href}
                  href={btn.href}
                  className="text-[14px] font-semibold text-[#101828] hover:text-primary-500 px-[16px] py-[10px] transition-colors rounded-full"
                >
                  {btn.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 text-gray-700 hover:text-primary-500 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white rounded-2xl shadow-2xl border border-gray-100 mt-2 p-4 sm:p-5 flex flex-col gap-3 relative z-50 w-full max-h-[82vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1 font-sans text-base">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href || (link.href !== "/" && router.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-[#e6f9ff] text-[#00698c] font-bold"
                      : "text-gray-800 hover:bg-gray-50 hover:text-[#00698c]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile Others Accordion Toggle */}
            <div className="border-t border-gray-100 pt-2 mt-1">
              <button
                type="button"
                onClick={() => setMobileOthersOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px] cursor-pointer ${
                  isOthersActive || mobileOthersOpen
                    ? "bg-[#f4faff] text-[#00698c]"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
                aria-expanded={mobileOthersOpen}
              >
                <span className="flex items-center gap-2">
                  <span>Explore More &amp; Resources</span>
                  {isOthersActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bfff]"></span>
                  )}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 text-gray-500 ${
                    mobileOthersOpen ? "rotate-180 text-[#00698c]" : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Sub-groups */}
              {mobileOthersOpen && (
                <div className="flex flex-col gap-3 pl-2 pr-1 pt-2 pb-1 border-l-2 border-[#b0ebff] ml-3 mt-1">
                  {othersGroups.map((group) => (
                    <div key={group.category} className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-[#00698c] uppercase tracking-wider px-2 py-0.5">
                        {group.category}
                      </span>
                      {group.items.map((item) => {
                        const isCurrent = router.pathname === item.href || (item.href !== "/" && router.pathname.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex flex-col px-3 py-2 rounded-lg transition-colors min-h-[44px] justify-center ${
                              isCurrent
                                ? "bg-[#e6f9ff] text-[#00698c] font-semibold"
                                : "hover:bg-gray-50 text-gray-700 hover:text-[#00698c]"
                            }`}
                          >
                            <span className="text-xs font-semibold text-gray-900">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-gray-500 line-clamp-1">
                              {item.description}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
            {navbar.actionButtons.map((btn) => (
              <Link
                key={"mob-" + btn.name + btn.href}
                href={btn.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-center py-3 px-4 text-sm font-semibold rounded-full min-h-[44px] flex items-center justify-center transition-colors ${
                  btn.variant === "primary"
                    ? "text-white bg-[#00bfff] hover:bg-sky-400 shadow-xs"
                    : btn.variant === "outline"
                    ? "text-gray-700 bg-gray-50 hover:bg-white border border-gray-200"
                    : "text-gray-900 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {btn.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

