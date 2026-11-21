import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { verifyCertificate, CertificateData } from '@/common/services/certificates.service';

export default function VerifyPage() {
  const router = useRouter();
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedRegNo, setSearchedRegNo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-verify if query parameter ?regNo= is provided
  useEffect(() => {
    if (!router.isReady) return;
    const queryReg = router.query.regNo;
    if (typeof queryReg === 'string' && queryReg.trim()) {
      setRegNo(queryReg.trim());
      handleVerify(queryReg.trim());
    }
  }, [router.isReady, router.query.regNo]);

  const handleVerify = async (queryNumber?: string) => {
    const targetNo = (queryNumber || regNo).trim();
    if (!targetNo) {
      setError('Please enter a valid Registration Number.');
      setCertificate(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchedRegNo(targetNo);

    try {
      const data = await verifyCertificate(targetNo);
      setCertificate(data);
      // Update URL query silently
      if (router.query.regNo !== targetNo) {
        router.replace({ pathname: '/verify', query: { regNo: targetNo } }, undefined, {
          shallow: true,
        });
      }
    } catch (err: any) {
      setCertificate(null);
      setError(
        err.message ||
          `No certificate found matching Registration Number "${targetNo}". Please verify the number or contact the IILP Verification Office.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && certificate) {
      const url = `${window.location.origin}/verify?regNo=${encodeURIComponent(certificate.regNo)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      <SeoHead
        title="Official Certificate Verification | International Institute for Law and Politics (IILP)"
        description="Verify certificates, fellowships, and academic diplomas issued by the International Institute for Law and Politics (IILP). Instant digital verification for employers and institutions by Registration Number."
        canonicalPath="/verify"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Certificate Verification', url: '/verify' },
        ])}
      />

      <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
        <Header />

        <main className="flex-grow pt-[110px] pb-20">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-[#000080] via-[#001f5c] to-[#002f80] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none blur-2xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#00bfff]/10 pointer-events-none blur-2xl" />

            <div className="max-w-[880px] mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 border border-[#00bfff]/40 bg-[#00bfff]/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#e6f9ff]">
                <svg className="w-4 h-4 text-[#00bfff]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Institutional Credential Authentication</span>
              </div>

              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                Certificate Verification
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#e6f9ff]/90 max-w-2xl mx-auto leading-relaxed">
                Verify the authenticity of diplomas, fellowships, and academic certificates issued by the International Institute for Law and Politics (IILP).
              </p>

              {/* Verification Search Bar Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify();
                }}
                className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full shadow-2xl border border-white/20"
              >
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="Enter Certificate Registration Number (Regd No.)"
                    className="w-full pl-11 pr-4 py-3 text-sm text-[#0a0d12] placeholder-gray-400 bg-transparent focus:outline-hidden font-medium"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00bfff] hover:bg-[#00a3db] active:scale-[0.98] text-white font-semibold text-sm px-7 py-3 rounded-full transition-all shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify Now'
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Results Container */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            {/* Loading Indicator */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-[#000080]/20 border-t-[#00bfff] rounded-full animate-spin" />
                <h3 className="text-base font-semibold text-[#0a0d12]">Querying IILP Credential Registry...</h3>
                <p className="text-xs text-gray-500">Authenticating cryptographic record and signatures for #{searchedRegNo}</p>
              </div>
            )}

            {/* Error / Not Found Alert */}
            {!loading && error && (
              <div className="bg-white rounded-2xl shadow-md border border-red-200 overflow-hidden">
                <div className="bg-red-50 p-6 sm:p-8 flex items-start gap-4 border-b border-red-100">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-1">Verification Unsuccessful</h3>
                    <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8 bg-white space-y-3 text-xs sm:text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">What should you do?</p>
                  <ul className="list-disc list-inside space-y-1.5 text-gray-600 pl-1">
                    <li>Check if the registration number was typed correctly without typos.</li>
                    <li>Ensure leading or trailing characters match the physical/digital certificate.</li>
                    <li>
                      If you believe this record is genuine or recently issued, please contact the Verification Office directly at{' '}
                      <a href="mailto:info@iilp.org" className="text-[#00698c] font-semibold underline">
                        info@iilp.org
                      </a>
                      .
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Verified Certificate Card */}
            {!loading && certificate && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Official Verified Header Ribbon */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-semibold text-emerald-100">
                        Institutional Verification Status
                      </div>
                      <div className="text-lg font-bold flex items-center gap-2">
                        <span>Authentic &amp; Officially Issued</span>
                        <span className="text-[11px] font-semibold uppercase bg-white/20 px-2 py-0.5 rounded-full text-white">
                          {certificate.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {copied ? 'Link Copied!' : 'Share Link'}
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Slip
                    </button>
                  </div>
                </div>

                {/* Certificate Main Details Body */}
                <div className="p-6 sm:p-10">
                  <div className="border-b border-gray-100 pb-8 text-center">
                    <span className="font-serif italic text-sm text-[#00698c] font-medium tracking-wide">
                      International Institute for Law and Politics
                    </span>
                    <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#000080] mt-1 mb-2">
                      {certificate.certificateTitle || 'Certificate of Fellowship'}
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                      Official Registration Record
                    </p>
                  </div>

                  {/* Recipient Spotlight */}
                  <div className="my-8 text-center bg-gradient-to-r from-blue-50/50 via-sky-50/40 to-blue-50/50 py-6 px-4 rounded-2xl border border-sky-100">
                    <div className="text-xs uppercase font-bold text-gray-500 mb-1 tracking-wider">
                      This is proudly presented to
                    </div>
                    <div className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a0d12]">
                      {certificate.recipientName}
                    </div>
                    <div className="text-sm font-semibold text-[#00698c] mt-2 max-w-lg mx-auto">
                      for successful completion of {certificate.programName}
                    </div>
                  </div>

                  {/* Two-Column Specification Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
                    {/* Left Column: Core Fields */}
                    <div className="space-y-4">
                      <div className="flex flex-col border-b border-gray-100 pb-3">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Registration Number (Regd No.)
                        </span>
                        <span className="font-mono text-base font-bold text-[#000080] tracking-wide mt-0.5">
                          {certificate.regNo}
                        </span>
                      </div>

                      <div className="flex flex-col border-b border-gray-100 pb-3">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Program / Course Track
                        </span>
                        <span className="text-sm font-semibold text-gray-900 mt-0.5">
                          {certificate.programName}
                        </span>
                      </div>

                      <div className="flex flex-col border-b border-gray-100 pb-3">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Date of Official Issue
                        </span>
                        <span className="text-sm font-semibold text-gray-900 mt-0.5">
                          {certificate.issueDate}
                        </span>
                      </div>

                      {(certificate.startDate || certificate.endDate) && (
                        <div className="flex flex-col border-b border-gray-100 pb-3">
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                            Fellowship / Academic Period
                          </span>
                          <span className="text-sm font-semibold text-gray-900 mt-0.5">
                            {certificate.startDate && `From ${certificate.startDate}`}
                            {certificate.endDate && ` to ${certificate.endDate}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Status & Verification Meta */}
                    <div className="space-y-4">
                      <div className="flex flex-col border-b border-gray-100 pb-3">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Nature of Fellowship / Study
                        </span>
                        <span className="text-sm font-semibold text-gray-900 mt-0.5">
                          {certificate.natureOfProgram || 'Part Time'}
                        </span>
                      </div>

                      <div className="flex flex-col border-b border-gray-100 pb-3">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Authorized Signatory
                        </span>
                        <span className="text-sm font-semibold text-gray-900 mt-0.5">
                          {certificate.authorizedSignatory || 'President / Registrar, IILP'}
                        </span>
                      </div>

                      <div className="flex flex-col border-b border-gray-100 pb-3">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Registry Authenticity
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-emerald-600 font-semibold text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Valid &amp; Active Digital Record</span>
                        </div>
                      </div>

                      {certificate.remarks && (
                        <div className="flex flex-col border-b border-gray-100 pb-3">
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                            Commendation Note
                          </span>
                          <span className="text-xs text-gray-600 italic mt-0.5">
                            &ldquo;{certificate.remarks}&rdquo;
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accreditations & Certificate Preview / Download */}
                  {certificate.certificateFileUrl && (
                    <div className="mt-8 pt-6 border-t border-gray-100 bg-[#f9fafb] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-20 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                          <Image
                            src={certificate.certificateFileUrl}
                            alt="Certificate Thumbnail"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Official Certificate Document</h4>
                          <p className="text-xs text-gray-500">
                            Authentic high-resolution credential document issued by IILP
                          </p>
                        </div>
                      </div>

                      <a
                        href={certificate.certificateFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#000080] hover:bg-[#000066] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Original Certificate
                      </a>
                    </div>
                  )}

                  {/* Security Notice Footer */}
                  <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
                    This verification record is digitally certified by the Registrar of the International Institute for Law and Politics (IILP). For formal verification letters or inquiries, contact <a href="mailto:info@iilp.org" className="text-[#00698c] underline">info@iilp.org</a>.
                  </div>
                </div>
              </div>
            )}

            {/* Information & Guidelines Box */}
            <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h3 className="font-playfair font-bold text-lg text-[#000080] mb-3">
                Information for Employers, Embassies &amp; Institutions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bfff]"></span>
                    Registration Number (Regd No.)
                  </h4>
                  <p>
                    Every certificate issued by IILP bears a distinct, immutable registration number in the lower section (e.g. printed on the official certificate).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bfff]"></span>
                    Tamper-Resistant Verification
                  </h4>
                  <p>
                    Verification is performed directly against IILP&apos;s encrypted database registry to safeguard against credential alteration or falsification.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bfff]"></span>
                    Direct Verification Support
                  </h4>
                  <p>
                    If an institution requires an official signed Letter of Attestation, please submit a written request to the academic verification secretariat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
