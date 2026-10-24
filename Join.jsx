import React, { useState } from "react";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { useApp } from "../lib/store";
import { Card, Err, inp, btn } from "./ui";
import { uid } from "../lib/utils";

export default function Join() {
  const { s, up, setMe } = useApp();
  const [f, setF] = useState({ name: "", phone: "", details: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const go = (e) => {
    e.preventDefault();
    const phone = f.phone.trim();
    if (!f.name.trim() || !/^01\d{9}$/.test(phone)) return setErr("সঠিক নাম ও ১১ ডিজিটের মোবাইল নম্বর দিন (01XXXXXXXXX)।");
    if (s.players.some((p) => p.phone === phone)) return setErr("এই নম্বর দিয়ে আগেই রেজিস্ট্রেশন হয়েছে।");
    const id = uid();
    up((d) => { d.players.push({ id, name: f.name.trim(), phone, details: f.details.trim(), at: Date.now() }); });
    setMe(id); setOk(true);
  };
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card title="খেলোয়াড় রেজিস্ট্রেশন" icon={UserPlus}>
        {ok ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto text-emerald-400" size={48} />
            <p className="mt-3 text-lg font-semibold">রেজিস্ট্রেশন সম্পন্ন!</p>
            <button className={btn + " mt-4"} onClick={() => { location.hash = "#/"; }}>অ্যাপে যান</button>
          </div>
        ) : (
          <form onSubmit={go} className="space-y-3">
            <input className={inp} placeholder="আপনার নাম" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <input className={inp} inputMode="tel" placeholder="মোবাইল নম্বর (01XXXXXXXXX)" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <textarea className={inp} rows={3} placeholder="অন্যান্য তথ্য (খেলার লেভেল, এলাকা ইত্যাদি)" value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} />
            <button className={btn + " w-full"}>রেজিস্ট্রেশন করুন</button>
            <Err>{err}</Err>
          </form>
        )}
      </Card>
    </div>
  );
}
