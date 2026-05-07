# 🌐 Implementation Plan — OneTap Landing Page
**URL:** https://www.onetap-charm.com  
**Versi:** 2.0  
**Tanggal:** 2026-05-07  
**Status:** Ready for Development

---

## 📋 Daftar Fitur

| ID | Fitur | Prioritas | Estimasi |
|----|-------|-----------|----------|
| L1 | Redesign UI Landing Page | High | 3–5 hari |
| L2 | Password Protection & Password Link Protection | High | 0.5 hari (reuse dari admin) |
| L3 | Fitur Linktree (Auth + Builder + Template) | High | 5–8 hari |
| L4 | NFC Absensi: Halaman Auto-Record + WA via Fonnte | High | 0.5–1 hari (reuse A5) |

---

## L1 — Redesign UI Landing Page

### Deskripsi
Redesign tampilan landing page agar lebih modern, bersih, dan menarik — mengacu pada referensi desain Neurix dan Payway yang diberikan.

### Prinsip Desain

- **Bold typography** — headline besar, kontras tinggi, mudah dibaca
- **Soft gradients & depth** — background tidak flat, ada layer visual
- **Warna brand tetap** — pink `#FF5FA2` sebagai aksen utama
- **Alternating sections** — section gelap dan terang bergantian untuk ritme visual
- **Micro-interactions** — hover effects, smooth scroll, fade-in saat scroll
- **Social proof prominent** — angka, rating, dan testimoni tampil besar
- **CTA always visible** — tombol utama tidak pernah jauh dari jangkauan

### Struktur Halaman Baru

```
1. Navbar
   ├── Logo + nav links
   ├── Tombol Login/Register (NEW)
   └── CTA: Order Sekarang

2. Hero Section
   ├── Badge: "Teknologi NFC #1 Indonesia"
   ├── Headline: "OneTap, Semuanya Terhubung"
   ├── Subheadline + stats (1500+, 5.0, 100%)
   ├── CTA: [Order Sekarang] [Lihat Katalog]
   └── Visual: 3D keychain mockup + floating info cards

3. Trust Bar
   └── Logo klien / institusi / sekolah yang sudah pakai

4. Features Section (3-kolom grid card)

5. How It Works (3 langkah visual)

6. Product Catalog (card + harga + CTA)

7. Use Cases (tab grid)
   ├── Personal Branding
   ├── Business Networking
   ├── Event & Conference
   └── Absensi Kelas (NEW)

8. Linktree Feature Highlight (NEW)
   └── Preview mockup builder + CTA daftar

9. OneTap for Education Section (NEW)
   └── Showcase fitur absensi WA otomatis

10. Testimoni (card grid dengan foto + rating)

11. FAQ (accordion)

12. Final CTA
    └── Chat WA + Lihat Katalog
```

### Komponen UI Baru

**Hero Section:**

