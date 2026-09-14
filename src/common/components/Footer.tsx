import Link from 'next/link';
import Image from 'next/image';
import { CallToAction } from './CallToAction';

interface FooterProps {
  withCta?: boolean;
}

export function Footer({ withCta = true }: FooterProps = {}) {
  return (
    <>
      {withCta && <CallToAction />}
      <footer className="relative bg-secondary-900 text-white pt-24 pb-16 overflow-hidden">
      {/* Background Watermark Image */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none flex items-center justify-center">
        <Image 
          src="/assets/footer-logo.png" 
          alt="IILP Background Logo" 
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col gap-24">
        
        {/* Top Section: Logo & Links */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          
          {/* Logo & Address Column */}
          <div className="flex flex-col gap-10 lg:w-1/4">
            <Image 
              src="/assets/footer-logo.png" 
              alt="IILP Logo" 
              width={358} 
              height={156} 
              className="w-[280px] h-auto object-contain"
              priority
            />
            <p className="text-gray-50 text-[16px] leading-relaxed max-w-[202px] font-inter">
              123 University Lane, Knowledge City, State, ZIP
            </p>
            {/* Social Icons Placeholder */}
            <div className="flex items-center gap-3">
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="font-playfair font-semibold text-[18px] text-white">About IILP</h3>
              <ul className="flex flex-col gap-4 text-[16px] text-gray-300 font-inter">
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Institutional Profile</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Vision & Mission</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Founder&apos;s Message</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Governance</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Leadership Directory</Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-6">
              <h3 className="font-playfair font-semibold text-[18px] text-white">Academic</h3>
              <ul className="flex flex-col gap-4 text-[16px] text-gray-300 font-inter">
                <li><Link href="#" className="hover:text-primary-500 transition-colors">All Departments</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Law & Legal Studies</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Political Science</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Human Rights</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Refugee Studies</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Peace & Conflict</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-playfair font-semibold text-[18px] text-white">Research & Programs</h3>
              <ul className="flex flex-col gap-4 text-[16px] text-gray-300 font-inter">
                <li><Link href="/research-publications" className="hover:text-primary-500 transition-colors">Research & Publications</Link></li>
                <li><Link href="/fellowships" className="hover:text-primary-500 transition-colors">Global Fellowship Network</Link></li>
                <li><Link href="/partnership-framework" className="hover:text-primary-500 transition-colors">Partnerships</Link></li>
                <li><Link href="/news-media" className="hover:text-primary-500 transition-colors">News & Media Center</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Events & Conferences</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-playfair font-semibold text-[18px] text-white">Support & Connect</h3>
              <ul className="flex flex-col gap-4 text-[16px] text-gray-300 font-inter">
                <li><Link href="/contact" className="hover:text-primary-500 transition-colors">Contact Us</Link></li>
                <li><Link href="/donate" className="hover:text-primary-500 transition-colors">Donate / Support IILP</Link></li>
                <li><Link href="/careers" className="hover:text-primary-500 transition-colors">Careers / Work With Us</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">FAQ</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-use" className="hover:text-primary-500 transition-colors">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
          
        </div>

        {/* Middle Section: Stay Informed */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white/5 rounded-2xl p-8 border border-white/10">
          <div className="flex flex-col gap-2 max-w-md">
            <h3 className="font-playfair font-semibold text-[24px] text-white">Stay Informed</h3>
            <p className="text-gray-300 text-[16px] font-inter">
              Subscribe to the IILP newsletter for research, events, and updates.
            </p>
          </div>
          
          <form className="flex w-full md:w-auto items-center bg-transparent border border-primary-500 rounded-full p-1 pl-6 font-inter">
            <input 
              type="email" 
              placeholder="YOUR EMAIL..." 
              className="bg-transparent border-none text-white placeholder-white/30 focus:outline-none focus:ring-0 w-full md:w-64" 
              required
            />
            <button 
              type="submit" 
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[14px] px-6 py-3 rounded-full uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2"
            >
              SUBSCRIBE
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-6 pt-8 border-t border-white/15 text-[14px] text-white/70 font-inter">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Email:</span> info@iilp.org
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Established:</span> 1 January 2026
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Status:</span> Independent, Non-Profit Academic Institute
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
            <p>© 2026 International Institute for Law and Politics (IILP). All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
    </>
  );
}
