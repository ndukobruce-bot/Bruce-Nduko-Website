"use client";

import { useEffect, useState } from "react";
import { formatNairobiTime, isProbablyAsleep } from "@/lib/time";

export function NairobiClock() {
  const [time, setTime] = useState<string | null>(null);
  const [asleep, setAsleep] = useState(false);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(formatNairobiTime(now));
      setAsleep(isProbablyAsleep(now));
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted">
      <span
        className={
          "pulse-dot relative flex size-1.5 rounded-full " +
          (asleep ? "bg-muted text-muted" : "bg-accent text-accent")
        }
      />
      {time ? (
        <span>
          {asleep ? "Probably asleep" : "Building in Nairobi"} · {time} EAT
        </span>
      ) : (
        <span>Building in Nairobi</span>
      )}
    </span>
  );
}
