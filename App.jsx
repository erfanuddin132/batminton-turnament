import React, { useEffect, useState } from "react";
import { Trophy, ShieldCheck, LogOut, Home as HomeI, Wallet, CalendarDays, Swords, Camera } from "lucide-react";
import { AppProvider, useApp } from "./lib/store";
import { btn, ghost, inp } from "./components/ui";
import Home from "./components/Home";
import Payments from "./components/Payments";
import Attendance from "./components/Attendance";
import Matches from "./components/Matches";
import Feed from "./components/Feed";
import Join from "./components/Join";

const TABS = [
  ["home", "হোম", HomeI, Home], ["pay", "পেমেন্ট", Wallet, Payments], ["att", "উপস্থিতি", CalendarDays, Attendance],
  ["match", "ম্যাচ ও স্কোর", Swords, Matches], ["feed", "ফিড", Camera, Feed],
];

const Frame = ({ children }) => (
  <div className="frame min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali',system-ui,sans-serif" }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
    @media print{.no-print{display:none!important}.frame,.frame *{color:#000!important;background:#fff!important;border-color:#999!important}}`}</style>
    {children}
  </div>
);

function Shell() {
  const { s, me, setMe, admin, login, logout } = useApp();
  const [tab, setTab] = useState("home");
  const [route, setRoute] = useState(location.hash);
  const [pin, setPin] = useState(null);
  useEffect(() => {
    const h = () => setRoute(location.hash);
    addEventListener("hashchange", h);
    return () => removeEventListener("hashchange", h);
  }, []);
  const Page = TABS.find((t) => t[0] === tab)[3];
  if (route === "#/join") return <Frame><Join /></Frame>;

  return (
    <Frame>
      <header className="no-print sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-lg font-bold"><span className="rounded-xl bg-emerald-400 p-2 text-slate-950"><Trophy size={18} /></span>ব্যাডমিন্টন টুর্নামেন্ট</div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm" value={me} onChange={(e) => setMe(e.target.value)}>
              <option value="">আমি কে?</option>{s.players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {admin ? (
              <>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-sm font-semibold text-emerald-300">ম্যানেজার মোড</span>
                <button onClick={logout} className={ghost} aria-label="লগআউট"><LogOut size={16} /></button>
              </>
            ) : <button onClick={() => setPin("")} className={ghost}><ShieldCheck size={16} /> ম্যানেজার লগইন</button>}
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {TABS.map(([k, l, I]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm transition ${tab === k ? "bg-emerald-400 font-semibold text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}><I size={16} />{l}</button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5"><Page /></main>

      {pin !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setPin(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); if (login(pin)) setPin(null); else { alert("ভুল PIN"); setPin(""); } }} className="w-full max-w-xs space-y-3 rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="font-bold">ম্যানেজার PIN দিন</p>
            <input autoFocus type="password" className={inp} value={pin} onChange={(e) => setPin(e.target.value)} />
            <button className={btn + " w-full"}>লগইন</button>
          </form>
        </div>
      )}
    </Frame>
  );
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>;
}
