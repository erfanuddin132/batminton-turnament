import React from "react";
export const inp = "w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20";
export const btn = "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-95 disabled:opacity-40";
export const ghost = "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-emerald-400/60 hover:text-emerald-300";
export const Card = ({ title, icon: I, right, children, className = "" }) => (
  <section className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 ${className}`}>
    {title && (
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-50">{I && <I size={20} className="text-emerald-300" />}{title}</h2>
        {right}
      </div>
    )}
    {children}
  </section>
);
export const Stat = ({ label, value, warn }) => (
  <div className={`rounded-2xl border p-4 ${warn ? "border-rose-500/60 bg-rose-950/30" : "border-slate-800 bg-slate-900/70"}`}>
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${warn ? "text-rose-300" : "text-emerald-300"}`}>{value}</p>
  </div>
);
export const Empty = ({ children }) => <p className="py-6 text-center text-sm text-slate-500">{children}</p>;
export const Err = ({ children }) => children ? <p role="alert" className="mt-3 rounded-xl border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">{children}</p> : null;
