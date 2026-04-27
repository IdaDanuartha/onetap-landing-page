# OneTap — Website Redesign Implementation Plan
> NFC Keychain Company Profile · v1.0 · 2025

---

## Ringkasan Eksekutif

Dokumen ini adalah panduan lengkap untuk me-redesign website OneTap dari tampilan yang terlalu *AI-generated* dan saturasi warna tinggi, menjadi company profile yang **modern, clean, dan inklusif untuk semua gender**. Redesign mencakup perubahan color palette, mode tampilan, arsitektur informasi baru, halaman-halaman tambahan, serta integrasi fitur pemesanan WhatsApp dan chatbot AI gratis.

| | Website Saat Ini | Target Setelah Redesign |
|---|---|---|
| Mode | Dark (biru gelap dominan) | **Full Light Mode** |
| Warna | Biru neon + kuning saturasi tinggi | Pink soft + warm white, gender-neutral |
| Kesan | Terlihat seperti template AI | Modern, clean, authentic |
| Struktur | Single-page sederhana | Multi-page dengan navigasi jelas |
| Produk | Preview minimal | Katalog lengkap + halaman detail |
| Order | Link WA manual | Pre-filled WA message per produk |
| Chatbot | Tidak ada | AI chatbot gratis terintegrasi |

---

## 01 · Mode Tampilan: Full Light Mode

### Kenapa Full Light Mode?

Palette baru OneTap (`#FFF8F2`, `#F6B7C8`, `#FF5FA2`) adalah palette **warm & pastel** yang secara natural cocok untuk light mode. Alasan teknisnya:

- **Kontras optimal** — Pink `#FF5FA2` punya rasio kontras yang cukup di atas background putih/warm white, tapi *tidak* cukup kontras di atas background gelap
- **Kesan brand** — Light mode memberikan kesan bersih, approachable, dan modern — sesuai target market Gen Z yang menyukai estetika minimalis
- **Warm white sebagai fondasi** — `#FFF8F2` adalah warna "putih krem" yang hangat. Di dark mode, warna ini tidak bisa dipakai sebagai background dan kehilangan perannya
- **Hindari overengineering** — Mendukung dark mode membutuhkan dua set warna penuh. Untuk fase awal, fokus di light mode dulu dan sempurnakan

### Keputusan Desain

> ⚠️ **Website OneTap TIDAK mendukung dark mode system preference.**
> Meskipun device pengguna menggunakan dark mode, website tetap tampil dalam light mode.
> Ini adalah keputusan intentional untuk menjaga konsistensi visual brand.

Implementasi di CSS:

```css
/* Paksa light mode meski OS user pakai dark mode */
:root {
  color-scheme: light only;
}

/* Atau via meta tag di <head> */
<meta name="color-scheme" content="light">
```

Implementasi di Tailwind:

```js
// tailwind.config.js
module.exports = {
  darkMode: false, // Nonaktifkan dark mode sepenuhnya
  // ...
}
```

### Konsekuensi yang Perlu Diperhatikan

| Aspek | Solusi |
|---|---|
| User OS dark mode → website tetap terang | Sudah intentional, tulis di brand guidelines |
| Keterbacaan di layar outdoor/terik | Pastikan kontras teks minimal 4.5:1 (WCAG AA) |
| Mata lelah untuk baca panjang | Gunakan `#FFF8F2` bukan pure white `#FFFFFF` untuk background utama — lebih nyaman di mata |

---

## 02 · Color Palette

### Filosofi: Warm Neutral-Pink

Gunakan pink **sebagai aksen, bukan dominan**. Background warm white dan abu-abu netral membuat palette ini bisa diterima semua gender. Navy gelap sebagai kontras menjaga kesan tegas dan profesional.

| Swatch | Hex | Nama | Penggunaan |
|---|---|---|---|
| 🩷 | `#FF5FA2` | Primary Pink | Tombol utama, highlight, ikon aktif |
| 🌸 | `#F6B7C8` | Soft Pink | Badge, pill, divider, ilustrasi ringan |
| 🤍 | `#FFF8F2` | Warm White | Background halaman, section alternating |
| ⬜ | `#FFFFFF` | Pure White | Card background, navbar, modal |
| 🌑 | `#1A1A2E` | Deep Navy | Heading, teks utama |
| 🩶 | `#6B7280` | Neutral Gray | Subteks, caption, placeholder |
| 🔲 | `#F3F4F6` | Light Gray | Border tipis, divider, input bg |

### CSS Variables

