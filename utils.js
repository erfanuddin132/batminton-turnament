export const bn = (v) => String(v).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
export const money = (n) => "৳ " + bn(Number(n).toLocaleString("en-US"));
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const p2 = (n) => String(n).padStart(2, "0");

// সময় মিনিটে: ১১৪০ = রাত ৭টা, ১৫০০ = ভোর ১টা
export const START = 19 * 60;
export const END = 25 * 60;
export const clock = (m) => {
  const h = Math.floor(m / 60) % 24;
  return bn(`${p2(h % 12 || 12)}:${p2(m % 60)}`) + (h >= 12 ? " পিএম" : " এএম");
};
export const dayKey = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export const dateLabel = (k) => {
  const d = new Date(k + "T00:00");
  return bn(`${p2(d.getDate())}/${p2(d.getMonth() + 1)}`) + " " + ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"][d.getDay()];
};
export const daysUntil = (endKey, max = 14) => {
  const out = [], e = new Date(endKey + "T00:00");
  for (let d = new Date(new Date().setHours(0, 0, 0, 0)); d <= e && out.length < max; d.setDate(d.getDate() + 1)) out.push(dayKey(d));
  return out;
};

// স্মার্ট শিডিউলার: কোর্ট ও খেলোয়াড় — দুটোরই ওভারল্যাপ এড়িয়ে প্রথম ফাঁকা স্লট খোঁজে
export function findSlot(matches, date, a, b, courts, dur = 30) {
  const on = matches.filter((m) => m.date === date);
  for (let t = START; t + dur <= END; t += 30)
    for (let c = 1; c <= courts; c++) {
      const clash = on.some((m) => m.start < t + dur && t < m.end && (m.court === c || [m.p1, m.p2].some((x) => x === a || x === b)));
      if (!clash) return { start: t, end: t + dur, court: c };
    }
  return null;
}

// ছবি ছোট করে data URL বানায় (localStorage-এর সীমার জন্য)
export const shrink = (file, max = 720) =>
  new Promise((res) => {
    const r = new FileReader();
    r.onload = () => {
      const i = new Image();
      i.onload = () => {
        const k = Math.min(1, max / Math.max(i.width, i.height));
        const c = document.createElement("canvas");
        c.width = i.width * k; c.height = i.height * k;
        c.getContext("2d").drawImage(i, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.6));
      };
      i.src = r.result;
    };
    r.readAsDataURL(file);
  });
