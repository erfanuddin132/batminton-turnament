import React, { useMemo, useState } from "react";
import { Swords, Timer, Medal, Printer, Trash2, Minus, Plus } from "lucide-react";
import { useApp } from "../lib/store";
import { Card, Empty, Err, inp, btn, ghost } from "./ui";
import { bn, clock, dateLabel, daysUntil, findSlot, uid } from "../lib/utils";

const ST = {
  upcoming: ["আসন্ন", "bg-sky-500/15 text-sky-300 border-sky-500/30", "live"],
  live: ["চলমান", "bg-amber-500/15 text-amber-300 border-amber-500/30", "done"],
  done: ["সম্পন্ন", "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", "upcoming"],
};

export default function Matches() {
  const { s, up, me, admin } = useApp();
  const days = daysUntil(s.settings.endDate);
  const [f, setF] = useState({ date: "", p1: "", p2: "", dur: 30 });
  const [err, setErr] = useState("");
  const nm = (id) => s.players.find((p) => p.id === id)?.name || "?";
  const opts = s.players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>);

  const fix = (e) => {
    e.preventDefault();
    const p1 = f.p1 || me, p2 = f.p2, date = f.date || days[0];
    if (!p1 || !p2 || p1 === p2 || !date) return setErr("দুইজন আলাদা খেলোয়াড় ও তারিখ বেছে নিন।");
    const slot = findSlot(s.matches, date, p1, p2, s.settings.courts, Number(f.dur));
    if (!slot) return setErr("ওই দিন রাত ৭টা–ভোর ১টার মধ্যে ফাঁকা সময় নেই। অন্য তারিখ দিন।");
    up((d) => { d.matches.push({ id: uid(), date, ...slot, p1, p2, s1: 0, s2: 0, status: "upcoming" }); });
    setErr(""); setF({ ...f, p2: "" });
  };
  const can = (m) => admin || me === m.p1 || me === m.p2;
  const score = (id, k, dv) => up((d) => { const m = d.matches.find((x) => x.id === id); m[k] = Math.max(0, m[k] + dv); if (m.status === "upcoming") m.status = "live"; });
  const cycle = (id) => up((d) => { const m = d.matches.find((x) => x.id === id); m.status = ST[m.status][2]; });
  const list = [...s.matches].sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start);

  const board = useMemo(() => {
    const t = {};
    s.players.forEach((p) => { t[p.id] = { id: p.id, pl: 0, w: 0, l: 0, pts: 0, diff: 0 }; });
    s.matches.filter((m) => m.status === "done" && t[m.p1] && t[m.p2]).forEach((m) => {
      t[m.p1].pl++; t[m.p2].pl++; t[m.p1].diff += m.s1 - m.s2; t[m.p2].diff += m.s2 - m.s1;
      if (m.s1 !== m.s2) { const [a, b] = m.s1 > m.s2 ? [m.p1, m.p2] : [m.p2, m.p1]; t[a].w++; t[a].pts += 2; t[b].l++; }
    });
    return Object.values(t).sort((x, y) => y.pts - x.pts || y.diff - x.diff);
  }, [s.players, s.matches]);

  const Sc = ({ m, k }) => (
    <span className="flex items-center gap-1">
      {can(m) && <button onClick={() => score(m.id, k, -1)} className="no-print rounded bg-slate-800 p-1"><Minus size={13} /></button>}
      <b className="w-7 text-center text-lg text-emerald-300">{bn(m[k])}</b>
      {can(m) && <button onClick={() => score(m.id, k, 1)} className="no-print rounded bg-emerald-400 p-1 text-slate-950"><Plus size={13} /></button>}
    </span>
  );

  return (
    <div className="space-y-5">
      <Card title="ম্যাচ ফিক্স করুন" icon={Swords} className="no-print">
        <form onSubmit={fix} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select className={inp} value={f.date || days[0] || ""} onChange={(e) => setF({ ...f, date: e.target.value })}>{days.map((k) => <option key={k} value={k}>{dateLabel(k)}</option>)}</select>
          <select className={inp} value={f.p1 || me} onChange={(e) => setF({ ...f, p1: e.target.value })}><option value="">খেলোয়াড় ১</option>{opts}</select>
          <select className={inp} value={f.p2} onChange={(e) => setF({ ...f, p2: e.target.value })}><option value="">প্রতিপক্ষ বেছে নিন</option>{opts}</select>
          <select className={inp} value={f.dur} onChange={(e) => setF({ ...f, dur: e.target.value })}><option value="30">৩০ মিনিট</option><option value="60">৬০ মিনিট</option></select>
          <button className={btn}>সময় ঠিক করে ফিক্স করুন</button>
        </form>
        <Err>{err}</Err>
        <p className="mt-2 text-xs text-slate-400">অ্যাপ নিজেই রাত ৭টা–ভোর ১টার মধ্যে ফাঁকা কোর্ট ও সময় খুঁজে নেয়; একই খেলোয়াড় বা একই কোর্টে ওভারল্যাপ হয় না।</p>
      </Card>

      <Card title="ম্যাচ তালিকা ও লাইভ স্কোর" icon={Timer} right={<button className={ghost + " no-print"} onClick={() => window.print()}><Printer size={16} /> প্রিন্ট</button>}>
        {!list.length && <Empty>এখনও কোনো ম্যাচ ফিক্স হয়নি।</Empty>}
        <ul className="space-y-2.5">
          {list.map((m) => (
            <li key={m.id} className={`rounded-xl border p-3 ${m.status === "live" ? "border-amber-400/50 bg-amber-400/5" : "border-slate-800 bg-slate-950/50"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-emerald-300">{dateLabel(m.date)} • {clock(m.start)} – {clock(m.end)} • কোর্ট {bn(m.court)}</span>
                <span className="flex items-center gap-2">
                  <button disabled={!can(m)} onClick={() => cycle(m.id)} className={`rounded-full border px-3 py-1 text-xs font-medium ${ST[m.status][1]}`}>{ST[m.status][0]}</button>
                  {admin && <button onClick={() => up((d) => { d.matches = d.matches.filter((x) => x.id !== m.id); })} className="no-print text-slate-400 hover:text-rose-300"><Trash2 size={16} /></button>}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="flex-1 font-medium">{nm(m.p1)}</span><Sc m={m} k="s1" />
                <span className="px-2 text-slate-500">-</span>
                <Sc m={m} k="s2" /><span className="flex-1 text-right font-medium">{nm(m.p2)}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="লিডারবোর্ড (জয় = ২ পয়েন্ট)" icon={Medal}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="text-slate-400"><tr><th className="py-2">#</th><th>খেলোয়াড়</th><th>খেলা</th><th>জয়</th><th>হার</th><th>পয়েন্ট</th></tr></thead>
            <tbody>
              {board.map((r, i) => (
                <tr key={r.id} className="border-t border-slate-800">
                  <td className="py-2">{["🥇", "🥈", "🥉"][i] || bn(i + 1)}</td><td className="font-medium">{nm(r.id)}</td>
                  <td>{bn(r.pl)}</td><td>{bn(r.w)}</td><td>{bn(r.l)}</td><td className="font-bold text-emerald-300">{bn(r.pts)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
