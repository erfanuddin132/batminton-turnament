import React, { useState } from "react";
import { Users, Wallet, Trash2, Check, X, Receipt } from "lucide-react";
import { useApp } from "../lib/store";
import { Card, Empty, Err, inp, btn } from "./ui";
import { bn, money, uid } from "../lib/utils";

export default function Payments() {
  const { s, up, admin, me, bal } = useApp();
  const [f, setF] = useState({ pid: "", amount: "", method: "bKash", trx: "" });
  const [ex, setEx] = useState({ name: "", amount: "" });
  const [note, setNote] = useState("");
  const nm = (id) => s.players.find((p) => p.id === id)?.name || "?";
  const pending = s.payments.filter((p) => p.status === "pending");

  const pay = (e) => {
    e.preventDefault();
    const pid = f.pid || me, a = Number(f.amount);
    if (!pid || !(a > 0)) return setNote("খেলোয়াড় ও সঠিক টাকার পরিমাণ দিন।");
    if (!admin && !f.trx.trim()) return setNote("ট্রানজেকশন আইডি (TrxID) দিন।");
    up((d) => { d.payments.push({ id: uid(), pid, amount: a, method: f.method, trx: f.trx.trim(), status: admin ? "ok" : "pending", at: Date.now() }); });
    setNote(admin ? "পেমেন্ট যোগ হয়েছে।" : "জমা হয়েছে। ম্যানেজার অনুমোদন করলে ব্যালেন্সে যোগ হবে।");
    setF({ ...f, amount: "", trx: "" });
  };
  const decide = (id, st) => up((d) => { d.payments.find((p) => p.id === id).status = st; });
  const del = (id) => window.confirm("এই খেলোয়াড়কে মুছে ফেলবেন?") && up((d) => { d.players = d.players.filter((p) => p.id !== id); d.payments = d.payments.filter((p) => p.pid !== id); });
  const addEx = (e) => {
    e.preventDefault();
    const a = Number(ex.amount);
    if (!ex.name.trim() || !(a > 0)) return;
    up((d) => { d.expenses.push({ id: uid(), name: ex.name.trim(), amount: a, at: Date.now() }); });
    setEx({ name: "", amount: "" });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="খেলোয়াড় ও ব্যালেন্স" icon={Users}>
        <ul className="space-y-2">
          {s.players.length === 0 && <Empty>এখনও কেউ রেজিস্ট্রেশন করেনি।</Empty>}
          {s.players.map((p) => {
            const b = bal(p.id);
            return (
              <li key={p.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5">
                <div><p className="font-medium">{p.name}</p>{admin && <p className="text-xs text-slate-400">{bn(p.phone)}</p>}</div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${b ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>{b ? money(b) : "০০ ৳"}</span>
                  {admin && <button onClick={() => del(p.id)} aria-label="মুছুন" className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/15 hover:text-rose-300"><Trash2 size={16} /></button>}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="space-y-5">
        <Card title={admin ? "ম্যানুয়াল পেমেন্ট এন্ট্রি" : "ফি জমা দিন"} icon={Wallet}>
          {!admin && <p className="mb-3 text-sm text-slate-400">বিকাশ/নগদে পাঠিয়ে TrxID দিন। ম্যানেজার যাচাই করে অনুমোদন দিলে আপনার ব্যালেন্স আপডেট হবে।</p>}
          <form onSubmit={pay} className="grid gap-2 sm:grid-cols-2">
            <select className={inp} value={f.pid || me} onChange={(e) => setF({ ...f, pid: e.target.value })}>
              <option value="">খেলোয়াড় বেছে নিন</option>{s.players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select className={inp} value={f.method} onChange={(e) => setF({ ...f, method: e.target.value })}><option>bKash</option><option>Nagad</option><option>নগদ হাতে</option></select>
            <input className={inp} type="number" min="1" placeholder="টাকা" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
            <input className={inp} placeholder="TrxID" value={f.trx} onChange={(e) => setF({ ...f, trx: e.target.value })} />
            <button className={btn + " sm:col-span-2"}>{admin ? "যোগ করুন" : "জমা দিন"}</button>
          </form>
          {note && <p className="mt-3 text-sm text-emerald-300">{note}</p>}
        </Card>

        {admin && <>
          <Card title={`অনুমোদনের অপেক্ষায় (${bn(pending.length)})`} icon={Check}>
            {pending.length === 0 && <Empty>কোনো পেন্ডিং পেমেন্ট নেই।</Empty>}
            <ul className="space-y-2">
              {pending.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-sm">
                  <span>{nm(p.pid)} • {money(p.amount)} • {p.method}<br /><span className="text-xs text-slate-400">TrxID: {p.trx || "—"}</span></span>
                  <span className="flex gap-1.5">
                    <button onClick={() => decide(p.id, "ok")} className="rounded-lg bg-emerald-400 p-2 text-slate-950"><Check size={16} /></button>
                    <button onClick={() => decide(p.id, "no")} className="rounded-lg bg-rose-400 p-2 text-slate-950"><X size={16} /></button>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="খরচের হিসাব" icon={Receipt}>
            <form onSubmit={addEx} className="grid grid-cols-[1fr_100px_auto] gap-2">
              <input className={inp} placeholder="খাত (শাটল, লাইটিং…)" value={ex.name} onChange={(e) => setEx({ ...ex, name: e.target.value })} />
              <input className={inp} type="number" placeholder="টাকা" value={ex.amount} onChange={(e) => setEx({ ...ex, amount: e.target.value })} />
              <button className={btn}>+</button>
            </form>
            <ul className="mt-3 space-y-1.5 text-sm">
              {s.expenses.map((x) => (
                <li key={x.id} className="flex items-center justify-between rounded-lg bg-slate-950/50 px-3 py-2">
                  <span>{x.name}</span>
                  <span className="flex items-center gap-2 text-rose-300">{money(x.amount)}
                    <button onClick={() => up((d) => { d.expenses = d.expenses.filter((y) => y.id !== x.id); })} className="text-slate-400 hover:text-rose-300"><Trash2 size={15} /></button>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </>}
        <Err>{""}</Err>
      </div>
    </div>
  );
}
