"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { employees } from "@/lib/employees";
import {
  getAppraisal,
  saveAppraisal,
  computeStatus,
  avgScore,
  EMPTY_REVIEW,
  type Appraisal,
  type AppraisalReview,
  type CompetencyScore,
  type Goal,
  type AppraisalStatus,
} from "@/lib/idb-appraisals";

const PERIOD = "2026 H1";

const MANAGER_ROLE_KEYWORDS = ["Manager", "Lead", "Head of", "VP ", "CEO", "CTO", "CFO", "Director"];

function isManagerRole(role: string): boolean {
  return MANAGER_ROLE_KEYWORDS.some((kw) => role.includes(kw));
}

type Tab = "goals" | "self" | "manager" | "summary";

const COMPETENCIES: { key: keyof Omit<AppraisalReview, "overall_comment" | "submitted_at">; label: string; desc: string }[] = [
  { key: "performance", label: "Performance", desc: "Quality and impact of work delivered" },
  { key: "communication", label: "Communication", desc: "Clarity, frequency, and effectiveness" },
  { key: "teamwork", label: "Teamwork", desc: "Collaboration, support, and team contribution" },
  { key: "innovation", label: "Innovation", desc: "Initiative, creativity, and problem-solving" },
  { key: "leadership", label: "Leadership", desc: "Ownership, mentoring, and decision-making" },
];

const SCORE_LABELS: Record<number, string> = {
  1: "Below expectations",
  2: "Needs improvement",
  3: "Meets expectations",
  4: "Exceeds expectations",
  5: "Outstanding",
};

const GOAL_STATUS_META = {
  "not-started": { label: "Not started", bg: "bg-stone-100", text: "text-stone-400" },
  "in-progress": { label: "In progress", bg: "bg-stone-200", text: "text-stone-600" },
  complete: { label: "Complete", bg: "bg-stone-800", text: "text-stone-50" },
};

