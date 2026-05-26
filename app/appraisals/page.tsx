"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { employees } from "@/lib/employees";
import { getAllAppraisals, type Appraisal, type AppraisalStatus, computeStatus, avgScore } from "@/lib/idb-appraisals";

const PERIOD = "2026 H1";

const statusMeta: Record<AppraisalStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "Pending", bg: "bg-stone-50", text: "text-stone-400", dot: "bg-stone-300" },
  "self-submitted": { label: "Self Done", bg: "bg-stone-50", text: "text-stone-600", dot: "bg-stone-400" },
  "manager-submitted": { label: "Manager Done", bg: "bg-stone-50", text: "text-stone-600", dot: "bg-stone-600" },
  complete: { label: "Complete", bg: "bg-stone-50", text: "text-stone-700", dot: "bg-stone-800" },
};

function StarDisplay({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-3 w-3 ${i <= Math.round(score) ? "text-amber-400" : "text-stone-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function AppraisalsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [appraisals, setAppraisals] = useState<Record<number, Appraisal>>({});
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | AppraisalStatus>("All");

  useEffect(() => {
    if (!sessionStorage.getItem("isLoggedIn")) {
      router.replace("/");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    getAllAppraisals().then((all) => {
      const map: Record<number, Appraisal> = {};
      all.forEach((a) => { map[a.employee_id] = a; });
      setAppraisals(map);
    });
  }, [authChecked]);

  if (!authChecked) return null;

  const allDepts = ["All", ...Array.from(new Set(employees.map((e) => e.department))).sort()];

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
    const matchDept = deptFilter === "All" || e.department === deptFilter;
    const appraisalStatus: AppraisalStatus = appraisals[e.id] ? computeStatus(appraisals[e.id]) : "pending";
    const matchStatus = statusFilter === "All" || appraisalStatus === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const total = employees.length;
  const counts = { pending: 0, "self-submitted": 0, "manager-submitted": 0, complete: 0 };
  employees.forEach((e) => {
    const s: AppraisalStatus = appraisals[e.id] ? computeStatus(appraisals[e.id]) : "pending";
    counts[s]++;
  });

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(145deg, #fdf6ed 0%, #f0e0c8 55%, #e5c9a0 100%)" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white border-b border-stone-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-8 w-8 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition shadow-sm"
              aria-label="Go back"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#e8d5b7] to-[#d4b59a] flex items-center justify-center shadow-md shadow-stone-200">
                <svg className="h-4 w-4 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-stone-800 font-bold text-base tracking-tight">Appraisals</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <button
                onClick={() => router.push("/employees")}
                className="text-stone-400 hover:text-stone-800 transition font-medium px-2 py-1 rounded-lg hover:bg-stone-100"
              >
                Directory
              </button>
              <span className="text-stone-300">/</span>
              <span className="text-stone-700 font-semibold px-2 py-1">Appraisals</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { sessionStorage.removeItem("isLoggedIn"); router.replace("/"); }}
              className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-100 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">Performance Appraisals</h1>
          <p className="text-stone-500 mt-2 text-base">{PERIOD} · {total} employees · click any card to open appraisal</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {(["pending", "self-submitted", "manager-submitted", "complete"] as AppraisalStatus[]).map((s) => {
            const meta = statusMeta[s];
            const pct = Math.round((counts[s] / total) * 100);
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
                className={`relative rounded-2xl border p-4 text-left transition-all shadow-sm hover:shadow-md cursor-pointer ${
                  statusFilter === s
                    ? "border-stone-400 bg-stone-50 ring-2 ring-stone-200"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                  <span className="text-xs font-semibold text-stone-500">{meta.label}</span>
                </div>
                <p className="text-3xl font-bold text-stone-800">{counts[s]}</p>
                <div className="mt-2 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                  <div className={`h-full rounded-full ${meta.dot} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-xs text-stone-400">{pct}% of total</p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="relative mb-4">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, role, or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white pl-11 pr-4 py-3.5 text-stone-800 placeholder-stone-400 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-100 transition text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {allDepts.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                deptFilter === dept
                  ? "bg-stone-800 text-stone-50 border border-stone-700"
                  : "bg-white border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700"
              } shadow-sm`}
            >
              {dept}
            </button>
          ))}
        </div>

        <p className="text-xs text-stone-400 mb-5">
          {filtered.length === 0 ? "No employees found" : `${filtered.length} employee${filtered.length !== 1 ? "s" : ""}`}
        </p>

        {/* Employee grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <p className="text-base font-semibold text-stone-600">No employees found</p>
            <p className="text-sm text-stone-400 mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((emp) => {
              const appraisal = appraisals[emp.id];
              const status: AppraisalStatus = appraisal ? computeStatus(appraisal) : "pending";
              const meta = statusMeta[status];
              const selfAvg = appraisal?.self_review ? avgScore(appraisal.self_review) : 0;
              const mgrAvg = appraisal?.manager_review ? avgScore(appraisal.manager_review) : 0;

              return (
                <button
                  key={emp.id}
                  onClick={() => router.push(`/appraisals/${emp.id}`)}
                  className="group relative flex flex-col bg-white rounded-3xl overflow-hidden text-left border border-stone-200/50 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-stone-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400/30"
                >
                  <div className="bg-gradient-to-br from-[#f5ebe0] to-[#e0c9a6] h-[56px] w-full shrink-0" />

                  <div className="-mt-8 flex justify-center relative z-10 shrink-0">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl bg-white">
                      <img
                        src={`https://i.pravatar.cc/128?u=${encodeURIComponent(emp.email)}`}
                        alt={emp.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="px-4 pt-2 pb-4 flex flex-col items-center gap-2 flex-1">
                    <div className="text-center">
                      <p className="font-bold text-stone-900 text-sm leading-tight">{emp.name}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{emp.role}</p>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border bg-stone-50 text-stone-600 border-stone-200">
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>

                    {(selfAvg > 0 || mgrAvg > 0) && (
                      <div className="w-full space-y-1.5 pt-1 border-t border-stone-100">
                        {selfAvg > 0 && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-stone-400 font-medium w-14">Self</span>
                            <StarDisplay score={selfAvg} />
                            <span className="text-[10px] font-bold text-stone-600 w-6 text-right">{selfAvg.toFixed(1)}</span>
                          </div>
                        )}
                        {mgrAvg > 0 && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-stone-400 font-medium w-14">Manager</span>
                            <StarDisplay score={mgrAvg} />
                            <span className="text-[10px] font-bold text-stone-600 w-6 text-right">{mgrAvg.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {appraisal?.goals && appraisal.goals.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {appraisal.goals.filter((g) => g.status === "complete").length}/{appraisal.goals.length} goals done
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-transparent group-hover:ring-stone-400/30 transition-all duration-300 pointer-events-none" />
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
