import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { PageSectionData } from "@/common/services/cms.service";
import {
  createStripeSession,
  verifyStripeSession,
  createPayPalOrder,
  capturePayPalOrder,
  fetchDonationReceipt,
  DonationData,
  PaymentMethod,
  DonationFrequency,
} from "@/common/services/donations.service";
import { OfficialDonationReceiptModal } from "./OfficialDonationReceiptModal";

export interface ValueCardItem {
  nodeId?: string;
  emoji: string;
  title: string;
  description: string;
}

export const defaultDonateValueCards: ValueCardItem[] = [
  {
    nodeId: "155:76744",
    emoji: "🎓",
    title: "Fund Research & Scholarships",
    description:
      "Support emerging scholars and researchers advancing human rights, governance, and development.",
  },
  {
    nodeId: "155:76760",
    emoji: "📚",
    title: "Publications & Policy Briefs",
    description:
      "Enable the production of open-access research, policy briefs, and scholarly publications.",
  },
  {
    nodeId: "155:76777",
    emoji: "🌐",
    title: "Global Fellowship Network",
    description:
      "Support the Global Fellowship Network connecting researchers and emerging leaders worldwide.",
  },
  {
    nodeId: "155:76769",
    emoji: "🎤",
    title: "Conferences & Events",
    description:
      "Fund conferences, seminars, and workshops that advance policy dialogue and knowledge exchange.",
  },
  {
    nodeId: "155:76784",
    emoji: "🏛️",
    title: "Institutional Development",
    description:
      "Contribute to IILP's long-term institutional capacity building and growth.",
  },
];

interface DonateMainSectionProps {
  data?: Partial<PageSectionData>;
}

