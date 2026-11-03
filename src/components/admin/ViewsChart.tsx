"use client";

import { useState } from "react";

type Point = { date: string; count: number };

const fmt = (d: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", opts);

/** Daily page views as a single-series column chart. */
export default function ViewsChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const max = Math.max(1, ...data.map((d) => d.count));
  // Round the top of the scale to a friendly number.
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;
  const ticks = [top, top / 2, 0];
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="card p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Page views</h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Last {data.length} days · <span className="font-medium text-zinc-800">{total.toLocaleString()}</span> total
          </p>
        </div>
        <button
          onClick={() => setShowTable(!showTable)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50"
        >
          {showTable ? "Show chart" : "Show table"}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-64 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr><th className="pb-2 font-medium">Date</th><th className="pb-2 text-right font-medium">Views</th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {[...data].reverse().map((d) => (
                <tr key={d.date}>
                  <td className="py-1.5 text-zinc-700">{fmt(d.date, { weekday: "short", month: "short", day: "numeric" })}</td>
                  <td className="py-1.5 text-right tabular-nums">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-3">
          {/* Y axis */}
          <div className="relative h-48 w-8 shrink-0 text-right text-[11px] tabular-nums text-zinc-400">
            {ticks.map((t) => (
              <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${100 - (t / top) * 100}%` }}>
                {t}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="relative h-48" onMouseLeave={() => setHover(null)}>
              {/* Grid lines */}
              {ticks.map((t) => (
                <div
                  key={t}
                  className={`absolute inset-x-0 border-t ${t === 0 ? "border-zinc-300" : "border-dashed border-zinc-100"}`}
                  style={{ top: `${100 - (t / top) * 100}%` }}
                />
              ))}
              {/* Columns: 2px gap between neighbours, max 24px wide */}
              <div className="absolute inset-0 flex items-end gap-[2px]">
                {data.map((d, i) => (
                  <div
                    key={d.date}
                    className="flex h-full flex-1 cursor-default items-end justify-center"
                    onMouseEnter={() => setHover(i)}
                  >
                    <div
                      className={`w-full max-w-6 rounded-t-[4px] transition-opacity ${
                        hover !== null && hover !== i ? "opacity-40" : ""
                      }`}
                      style={{ height: `${(d.count / top) * 100}%`, background: "var(--accent)" }}
                    />
                  </div>
                ))}
              </div>
              {/* Tooltip */}
              {hover !== null && (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-lg"
                  style={{
                    left: `${((hover + 0.5) / data.length) * 100}%`,
                    top: `calc(${100 - (data[hover].count / top) * 100}% - 8px)`,
                  }}
                >
                  <p className="text-zinc-500">{fmt(data[hover].date, { weekday: "short", month: "short", day: "numeric" })}</p>
                  <p className="mt-0.5 font-semibold text-zinc-900">{data[hover].count} views</p>
                </div>
              )}
            </div>
            {/* X axis: first, middle and last labels */}
            <div className="mt-2 flex justify-between text-[11px] text-zinc-400">
              <span>{fmt(data[0].date, { month: "short", day: "numeric" })}</span>
              <span className="hidden sm:inline">{fmt(data[Math.floor(data.length / 2)].date, { month: "short", day: "numeric" })}</span>
              <span>{fmt(data[data.length - 1].date, { month: "short", day: "numeric" })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
