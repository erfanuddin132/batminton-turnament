import React, { useState } from "react";
import { ImagePlus, Send, Trash2, MessageCircle } from "lucide-react";
import { useApp } from "../lib/store";
import { Card, Empty, inp, btn } from "./ui";
import { bn, shrink, uid } from "../lib/utils";

const EM = ["❤️", "👍", "🔥", "👏", "😂"];

export default function Feed() {
  const { s, up, me, admin } = useApp();
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [cm, setCm] = useState({});
  const nm = (id) => s.players.find((p) => p.id === id)?.name || "অজানা";
  const need = () => { if (!me) { alert("আগে উপরে 'আমি কে?' থেকে নিজের নাম বেছে নিন।"); return true; } return false; };

  const post = () => {
    if (need() || (!text.trim() && !img)) return;
    up((d) => { d.posts.unshift({ id: uid(), pid: me, text: text.trim(), img, at: Date.now(), reacts: {}, comments: [] }); });
    setText(""); setImg("");
  };
  const react = (id, e) => { if (need()) return; up((d) => { const p = d.posts.find((x) => x.id === id), a = p.reacts[e] || []; p.reacts[e] = a.includes(me) ? a.filter((x) => x !== me) : [...a, me]; }); };
  const comment = (id) => {
    const t = (cm[id] || "").trim();
    if (!t || need()) return;
    up((d) => { d.posts.find((x) => x.id === id).comments.push({ id: uid(), pid: me, text: t, at: Date.now() }); });
    setCm({ ...cm, [id]: "" });
  };
  const when = (t) => new Date(t).toLocaleString("bn-BD", { dateStyle: "short", timeStyle: "short" });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card>
        <textarea className={inp} rows={2} placeholder="ম্যাচের অভিজ্ঞতা শেয়ার করুন…" value={text} onChange={(e) => setText(e.target.value)} />
        {img && <img src={img} alt="" className="mt-2 max-h-56 rounded-xl" />}
        <div className="mt-2 flex items-center justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-300 hover:text-emerald-300">
            <ImagePlus size={18} /> ছবি<input type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files[0]; if (f) setImg(await shrink(f)); }} />
          </label>
          <button onClick={post} className={btn}><Send size={16} /> পোস্ট</button>
        </div>
      </Card>

      {!s.posts.length && <Empty>এখনও কোনো পোস্ট নেই।</Empty>}
      {s.posts.map((p) => (
        <Card key={p.id}>
          <div className="flex items-center justify-between">
            <div><p className="font-semibold">{nm(p.pid)}</p><p className="text-xs text-slate-500">{when(p.at)}</p></div>
            {(admin || me === p.pid) && <button onClick={() => up((d) => { d.posts = d.posts.filter((x) => x.id !== p.id); })} className="text-slate-400 hover:text-rose-300"><Trash2 size={16} /></button>}
          </div>
          {p.text && <p className="mt-2 whitespace-pre-wrap">{p.text}</p>}
          {p.img && <img src={p.img} alt="" className="mt-2 w-full rounded-xl" />}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {EM.map((e) => {
              const a = p.reacts[e] || [];
              return <button key={e} onClick={() => react(p.id, e)} className={`rounded-full border px-2.5 py-1 text-sm transition active:scale-95 ${a.includes(me) ? "border-emerald-400 bg-emerald-400/15" : "border-slate-700"}`}>{e} {a.length ? bn(a.length) : ""}</button>;
            })}
          </div>
          <div className="mt-3 space-y-1.5 border-t border-slate-800 pt-3 text-sm">
            {p.comments.map((c) => <p key={c.id}><b className="text-emerald-300">{nm(c.pid)}</b> {c.text}</p>)}
            <div className="flex gap-2">
              <input className={inp} placeholder="মন্তব্য লিখুন…" value={cm[p.id] || ""} onChange={(e) => setCm({ ...cm, [p.id]: e.target.value })} onKeyDown={(e) => e.key === "Enter" && comment(p.id)} />
              <button onClick={() => comment(p.id)} className="rounded-xl border border-slate-700 px-3 text-slate-300 hover:text-emerald-300"><MessageCircle size={16} /></button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
