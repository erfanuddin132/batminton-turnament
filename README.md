# ব্যাডমিন্টন টুর্নামেন্ট ম্যানেজার

চাঁদা, খরচ ও খেলার রুটিন (রাত ৭টা – ভোর ১টা) ম্যানেজ করার React + Tailwind অ্যাপ।

## লোকালি চালান
```bash
npm install
npm run dev
```

## GitHub Pages-এ লাইভ করুন
1. GitHub-এ নতুন repository বানান।
2. এই ফোল্ডারের সব ফাইল push করুন (branch: `main`)।
3. Repo → **Settings → Pages → Source: GitHub Actions** সিলেক্ট করুন।
4. **Actions** ট্যাবে workflow শেষ হলে লিংক পাবেন:
   `https://<ইউজারনেম>.github.io/<রিপো-নাম>/`

## v2 নোট
- ম্যানেজার মোডের ডিফল্ট PIN: `1234` (হোম → সেটিংস থেকে বদলান)।
- ডাটা এখন ব্রাউজারের `localStorage`-এ থাকে। একাধিক ডিভাইসে শেয়ার করতে `src/lib/store.jsx`-এর `storage` অবজেক্টে Firebase/Supabase লাগাতে হবে।
