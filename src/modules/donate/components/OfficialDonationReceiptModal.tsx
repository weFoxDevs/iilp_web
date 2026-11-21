import React from "react";
import Image from "next/image";
import { DonationData } from "@/common/services/donations.service";

interface OfficialDonationReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: DonationData | null;
  currentAmount?: number;
  frequency?: string;
}

export function OfficialDonationReceiptModal({
  isOpen,
  onClose,
  donation,
  currentAmount = 30,
  frequency = "Monthly",
}: OfficialDonationReceiptModalProps) {
  if (!isOpen) return null;

  const amount = donation ? Number(donation.amount) : currentAmount;
  const isMonthly =
    donation?.frequency === "MONTHLY" || frequency === "Monthly";
  const donorName = donation?.isAnonymous
    ? "Anonymous Supporter"
    : donation?.donorName || "Valued Donor";
  const donorEmail = donation?.donorEmail || "donor@example.org";
  const receiptNo = donation?.id
    ? `REC-${donation.id.substring(0, 8).toUpperCase()}`
    : `REC-${Date.now().toString().slice(-8)}`;
  const transactionId = donation?.transactionId || "N/A";
  const paymentMethod =
    donation?.paymentMethod === "STRIPE"
      ? "Credit Card (Stripe)"
      : donation?.paymentMethod === "PAYPAL"
      ? "PayPal"
      : "Card Payment";

  const dateStr = donation?.createdAt
    ? new Date(donation.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  const timeStr = donation?.createdAt
    ? new Date(donation.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

  const handlePrint = () => {
    // Create or reuse hidden printing iframe
    let printFrame = document.getElementById("iilp-receipt-iframe") as HTMLIFrameElement | null;
    if (printFrame) {
      printFrame.remove();
    }
    printFrame = document.createElement("iframe");
    printFrame.id = "iilp-receipt-iframe";
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";
    printFrame.style.opacity = "0";
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (!frameDoc) {
      window.print();
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const logoUrl = `${origin}/assets/logo.png`;

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>IILP Donation Receipt - ${receiptNo}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 20mm 15mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background: #ffffff;
              color: #0f172a;
              margin: 0;
              padding: 20px 0;
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }
            .receipt-card {
              width: 100%;
              max-width: 580px;
              margin: 0 auto;
              border: 1.5px solid #e2e8f0;
              border-radius: 16px;
              padding: 32px 36px;
              background: #ffffff;
              page-break-inside: avoid;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              padding-bottom: 20px;
              margin-bottom: 24px;
              border-bottom: 1.5px solid #f1f5f9;
            }
            .header-logo {
              width: 48px;
              vertical-align: middle;
            }
            .header-logo img {
              width: 44px;
              height: 44px;
              object-fit: contain;
              display: block;
            }
            .header-text {
              vertical-align: middle;
              padding-left: 14px;
            }
            .org-title {
              font-family: "Playfair Display", Georgia, serif;
              font-size: 18px;
              font-weight: 700;
              color: #000080;
              line-height: 1.3;
              margin: 0 0 4px 0;
            }
            .org-subtitle {
              font-size: 12px;
              color: #64748b;
              font-weight: 500;
              margin: 0;
            }
            .hero-box {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 22px 20px;
              text-align: center;
              margin-bottom: 24px;
            }
            .hero-label {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: #64748b;
              margin-bottom: 6px;
            }
            .hero-amount {
              font-family: "Playfair Display", Georgia, serif;
              font-size: 38px;
              font-weight: 700;
              color: #000080;
              line-height: 1.1;
              margin-bottom: 8px;
            }
            .hero-currency {
              font-family: -apple-system, sans-serif;
              font-size: 16px;
              font-weight: 600;
              color: #64748b;
              margin-left: 6px;
            }
            .status-badge {
              display: inline-block;
              background-color: #ecfdf5;
              border: 1px solid #a7f3d0;
              color: #047857;
              font-size: 12px;
              font-weight: 600;
              padding: 3px 12px;
              border-radius: 9999px;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              margin-bottom: 24px;
            }
            .details-table tr {
              border-bottom: 1px solid #f1f5f9;
            }
            .details-table td {
              padding: 10px 0;
              vertical-align: top;
            }
            .col-label {
              width: 36%;
              font-size: 13px;
              color: #64748b;
              font-weight: 500;
              white-space: nowrap;
            }
            .col-value {
              width: 64%;
              font-size: 13px;
              color: #0f172a;
              font-weight: 600;
              text-align: right;
            }
            .tx-code {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 11px;
              font-weight: 500;
              color: #334155;
              line-height: 1.45;
              word-break: break-all;
              overflow-wrap: anywhere;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 4px 8px;
              display: inline-block;
              max-width: 100%;
              text-align: right;
            }
            .note-box {
              background-color: #f8fafc;
              border-radius: 8px;
              padding: 10px 14px;
              margin-bottom: 20px;
              font-size: 12px;
              color: #334155;
              font-style: italic;
              border-left: 3px solid #000080;
            }
            .footer-note {
              font-size: 11px;
              color: #64748b;
              text-align: center;
              line-height: 1.6;
              padding-top: 16px;
              border-top: 1px dashed #e2e8f0;
            }
            .footer-contact {
              margin-top: 6px;
              font-size: 11px;
              font-weight: 500;
              color: #000080;
            }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <!-- Header -->
            <table class="header-table">
              <tr>
                <td class="header-logo">
                  <img src="${logoUrl}" alt="IILP" />
                </td>
                <td class="header-text">
                  <h1 class="org-title">International Institute for Law and Politics</h1>
                  <p class="org-subtitle">Official Donation Receipt &bull; Tax Acknowledgment</p>
                </td>
              </tr>
            </table>

            <!-- Hero Amount Box -->
            <div class="hero-box">
              <div class="hero-label">Amount Contributed</div>
              <div class="hero-amount">
                $${amount.toFixed(2)}<span class="hero-currency">USD</span>
              </div>
              <div class="status-badge">
                &#10003; Payment Completed &bull; ${isMonthly ? "Monthly Recurring" : "One-Time"}
              </div>
            </div>

            <!-- Details Table (Fixed Table Layout guarantees NO overflow/glitch) -->
            <table class="details-table">
              <tr>
                <td class="col-label">Receipt Number</td>
                <td class="col-value" style="font-family: monospace; letter-spacing: 0.04em;">${receiptNo}</td>
              </tr>
              <tr>
                <td class="col-label">Date &amp; Time</td>
                <td class="col-value">${dateStr}, ${timeStr}</td>
              </tr>
              <tr>
                <td class="col-label">Donor Name</td>
                <td class="col-value">${donorName}</td>
              </tr>
              <tr>
                <td class="col-label">Email Address</td>
                <td class="col-value" style="font-weight: 500;">${donorEmail}</td>
              </tr>
              <tr>
                <td class="col-label">Payment Gateway</td>
                <td class="col-value">${paymentMethod}</td>
              </tr>
              <tr>
                <td class="col-label">Transaction Ref</td>
                <td class="col-value">
                  <span class="tx-code">${transactionId}</span>
                </td>
              </tr>
            </table>

            ${
              donation?.message
                ? `<div class="note-box">&ldquo;${donation.message}&rdquo;</div>`
                : ""
            }

            <!-- Legal / Philanthropic Footer -->
            <div class="footer-note">
              Thank you for your generous contribution. The International Institute for Law and Politics (IILP) is an independent non-profit academic institute. No goods or services were provided in exchange for this contribution. Please retain this receipt for tax records.
              <div class="footer-contact">giving@iilp.org &bull; www.iilp.org</div>
            </div>
          </div>
        </body>
      </html>
    `);
    frameDoc.close();

    // Trigger print
    setTimeout(() => {
      try {
        printFrame?.contentWindow?.focus();
        printFrame?.contentWindow?.print();
      } catch {
        window.print();
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Receipt Card */}
      <div
        id="iilp-printable-receipt"
        className="printable-receipt-container bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative print:shadow-none print:border print:border-gray-300 print:max-w-xl print:p-8 print:mx-auto"
      >
        {/* Close Button (No print) */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header: Logo & Org Name */}
        <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
          <div className="relative w-11 h-11 shrink-0">
            <Image
              src="/assets/logo.png"
              alt="IILP Logo"
              width={44}
              height={44}
              className="w-11 h-11 object-contain"
            />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#000080] leading-snug">
              International Institute for Law and Politics
            </h3>
            <p className="text-[11px] text-gray-500 font-medium">
              Official Donation Receipt &bull; Tax Acknowledgment
            </p>
          </div>
        </div>

        {/* Hero Amount Display */}
        <div className="text-center py-6 my-2 bg-gray-50/70 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Amount Contributed
          </p>
          <h2 className="text-4xl font-serif font-bold text-[#000080]">
            ${amount.toFixed(2)}
            <span className="text-sm font-sans font-medium text-gray-500 ml-1">
              USD
            </span>
          </h2>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Payment Succeeded</span>
            <span className="text-gray-400">&bull;</span>
            <span>{isMonthly ? "Monthly Recurring" : "One-Time"}</span>
          </div>
        </div>

        {/* Clean Details List */}
        <div className="space-y-2 py-3 text-xs text-gray-700">
          <div className="receipt-row flex justify-between py-1.5 border-b border-gray-100">
            <span className="receipt-label text-gray-500">Receipt Number</span>
            <span className="receipt-value font-mono font-bold text-gray-900">{receiptNo}</span>
          </div>

          <div className="receipt-row flex justify-between py-1.5 border-b border-gray-100">
            <span className="receipt-label text-gray-500">Date &amp; Time</span>
            <span className="receipt-value font-medium text-gray-900">{dateStr}, {timeStr}</span>
          </div>

          <div className="receipt-row flex justify-between py-1.5 border-b border-gray-100">
            <span className="receipt-label text-gray-500">Donor Name</span>
            <span className="receipt-value font-semibold text-gray-900">{donorName}</span>
          </div>

          <div className="receipt-row flex justify-between py-1.5 border-b border-gray-100">
            <span className="receipt-label text-gray-500">Email Address</span>
            <span className="receipt-value font-medium text-gray-900">{donorEmail}</span>
          </div>

          <div className="receipt-row flex justify-between py-1.5 border-b border-gray-100">
            <span className="receipt-label text-gray-500">Payment Gateway</span>
            <span className="receipt-value font-semibold text-gray-900">{paymentMethod}</span>
          </div>

          <div className="receipt-row flex justify-between items-start gap-3 py-2 border-b border-gray-100">
            <span className="receipt-label text-gray-500 shrink-0 whitespace-nowrap font-medium text-xs pt-0.5">Transaction Ref</span>
            <span
              className="receipt-tx-code font-mono text-[10.5px] text-gray-700 text-right break-all max-w-[260px] leading-relaxed select-all bg-gray-50 px-2 py-0.5 rounded border border-gray-100"
              title={transactionId}
            >
              {transactionId}
            </span>
          </div>

          {donation?.message && (
            <div className="py-2 border-b border-gray-100">
              <span className="receipt-label text-gray-500 block mb-1">Dedication / Note</span>
              <p className="italic text-gray-800 bg-gray-50 p-2 rounded text-[11px]">
                &ldquo;{donation.message}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Clean Footer Note */}
        <p className="text-[11px] text-gray-500 text-center leading-relaxed pt-2">
          Thank you for supporting IILP. An independent, non-profit academic institute. 
          Please keep this receipt for your records.
        </p>

        {/* Action Buttons (No print) */}
        <div className="no-print flex items-center gap-3 pt-5 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#000080] hover:bg-[#000066] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
