import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { dayKey, START } from "./utils";

const KEY = "bt_state_v2";
// ★ ডাটা স্টোরেজের একমাত্র জায়গা। পরে Firebase/Supabase লাগালে শুধু এই অবজেক্ট বদলাবে।
const storage = {
  load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } },
  save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } },
};

const plus = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return dayKey(d); };
const now = Date.now();
const seed = () => ({
  settings: { bkash: "01XXXXXXXXX", bkashType: "পার্সোনাল", nagad: "01XXXXXXXXX", nagadType: "পার্সোনাল", pin: "1234", endDate: plus(10), courts: 2 },
  players: [["p1", "রাকিব হাসান"], ["p2", "সাকিব আহমেদ"], ["p3", "তানভীর ইসলাম"], ["p4", "ফারহান করিম"]].map(([id, name], i) => ({ id, name, phone: "0170000000" + i, details: "", at: now })),
  payments: [
    { id: "y1", pid: "p1", amount: 500, method: "bKash", trx: "DEMO1", status: "ok", at: now },
    { id: "y2", pid: "p2", amount: 500, method: "Nagad", trx: "DEMO2", status: "ok", at: now },
    { id: "y3", pid: "p3", amount: 300, method: "bKash", trx: "DEMO3", status: "pending", at: now },
  ],
  expenses: [{ id: "x1", name: "শাটল কক", amount: 600, at: now }],
  avail: { [plus(1)]: ["p1", "p2", "p3"], [plus(2)]: ["p1", "p4"] },
  matches: [{ id: "m1", date: plus(0), start: START, end: START + 30, court: 1, p1: "p1", p2: "p2", s1: 21, s2: 17, status: "done" }],
  posts: [{ id: "f1", pid: "p1", text: "স্বাগতম! টুর্নামেন্ট শুরু হচ্ছে 🏸", img: "", at: now, reacts: { "❤️": ["p2"] }, comments: [] }],
});

const Ctx = createContext();
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [s, setS] = useState(() => storage.load() || seed());
  const [me, setMe] = useState(() => { try { return localStorage.getItem("bt_me") || ""; } catch { return ""; } });
  const [admin, setAdmin] = useState(() => { try { return sessionStorage.getItem("bt_admin") === "1"; } catch { return false; } });
  useEffect(() => storage.save(s), [s]);
  useEffect(() => { try { localStorage.setItem("bt_me", me); } catch { /* ignore */ } }, [me]);

  const up = useCallback((fn) => setS((p) => { const d = structuredClone(p); fn(d); return d; }), []);
  const login = (pin) => {
    if (pin !== s.settings.pin) return false;
    setAdmin(true); try { sessionStorage.setItem("bt_admin", "1"); } catch { /* ignore */ }
    return true;
  };
  const logout = () => { setAdmin(false); try { sessionStorage.removeItem("bt_admin"); } catch { /* ignore */ } };
  const bal = (id) => s.payments.reduce((a, p) => a + (p.pid === id && p.status === "ok" ? p.amount : 0), 0);

  return <Ctx.Provider value={{ s, up, me, setMe, admin, login, logout, bal }}>{children}</Ctx.Provider>;
}