export function DonateMainSection({ data }: DonateMainSectionProps = {}) {
  const router = useRouter();

  const badge = data?.badge || "Why Give";
  const title = data?.title || "Support IILP's Mission";
  const subtitle =
    data?.subtitle ||
    data?.bodyContent ||
    "Your donation directly supports IILP's mission of advancing knowledge, justice, and leadership for global change. Every contribution — large or small — makes a meaningful difference.";

  const metadata = (data?.metadata || {}) as Record<string, unknown>;

  // Dynamic ValueCards from CMS metadata
  const cards: ValueCardItem[] =
    Array.isArray(metadata.cards) && metadata.cards.length > 0
      ? (metadata.cards as ValueCardItem[])
      : defaultDonateValueCards;

  // Dynamic Form Configurations from CMS metadata
  const formBadge =
    (metadata.formBadge as string) ||
    (metadata.form_badge as string) ||
    "Make a Gift";
  const formTitle =
    (metadata.formTitle as string) ||
    (metadata.form_title as string) ||
    "Donate to IILP";
  const presetAmounts: number[] =
    Array.isArray(metadata.presetAmounts) && metadata.presetAmounts.length > 0
      ? (metadata.presetAmounts as number[])
      : [25, 50, 100, 150];
  const defaultAmountVal = String(
    metadata.defaultAmount || metadata.default_amount || "30"
  );
  const securityNotice =
    (metadata.securityNotice as string) ||
    (metadata.security_notice as string) ||
    "Secure donation. IILP is an independent non-profit institute.";
  const thankYouHeading =
    (metadata.thankYouHeading as string) ||
    (metadata.thank_you_heading as string) ||
    "Thank You for Your Support!";
  const thankYouMessage =
    (metadata.thankYouMessage as string) ||
    (metadata.thank_you_message as string) ||
    "Your generous gift empowers scholars and defenders of justice around the world.";

  const [frequency, setFrequency] = useState<"Monthly" | "One-Time">("Monthly");
  const [selectedPreset, setSelectedPreset] = useState<number | "custom">("custom");
  const [customAmount, setCustomAmount] = useState(defaultAmountVal);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmedDonation, setConfirmedDonation] = useState<DonationData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoBanner, setInfoBanner] = useState("");
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const currentAmount =
    selectedPreset === "custom"
      ? Number(customAmount) || 0
      : selectedPreset;

  // Auto-verify when returning from Stripe checkout or PayPal redirect
  useEffect(() => {
    if (!router.isReady) return;

    const { status, session_id, donation_id } = router.query;

    if (status === "success" && typeof session_id === "string") {
      setVerifyingSession(true);
      verifyStripeSession(session_id, donation_id as string | undefined)
        .then((res) => {
          setConfirmedDonation(res.donation);
          setSubmitted(true);
        })
        .catch((err) => {
          setErrorMessage(err.message || "Failed to verify Stripe checkout session.");
        })
        .finally(() => {
          setVerifyingSession(false);
        });
    } else if (status === "paypal_success" && typeof donation_id === "string") {
      setVerifyingSession(true);
      fetchDonationReceipt(donation_id)
        .then((donation) => {
          setConfirmedDonation(donation);
          setSubmitted(true);
        })
        .catch((err) => {
          setErrorMessage(err.message || "Failed to load PayPal donation receipt.");
        })
        .finally(() => {
          setVerifyingSession(false);
        });
    } else if (status === "cancelled") {
      setInfoBanner("Checkout was cancelled. No charges were made to your account. Feel free to adjust your details and try again.");
    }
  }, [router.isReady, router.query]);

  const handlePresetClick = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomClick = () => {
    setSelectedPreset("custom");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMessage("Please fill out all required fields marked with *");
      return;
    }
    if (currentAmount <= 0) {
      setErrorMessage("Please enter a valid donation amount.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setInfoBanner("");

    const donationFreq: DonationFrequency =
      frequency === "Monthly" ? "MONTHLY" : "ONE_TIME";

    try {
      if (paymentMethod === "STRIPE") {
        // Stripe Checkout Integration
        const session = await createStripeSession({
          donorName: formData.fullName.trim(),
          donorEmail: formData.email.trim(),
          amount: currentAmount,
          frequency: donationFreq,
          message: formData.message.trim() || undefined,
          isAnonymous,
        });

        // If returned checkout session URL, redirect donor to Stripe Secure Checkout
        if (session.url) {
          window.location.href = session.url;
        } else {
          // If in test simulation mode without redirect URL
          const verified = await verifyStripeSession(session.sessionId, session.donationId);
          setConfirmedDonation(verified.donation);
          setSubmitted(true);
        }
      } else if (paymentMethod === "PAYPAL") {
        // PayPal Order Integration
        const orderRes = await createPayPalOrder({
          donorName: formData.fullName.trim(),
          donorEmail: formData.email.trim(),
          amount: currentAmount,
          frequency: donationFreq,
          message: formData.message.trim() || undefined,
          isAnonymous,
        });

        // Capture PayPal Order
        const captured = await capturePayPalOrder({
          orderId: orderRes.orderId,
          donationId: orderRes.donationId,
        });

        setConfirmedDonation(captured.donation);
        setSubmitted(true);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to process payment. Please try again or choose another method."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ fullName: "", email: "", message: "" });
    setSubmitted(false);
    setConfirmedDonation(null);
    setErrorMessage("");
    setInfoBanner("");
    router.replace("/donate", undefined, { shallow: true });
  };

  const handlePrintReceipt = () => {
    setIsReceiptModalOpen(true);
  };

  return (
    <section
      className="bg-white flex flex-col gap-12 sm:gap-16 lg:gap-[120px] items-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px] py-12 sm:py-20 lg:py-[140px] relative w-full"
      data-node-id="155:76605"
      data-name="misson and vision"
    >
      <div
        className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-[80px] items-start"
        data-node-id="155:76606"
      >
        {/* Left Column: Why Give (Figma node 155:76607) */}
        <div
          className="flex flex-1 flex-col gap-10 lg:gap-[80px] items-start w-full"
          data-node-id="155:76607"
          data-name="Container"
        >
          {/* Heading Container (Figma node 155:76661) */}
          <div
            className="flex flex-col gap-[30px] items-start relative shrink-0 w-full"
            data-node-id="155:76661"
          >
            <div
              className="flex flex-col gap-4 items-start relative shrink-0 w-full"
              data-node-id="155:76662"
            >
              {/* Pill Badge */}
              <div
                className="border border-[#00698c] border-solid flex flex-col items-start px-[12px] py-[8px] relative rounded-[1000px] shrink-0"
                data-node-id="155:76663"
              >
                <span
                  className="font-sans font-semibold leading-[17.6px] text-[#0a0d12] text-sm sm:text-[16px] uppercase"
                  data-node-id="155:76665"
                >
                  {badge}
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-serif font-medium leading-tight sm:leading-[44px] text-[#0a0d12] text-2xl sm:text-3xl lg:text-[36px] tracking-tight w-full max-w-[580px]"
                data-node-id="155:76666"
              >
                {title}
              </h2>
            </div>

            {/* Description */}
            <p
              className="font-sans font-normal leading-[30px] text-[#0a0d12]/70 text-lg sm:text-[20px] max-w-[580px]"
              data-node-id="155:76668"
            >
              {subtitle}
            </p>
          </div>

          {/* Dynamic ValueCards List (Figma node 155:76768) */}
          <div
            className="flex flex-col gap-[16px] items-start relative shrink-0 w-full"
            data-node-id="155:76768"
          >
            {cards.map((card, idx) => (
              <div
                key={card.nodeId || `val-card-${idx}`}
                className="bg-white border border-[#b0ebff] flex gap-4 sm:gap-[24px] items-start p-4 sm:p-[24px] relative shrink-0 w-full rounded-xl sm:rounded-none shadow-xs hover:border-[#00698c] transition-colors"
                data-node-id={card.nodeId}
                data-name="ValueCard"
              >
                {/* Emoji Icon Container (64x64) */}
                <div
                  className="bg-[#e6f9ff] border border-[#b0ebff] flex flex-col items-center justify-center p-3 sm:p-[16px] relative shrink-0 w-12 h-12 sm:w-[64px] sm:h-[64px] rounded-lg sm:rounded-none"
                  data-name="Container"
                >
                  <span className="font-sans text-xl sm:text-[24px] leading-none sm:leading-[32px] select-none">
                    {card.emoji}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 sm:gap-[12px] items-start min-w-0">
                  <h3 className="font-serif font-bold text-[#000080] text-lg sm:text-[24px] leading-snug sm:leading-normal w-full">
                    {card.title}
                  </h3>
                  <p className="font-sans font-normal text-[#414651] text-sm sm:text-[16px] leading-relaxed sm:leading-[24px] w-full">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Make a Gift Form (Figma node 155:76791) */}
        <div
          className="bg-[#e6f9ff] flex flex-col gap-[28px] items-start p-6 sm:p-8 lg:p-[32px] relative shrink-0 w-full lg:w-[500px] rounded-2xl lg:rounded-none"
          data-node-id="155:76791"
        >
          {/* Header */}
          <div
            className="flex flex-col gap-4 items-start relative shrink-0 w-full"
            data-node-id="155:76792"
          >
            {/* Pill Badge */}
            <div
              className={`border border-solid flex flex-col items-start px-[12px] py-[8px] relative rounded-[1000px] shrink-0 transition-colors ${
                submitted
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-[#00698c]"
              }`}
              data-node-id="155:76793"
            >
              <span
                className={`font-sans font-semibold leading-[17.6px] text-sm sm:text-[16px] uppercase ${
                  submitted ? "text-emerald-800" : "text-[#0a0d12]"
                }`}
                data-node-id="155:76795"
              >
                {submitted ? "Contribution Confirmed" : formBadge}
              </span>
            </div>

            {/* Title */}
            <h2
              className="font-serif font-medium leading-tight sm:leading-[44px] text-[#0a0d12] text-2xl sm:text-3xl lg:text-[36px] tracking-tight w-full"
              data-node-id="155:76796"
            >
              {submitted ? "Donation Receipt" : formTitle}
            </h2>
          </div>

          {/* Session Verification Loader */}
          {verifyingSession ? (
            <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 my-auto min-h-[440px] w-full shadow-xs">
              <div className="w-12 h-12 border-3 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
              <h3 className="font-serif text-xl font-bold text-[#0a0d12]">
                Confirming Your Contribution...
              </h3>
              <p className="font-sans text-gray-500 text-sm max-w-[280px]">
                Please hold on while we verify your donation payment with the gateway.
              </p>
            </div>
          ) : submitted ? (
            /* Thank You / Official Receipt View */
            <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 my-auto min-h-[460px] w-full shadow-xs border border-gray-100">
              {/* Checkmark Circle */}
              <div className="relative flex items-center justify-center mb-1">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-500 shadow-xs">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#000080]">
                {thankYouHeading}
              </h3>

              <p className="font-sans text-gray-600 text-xs sm:text-sm leading-relaxed max-w-[380px]">
                {thankYouMessage}
              </p>

              {/* Polished In-Page Receipt Card */}
              <div className="bg-[#f0faff] border border-[#b0ebff] rounded-2xl p-4 sm:p-5 w-full text-left space-y-3 text-xs text-gray-700 my-1 shadow-xs">
                {/* Header Row: Big Amount & Frequency */}
                <div className="flex justify-between items-center pb-3 border-b border-[#cceeff]">
                  <div>
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">
                      Total Contribution
                    </span>
                    <span className="font-serif font-bold text-[#000080] text-2xl sm:text-3xl leading-none">
                      ${confirmedDonation ? Number(confirmedDonation.amount).toFixed(2) : currentAmount.toFixed(2)}
                      <span className="text-xs font-sans text-gray-600 ml-1 font-semibold">
                        USD
                      </span>
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      frequency === "Monthly" || confirmedDonation?.frequency === "MONTHLY"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {frequency === "Monthly" || confirmedDonation?.frequency === "MONTHLY"
                      ? "🔄 Monthly Sustainer"
                      : "⚡ One-Time Gift"}
                  </span>
                </div>

                {/* Donor Details */}
                <div className="grid grid-cols-2 gap-2 text-xs py-1">
                  <div>
                    <span className="text-gray-500 text-[11px] block">Donor</span>
                    <span className="font-semibold text-gray-900 truncate block">
                      {confirmedDonation?.isAnonymous
                        ? "Anonymous Donor"
                        : confirmedDonation?.donorName || formData.fullName || "Valued Supporter"}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[11px] block">Email</span>
                    <span className="font-medium text-gray-900 truncate block">
                      {confirmedDonation?.donorEmail || formData.email || "donor@example.org"}
                    </span>
                  </div>
                </div>

                {/* Gateway & Date */}
                <div className="grid grid-cols-2 gap-2 text-xs py-1 border-t border-[#cceeff]/70">
                  <div>
                    <span className="text-gray-500 text-[11px] block">Payment Gateway</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-gray-900">
                      {confirmedDonation?.paymentMethod === "STRIPE" ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#635BFF]" />
                          Credit Card (Stripe)
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#003087]" />
                          PayPal
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[11px] block">Contribution Date</span>
                    <span className="font-medium text-gray-800">
                      {new Date(confirmedDonation?.createdAt || Date.now()).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Transaction Ref with Copy */}
                {(confirmedDonation?.transactionId || confirmedDonation?.id) && (
                  <div className="pt-2 border-t border-[#cceeff]/70 space-y-1.5">
                    {confirmedDonation?.transactionId && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-[11px]">Transaction Ref:</span>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#cceeff]">
                          <span className="truncate max-w-[170px]" title={confirmedDonation.transactionId}>
                            {confirmedDonation.transactionId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(confirmedDonation.transactionId!, "tx")}
                            className="text-[#00698c] hover:text-[#000080] transition-colors p-0.5 cursor-pointer"
                            title="Copy Transaction ID"
                          >
                            {copiedField === "tx" ? "✓" : "📋"}
                          </button>
                        </div>
                      </div>
                    )}

                    {confirmedDonation?.id && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-[11px]">Receipt Serial:</span>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#cceeff]">
                          <span className="truncate max-w-[170px]" title={confirmedDonation.id}>
                            {confirmedDonation.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(confirmedDonation.id, "rec")}
                            className="text-[#00698c] hover:text-[#000080] transition-colors p-0.5 cursor-pointer"
                            title="Copy Receipt ID"
                          >
                            {copiedField === "rec" ? "✓" : "📋"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Dedication Note if present */}
                {confirmedDonation?.message && (
                  <div className="pt-2 border-t border-[#cceeff]/70">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">
                      Dedication / Note
                    </span>
                    <p className="text-[11px] text-gray-800 italic mt-0.5 bg-white/80 p-2 rounded border border-[#cceeff]/60">
                      &ldquo;{confirmedDonation.message}&rdquo;
                    </p>
                  </div>
                )}

                <div className="pt-2 text-[11px] text-gray-500 italic text-center border-t border-[#cceeff]">
                  ✉️ An official tax receipt has been emailed to{" "}
                  <strong className="text-gray-700">
                    {confirmedDonation?.donorEmail || formData.email || "your email address"}
                  </strong>.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 py-3 px-4 rounded-full bg-[#000080] hover:bg-[#000066] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-95"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  <span>Print Official Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Make Another Gift
                </button>
              </div>
            </div>
          ) : (
            /* Donation Checkout Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              {infoBanner && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
                  <span>ℹ️</span>
                  <span>{infoBanner}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                  {errorMessage}
                </div>
              )}

              {/* Frequency Toggle (Figma node 155:76927) */}
              <div
                className="bg-white border border-[#e6f9ff] flex gap-[4px] items-start p-[4px] relative rounded-full shrink-0 w-full"
                data-node-id="155:76927"
              >
                <button
                  type="button"
                  onClick={() => setFrequency("Monthly")}
                  className={`flex flex-1 items-center justify-center py-[10px] px-[16px] rounded-full font-sans font-semibold text-sm transition-all cursor-pointer ${
                    frequency === "Monthly"
                      ? "bg-[#1e2939] text-white shadow-xs"
                      : "bg-white text-[#4a5565] hover:text-black"
                  }`}
                  data-node-id="155:76928"
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("One-Time")}
                  className={`flex flex-1 items-center justify-center py-[10px] px-[16px] rounded-full font-sans font-semibold text-sm transition-all cursor-pointer ${
                    frequency === "One-Time"
                      ? "bg-[#1e2939] text-white shadow-xs"
                      : "bg-white text-[#4a5565] hover:text-black"
                  }`}
                  data-node-id="155:76929"
                >
                  One-Time
                </button>
              </div>

              {/* Donation Amount Presets & Custom Input (Figma node 155:76996) */}
              <div
                className="flex flex-col gap-[8px] items-start relative shrink-0 w-full"
                data-node-id="155:76996"
              >
                {/* Presets Row */}
                <div
                  className="grid grid-cols-3 sm:flex sm:flex-nowrap gap-2 items-stretch relative shrink-0 w-full"
                  data-node-id="155:76976"
                >
                  {presetAmounts.map((amt) => {
                    const isSelected = selectedPreset === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handlePresetClick(amt)}
                        className={`flex items-center justify-center px-3 sm:px-[20px] py-[12px] border border-[#e5e7eb] font-sans font-semibold text-sm sm:text-base transition-colors cursor-pointer flex-1 rounded-sm sm:rounded-none ${
                          isSelected
                            ? "bg-[#000080] text-white border-[#000080]"
                            : "bg-[#f9fafb] text-[#4a5565] hover:border-[#000080]"
                        }`}
                      >
                        ${amt}
                      </button>
                    );
                  })}

                  {/* Custom Button */}
                  <button
                    type="button"
                    onClick={handleCustomClick}
                    className={`flex flex-1 items-center justify-center px-3 sm:px-[20px] py-[12px] border font-sans font-semibold text-sm sm:text-base transition-colors cursor-pointer rounded-sm sm:rounded-none ${
                      selectedPreset === "custom"
                        ? "bg-[#000080] text-white border-[#000080]"
                        : "bg-[#f9fafb] text-[#4a5565] border-[#e5e7eb] hover:border-[#000080]"
                    }`}
                    data-node-id="155:77110"
                  >
                    Custom
                  </button>
                </div>

                {/* Amount Input with currency & spin controls */}
                <div
                  className="flex flex-col gap-[10px] items-start relative shrink-0 w-full"
                  data-node-id="155:77073"
                >
                  <div className="bg-[#f9fafb] border border-[#1447e6] flex gap-[8px] items-center px-[16px] py-[14px] relative shrink-0 w-full">
                    <span className="text-[#101828] font-sans font-semibold text-base">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={customAmount}
                      onChange={(e) => {
                        setSelectedPreset("custom");
                        setCustomAmount(e.target.value);
                      }}
                      className="w-full bg-transparent font-sans text-base text-[#101828] outline-hidden leading-[24px]"
                      placeholder="30"
                    />
                    <div className="relative shrink-0 size-[16px] pointer-events-none opacity-60">
                      <Image
                        src="/icons/donate/chevron-up-down.svg"
                        alt="Adjust amount"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector (Stripe vs PayPal) */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-sans font-medium text-xs leading-[18px] text-[#101828] uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5 w-full">
                  {/* Stripe Card Button */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("STRIPE")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "STRIPE"
                        ? "border-[#000080] bg-white shadow-xs"
                        : "border-gray-200 bg-white/70 hover:bg-white text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5 text-[#635BFF]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" />
                      </svg>
                      <span className="font-sans font-bold text-sm text-[#0a0d12]">
                        Credit Card
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      Stripe / Apple / Google Pay
                    </span>
                  </button>

                  {/* PayPal Button */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("PAYPAL")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "PAYPAL"
                        ? "border-[#000080] bg-white shadow-xs"
                        : "border-gray-200 bg-white/70 hover:bg-white text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#003087] text-base leading-none">
                        <i>P</i>
                      </span>
                      <span className="font-sans font-bold text-sm text-[#003087]">
                        PayPal
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      PayPal Wallet &amp; Cards
                    </span>
                  </button>
                </div>
              </div>

              {/* Donor Inputs (Figma node 155:76798) */}
              <div
                className="flex flex-col gap-[16px] items-start relative shrink-0 w-full"
                data-node-id="155:76798"
              >
                {/* Row: Full Name & Email Address */}
                <div
                  className="flex flex-col sm:flex-row gap-[16px] items-start relative shrink-0 w-full"
                  data-node-id="155:77123"
                >
                  {/* Full Name */}
                  <div
                    className="flex flex-1 flex-col gap-[8px] items-start relative shrink-0 w-full"
                    data-node-id="155:76897"
                  >
                    <label className="flex gap-[4px] items-center font-sans font-medium text-sm leading-[20px] text-[#101828]">
                      <span>Full Name</span>
                      <span className="text-[#c70036]">*</span>
                    </label>
                    <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] flex items-center px-[16px] py-[12px] relative shrink-0 w-full transition-colors">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        required
                        className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div
                    className="flex flex-1 flex-col gap-[8px] items-start relative shrink-0 w-full"
                    data-node-id="155:76909"
                  >
                    <label className="flex gap-[4px] items-center font-sans font-medium text-sm leading-[20px] text-[#101828]">
                      <span>Email Address</span>
                      <span className="text-[#c70036]">*</span>
                    </label>
                    <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] flex items-center px-[16px] py-[12px] relative shrink-0 w-full transition-colors">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.org"
                        required
                        className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Field */}
                <div
                  className="flex flex-col gap-[8px] h-[95px] items-start relative shrink-0 w-full"
                  data-node-id="155:76814"
                >
                  <label className="font-sans font-medium text-sm leading-[20px] text-[#101828]">
                    Dedication or Note (Optional)
                  </label>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] flex flex-1 items-start px-[16px] py-[10px] relative w-full transition-colors">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share a message, program preference, or dedication note..."
                      className="w-full h-full bg-transparent font-sans text-sm text-[#101828] placeholder-[#6a7282] outline-hidden resize-none leading-[20px]"
                    />
                  </div>
                </div>

                {/* Anonymous Donation Checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded text-[#000080] focus:ring-[#000080]/20"
                  />
                  <span>Keep my donation anonymous from public donor lists</span>
                </label>
              </div>

              {/* Submit Button (Figma node 155:76815) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00bfff] hover:bg-[#009cd9] active:bg-[#0086bc] drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex gap-[6px] items-center justify-center px-[24px] py-[14px] relative rounded-full shrink-0 w-full cursor-pointer transition-colors disabled:opacity-70 mt-1"
                data-node-id="155:76815"
              >
                <span className="font-sans font-semibold text-white text-[16px] leading-[24px] whitespace-nowrap flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {paymentMethod === "STRIPE"
                          ? "Connecting to Stripe..."
                          : "Processing PayPal..."}
                      </span>
                    </>
                  ) : (
                    `Donate $${currentAmount || 0} ${
                      frequency === "Monthly" ? "/ Month" : ""
                    } via ${paymentMethod === "STRIPE" ? "Card" : "PayPal"}`
                  )}
                </span>
              </button>

              {/* Security Tag (Figma node 155:77124) */}
              <div
                className="flex gap-[6px] items-center justify-center px-[12px] py-[4px] relative rounded-full shrink-0 w-full"
                data-node-id="155:77124"
              >
                <div className="relative shrink-0 size-[14px]">
                  <Image
                    src="/icons/donate/lock.svg"
                    alt="Lock"
                    width={14}
                    height={14}
                    className="w-[14px] h-[14px]"
                  />
                </div>
                <p className="font-sans font-semibold text-[12px] leading-[20px] text-[#717680] text-center">
                  {securityNotice}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Official Printable Receipt Modal */}
      <OfficialDonationReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        donation={confirmedDonation}
        currentAmount={currentAmount}
        frequency={frequency}
      />
    </section>
  );
}