```tsx
// components/landing/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-24">
        {/* Kiri: Text & CTA */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-600 text-sm font-semibold rounded-full mb-6">
            ✦ Teknologi NFC #1 Indonesia
          </span>
          <h1 className="text-6xl lg:text-7xl font-black leading-tight mb-6 text-gray-900">
            OneTap,<br />
            <span className="text-pink-500">Semuanya</span><br />
            Terhubung
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-lg leading-relaxed">
            Hubungkan dunia fisik dan digital dalam satu sentuhan.
            Tanpa aplikasi, tanpa ribet.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="https://wa.me/6283114227745"
              className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl transition shadow-lg shadow-pink-200"
            >
              Order Sekarang
            </a>
            <a
              href="/catalog"
              className="px-8 py-4 border-2 border-gray-200 hover:border-pink-300 text-gray-700 font-semibold rounded-2xl transition"
            >
              Lihat Katalog →
            </a>
          </div>
          <div className="flex gap-8">
            {[
              { value: "1,500+", label: "Pelanggan Puas" },
              { value: "5.0/5.0", label: "Rating" },
              { value: "100%", label: "Tanpa Aplikasi" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-pink-500">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Kanan: Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <img
            src="/images/keychain-3d.png"
            alt="OneTap NFC Keychain"
            className="w-full drop-shadow-2xl"
          />
          {/* Floating cards */}
          <div className="absolute top-8 -left-8 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2">
            <span className="text-2xl">📲</span>
            <div>
              <p className="text-xs text-gray-400">Tap & Connect</p>
              <p className="text-sm font-bold">Langsung Terhubung</p>
            </div>
          </div>
          <div className="absolute bottom-16 -right-8 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-xs text-gray-400">Password Protected</p>
              <p className="text-sm font-bold">Aman & Privat</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

**Animasi Scroll (reusable wrapper):**

```tsx
// components/ui/FadeIn.tsx
import { motion } from "framer-motion";

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const variants = {
    up: { y: 40 },
    left: { x: -40 },
    right: { x: 40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...variants[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
```

### Dependencies Desain

| Package | Kegunaan |
|---------|----------|
| `framer-motion` | Animasi scroll & micro-interactions |
| `@radix-ui/react-accordion` | FAQ accordion |
| `@radix-ui/react-tabs` | Tabs use cases |
| `@radix-ui/react-dialog` | Modal auth & password |

---

## L2 — Password Protection & Password Link Protection

### Deskripsi
Fitur password protection saat Write NFC dan password link protection juga tersedia di landing page — untuk user yang punya akun Linktree OneTap.

> Implementasi **identik** dengan A2 dan A3 di Implementation Plan Admin. Komponen dan API endpoint di-share agar tidak duplikasi kode.

### Shared Components

```
shared/
├── components/
│   ├── NfcPasswordModal.tsx     ← dipakai di admin & landing
│   └── PasswordLinkForm.tsx     ← dipakai di /r/[token] (landing)
├── lib/
│   ├── linkProtection.ts        ← generate & verify token
│   └── nfcPassword.ts           ← verify operation password
└── pages/
    └── r/[token].tsx            ← di-host di landing page
```

Referensi implementasi detail: **lihat A2 dan A3 di Implementation Plan Admin.**

---

## L3 — Fitur Linktree (Auth + Builder + Template)

### Deskripsi
User bisa daftar akun di landing page, membuat halaman profil bergaya Linktree, dan menghubungkannya langsung ke NFC tag mereka. Tidak perlu coding — cukup isi form dan pilih template.

### Arsitektur Halaman

```
onetap-charm.com/
├── /auth/login              ← halaman login
├── /auth/register           ← halaman register
├── /dashboard               ← user dashboard
├── /dashboard/linktree      ← builder halaman linktree
├── /dashboard/nfc           ← connect linktree ke NFC tag
├── /dashboard/analytics     ← statistik tap & klik
└── /l/[username]            ← halaman public linktree (dibuka saat NFC di-tap)
```

### Schema Database

```sql
-- Tabel users
CREATE TABLE users (
  id            UUID PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username      VARCHAR(100) UNIQUE NOT NULL,
  avatar_url    TEXT,
  bio           TEXT,
  plan          VARCHAR(20) DEFAULT 'free',
  created_at    TIMESTAMP
);

-- Halaman linktree milik user
CREATE TABLE linktree_pages (
  id            UUID PRIMARY KEY,
  user_id       UUID REFERENCES users(id),
  title         VARCHAR(255),
  bio           TEXT,
  theme_id      VARCHAR(100) DEFAULT 'minimal',
  is_published  BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP,
  updated_at    TIMESTAMP
);

-- Link-link di halaman linktree
CREATE TABLE linktree_links (
  id            UUID PRIMARY KEY,
  page_id       UUID REFERENCES linktree_pages(id),
  label         VARCHAR(255) NOT NULL,
  url           TEXT NOT NULL,
  icon          VARCHAR(100),
  sort_order    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  click_count   INTEGER DEFAULT 0
);

-- Koneksi NFC tag ke halaman linktree
CREATE TABLE nfc_linktree_connections (
  tag_id        VARCHAR(255) PRIMARY KEY,
  page_id       UUID REFERENCES linktree_pages(id),
  connected_at  TIMESTAMP
);
```

### Implementasi

**Step 1 — Halaman Register & Login**

```tsx
// pages/auth/register.tsx
export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", username: "", password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="card max-w-md w-full mx-4 p-8">
        <img src="/images/logo.png" className="h-10 mb-6 mx-auto" />
        <h2 className="text-2xl font-bold text-center mb-1">Buat Akun OneTap</h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Mulai buat halaman Linktree-mu sendiri
        </p>

        <div className="space-y-3">
          <input
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input w-full"
          />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              onetap-charm.com/l/
            </span>
            <input
              placeholder="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input w-full pl-44"
            />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input w-full"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button onClick={handleSubmit} className="btn-primary w-full mt-4">
          Daftar Sekarang
        </button>
        <p className="text-center text-sm mt-4 text-gray-400">
          Sudah punya akun?{" "}
          <a href="/auth/login" className="text-pink-500 font-medium">
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}
```

**Step 2 — Linktree Builder (Drag & Drop)**

```tsx
// pages/dashboard/linktree.tsx
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function LinktreeBuilder() {
  const [links, setLinks] = useState<Link[]>([]);
  const [profile, setProfile] = useState({ title: "", bio: "", avatar: "" });
  const [selectedTheme, setSelectedTheme] = useState("pink");
  const [saved, setSaved] = useState(false);

  const addLink = () => {
    setLinks((prev) => [
      ...prev,
      { id: uuid(), label: "", url: "", icon: "🔗", isActive: true, clickCount: 0 },
    ]);
  };

  const handleSave = async () => {
    await fetch("/api/linktree/save", {
      method: "POST",
      body: JSON.stringify({ profile, links, theme: selectedTheme }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-[1fr_360px] gap-8">

        {/* Kiri: Editor */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Edit Linktree</h1>
            <button onClick={handleSave} className="btn-primary">
              {saved ? "✓ Tersimpan" : "Simpan"}
            </button>
          </div>

          {/* Profil */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Profil</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src={profile.avatar || "/images/avatar-placeholder.png"}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">
                  +
                </button>
              </div>
              <div className="flex-1 space-y-2">
                <input
                  placeholder="Nama / Brand kamu"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="input w-full"
                />
                <input
                  placeholder="Bio singkat (opsional)"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Links</h3>
              <button onClick={addLink} className="btn-outline text-sm px-3 py-1.5">
                + Tambah Link
              </button>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links} strategy={verticalListSortingStrategy}>
                {links.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Belum ada link. Klik "+ Tambah Link" untuk mulai.
                  </div>
                )}
                {links.map((link) => (
                  <SortableLinkCard
                    key={link.id}
                    link={link}
                    onUpdate={(updated) =>
                      setLinks((prev) => prev.map((l) => (l.id === link.id ? updated : l)))
                    }
                    onDelete={() =>
                      setLinks((prev) => prev.filter((l) => l.id !== link.id))
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Tema */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Pilih Tema</h3>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-3 rounded-xl border-2 transition text-left ${
                    selectedTheme === theme.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-full h-10 rounded-lg mb-2 ${theme.previewBg}`}
                  />
                  <p className="text-xs font-medium text-center">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kanan: Preview live */}
        <div className="sticky top-6">
          <p className="text-sm text-gray-400 text-center mb-3">Preview</p>
          <div className="relative mx-auto w-[280px] h-[560px] bg-black rounded-[40px] p-3 shadow-2xl">
            <div className="w-full h-full rounded-[32px] overflow-hidden">
              <LinktreePreview
                profile={profile}
                links={links}
                theme={selectedTheme}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <a
              href={`/l/${username}`}
              target="_blank"
              className="btn-outline flex-1 text-sm text-center"
            >
              Buka Halaman →
            </a>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            onetap-charm.com/l/{username}
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Step 3 — Template Tema**

```ts
// lib/themes.ts
export const themes = [
  {
    id: "minimal",
    name: "Minimal",
    previewBg: "bg-white border border-gray-100",
    bg: "bg-white",
    card: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    text: "text-gray-900",
    bio: "text-gray-500",
  },
  {
    id: "dark",
    name: "Dark",
    previewBg: "bg-gray-900",
    bg: "bg-gray-900",
    card: "bg-gray-800 hover:bg-gray-700 text-white",
    text: "text-white",
    bio: "text-gray-400",
  },
  {
    id: "pink",
    name: "OneTap Pink",
    previewBg: "bg-gradient-to-br from-pink-400 to-rose-500",
    bg: "bg-gradient-to-br from-pink-50 to-rose-100",
    card: "bg-white hover:bg-pink-50 border border-pink-100 text-gray-900",
    text: "text-gray-900",
    bio: "text-pink-500",
  },
  {
    id: "gradient",
    name: "Gradient",
    previewBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    bg: "bg-gradient-to-br from-purple-600 to-pink-500",
    card: "bg-white/20 hover:bg-white/30 backdrop-blur text-white",
    text: "text-white",
    bio: "text-white/70",
  },
  {
    id: "nature",
    name: "Nature",
    previewBg: "bg-gradient-to-br from-green-400 to-emerald-500",
    bg: "bg-gradient-to-br from-green-50 to-emerald-100",
    card: "bg-white hover:bg-green-50 text-gray-900",
    text: "text-gray-900",
    bio: "text-green-600",
  },
  {
    id: "ocean",
    name: "Ocean",
    previewBg: "bg-gradient-to-br from-blue-400 to-cyan-500",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-100",
    card: "bg-white hover:bg-blue-50 text-gray-900",
    text: "text-gray-900",
    bio: "text-blue-500",
  },
];
```

**Step 4 — Halaman Public /l/[username]**

```tsx
// pages/l/[username].tsx
export async function getServerSideProps({ params }: { params: { username: string } }) {
  const user = await db.users.findByUsername(params.username);
  if (!user) return { notFound: true };

  const page = await db.linktreePages.findByUserId(user.id);
  const links = await db.linktreeLinks.findByPageId(page.id, { isActive: true });

  return { props: { user, page, links } };
}

export default function PublicLinktreePage({ user, page, links }: Props) {
  const theme = themes.find((t) => t.id === page.themeId) ?? themes[0];

  const handleLinkClick = async (linkId: string) => {
    // Track klik di background
    await fetch(`/api/linktree/click/${linkId}`, { method: "POST" });
  };

  return (
    <>
      <Head>
        <title>{page.title || user.name} | OneTap</title>
        <meta property="og:title" content={page.title || user.name} />
        <meta property="og:description" content={page.bio || ""} />
        <meta property="og:image" content={user.avatarUrl || ""} />
      </Head>

      <div className={`min-h-screen ${theme.bg} flex flex-col items-center py-12 px-4`}>
        {/* Profile */}
        <div className="text-center mb-8">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-white shadow-md object-cover"
            />
          )}
          <h1 className={`text-2xl font-bold ${theme.text}`}>
            {page.title || user.name}
          </h1>
          {page.bio && (
            <p className={`mt-1 text-sm max-w-xs mx-auto ${theme.bio}`}>{page.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="w-full max-w-sm space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              onClick={() => handleLinkClick(link.id)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl font-semibold text-sm transition ${theme.card}`}
            >
              {link.icon && <span className="text-lg">{link.icon}</span>}
              {link.label}
            </a>
          ))}
        </div>

        {/* Branding */}
        <div className="mt-12">
          <a
            href="https://onetap-charm.com"
            className="text-xs text-gray-400 hover:text-gray-500 transition"
          >
            Dibuat dengan ❤️ <span className="font-semibold">OneTap</span>
          </a>
        </div>
      </div>
    </>
  );
}
```

**Step 5 — Koneksi Linktree ke NFC Tag**

```tsx
// pages/dashboard/nfc/connect.tsx
export default function ConnectNfcPage() {
  const { data: page } = useLinktreePage();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnectNfc = async () => {
    setIsConnecting(true);
    try {
      const ndef = new NDEFReader();
      await ndef.write({
        records: [{
          recordType: "url",
          data: `https://onetap-charm.com/l/${username}`,
        }],
      });
      setConnected(true);
    } catch (err) {
      alert("Gagal menulis ke NFC tag. Pastikan tag ditempel dan coba lagi.");
    }
    setIsConnecting(false);
  };

  return (
    <div className="max-w-sm mx-auto p-6 text-center">
      <h2 className="text-xl font-bold mb-2">Hubungkan ke NFC Tag</h2>
      <p className="text-gray-500 text-sm mb-6">
        NFC tag akan diarahkan ke halaman Linktree kamu:
      </p>
      <div className="bg-pink-50 rounded-xl p-4 mb-6">
        <p className="text-pink-600 font-semibold text-sm">
          onetap-charm.com/l/{username}
        </p>
      </div>

      {!connected ? (
        <button
          onClick={handleConnectNfc}
          disabled={isConnecting}
          className="btn-primary w-full"
        >
          {isConnecting ? "Menunggu NFC tag..." : "Tulis ke NFC Tag"}
        </button>
      ) : (
        <div className="text-center">
          <div className="text-5xl mb-3">✅</div>
          <p className="font-semibold text-green-700">NFC tag berhasil terhubung!</p>
          <p className="text-sm text-gray-500 mt-1">
            Sekarang tap keychain = buka halaman Linktree kamu
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## L4 — NFC Absensi: Halaman Auto-Record + WA via Fonnte

### Deskripsi
Ketika NFC absensi di-tap, browser membuka halaman `/attend/{token}` di landing page. Halaman ini secara otomatis mencatat kehadiran dan mengirim WA ke guru via Fonnte — **tanpa aksi apapun dari siswa**.

### Flow

```
Siswa tap NFC
        ↓
onetap-charm.com/attend/{token} terbuka
        ↓
Otomatis: catat ke DB + kirim WA via Fonnte
        ↓
Tampil: "✅ Hadir! Notifikasi terkirim ke guru"
```

> Implementasi teknis (API, Fonnte helper, schema DB) **identik dengan A5 di Implementation Plan Admin**.  
> Halaman `/attend/[token]` di-host di **landing page** (bukan admin).

### Section Landing: "OneTap for Education"

Tambahkan section baru di homepage untuk showcase fitur absensi kepada calon klien sekolah/institusi:

```tsx
// components/landing/EducationSection.tsx
export function EducationSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Kiri: teks */}
          <FadeIn direction="left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full mb-4">
              🎓 Untuk Pendidikan
            </span>
            <h2 className="text-4xl font-black leading-tight mb-4 text-gray-900">
              Absensi Otomatis<br />
              <span className="text-blue-500">Cukup Tap Sekali</span>
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Siswa tap keychain NFC ke HP — langsung tercatat hadir dan
              notifikasi WhatsApp terkirim otomatis ke guru. Tidak ada lagi
              absen manual yang membuang waktu kelas.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Pesan WA otomatis terkirim ke guru — tanpa aksi dari siswa",
                "Mencantumkan nama siswa, kelas, dan waktu tap",
                "Riwayat absensi tersimpan di dashboard admin",
                "Template pesan bisa dikustomisasi per kelas",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://wa.me/6283114227745?text=Halo+OneTap!+Saya+tertarik+dengan+fitur+absensi+NFC."
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition"
            >
              Konsultasi Gratis →
            </a>
          </FadeIn>

          {/* Kanan: demo visual */}
          <FadeIn direction="right" delay={0.2}>
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              {/* Flow diagram sederhana */}
              <div className="space-y-4">
                {[
                  { icon: "📱", title: "Siswa tap keychain ke HP", sub: "NFC terdeteksi otomatis" },
                  { icon: "✅", title: "Kehadiran tercatat", sub: "Langsung masuk database" },
                  { icon: "📲", title: "WA terkirim ke guru", sub: "Via Fonnte — 100% otomatis" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{step.title}</p>
                      <p className="text-gray-400 text-xs">{step.sub}</p>
                    </div>
                    {i < 2 && (
                      <div className="absolute left-10 mt-16 h-4 w-0.5 bg-blue-100" />
                    )}
                  </div>
                ))}
              </div>

              {/* Contoh notif WA */}
              <div className="mt-6 bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-2">Contoh pesan yang diterima guru:</p>
                <div className="bg-white rounded-xl p-3 shadow-sm text-sm">
                  <p className="font-semibold text-green-600 text-xs mb-1">WhatsApp</p>
                  <p className="text-gray-700 whitespace-pre-line text-xs leading-relaxed">
                    {`✅ Absensi OneTap\n\nSiswa *Budi Santoso* hadir dalam kelas *IPA - Kelas 10A*\n📅 Kamis, 7 Mei 2026\n🕐 08:32 WIB`}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
```

---

## 🗂️ Struktur Folder Lengkap

```
src/
├── app/ (atau pages/)
│   ├── (landing)/
│   │   ├── page.tsx              ← homepage (redesign)
│   │   ├── catalog/
│   │   ├── about/
│   │   └── blog/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── page.tsx              ← user overview
│   │   ├── linktree/             ← builder
│   │   ├── nfc/
│   │   │   └── connect/          ← hubungkan NFC ke linktree
│   │   └── analytics/
│   ├── l/[username]/             ← halaman public linktree
│   ├── r/[token]/                ← password link redirect
│   └── attend/[token]/           ← absensi NFC (auto-proses)
│
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── TrustBar.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ProductCatalog.tsx
│   │   ├── UseCases.tsx
│   │   ├── LinktreeHighlight.tsx
│   │   ├── EducationSection.tsx  ← NEW (absensi showcase)
│   │   ├── Testimonials.tsx
│   │   └── Faq.tsx
│   ├── linktree/
│   │   ├── SortableLinkCard.tsx
│   │   ├── LinktreePreview.tsx
│   │   └── ThemePicker.tsx
│   ├── ui/
│   │   ├── FadeIn.tsx
│   │   ├── Modal.tsx
│   │   └── Toggle.tsx
│   └── shared/
│       ├── NfcPasswordModal.tsx  ← shared dengan admin
│       └── PasswordLinkForm.tsx  ← shared dengan admin
│
└── lib/
    ├── fonnte.ts                 ← WA API helper
    ├── linkProtection.ts         ← token generate & verify
    ├── themes.ts                 ← konfigurasi tema linktree
    └── db.ts                     ← database client
```

---

## 📦 Dependencies Tambahan

| Package | Kegunaan |
|---------|----------|
| `framer-motion` | Animasi scroll & hero section |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag-and-drop link ordering |
| `next-auth` atau `lucia-auth` | Sistem autentikasi |
| `bcryptjs` | Hash password user |
| `zod` | Validasi form input |
| `@radix-ui/react-accordion` | FAQ accordion |
| `@radix-ui/react-tabs` | Tabs use cases |
| `uuid` | Generate ID unik |

---

## ⚠️ Catatan Penting

- **Username validation** — hanya alphanumeric + dash, tidak boleh sama dengan route existing (`/catalog`, `/blog`, `/auth`, `/l`, `/r`, `/attend`, dll). Validasi di sisi server dan client
- **Auth session** — gunakan supabase auth
- **SEO halaman linktree** — setiap `/l/[username]` harus punya proper `<title>` dan OG meta tags agar bagus saat dishare di sosmed
- **Mobile first** — halaman `/l/[username]` hampir selalu dibuka dari HP setelah tap NFC, pastikan responsive sempurna
- **Fonnte uptime** — ingatkan klien bahwa nomor WA Fonnte harus selalu terhubung (tidak boleh logout dari WA di HP yang dipakai Fonnte)
- **Rate limiting** — terapkan di `/api/attendance/[token]` untuk mencegah spam tap berulang dari satu NFC tag dalam waktu singkat (misalnya cooldown 1 menit per tag)

---

## 🔗 Keterkaitan dengan Implementation Plan Admin

| Fitur Landing | Bergantung pada | Catatan |
|---------------|-----------------|---------|
| L2 Password Protection | A2 + A3 | Shared components & API endpoints |
| L4 Halaman `/attend/[token]` | A5 | Di-host di landing, shared Fonnte lib & DB |
| Halaman `/r/[token]` | A3 | Di-host di landing, shared unlock API |

---

## 🗓️ Estimasi Total Pengerjaan

| Fase | Fitur | Estimasi |
|------|-------|----------|
| Fase 1 | L1 (Redesign UI) | 3–5 hari |
| Fase 2 | L2 (Password Protection — reuse admin) | 0.5 hari |
| Fase 3 | L3 (Linktree Auth + Builder + Public page) | 5–7 hari |
| Fase 4 | L4 (Absensi section + attend page — reuse A5) | 0.5–1 hari |
| **Total** | | **~9–14 hari kerja** |