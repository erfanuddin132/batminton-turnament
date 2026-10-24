import React, { useState } from "react";
import { Copy, Share2, Settings, Wallet, Check } from "lucide-react";
import { useApp } from "../lib/store";
import { Card, Stat, inp, ghost } from "./ui";
import { bn, money } from "../lib/utils";

export default function Home() {
  const { s, up, admin } = useApp();
  const [ok, setOk] = useState(false);
  const link = location.origin + location.pathname + "#/join";
  const msg = encodeURIComponent("ব্যাডমিন্টন টুর্নামেন্টে রেজিস্ট্রেশন করুন: " + link);
  const copy = async () => { try { await navigator.clipboard.writeText(link); setOk(true); setTimeout(() => setOk(false), 1500); } catch { /* ignore */ } };
  const set = (k, v) => up((d) => { d.settings[k] = v; });
  const income = s.payments.reduce((a, p) => a + (p.status === "ok" ? p.amount : 0), 0);
  const out = s.expenses.reduce((a, x) => a + x.amount, 0);
  const label = "text-sm text-slate-400";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="মোট খেলোয়াড়" value={bn(s.players.length) + " জন"} />
        <Stat label="মোট ম্যাচ" value={bn(s.matches.length)} />
        {admin && <>
          <Stat label="মোট সংগ্রহ" value={money(income)} />
          <Stat label="অবশিষ্ট ফান্ড" value={money(income - out)} warn={income - out < 0} />
        </>}
      </div>

      <Card title="অফিসিয়াল পেমেন্ট নম্বর" icon={Wallet}>
        <div className="grid gap-3 sm:grid-cols-2">
          {[["bkash", "বিকাশ (bKash)"], ["nagad", "নগদ (Nagad)"]].map(([k, l]) => (
            <div key={k} className="rounded-xl bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">{l} • {s.settings[k + "Type"]}</p>
              {admin ? (
                <div className="mt-2 flex gap-2">
                  <input className={inp} value={s.settings[k]} onChange={(e) => set(k, e.target.value)} />
                  <select className={inp + " !w-32"} value={s.settings[k + "Type"]} onChange={(e) => set(k + "Type", e.target.value)}>
                    <option>পার্সোনাল</option><option>মার্চেন্ট</option>
                  </select>
                </div>
              ) : <p className="mt-1 text-xl font-bold text-emerald-300">{bn(s.settings[k])}</p>}
            </div>
          ))}
        </div>
      </Card>

      <Card title="রেজিস্ট্রেশন লিংক" icon={Share2}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input readOnly className={inp} value={link} onFocus={(e) => e.target.select()} />
          <button onClick={copy} className={ghost}>{ok ? <Check size={16} /> : <Copy size={16} />} {ok ? "কপি হয়েছে" : "কপি"}</button>
          <a className={ghost} target="_blank" rel="noreferrer" href={`https://wa.me/?text=${msg}`}>WhatsApp</a>
          <a className={ghost} target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}>Facebook</a>
        </div>
      </Card>

      {admin && (
        <Card title="টুর্নামেন্ট সেটিংস (শুধু ম্যানেজার)" icon={Settings}>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className={label}>টুর্নামেন্ট শেষের তারিখ<input type="date" className={inp} value={s.settings.endDate} onChange={(e) => set("endDate", e.target.value)} /></label>
            <label className={label}>কোর্টের সংখ্যা<input type="number" min="1" max="6" className={inp} value={s.settings.courts} onChange={(e) => set("courts", Math.max(1, Number(e.target.value) || 1))} /></label>
            <label className={label}>ম্যানেজার PIN<input className={inp} value={s.settings.pin} onChange={(e) => set("pin", e.target.value)} /></label>
          </div>
        </Card>
      )}
    </div>
  );
}
