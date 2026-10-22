"use client";

import React, { useMemo, useState } from "react";
import {
  Star,
  Bot,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Send,
  Trash2,
  Edit3,
  ThumbsUp,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
import { useGetMyBusinessProfileQuery } from "@/redux/api/userDashboard/overview/overviewApi";
import {
  useGetReviewsQuery,
  useGenerateAiRepliesMutation,
  useReplyToReviewMutation,
  useDeleteReplyMutation,
  IReview,
  IAiReplyOption,
} from "@/redux/api/userDashboard/review/reviewApi";

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
];

export default function ReviewsManager() {
  const { data: meRes, isLoading: meLoading } = useGetMeProfileQuery(undefined);
  const me = meRes?.data;
  const businessId = me?.businessId ?? me?.businesses?.[0]?.id;

  const { data: bizRes, refetch: refetchBiz } = useGetMyBusinessProfileQuery(
    businessId,
    { skip: !businessId, pollingInterval: 5000, refetchOnFocus: true }
  );
  const business = bizRes?.data;
  const subscription = business?.subscription;

  // Filter states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("ALL"); // ALL, REPLIED, PENDING
  const [sentimentFilter, setSentimentFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const isRepliedParam =
    statusFilter === "REPLIED" ? true : statusFilter === "PENDING" ? false : undefined;

  const {
    data: reviewsRes,
    isLoading: reviewsLoading,
    isFetching: reviewsFetching,
    refetch: refetchReviews,
  } = useGetReviewsQuery(
    {
      businessId: businessId ?? "",
      page,
      limit,
      rating: ratingFilter,
      isReplied: isRepliedParam,
      sentiment:
        sentimentFilter !== "ALL"
          ? (sentimentFilter as "POSITIVE" | "NEUTRAL" | "NEGATIVE")
          : undefined,
      searchTerm: searchTerm.trim() || undefined,
    },
    { skip: !businessId, pollingInterval: 6000, refetchOnFocus: true }
  );

  const rawReviewsData = reviewsRes?.data;
  const reviews: IReview[] = Array.isArray(rawReviewsData)
    ? rawReviewsData
    : Array.isArray((rawReviewsData as any)?.data)
    ? (rawReviewsData as any).data
    : [];

  const meta =
    (rawReviewsData as any)?.meta ??
    reviewsRes?.metaData ??
    reviewsRes?.meta ?? { page: 1, limit: 10, total: reviews.length, totalPages: 1 };

  const summary = (rawReviewsData as any)?.summary;

  // AI Reply Mutations
  const [generateAiReplies, { isLoading: isGeneratingAi }] =
    useGenerateAiRepliesMutation();
  const [replyToReview, { isLoading: isPostingReply }] =
    useReplyToReviewMutation();
  const [deleteReply, { isLoading: isDeletingReply }] = useDeleteReplyMutation();

  // Active AI drafting state per review
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [draftOptions, setDraftOptions] = useState<Record<string, IAiReplyOption[]>>({});
  const [selectedTone, setSelectedTone] = useState<Record<string, string>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Trigger DeepSeek AI reply generation
  const handleGenerateAi = async (reviewId: string) => {
    try {
      setActiveReviewId(reviewId);
      const res = await generateAiReplies(reviewId).unwrap();
      const options = res.data?.options ?? [];
      setDraftOptions((prev) => ({ ...prev, [reviewId]: options }));

      // Pick first tone by default (usually Professional or Friendly)
      if (options.length > 0) {
        setSelectedTone((prev) => ({ ...prev, [reviewId]: options[0].tone }));
        setReplyInputs((prev) => ({ ...prev, [reviewId]: options[0].reply }));
      }
      toast.success("AI smart reply options generated!");
      refetchBiz();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to generate AI replies"
      );
    }
  };

  const handleSelectTone = (reviewId: string, option: IAiReplyOption) => {
    setSelectedTone((prev) => ({ ...prev, [reviewId]: option.tone }));
    setReplyInputs((prev) => ({ ...prev, [reviewId]: option.reply }));
  };

  const handlePostReply = async (reviewId: string, isAi: boolean = false) => {
    const text = replyInputs[reviewId]?.trim();
    if (!text) {
      toast.error("Reply text cannot be empty");
      return;
    }

    try {
      await replyToReview({
        reviewId,
        replyText: text,
        isAiGenerated: isAi || Boolean(draftOptions[reviewId]?.length),
      }).unwrap();

      toast.success("Reply saved successfully!");
      setActiveReviewId(null);
      refetchReviews();
      refetchBiz();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to post reply");
    }
  };

  const handleDeleteReply = async (reviewId: string) => {
    if (!confirm("Are you sure you want to remove this reply?")) return;
    try {
      await deleteReply(reviewId).unwrap();
      toast.success("Reply removed");
      refetchReviews();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to delete reply");
    }
  };

  // Quotas calculations
  const aiLimit = subscription?.aiReplyLimit ?? 100;
  const aiUsed = subscription?.aiReplyUsed ?? 0;
  const aiPercentage = Math.min(Math.round((aiUsed / (aiLimit || 1)) * 100), 100);

  const avgRating = business?.rating ?? 5.0;
  const totalReviews = summary?.total ?? meta.total ?? reviews.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1727] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400">
              <Bot className="h-3.5 w-3.5" />
              DeepSeek AI Reply Engine
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Reviews & AI Auto-Replies
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your Google customer reviews, analyze review sentiment, and generate smart, tailored AI replies in one click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                refetchReviews();
                refetchBiz();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${reviewsFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: AI Auto-Replies Quota */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4.5 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Bot className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {aiUsed} / {aiLimit}
                </p>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {aiPercentage}%
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                AI Auto-Replies Used
              </p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                  style={{ width: `${aiPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Total Reviews */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4.5 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Star className="h-5 w-5 fill-current" />
            </span>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {totalReviews}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Reviews Synced
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Across Google Profiles</p>
            </div>
          </div>

          {/* Card 3: Average Rating */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4.5 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <ThumbsUp className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {avgRating.toFixed(1)}
                </p>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.round(avgRating)
                          ? "fill-current text-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Average Rating Score
              </p>
              <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                High Reputation Score
              </p>
            </div>
          </div>

          {/* Card 4: Response Rate */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4.5 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {summary?.replied ?? reviews.filter((r) => r.isReplied).length} / {(summary?.total ?? reviews.length) || 0}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Reviews Responded
              </p>
              <p className="mt-1 text-[11px] text-slate-400">AI & Manual Responses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0b1727] sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search reviews by customer name or keyword..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Rating Filter */}
          <select
            value={ratingFilter ?? ""}
            onChange={(e) => {
              setRatingFilter(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Needs Reply</option>
            <option value="REPLIED">Replied</option>
          </select>

          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => {
              setSentimentFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">All Sentiments</option>
            <option value="POSITIVE">Positive 😊</option>
            <option value="NEUTRAL">Neutral 😐</option>
            <option value="NEGATIVE">Negative 🙁</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#0b1727]">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="mt-3 text-sm text-slate-500">Loading customer reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#0b1727]">
            <MessageSquare className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
              No reviews found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          reviews.map((rev, idx) => {
            const isDrafting = activeReviewId === rev.id;
            const options = draftOptions[rev.id] || [];
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

            return (
              <div
                key={rev.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#0b1727] sm:p-6"
              >
                {/* Author & Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-xs ${avatarColor}`}
                    >
                      {rev.authorName?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {rev.authorName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating
                                  ? "fill-current text-amber-400"
                                  : "text-slate-200 dark:text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(rev.reviewDate || rev.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Sentiment Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        rev.sentiment === "POSITIVE"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : rev.sentiment === "NEGATIVE"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {rev.sentiment === "POSITIVE"
                        ? "Positive 😊"
                        : rev.sentiment === "NEGATIVE"
                        ? "Negative 🙁"
                        : "Neutral 😐"}
                    </span>

                    {rev.isReplied ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Replied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        <Clock className="h-3 w-3" />
                        Needs Reply
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mt-3.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300 sm:text-sm">
                  {rev.text || <em className="text-slate-400">No review text provided.</em>}
                </div>

                {/* Existing Reply Display */}
                {rev.isReplied && rev.replyText && !isDrafting && (
                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-100/80 dark:border-blue-900/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                        {rev.isAiGeneratedReply ? (
                          <>
                            <Bot className="h-3.5 w-3.5" />
                            <span>AI-Generated Response</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Response from Business</span>
                          </>
                        )}
                        {rev.replyDate && (
                          <span className="text-[10px] font-normal text-slate-400 ml-1">
                            · {new Date(rev.replyDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReviewId(rev.id);
                            setReplyInputs((prev) => ({
                              ...prev,
                              [rev.id]: rev.replyText || "",
                            }));
                          }}
                          className="text-[11px] text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReply(rev.id)}
                          className="text-[11px] text-rose-600 hover:text-rose-800 dark:text-rose-400 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rev.replyText}
                    </p>
                  </div>
                )}

                {/* Interactive AI Drafting Box */}
                {isDrafting ? (
                  <div className="mt-4 rounded-xl border border-blue-200 bg-slate-50/80 p-4 dark:border-blue-900/60 dark:bg-slate-900/80">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Smart AI Reply Drafts (DeepSeek)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveReviewId(null)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* AI Tone Options Tabs */}
                    {options.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                          Select AI Tone Option:
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          {options.map((opt) => {
                            const isSelected = selectedTone[rev.id] === opt.tone;
                            return (
                              <button
                                key={opt.tone}
                                type="button"
                                onClick={() => handleSelectTone(rev.id, opt)}
                                className={`rounded-xl border p-2.5 text-left text-xs transition cursor-pointer ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-50/80 text-blue-800 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-200 font-semibold ring-1 ring-blue-500"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>
                                    {opt.tone === "Professional"
                                      ? "👔 Professional"
                                      : opt.tone === "Friendly"
                                      ? "😊 Friendly"
                                      : "🤝 Empathetic"}
                                  </span>
                                  {isSelected && (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                                  )}
                                </div>
                                <p className="mt-1 line-clamp-2 text-[11px] font-normal opacity-85">
                                  {opt.reply}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Editable Textarea */}
                    <div className="mt-3">
                      <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Customize Your Response:
                      </label>
                      <textarea
                        rows={3}
                        value={replyInputs[rev.id] || ""}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({
                            ...prev,
                            [rev.id]: e.target.value,
                          }))
                        }
                        placeholder="Select an AI tone above or type your customized reply..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveReviewId(null)}
                        className="rounded-xl px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isPostingReply}
                        onClick={() => handlePostReply(rev.id, true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="h-3 w-3" />
                        {isPostingReply ? "Saving..." : "Save & Publish Reply"}
                      </button>
                    </div>
                  </div>
                ) : (
                  !rev.isReplied && (
                    <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        disabled={isGeneratingAi && activeReviewId === rev.id}
                        onClick={() => handleGenerateAi(rev.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-95 disabled:opacity-60 cursor-pointer"
                      >
                        <Sparkles
                          className={`h-3.5 w-3.5 ${
                            isGeneratingAi && activeReviewId === rev.id
                              ? "animate-spin"
                              : ""
                          }`}
                        />
                        {isGeneratingAi && activeReviewId === rev.id
                          ? "Generating AI Options..."
                          : "✨ Generate AI Reply (DeepSeek)"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveReviewId(rev.id);
                          setReplyInputs((prev) => ({
                            ...prev,
                            [rev.id]: "",
                          }));
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                        Write Custom Reply
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0b1727]">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing Page <strong>{meta.page}</strong> of <strong>{meta.totalPages}</strong> ({meta.total} total reviews)
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
