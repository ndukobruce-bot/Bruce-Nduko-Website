// Illustrative code for the site's LiveCode animation — representative of
// the kind of work described elsewhere on the site (Allama's SMS parsing,
// the billing engine, the live-status/GitHub features on this very site),
// not literal excerpts from a private repo. Never used to claim a specific
// unverified fact — purely decorative, honest as "the kind of code I write."

export type CodeLanguage = "python" | "typescript" | "sql" | "go" | "rust";

export type CodeSnippet = {
  filename: string;
  language: CodeLanguage;
  code: string;
};

export const codeSnippets: CodeSnippet[] = [
  {
    filename: "mpesa_parser.py",
    language: "python",
    code: `import re
from dataclasses import dataclass
from datetime import datetime

SMS_PATTERN = re.compile(
    r"Confirmed\\.\\s*(?P<code>[A-Z0-9]{10})\\s*"
    r"You have received Ksh(?P<amount>[\\d,]+\\.\\d{2})\\s*"
    r"from (?P<sender>[A-Za-z ]+) on (?P<date>\\d{1,2}/\\d{1,2}/\\d{2})"
)

@dataclass
class WorkRecord:
    code: str
    amount: float
    payer: str
    occurred_at: datetime
    confidence: float


def parse_sms(raw: str) -> WorkRecord | None:
    match = SMS_PATTERN.search(raw)
    if not match:
        return None

    amount = float(match.group("amount").replace(",", ""))
    occurred_at = datetime.strptime(match.group("date"), "%d/%m/%y")

    # Confidence drops if the payer name looks truncated or the amount
    # is suspiciously round — both are common OCR/forwarding artifacts.
    confidence = 0.95
    if len(match.group("sender").strip()) < 4:
        confidence -= 0.2
    if amount % 100 == 0 and amount > 1000:
        confidence -= 0.1

    return WorkRecord(
        code=match.group("code"),
        amount=amount,
        payer=match.group("sender").strip(),
        occurred_at=occurred_at,
        confidence=round(max(confidence, 0.0), 2),
    )`,
  },
  {
    filename: "rank_matches.py",
    language: "python",
    code: `from dataclasses import dataclass
from math import sqrt

@dataclass
class Candidate:
    id: str
    text: str
    vector: list[float]


def tokenize(text: str) -> list[str]:
    return [t.lower() for t in text.split() if t.isalpha()]


def embed(tokens: list[str], vocab: dict[str, int]) -> list[float]:
    vector = [0.0] * len(vocab)
    for token in tokens:
        if token in vocab:
            vector[vocab[token]] += 1.0
    return vector


def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sqrt(sum(x * x for x in a))
    norm_b = sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def rank(query: str, candidates: list[Candidate], vocab: dict[str, int]) -> list[Candidate]:
    query_vector = embed(tokenize(query), vocab)
    scored = [
        (cosine_similarity(query_vector, c.vector), c)
        for c in candidates
    ]
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [candidate for _, candidate in scored]`,
  },
  {
    filename: "passport_summary.py",
    language: "python",
    code: `from collections import defaultdict
from dataclasses import dataclass

@dataclass
class VerifiedJob:
    month: str
    amount: float
    confidence: float


def build_passport(jobs: list[VerifiedJob], min_confidence: float = 0.6) -> dict:
    trusted = [j for j in jobs if j.confidence >= min_confidence]

    by_month: dict[str, float] = defaultdict(float)
    for job in trusted:
        by_month[job.month] += job.amount

    months_active = sorted(by_month.keys())
    total_verified = sum(by_month.values())

    return {
        "months_active": months_active,
        "total_verified_ksh": round(total_verified, 2),
        "monthly_breakdown": dict(sorted(by_month.items())),
        "jobs_excluded_low_confidence": len(jobs) - len(trusted),
    }`,
  },
  {
    filename: "invoices.ts",
    language: "typescript",
    code: `import { Router } from "express";
import PDFDocument from "pdfkit";
import { createPesapalOrder } from "./pesapal";
import { sendInvoiceEmail } from "./mailer";
import { saveInvoice } from "./db";

const router = Router();

router.post("/invoices", async (req, res) => {
  const { customerId, amount, currency, email } = req.body;

  const order = await createPesapalOrder({
    amount,
    currency,
    description: \`Subscription invoice for \${customerId}\`,
  });

  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text("Tija Labs", { align: "left" });
  doc.moveDown();
  doc.fontSize(11).text(\`Invoice for \${customerId}\`);
  doc.text(\`Amount: \${currency} \${amount.toFixed(2)}\`);
  doc.text(\`Reference: \${order.trackingId}\`);
  doc.end();

  const pdf = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const invoice = await saveInvoice({
    customerId,
    amount,
    trackingId: order.trackingId,
    status: "pending",
  });

  await sendInvoiceEmail({ to: email, pdf, invoiceId: invoice.id });

  res.json({ invoiceId: invoice.id, redirectUrl: order.redirectUrl });
});

export default router;`,
  },
  {
    filename: "status-check.ts",
    language: "typescript",
    code: `type ProjectStatus = "live" | "checking";

async function checkUrl(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    // Never surface "down" on a failed check — only "live" or "checking".
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkAll(
  targets: { slug: string; url: string }[]
): Promise<Record<string, ProjectStatus>> {
  const entries = await Promise.all(
    targets.map(async (t) => {
      const ok = await checkUrl(t.url);
      return [t.slug, ok ? "live" : "checking"] as const;
    })
  );

  return Object.fromEntries(entries);
}`,
  },
  {
    filename: "github_heat.ts",
    language: "typescript",
    code: `type GithubEvent = { type: string; created_at: string };

export function buildWeeklyHeat(events: GithubEvent[], weeks = 12): number[] {
  const heat = new Array(weeks).fill(0);
  const now = Date.now();
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;

  for (const event of events) {
    const age = now - new Date(event.created_at).getTime();
    const weekIndex = Math.floor(age / msPerWeek);

    if (weekIndex >= 0 && weekIndex < weeks) {
      heat[weeks - 1 - weekIndex] += 1;
    }
  }

  return heat;
}`,
  },
  {
    filename: "verified_jobs_by_month.sql",
    language: "sql",
    code: `SELECT
  worker_id,
  DATE_TRUNC('month', occurred_at) AS month,
  COUNT(*) AS job_count,
  SUM(amount) AS total_amount,
  ROUND(AVG(confidence), 2) AS avg_confidence
FROM work_records
WHERE confidence >= 0.6
GROUP BY worker_id, DATE_TRUNC('month', occurred_at)
HAVING COUNT(*) >= 1
ORDER BY worker_id, month DESC;`,
  },
  {
    filename: "invoice_summary.sql",
    language: "sql",
    code: `SELECT
  DATE_TRUNC('month', created_at) AS billing_month,
  status,
  COUNT(*) AS invoice_count,
  SUM(amount) AS total_billed
FROM invoices
WHERE currency = 'KES'
GROUP BY DATE_TRUNC('month', created_at), status
ORDER BY billing_month DESC, status;`,
  },
  {
    filename: "rate_limiter.go",
    language: "go",
    code: `package ratelimit

import (
	"sync"
	"time"
)

type TokenBucket struct {
	mu         sync.Mutex
	tokens     float64
	maxTokens  float64
	refillRate float64 // tokens per second
	lastRefill time.Time
}

func NewTokenBucket(maxTokens, refillRate float64) *TokenBucket {
	return &TokenBucket{
		tokens:     maxTokens,
		maxTokens:  maxTokens,
		refillRate: refillRate,
		lastRefill: time.Now(),
	}
}

func (b *TokenBucket) Allow() bool {
	b.mu.Lock()
	defer b.mu.Unlock()

	now := time.Now()
	elapsed := now.Sub(b.lastRefill).Seconds()
	b.tokens = min(b.maxTokens, b.tokens+elapsed*b.refillRate)
	b.lastRefill = now

	if b.tokens >= 1.0 {
		b.tokens--
		return true
	}
	return false
}

func min(a, b float64) float64 {
	if a < b {
		return a
	}
	return b
}`,
  },
  {
    filename: "worker_pool.rs",
    language: "rust",
    code: `use std::sync::mpsc;
use std::thread;

pub struct WorkerPool {
    workers: Vec<thread::JoinHandle<()>>,
}

impl WorkerPool {
    pub fn new(size: usize, jobs_rx: mpsc::Receiver<Box<dyn FnOnce() + Send>>) -> Self {
        let jobs_rx = std::sync::Arc::new(std::sync::Mutex::new(jobs_rx));
        let mut workers = Vec::with_capacity(size);

        for id in 0..size {
            let jobs_rx = jobs_rx.clone();
            workers.push(thread::spawn(move || loop {
                let job = jobs_rx.lock().unwrap().recv();
                match job {
                    Ok(job) => {
                        println!("worker {id} picked up a job");
                        job();
                    }
                    Err(_) => break, // channel closed, shut down
                }
            }));
        }

        WorkerPool { workers }
    }

    pub fn join(self) {
        for worker in self.workers {
            let _ = worker.join();
        }
    }
}`,
  },
];
