const DB_NAME = "employee-appraisals";
const STORE_NAME = "appraisals";
const DB_VERSION = 1;

export type CompetencyScore = {
  score: number;
  comment: string;
};

export type AppraisalReview = {
  performance: CompetencyScore;
  communication: CompetencyScore;
  teamwork: CompetencyScore;
  innovation: CompetencyScore;
  leadership: CompetencyScore;
  overall_comment: string;
  submitted_at: string;
};

export type Goal = {
  id: string;
  title: string;
  status: "not-started" | "in-progress" | "complete";
};

export type AppraisalStatus = "pending" | "self-submitted" | "manager-submitted" | "complete";

export type Appraisal = {
  employee_id: number;
  period: string;
  status: AppraisalStatus;
  self_review: AppraisalReview | null;
  manager_review: AppraisalReview | null;
  goals: Goal[];
  updated_at: string;
};

export const EMPTY_REVIEW: Omit<AppraisalReview, "submitted_at"> = {
  performance: { score: 0, comment: "" },
  communication: { score: 0, comment: "" },
  teamwork: { score: 0, comment: "" },
  innovation: { score: 0, comment: "" },
  leadership: { score: 0, comment: "" },
  overall_comment: "",
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: "employee_id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAppraisal(employeeId: number): Promise<Appraisal | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(employeeId);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveAppraisal(appraisal: Appraisal): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(appraisal);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllAppraisals(): Promise<Appraisal[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result ?? []);
    req.onerror = () => reject(req.error);
  });
}

export function computeStatus(a: Appraisal): AppraisalStatus {
  if (a.self_review && a.manager_review) return "complete";
  if (a.manager_review) return "manager-submitted";
  if (a.self_review) return "self-submitted";
  return "pending";
}

export function avgScore(review: AppraisalReview): number {
  const scores = [
    review.performance.score,
    review.communication.score,
    review.teamwork.score,
    review.innovation.score,
    review.leadership.score,
  ].filter((s) => s > 0);
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
