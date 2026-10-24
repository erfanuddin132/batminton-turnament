import React from "react";
import { CalendarDays } from "lucide-react";
import { useApp } from "../lib/store";
import { Card, Empty, btn, ghost } from "./ui";
import { bn, dateLabel, daysUntil } from "../lib/utils";

export default function Attendance() {
  const { s, up, me } = useApp();
  const days = daysUntil(s.settings.endDate);
  const name = (id) => s.players.find((p) => p.id === id)?.name;
  const toggle = (k) => {
    if (!me) return alert("আগে উপরে 'আমি কে?' থেকে নিজের নাম বেছে নিন।");
    up((d) => { const a = d.avail[k] || []; d.avail[k] = a.includes(me) ? a.filter((x) => x !== me) : [...a, me]; });
  };
  return (
    <Card title="তারিখ অনুযায়ী উপস্থিতি" icon={CalendarDays} right={<span className="text-xs text-slate-400">টুর্নামেন্ট শেষ: {dateLabel(s.settings.endDate)}</span>}>
      {!days.length && <Empty>টুর্নামেন্টের শেষ তারিখ পার হয়ে গেছে।</Empty>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((k) => {
          const a = (s.avail[k] || []).filter(name), on = a.includes(me);
          return (
            <div key={k} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="flex items-center justify-between">
                <b>{dateLabel(k)}</b>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-sm font-bold text-emerald-300">{bn(a.length)} জন</span>
              </div>
              <p className="mt-2 min-h-[2.5rem] text-xs text-slate-400">{a.map(name).join(", ") || "কেউ এখনও জানায়নি"}</p>
              <button onClick={() => toggle(k)} className={`${on ? ghost : btn} mt-2 w-full`}>{on ? "আমি আসব না" : "আমি খেলতে পারব"}</button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
