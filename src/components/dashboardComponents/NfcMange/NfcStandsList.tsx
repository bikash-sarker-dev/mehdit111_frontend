"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Plus,
  Printer,
  QrCode,
  Smartphone,
  Trash2,
  ExternalLink,
  Power,
  X,
  Info,
  Radio,
  Lock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetNfcCardsQuery,
  useCreateNfcCardMutation,
  useUpdateNfcCardMutation,
  useDeleteNfcCardMutation,
} from "@/redux/api/userDashboard/reviewGap/reviewGapAPI";

interface NfcCardItem {
  id: string;
  businessId: string;
  label: string;
  shortCode: string;
  cardUid?: string | null;
  redirectUrl?: string | null;
  tapCount: number;
  isActive: boolean;
  lastTappedAt?: string | null;
  createdAt: string;
  tapUrl: string;
  qrCodeDataUrl?: string;
  business?: {
    id: string;
    name: string;
    logo?: string | null;
    googleReviewUrl?: string | null;
  };
}

interface NfcStandsListProps {
  businessId?: string;
  businessName?: string;
  allowedStands?: number;
}

export default function NfcStandsList({
  businessId,
  businessName,
  allowedStands = 1,
}: NfcStandsListProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [previewCard, setPreviewCard] = useState<NfcCardItem | null>(null);
  const [printCard, setPrintCard] = useState<NfcCardItem | null>(null);

  const {
    data: cardsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetNfcCardsQuery(businessId, {
    skip: !businessId,
    pollingInterval: 3000,
    refetchOnFocus: true,
  });

  const [createNfcCard, { isLoading: isCreating }] = useCreateNfcCardMutation();
  const [updateNfcCard, { isLoading: isUpdating }] = useUpdateNfcCardMutation();
  const [deleteNfcCard, { isLoading: isDeleting }] = useDeleteNfcCardMutation();

  const rawCards: any = cardsResponse?.data ?? cardsResponse;
  const cards: NfcCardItem[] = Array.isArray(rawCards)
    ? rawCards
    : Array.isArray(rawCards?.data)
    ? rawCards.data
    : [];

  const handleCopyUrl = async (cardId: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(cardId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(cardId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDownloadQr = (card: NfcCardItem) => {
    if (!card.qrCodeDataUrl) return;
    const a = document.createElement("a");
    a.href = card.qrCodeDataUrl;
    const cleanLabel = (card.label || "nfc-stand").replace(/\s+/g, "-").toLowerCase();
    a.download = `${cleanLabel}-${card.shortCode}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

    try {
      const res = await createNfcCard({
        businessId,
        label: labelInput.trim() || "Countertop NFC Stand",
      }).unwrap();

      setIsCreateModalOpen(false);
      setLabelInput("");
      toast.success(`NFC Stand "${res?.data?.label || "Stand"}" created! URL & QR code ready.`);
      refetch();
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || "Failed to create NFC Stand";
      toast.error(errorMsg);
      setIsCreateModalOpen(false);

      if (err?.status === 403 || errorMsg.toLowerCase().includes("upgrade") || errorMsg.toLowerCase().includes("plan")) {
        setTimeout(() => {
          router.push("/dashboard/plan-management");
        }, 1200);
      }
    }
  };

  const handleToggleActive = async (card: NfcCardItem) => {
    try {
      await updateNfcCard({
        id: card.id,
        body: { isActive: !card.isActive },
      }).unwrap();
      toast.success(card.isActive ? "Stand paused" : "Stand activated");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update stand status");
    }
  };

  const handleDelete = async (card: NfcCardItem) => {
    if (!window.confirm(`Delete "${card.label}"? Anyone tapping this stand will no longer be redirected.`)) {
      return;
    }

    try {
      await deleteNfcCard(card.id).unwrap();
      toast.success("NFC Stand deleted successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not delete stand");
    }
  };


  const triggerPrint = (card: NfcCardItem) => {
    setPrintCard(card);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Printable Stand Overlay (only visible when printing) */}
      {printCard && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 text-center text-slate-900 z-50">
          <div className="max-w-sm mx-auto border-4 border-slate-900 rounded-3xl p-8 flex flex-col items-center">
            <h1 className="text-2xl font-black mb-1">
              {businessName || printCard.business?.name || "Grow More Reviews"}
            </h1>
            <p className="text-sm font-medium text-slate-600 mb-6">
              Review us on Google
            </p>

            <div className="w-56 h-56 p-3 border-2 border-slate-300 rounded-2xl mb-6 flex items-center justify-center">
              {printCard.qrCodeDataUrl ? (
                <img
                  src={printCard.qrCodeDataUrl}
                  alt="Review QR Code"
                  className="w-full h-full object-contain"
                />
              ) : null}
            </div>

            <div className="bg-slate-900 text-white rounded-xl py-3 px-6 w-full text-center">
              <p className="font-bold text-base flex items-center justify-center gap-2">
                <Radio className="h-5 w-5" /> TAP PHONE OR SCAN
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Takes 5 seconds • No app needed
              </p>
            </div>

            <p className="text-[11px] text-slate-400 mt-4">
              Stand: {printCard.label} ({printCard.shortCode})
            </p>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Physical NFC Stands & QR Codes
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                Generate tracking URLs to write onto NFC chips and print matching QR codes for physical countertop stands.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Plan Quota:
            </span>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {cards.length} / {allowedStands} Stands Used
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (cards.length >= allowedStands) {
                setIsUpgradeModalOpen(true);
              } else {
                setIsCreateModalOpen(true);
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {cards.length >= allowedStands ? (
              <>
                <Lock className="h-4 w-4" />
                Upgrade for More Stands
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create New Stand
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step-by-step Execution Banner (Matching Mehdi's Workflow) */}
      <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/40 dark:from-blue-950/20 dark:via-slate-900 dark:to-blue-950/20 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 p-1.5 text-blue-600 dark:text-blue-400 shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">
              How to Program & Deploy Countertop Stands:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              <li>
                <span className="font-medium text-slate-900 dark:text-white">Copy the Tracking URL</span> using the button on any stand below.
              </li>
              <li>
                <span className="font-medium text-slate-900 dark:text-white">Write onto the NFC chip</span> with your phone (using any free NFC app such as <em>NFC Tools</em>).
              </li>
              <li>
                <span className="font-medium text-slate-900 dark:text-white">Print the QR Code</span> and stick it directly onto the stand so non-NFC phones can scan.
              </li>
              <li>
                <span className="font-medium text-slate-900 dark:text-white">Place the stand at the counter</span>—every customer tap automatically counts on your dashboard.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Stands List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-48 rounded-2xl bg-gray-100 dark:bg-slate-800" />
          <div className="h-48 rounded-2xl bg-gray-100 dark:bg-slate-800" />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 p-8 sm:p-12">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-3">
            <Smartphone className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            No NFC Stands Created Yet
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            Create your first physical review stand to generate a tracking URL and print a matching QR code.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create First Stand
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {cards.map((card) => {
            const isCopied = copiedId === card.id;

            return (
              <div
                key={card.id}
                className={`rounded-2xl border bg-white dark:bg-[#0b1727] p-5 shadow-sm transition-all ${
                  card.isActive
                    ? "border-gray-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700"
                    : "border-gray-100 dark:border-slate-800/60 opacity-60 bg-gray-50/50"
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Radio className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {card.label}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs text-gray-400 dark:text-slate-500">
                          {card.shortCode}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            card.isActive
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {card.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title={card.isActive ? "Pause Stand" : "Activate Stand"}
                      onClick={() => handleToggleActive(card)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Power className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete Stand"
                      onClick={() => handleDelete(card)}
                      className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Middle info & QR preview */}
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl p-3.5 border border-gray-100 dark:border-slate-800/80">
                  {/* QR Code thumbnail */}
                  <div
                    onClick={() => setPreviewCard(card)}
                    className="relative cursor-pointer group shrink-0 w-20 h-20 bg-white dark:bg-white rounded-lg p-1.5 border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-center"
                    title="Click to Enlarge QR"
                  >
                    {card.qrCodeDataUrl ? (
                      <img
                        src={card.qrCodeDataUrl}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QrCode className="h-8 w-8 text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-semibold">
                      Preview
                    </div>
                  </div>

                  {/* Tracking link & stats */}
                  <div className="flex-1 min-w-0 w-full space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-slate-400 font-medium">
                        NFC Tracking URL:
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ⚡ {card.tapCount} Total Taps
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={card.tapUrl}
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-mono text-gray-700 dark:text-slate-300 select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(card.id, card.tapUrl)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                          isCopied
                            ? "bg-emerald-600 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1"}/nfc/t/${card.shortCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 shrink-0 transition-colors"
                        title="Test NFC Tap & Review Flow"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Test Flow
                      </a>
                    </div>

                    <p className="text-[11px] text-gray-400 dark:text-slate-500">
                      Write this URL onto your NFC chip using the NFC Tools app.
                    </p>
                  </div>
                </div>

                {/* Footer buttons: Download QR & Print Stand */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="text-gray-400 dark:text-slate-500 text-[11px]">
                    Created: {new Date(card.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadQr(card)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      <Download className="h-3.5 w-3.5 text-blue-600" />
                      Download QR
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerPrint(card)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      <Printer className="h-3.5 w-3.5 text-emerald-600" />
                      Print Stand
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create NFC Stand */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0b1727] border border-gray-100 dark:border-slate-800 p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Create New NFC Stand
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Assign a location label to track taps from this specific spot.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Stand Label / Location Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Front Cashier Desk, Table 5, Bar Counter"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                When created, you will get a unique tracking URL to write to your NFC chip and a high-definition QR code ready for printing.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                >
                  {isCreating ? "Generating..." : "Generate Stand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quota Exceeded / Upgrade Required */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0b1727] border border-gray-100 dark:border-slate-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center pt-2">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-600 flex items-center justify-center mb-4 shadow-inner">
                <Lock className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                NFC Stands Limit Reached
              </h3>

              <p className="text-sm text-gray-600 dark:text-slate-300 mb-5 leading-relaxed">
                Your current plan includes <span className="font-semibold text-blue-600 dark:text-blue-400">{allowedStands} NFC Stand</span>. 
                You have already deployed all of them ({cards.length} / {allowedStands}).
              </p>

              <div className="w-full bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 mb-6 text-left space-y-2.5">
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Available Upgrades:
                </p>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-gray-700 dark:text-slate-300">Growth Plan</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">2 Stands Included</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-gray-700 dark:text-slate-300">Pro Plan</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">5 Stands Included</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-gray-700 dark:text-slate-300">Enterprise Plan</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">15 Stands Included</span>
                </div>
              </div>

              <div className="flex w-full items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <Link
                  href="/dashboard/plan-management"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white shadow-sm"
                >
                  <span>Upgrade Plan</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: QR Code Preview */}
      {previewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0b1727] border border-gray-100 dark:border-slate-800 p-6 shadow-2xl text-center relative">
            <button
              onClick={() => setPreviewCard(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {previewCard.label}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
              Scan to write a Google review for {businessName || previewCard.business?.name || "this business"}
            </p>

            <div className="mx-auto w-64 h-64 p-3 bg-white rounded-2xl border-2 border-gray-200 shadow-inner flex items-center justify-center mb-5">
              {previewCard.qrCodeDataUrl ? (
                <img
                  src={previewCard.qrCodeDataUrl}
                  alt="High Res QR Code"
                  className="w-full h-full object-contain"
                />
              ) : null}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleDownloadQr(previewCard)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => triggerPrint(previewCard)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <Printer className="h-4 w-4" />
                Print Stand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