```css
:root {
  /* Core palette */
  --color-primary:       #FF5FA2;
  --color-primary-soft:  #F6B7C8;
  --color-primary-light: #fff0f7;   /* hover state card */
  --color-primary-hover: #e54d90;   /* darken 10% untuk hover tombol */

  /* Backgrounds — light mode only */
  --color-bg:            #FFF8F2;   /* halaman utama */
  --color-bg-white:      #FFFFFF;   /* card, navbar */
  --color-bg-gray:       #F3F4F6;   /* section alternating, input */

  /* Text */
  --color-text-dark:     #1A1A2E;
  --color-text-body:     #374151;
  --color-text-muted:    #6B7280;

  /* Border */
  --color-border:        #f3e8ef;
}
```

### Pola Alternating Section (Light Mode)

Agar halaman tidak monoton tanpa dark section, gunakan pola alternating:

```
Section 1 — bg: #FFFFFF        (Hero)
Section 2 — bg: #FFF8F2        (Features)
Section 3 — bg: #FFFFFF        (How It Works)
Section 4 — bg: #FFF8F2        (Produk)
Section 5 — bg: #FF5FA2        (CTA Banner — satu-satunya section bold pink)
Section 6 — bg: #FFFFFF        (Testimonial)
Section 7 — bg: #1A1A2E        (Footer — satu-satunya section dark)
```

> Gunakan dark section **hanya** di footer dan satu CTA banner. Ini memberikan "aksen gelap" tanpa mengubah karakter light mode keseluruhan.

### Tips Gender-Neutral

- Gunakan `#FF5FA2` hanya pada elemen aksen — **bukan** background full section (kecuali CTA banner)
- Pasangkan dengan banyak white space dan abu-abu netral
- Tipografi sans-serif yang kuat (Inter/Geist) untuk kesan tegas dan modern
- Deep Navy `#1A1A2E` sebagai warna teks utama — terasa profesional, bukan playful

---

## 03 · Tipografi

