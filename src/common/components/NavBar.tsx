import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

interface DropdownItem {
  name: string;
  href: string;
  description: string;
  badge?: string;
}

interface DropdownGroup {
  category: string;
  items: DropdownItem[];
}

const othersGroups: DropdownGroup[] = [
  {
    category: "Research & Academics",
    items: [
      {
        name: "Research & Publications",
        href: "/publications",
        description: "Repository of policy briefs, papers & reports",
      },
      {
        name: "Publication Details",
        href: "/publication-details",
        description: "In-depth research paper & publication sample",
      },
      {
        name: "Department Details",
        href: "/department-details",
        description: "Academic departments, courses & faculty",
      },
      {
        name: "Leadership Directory",
        href: "/leadership-directory",
        description: "Executive leadership & distinguished faculty profiles",
      },
    ],
  },
  {
    category: "Media & Partnerships",
    items: [
      {
        name: "News & Media Center",
        href: "/news-media",
        description: "Press releases, events & photo gallery",
      },
      {
        name: "News Article Details",
        href: "/news-details",
        description: "Student clubs & campus news details",
      },
      {
        name: "Partnership Framework",
        href: "/partnership-framework",
        description: "Collaborative engagement across five strategic tracks",
      },
      {
        name: "Global Fellowship Network",
        href: "/fellowships",
        description: "Junior, Research & Honorary fellows network",
      },
    ],
  },
];

// Flat list for checking active route
const allOthersItems = othersGroups.flatMap((g) => g.items);

export default function NavBar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const navLinks = [
    { name: "About IILP", href: "/about" },
    { name: "Governance", href: "/governance" },
    { name: "Academics", href: "/academics" },
    { name: "Fellowships", href: "/fellowships" },
  ];

  const isOthersActive = allOthersItems.some((item) =>
    router.pathname.startsWith(item.href)
  );

  return (
    <div className="w-full bg-white drop-shadow-[0px_37px_40.5px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-[30px] py-[9px] relative z-40">
      <div className="w-full max-w-[1440px] h-[65px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" aria-label="IILP Home">
          <div className="w-[127px] h-[56px] relative shrink-0 overflow-hidden">
            <img
              src="/assets/logo.png"
              alt="IILP Logo"
              className="absolute h-[274.59%] w-[120.67%] max-w-none left-[-9.93%] top-[-85.73%] pointer-events-none select-none"
            />
          </div>
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
          <div className="flex items-center gap-[8px] font-sans">
            <Link
              href="/donate"
              className="text-[14px] font-semibold text-[#101828] hover:text-primary-500 px-[16px] py-[10px] transition-colors rounded-full"
            >
              Donate
            </Link>
            <Link
              href="/contact"
              className="bg-[#f9fafb] border border-[#e5e7eb] rounded-full px-[16px] py-[10px] text-[14px] font-semibold text-[#4a5565] hover:bg-white hover:text-gray-900 transition-colors drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)]"
            >
              Contact
            </Link>
            <Link
              href="/fellowships#apply"
              className="bg-[#00bfff] hover:bg-sky-400 rounded-full px-[16px] py-[10px] text-[14px] font-semibold text-white transition-colors drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)]"
            >
              Apply Now
            </Link>
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white rounded-2xl shadow-lg border border-gray-100 mt-2 p-5 flex flex-col gap-4 relative z-50 w-full max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-3 font-sans text-base text-gray-900">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary-500 py-1"
              >
                {link.name}
              </Link>
            ))}

            {/* Others Submenu Grouped */}
            {othersGroups.map((group) => (
              <div key={group.category} className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#00698c] uppercase tracking-wider">
                  {group.category}
                </span>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col pl-2 py-1 hover:text-primary-500"
                  >
                    <span className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
            <Link
              href="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 text-sm font-semibold text-gray-900 border border-gray-200 rounded-full"
            >
              Donate
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-full"
            >
              Contact
            </Link>
            <Link
              href="/fellowships#apply"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 text-sm font-semibold text-white bg-[#00bfff] rounded-full"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