function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => !readonly && setHovered(i)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <svg
            className={`h-7 w-7 transition-colors ${
              i <= (hovered || value)
                ? "text-amber-400"
                : "text-stone-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 self-center text-xs font-semibold text-stone-500">{SCORE_LABELS[value]}</span>
      )}
    </div>
  );
}

function ScoreBar({ label, self, manager }: { label: string; self: number; manager: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-600">{label}</span>
        <div className="flex gap-3 text-xs text-stone-400">
          {self > 0 && <span className="text-stone-600 font-bold">Self: {self}/5</span>}
          {manager > 0 && <span className="text-[#8a6d4a] font-bold">Mgr: {manager}/5</span>}
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-stone-600 transition-all duration-500"
            style={{ width: `${(self / 5) * 100}%` }}
          />
        </div>
        <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#c4956a] transition-all duration-500"
            style={{ width: `${(manager / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

type ReviewDraft = Omit<AppraisalReview, "submitted_at">;

function ReviewForm({
  title,
  initial,
  onSubmit,
  submitted,
  submittedAt,
  readonly,
  lockedMessage,
}: {
  title: string;
  initial: ReviewDraft;
  onSubmit: (review: ReviewDraft) => void;
  submitted: boolean;
  submittedAt?: string;
  readonly?: boolean;
  lockedMessage?: string;
}) {
  const [draft, setDraft] = useState<ReviewDraft>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setDraft(initial); }, [initial]);

  function setScore(key: keyof Omit<ReviewDraft, "overall_comment">, score: number) {
    setDraft((d) => ({ ...d, [key]: { ...d[key] as CompetencyScore, score } }));
  }
  function setComment(key: keyof Omit<ReviewDraft, "overall_comment">, comment: string) {
    setDraft((d) => ({ ...d, [key]: { ...d[key] as CompetencyScore, comment } }));
  }

  const allScored = COMPETENCIES.every((c) => (draft[c.key] as CompetencyScore).score > 0);

  async function handleSubmit() {
    if (!allScored) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 200));
    onSubmit(draft);
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {submitted && submittedAt && (
        <div className="flex items-center gap-2 rounded-2xl bg-stone-50 border border-stone-200 px-4 py-3">
          <svg className="h-4 w-4 text-stone-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-stone-600 font-medium">
            {title} submitted on {new Date(submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      )}

      {readonly && !submitted && lockedMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-stone-100 border border-stone-200 px-4 py-3">
          <svg className="h-4 w-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm text-stone-500">{lockedMessage}</p>
        </div>
      )}

      {COMPETENCIES.map((c) => {
        const val = draft[c.key] as CompetencyScore;
        const isLocked = submitted || readonly;
        return (
          <div key={c.key} className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
            <div>
              <p className="font-bold text-stone-800 text-sm">{c.label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{c.desc}</p>
            </div>
            <StarRating value={val.score} onChange={(v) => setScore(c.key, v)} readonly={isLocked} />
            <textarea
              disabled={isLocked}
              placeholder={`Comments on ${c.label.toLowerCase()}…`}
              value={val.comment}
              onChange={(e) => setComment(c.key, e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-700 placeholder-stone-400 resize-none focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        );
      })}

      <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
        <p className="font-bold text-stone-800 text-sm">Overall Comments</p>
        <textarea
          disabled={submitted || readonly}
          placeholder="Overall summary, highlights, and areas for growth…"
          value={draft.overall_comment}
          onChange={(e) => setDraft((d) => ({ ...d, overall_comment: e.target.value }))}
          rows={4}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-700 placeholder-stone-400 resize-none focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>

      {!submitted && !readonly && (
        <button
          onClick={handleSubmit}
          disabled={!allScored || saving}
          className="w-full rounded-2xl bg-stone-800 hover:bg-stone-700 active:bg-stone-900 py-3 text-sm font-bold text-stone-50 transition focus:outline-none focus:ring-2 focus:ring-stone-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Submitting…" : `Submit ${title}`}
        </button>
      )}
      {!submitted && !readonly && !allScored && (
        <p className="text-center text-xs text-stone-400">Rate all 5 competencies to submit</p>
      )}
    </div>
  );
}

export default function AppraisalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const emp = employees.find((e) => e.id === id);

  const [authChecked, setAuthChecked] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("goals");
  const [appraisal, setAppraisal] = useState<Appraisal | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("isLoggedIn")) {
      router.replace("/");
    } else {
      setAuthChecked(true);
      setLoggedInEmail(sessionStorage.getItem("currentUserEmail"));
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked || !emp) return;
    getAppraisal(id).then((a) => {
      setAppraisal(
        a ?? {
          employee_id: id,
          period: PERIOD,
          status: "pending",
          self_review: null,
          manager_review: null,
          goals: [],
          updated_at: new Date().toISOString(),
        }
      );
    });
  }, [authChecked, id, emp]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  async function persistAppraisal(updated: Appraisal) {
    const withStatus = { ...updated, status: computeStatus(updated), updated_at: new Date().toISOString() };
    setSaving(true);
    await saveAppraisal(withStatus);
    setAppraisal(withStatus);
    setSaving(false);
  }

  async function addGoal() {
    if (!appraisal || !newGoalTitle.trim()) return;
    const goal: Goal = { id: crypto.randomUUID(), title: newGoalTitle.trim(), status: "not-started" };
    const updated = { ...appraisal, goals: [...appraisal.goals, goal] };
    await persistAppraisal(updated);
    setNewGoalTitle("");
    showToast("Goal added");
  }

  async function updateGoalStatus(goalId: string, status: Goal["status"]) {
    if (!appraisal) return;
    const goals = appraisal.goals.map((g) => (g.id === goalId ? { ...g, status } : g));
    await persistAppraisal({ ...appraisal, goals });
  }

  async function deleteGoal(goalId: string) {
    if (!appraisal) return;
    const goals = appraisal.goals.filter((g) => g.id !== goalId);
    await persistAppraisal({ ...appraisal, goals });
    showToast("Goal removed");
  }

  async function submitReview(type: "self" | "manager", draft: ReviewDraft) {
    if (!appraisal) return;
    const review: AppraisalReview = { ...draft, submitted_at: new Date().toISOString() };
    const updated = type === "self"
      ? { ...appraisal, self_review: review }
      : { ...appraisal, manager_review: review };
    await persistAppraisal(updated);
    showToast(`${type === "self" ? "Self evaluation" : "Manager review"} submitted!`);
    if (type === "self") setTab("manager");
    else setTab("summary");
  }

  if (!authChecked || !appraisal) return null;

  const isAdmin = !loggedInEmail;
  const userRole = typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
  const isManager = userRole === "manager" || userRole === "admin";
  const loggedInEmployee = employees.find((e) => e.email === loggedInEmail);
  const canEdit = isAdmin || (!!emp && emp.email === loggedInEmail);
  const canGiveManagerReview = isAdmin || isManager || isManagerRole(loggedInEmployee?.role ?? "");
  const canView = canEdit || canGiveManagerReview;

  if (!emp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Employee not found.</p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(145deg, #fdf6ed 0%, #f0e0c8 55%, #e5c9a0 100%)" }}>
        <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 max-w-sm w-full text-center space-y-4 mx-4">
          <div className="h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto">
            <svg className="h-6 w-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-stone-800 text-lg">Access Restricted</p>
            <p className="text-sm text-stone-500 mt-1">You can only view your own appraisal.</p>
          </div>
          {loggedInEmployee && (
            <button
              onClick={() => router.replace(`/appraisals/${loggedInEmployee.id}`)}
              className="w-full rounded-2xl bg-stone-800 hover:bg-stone-700 py-3 text-sm font-bold text-stone-50 transition"
            >
              Go to My Appraisal
            </button>
          )}
          <button
            onClick={() => router.back()}
            className="w-full rounded-2xl border border-stone-200 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const status: AppraisalStatus = computeStatus(appraisal);
  const statusLabels: Record<AppraisalStatus, string> = {
    pending: "Pending",
    "self-submitted": "Self Completed",
    "manager-submitted": "Manager Completed",
    complete: "Complete",
  };
  const statusColors: Record<AppraisalStatus, string> = {
    pending: "bg-stone-100 text-stone-400 border-stone-200",
    "self-submitted": "bg-stone-50 text-stone-600 border-stone-200",
    "manager-submitted": "bg-stone-50 text-stone-600 border-stone-200",
    complete: "bg-stone-50 text-stone-700 border-stone-300",
  };

  const selfDraft: ReviewDraft = appraisal.self_review
    ? {
        performance: appraisal.self_review.performance,
        communication: appraisal.self_review.communication,
        teamwork: appraisal.self_review.teamwork,
        innovation: appraisal.self_review.innovation,
        leadership: appraisal.self_review.leadership,
        overall_comment: appraisal.self_review.overall_comment,
      }
    : { ...EMPTY_REVIEW };

  const mgrDraft: ReviewDraft = appraisal.manager_review
    ? {
        performance: appraisal.manager_review.performance,
        communication: appraisal.manager_review.communication,
        teamwork: appraisal.manager_review.teamwork,
        innovation: appraisal.manager_review.innovation,
        leadership: appraisal.manager_review.leadership,
        overall_comment: appraisal.manager_review.overall_comment,
      }
    : { ...EMPTY_REVIEW };

  const goalsComplete = appraisal.goals.filter((g) => g.status === "complete").length;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(145deg, #fdf6ed 0%, #f0e0c8 55%, #e5c9a0 100%)" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white border-b border-stone-200/80 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push("/appraisals")}
              className="flex items-center gap-1.5 text-stone-400 hover:text-stone-800 transition font-medium"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Appraisals
            </button>
            <span className="text-stone-300">/</span>
            <span className="text-stone-700 font-semibold truncate max-w-[160px]">{emp.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="text-xs text-stone-400 font-medium animate-pulse">Saving…</span>
            )}
            <span className={`text-xs font-semibold border px-2.5 py-1 rounded-full ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl animate-fade-in">
          {toast}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Employee header card */}
        <div className={`rounded-3xl overflow-hidden shadow-lg border border-stone-200/50`}>
          <div className="bg-gradient-to-br from-[#f5ebe0] to-[#e0c9a6] px-8 pt-8 pb-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-2xl overflow-hidden ring-4 ring-white/60 shadow-xl bg-white shrink-0">
                <img
                  src={`https://i.pravatar.cc/160?u=${encodeURIComponent(emp.email)}`}
                  alt={emp.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-800 tracking-tight">{emp.name}</h1>
                <p className="text-stone-600 text-sm mt-0.5 font-medium">{emp.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-stone-600">{emp.department}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="bg-white grid grid-cols-3 divide-x divide-stone-100 px-2">
            <div className="flex flex-col items-center py-3 gap-0.5">
              <span className="text-xs text-stone-400 font-medium">Goals</span>
              <span className="text-lg font-bold text-stone-800">{goalsComplete}/{appraisal.goals.length}</span>
              <span className="text-[10px] text-stone-400">complete</span>
            </div>
            <div className="flex flex-col items-center py-3 gap-0.5">
              <span className="text-xs text-stone-400 font-medium">Self Score</span>
              <span className="text-lg font-bold text-stone-700">
                {appraisal.self_review ? avgScore(appraisal.self_review).toFixed(1) : "—"}
              </span>
              <span className="text-[10px] text-stone-400">out of 5</span>
            </div>
            <div className="flex flex-col items-center py-3 gap-0.5">
              <span className="text-xs text-stone-400 font-medium">Manager Score</span>
              <span className="text-lg font-bold text-stone-600">
                {appraisal.manager_review ? avgScore(appraisal.manager_review).toFixed(1) : "—"}
              </span>
              <span className="text-[10px] text-stone-400">out of 5</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-stone-100 rounded-2xl p-1">
          {(["goals", "self", "manager", "summary"] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = { goals: "Goals", self: "Self Evaluation", manager: "Manager Review", summary: "Summary" };
            const indicators: Record<Tab, boolean> = {
              goals: appraisal.goals.length > 0,
              self: !!appraisal.self_review,
              manager: !!appraisal.manager_review,
              summary: !!appraisal.self_review && !!appraisal.manager_review,
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                  tab === t
                    ? "bg-white text-stone-800 shadow-md"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {labels[t]}
                {indicators[t] && (
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Goals tab */}
        {tab === "goals" && (
          <div className="space-y-4">
            {!canEdit && (
              <div className="flex items-center gap-2 rounded-2xl bg-stone-100 border border-stone-200 px-4 py-3">
                <svg className="h-4 w-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm text-stone-500">Only this employee can manage their goals.</p>
              </div>
            )}
            {canEdit && (
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Add a goal for this review period…"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGoal()}
                className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-100 transition"
              />
              <button
                onClick={addGoal}
                disabled={!newGoalTitle.trim()}
                className="rounded-2xl bg-stone-800 hover:bg-stone-700 px-5 py-3 text-sm font-bold text-stone-50 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Add
              </button>
            </div>
            )}

            {appraisal.goals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-dashed border-stone-300 bg-white/60">
                <svg className="h-10 w-10 text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-stone-500">No goals yet</p>
                <p className="text-xs text-stone-400 mt-1">Add goals above to track progress this period</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appraisal.goals.map((goal) => {
                  const meta = GOAL_STATUS_META[goal.status];
                  return (
                    <div key={goal.id} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-stone-800">{goal.title}</p>
                      </div>
                      <select
                        value={goal.status}
                        disabled={!canEdit}
                        onChange={(e) => canEdit && updateGoalStatus(goal.id, e.target.value as Goal["status"])}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-stone-200 ${canEdit ? "cursor-pointer" : "cursor-default opacity-70"} ${meta.bg} ${meta.text}`}
                      >
                        <option value="not-started">Not started</option>
                        <option value="in-progress">In progress</option>
                        <option value="complete">Complete</option>
                      </select>
                      {canEdit && (
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-stone-300 hover:text-stone-600 transition p-1 rounded-lg hover:bg-stone-100"
                          title="Delete goal"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}

                {appraisal.goals.length > 0 && (
                  <div className="rounded-2xl border border-stone-100 bg-white/70 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-stone-500">Progress</span>
                      <span className="text-xs font-bold text-stone-700">{goalsComplete}/{appraisal.goals.length} complete</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-stone-600 transition-all duration-500"
                        style={{ width: appraisal.goals.length > 0 ? `${(goalsComplete / appraisal.goals.length) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Self Evaluation tab */}
        {tab === "self" && (
          <ReviewForm
            title="Self Evaluation"
            initial={selfDraft}
            onSubmit={(draft) => submitReview("self", draft)}
            submitted={!!appraisal.self_review}
            submittedAt={appraisal.self_review?.submitted_at}
            readonly={!canEdit}
            lockedMessage="Only this employee can fill in their own self evaluation."
          />
        )}

        {/* Manager Review tab */}
        {tab === "manager" && (
          <ReviewForm
            title="Manager Review"
            initial={mgrDraft}
            onSubmit={(draft) => submitReview("manager", draft)}
            submitted={!!appraisal.manager_review}
            submittedAt={appraisal.manager_review?.submitted_at}
            readonly={!canGiveManagerReview}
            lockedMessage="Only managers or admins can submit the manager appraisal and feedback."
          />
        )}

        {/* Summary tab */}
        {tab === "summary" && (
          <div className="space-y-6">
            {!appraisal.self_review && !appraisal.manager_review ? (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-dashed border-stone-300 bg-white/60">
                <svg className="h-10 w-10 text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-semibold text-stone-500">No reviews submitted yet</p>
                <p className="text-xs text-stone-400 mt-1">Complete the Self Evaluation and Manager Review to see the summary</p>
              </div>
            ) : (
              <>
                {/* Overall score cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 text-center">
                    <p className="text-xs font-semibold text-stone-500 mb-1">Self Evaluation</p>
                    <p className="text-4xl font-bold text-stone-800">
                      {appraisal.self_review ? avgScore(appraisal.self_review).toFixed(1) : "—"}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">out of 5.0</p>
                    {appraisal.self_review && (
                      <p className="text-xs text-stone-600 mt-2 font-semibold">
                        {SCORE_LABELS[Math.round(avgScore(appraisal.self_review))]}
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-[#dcc9a8] bg-[#fdf6ed] p-5 text-center">
                    <p className="text-xs font-semibold text-stone-500 mb-1">Manager Review</p>
                    <p className="text-4xl font-bold text-stone-800">
                      {appraisal.manager_review ? avgScore(appraisal.manager_review).toFixed(1) : "—"}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">out of 5.0</p>
                    {appraisal.manager_review && (
                      <p className="text-xs text-stone-600 mt-2 font-semibold">
                        {SCORE_LABELS[Math.round(avgScore(appraisal.manager_review))]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Competency comparison */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-stone-700">Competency Breakdown</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-stone-600" />Self</span>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#c4956a]" />Manager</span>
                    </div>
                  </div>
                  {COMPETENCIES.map((c) => (
                    <ScoreBar
                      key={c.key}
                      label={c.label}
                      self={appraisal.self_review ? (appraisal.self_review[c.key] as CompetencyScore).score : 0}
                      manager={appraisal.manager_review ? (appraisal.manager_review[c.key] as CompetencyScore).score : 0}
                    />
                  ))}
                </div>

                {/* Comments */}
                {(appraisal.self_review?.overall_comment || appraisal.manager_review?.overall_comment) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {appraisal.self_review?.overall_comment && (
                      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                        <p className="text-xs font-bold text-stone-500 mb-2">Self — Overall Comments</p>
                        <p className="text-sm text-stone-700 leading-relaxed">{appraisal.self_review.overall_comment}</p>
                      </div>
                    )}
                    {appraisal.manager_review?.overall_comment && (
                      <div className="rounded-2xl border border-[#dcc9a8] bg-[#fdf6ed] p-5">
                        <p className="text-xs font-bold text-stone-500 mb-2">Manager — Overall Comments</p>
                        <p className="text-sm text-stone-700 leading-relaxed">{appraisal.manager_review.overall_comment}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Goals summary */}
                {appraisal.goals.length > 0 && (
                  <div className="rounded-3xl border border-stone-200 bg-white p-6">
                    <p className="text-sm font-bold text-stone-700 mb-4">Goals — {goalsComplete}/{appraisal.goals.length} Complete</p>
                    <div className="space-y-2">
                      {appraisal.goals.map((g) => {
                        const meta = GOAL_STATUS_META[g.status];
                        return (
                          <div key={g.id} className="flex items-center justify-between gap-3">
                            <span className="text-sm text-stone-700 flex-1">{g.title}</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.bg} ${meta.text}`}>{meta.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