**Font utama:** [Inter](https://fonts.google.com/specimen/Inter) — Google Fonts, gratis  
**Alternatif:** Geist · Plus Jakarta Sans

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

body {
  font-family: 'Inter', sans-serif;
  background-color: #FFF8F2;   /* warm white, bukan pure white */
  color: #1A1A2E;
}
```

| Elemen | Weight | Size | Color |
|---|---|---|---|
| H1 Hero | 800 ExtraBold | 56–72px | `#1A1A2E` |
| H2 Section | 700 Bold | 36–40px | `#1A1A2E` |
| H3 Sub | 600 SemiBold | 24–28px | `#1A1A2E` atau `#FF5FA2` |
| Body | 400 Regular | 16–18px | `#374151` |
| Caption | 400 Regular | 13–14px | `#6B7280` |
| Button | 600 SemiBold | 15–16px | tergantung varian |

---

## 04 · Arsitektur Website Baru

```
/                      → Homepage
/catalog               → Katalog Produk
/product/:slug         → Detail Produk
/about                 → Tentang OneTap
/blog                  → Blog & Tips (Fase 2)
```

### ① Homepage `/`

- **Hero** — tagline baru, animasi minimal, CTA "Lihat Katalog" + "Chat WA"
- **Social Proof** — statistik & trust badge
- **How It Works** — 3 langkah, visual bersih
- **Produk Unggulan** — preview 3 produk terpopuler, link ke katalog
- **Use Cases** — kartu grid icon-first
- **Testimonial** — slider atau masonry
- **FAQ** — accordion, 8–10 pertanyaan
- **CTA Banner** — section `#FF5FA2` dengan headline dan tombol putih
- **Footer** — background `#1A1A2E`, teks putih

### ② Katalog Produk `/catalog`

- Grid produk dengan filter: Personal / Bisnis / Event
- Setiap card: foto, nama, harga, badge "Terlaris" / "Baru"
- Sorting: harga, terpopuler, terbaru
- Search bar

### ③ Detail Produk `/product/:slug`

- Galeri foto produk (swipe mobile-friendly)
- Deskripsi lengkap, spesifikasi, pilihan varian
- Tombol **"Order via WhatsApp"** — pre-filled message otomatis
- Section "Produk Serupa"
- Review & rating *(Fase 2)*

### ④ About `/about`

- Cerita brand OneTap — visi, misi
- Tim *(bisa dummy dulu)*
- Nilai-nilai perusahaan

### ⑤ Blog `/blog` *(Fase 2)*

- Artikel tips NFC, networking, personal branding
- SEO-friendly untuk organic traffic

---

## 05 · Komponen UI Kunci

### Navbar

```
bg: #FFFFFF | shadow tipis saat scroll | sticky top

[Logo OneTap]   Katalog   About   Blog   Kontak   [Order Sekarang →]
```

- Transparan di atas hero → `bg-white shadow-sm` saat scroll
- CTA button: `bg #FF5FA2` teks putih
- Mobile: hamburger → slide-out drawer

### Hero Section

```
bg: #FFF8F2
Layout: teks kiri, visual/foto produk kanan

[Badge: NFC Technology]

OneTap,
Everything
Connected                    [3D Keychain / foto produk nyata]

Hubungkan dunia fisik dan digital...

[Order Sekarang →]  [Pelajari Lebih]
```

> ❌ **Jangan** pakai gradient biru gelap seperti versi lama  
> ❌ **Jangan** pakai AI-render generik sebagai hero visual  
> ✅ Gunakan foto produk nyata atau mockup bersih di background warm white  
> ✅ Blob/shape abstrak boleh, tapi gunakan warna `#F6B7C8` atau `#fff0f7` — jangan saturasi penuh

### Card Produk

```
bg: #FFFFFF | rounded-2xl | shadow-sm
hover: shadow-md + border #FF5FA2

┌─────────────────────┐
│                     │
│   [Foto Produk]     │
│ ╔═══════════╗       │
│ ║ Terlaris  ║       │  ← badge bg: #FF5FA2, teks putih
│ ╚═══════════╝       │
├─────────────────────┤
│ OneTap Keychain     │  ← font-semibold, #1A1A2E
│ Mulai Rp 45.000     │  ← #FF5FA2
│                     │
│ [Detail] [Order WA] │
└─────────────────────┘
```

### Tombol CTA

```css
/* Primary */
.btn-primary {
  background: #FF5FA2;
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: #e54d90;
  transform: scale(1.02);
}

/* Secondary / Ghost */
.btn-secondary {
  border: 1.5px solid #FF5FA2;
  color: #FF5FA2;
  background: transparent;
  border-radius: 12px;
}
.btn-secondary:hover {
  background: #fff0f7;
}

/* WhatsApp */
.btn-wa {
  background: #25D366;
  color: white;
}

/* Di atas section pink (#FF5FA2 bg) */
.btn-on-pink {
  background: white;
  color: #FF5FA2;
}
```

### CTA Banner Section

```
bg: #FF5FA2
teks: #FFFFFF
tombol: bg white, teks #FF5FA2

"Siap Untuk Lebih Terhubung?"
Hubungi kami untuk konsultasi gratis.

[Chat WhatsApp]  [Lihat Katalog]
```

> Ini **satu-satunya** section dengan background pink penuh. Letakkan menjelang footer agar impactful.

### Footer

```
bg: #1A1A2E
teks: #FFFFFF / #9CA3AF untuk subteks

[Logo putih]  |  Quick Links  |  Kontak  |  Sosial Media
────────────────────────────────────────────────────────
© 2025 OneTap. All rights reserved.
```

---

## 06 · Sistem Pemesanan via WhatsApp

### Format URL Pre-filled

```
https://wa.me/62XXXXXXXXXX?text=Halo+OneTap!+Saya+ingin+order:%0A
*Produk:*+OneTap+Keychain%0A
*Varian:*+Gold+Edition%0A
*Qty:*+1+pcs%0A
*Link+Produk:*+https://onetap.id/product/nfc-keychain
```

### Helper Function

```js
// config/wa.js
const WA_NUMBER = "62XXXXXXXXXX"; // ganti nomor WA bisnis

export function getOrderLink(product, variant = "") {
  const message = encodeURIComponent(
    `Halo OneTap! Saya ingin order:\n` +
    `*Produk:* ${product.name}\n` +
    (variant ? `*Varian:* ${variant}\n` : "") +
    `*Harga:* ${product.price}\n` +
    `*Link:* https://onetap.id/product/${product.slug}\n\n` +
    `Boleh minta info lebih lanjut?`
  );
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
}
```

### Floating WA Button

```jsx
// components/FloatingWA.jsx
export default function FloatingWA() {
  return (
    <a
      href={`https://wa.me/62XXXXXXXXXX?text=Halo+OneTap!`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2
                 bg-[#25D366] text-white px-4 py-3 rounded-full
                 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
    >
      <WhatsAppIcon />
      <span className="font-semibold text-sm">Chat WA</span>
    </a>
  );
}
```

> Posisi: **kanan bawah**. Jika chatbot juga ada di kanan bawah, geser chatbot ke kiri atau WA ke atas sedikit agar tidak tumpang tindih.

### Alur Order

1. User klik **"Order Sekarang"** di halaman produk
2. Browser membuka WhatsApp dengan pesan pre-filled
3. User klik Send — langsung ke admin OneTap
4. Admin follow up: konfirmasi desain, DP, jadwal produksi
5. Produk dikirim, tracking via WA

---

## 07 · Integrasi AI Chatbot (Gratis)

### Perbandingan Platform

| Platform | Model AI | Free Tier | Kelebihan |
|---|---|---|---|
| **Tawk.to** ⭐ | AI Assist | 100% gratis selamanya | Tidak ada batas percakapan, mobile app admin |
| Tidio | Lyro AI | 50 percakapan/bln | UI paling bagus, setup mudah |
| Crisp | MagicReply | 2 agen, unlimited chat | Open source, bisa self-host |
| Botpress | GPT-based | 5 bot, 2000 msg/bln | Paling powerful, visual flow builder |
| n8n + OpenAI | GPT-4o | Self-host = gratis | Paling fleksibel, butuh developer |

### ⭐ Rekomendasi: Tawk.to

**Alasan:**
- 100% gratis selamanya, tanpa batasan percakapan
- Setup hanya 2 baris script
- Ada mobile app — admin bisa reply dari HP
- Widget bisa dikustomisasi warnanya ke `#FF5FA2`
- Mendukung AI auto-reply di luar jam kerja

### Cara Pasang Tawk.to

1. Daftar gratis di [tawk.to](https://www.tawk.to)
2. Buat properti baru → nama: "OneTap"
3. Salin script embed yang diberikan
4. Tempel sebelum `</body>` di semua halaman:

```html
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/69eeeffa5559ee1c3cb4053c/1jn6lir7o';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
```

5. Di dashboard Tawk.to → **Appearance** → ubah warna widget ke `#FF5FA2`
6. Isi **Canned Responses** (shortcut jawaban) untuk pertanyaan umum:
   - "Berapa harga keychain?"
   - "Berapa lama proses produksi?"
   - "Apakah bisa custom desain?"
   - "Cara order gimana?"
7. Aktifkan **AI Assist** untuk auto-reply di luar jam operasional

### Posisi Widget

```
Chatbot: pojok kanan bawah (default tawk.to)
WA Button: geser ke kanan bawah, offset ke atas (bottom: 80px)
```

Atau gunakan setting Tawk.to untuk memindah widget ke **kiri bawah** agar WA button tetap di kanan.

---

## 08 · Tech Stack Rekomendasi

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | Next.js 14 (App Router) | React-based, SSG/SSR, SEO optimal |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, komponen siap pakai |
| Animasi | Framer Motion | Scroll reveal, micro-interaction |
| CMS (opsional) | Sanity.io atau Notion API | Edit produk tanpa coding |
| Deploy | Vercel (sudah ada) | Gratis untuk skala ini |
| Chatbot | Tawk.to embed | 2 baris script, 100% gratis |
| Analytics | Vercel Analytics | Gratis, privacy-friendly |
| Font | Inter via Google Fonts | Modern, terbaca semua device |

---

## 09 · Prioritas & Timeline

### Fase 1 — Fondasi (Minggu 1–2)
Target: Website baru live, tampilan redesign & light mode selesai

| Task | Prioritas | Estimasi |
|---|---|---|
| Setup project Next.js + Tailwind | 🔴 Kritis | 0.5 hari |
| Implementasi color palette + `color-scheme: light` | 🔴 Kritis | 0.5 hari |
| Redesign Navbar + Footer | 🔴 Kritis | 1 hari |
| Redesign Hero Section (light bg, foto nyata) | 🔴 Kritis | 1–2 hari |
| Section: Features, How It Works, CTA Banner | 🟡 Tinggi | 1 hari |
| Pasang Tawk.to chatbot + kustomisasi warna | 🟡 Tinggi | 2 jam |
| Floating WA button (semua halaman) | 🔴 Kritis | 2 jam |

### Fase 2 — Produk & Katalog (Minggu 3–4)
Target: Sistem katalog dan halaman detail produk live

| Task | Prioritas | Estimasi |
|---|---|---|
| Halaman Katalog `/catalog` (filter + grid) | 🔴 Kritis | 2–3 hari |
| Halaman Detail Produk + WA order button | 🔴 Kritis | 2 hari |
| Data produk (JSON/CMS, min. 5 produk) | 🟡 Tinggi | 1 hari |
| Halaman About | 🟢 Normal | 1 hari |
| SEO: meta tags, sitemap, OG image | 🟡 Tinggi | 0.5 hari |
| Mobile responsiveness audit | 🔴 Kritis | 1 hari |

### Fase 3 — Polish & Growth (Minggu 5–6)

| Task | Prioritas | Estimasi |
|---|---|---|
| Testimonial section (data nyata dari pelanggan) | 🟡 Tinggi | 1 hari |
| FAQ accordion | 🟢 Normal | 0.5 hari |
| Animasi Framer Motion (scroll reveal) | 🟢 Normal | 1–2 hari |
| Blog/Tips section (3 artikel awal) | 🟢 Normal | 2 hari |
| Analytics setup | 🟡 Tinggi | 2 jam |
| Performance audit (Core Web Vitals, target LCP < 2.5s) | 🟡 Tinggi | 1 hari |

---

## 10 · Checklist Sebelum Launch

### Visual & Branding
- [ ] `color-scheme: light` / `darkMode: false` sudah diset
- [ ] Tidak ada sisa warna biru gelap dari versi lama
- [ ] Logo baru terpasang (SVG + PNG) di semua halaman
- [ ] Favicon menggunakan logo baru
- [ ] Color palette konsisten di seluruh halaman
- [ ] Font Inter/Geist dimuat dengan benar

### Light Mode
- [ ] Background hero: `#FFF8F2` atau `#FFFFFF` — bukan gelap
- [ ] Teks utama: `#1A1A2E` — kontras minimal 4.5:1 di background putih
- [ ] CTA banner pink `#FF5FA2` hanya ada satu section
- [ ] Footer gelap `#1A1A2E` hanya di bagian paling bawah
- [ ] Test di device yang pakai OS dark mode → website tetap tampil light

### Konten
- [ ] Nomor WA benar di semua tombol order
- [ ] Pesan pre-filled WA sudah ditest dan terkirim dengan benar
- [ ] Harga produk up-to-date
- [ ] Foto produk nyata (bukan AI placeholder)

### Teknis
- [ ] Mobile responsive di iOS dan Android
- [ ] Tawk.to chatbot muncul, warna pink, posisi tidak bentrok dengan WA button
- [ ] Meta title dan description setiap halaman terisi
- [ ] Tidak ada broken link
- [ ] Loading time < 3 detik (cek via [PageSpeed Insights](https://pagespeed.web.dev))
- [ ] HTTPS aktif

---

## 11 · Panduan Upload Assets

### Logo

Format yang dibutuhkan:
- `logo.svg` — utama, scalable
- `logo-512.png` — fallback & OG image
- `logo-192.png` — PWA icon
- `logo-white.svg` — untuk dipakai di footer dark (`#1A1A2E`)
- `logo-dark.svg` — untuk navbar (versi pink atau navy)

Simpan di: `/public/images/logo/`

Gunakan logo_full.png jika ingin ada textnya atau logo_simple.png jika tidak ada textnya (only logo)

### Foto Produk

- Format: **WebP** (utama) atau JPG — hindari PNG untuk foto
- Resolusi: min. 800×800px thumbnail, 1200×1200px untuk detail
- Background: **putih bersih** atau `#FFF8F2` agar konsisten dengan site
- Minimal per produk: 3 foto (depan, detail/close-up, lifestyle/pemakaian)

Simpan di: `/public/images/products/:product-slug/`

---

## 12 · Catatan Akhir

Redesign ini dirancang agar bisa dikerjakan secara bertahap tanpa harus sekaligus. Fase 1 sudah cukup untuk meningkatkan kesan pertama secara signifikan.

**Dua hal paling berdampak** untuk menghilangkan kesan *AI-generated*:
1. **Logo baru** — pasang segera begitu tersedia
2. **Foto produk nyata** — bahkan 2–3 foto bagus sudah jauh lebih baik dari render AI

Keputusan **full light mode** adalah hal yang tepat untuk palette ini. Jangan tergoda untuk menambahkan dark mode di awal — selesaikan light mode dengan sempurna dulu, dan dark mode bisa jadi roadmap v2 jika memang ada permintaan dari pengguna.

---

*Dokumen ini dibuat untuk kebutuhan internal tim OneTap · 2026*