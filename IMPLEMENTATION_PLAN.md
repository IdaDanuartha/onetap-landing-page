# Implementation Plan — NFC Payment Integration (Flow 1)

> Dokumen ini adalah panduan lengkap untuk mengupdate sistem NFC keychain yang sudah ada agar mendukung fitur pembayaran via QRIS / deep link / payment link (Flow 1).

---

## Daftar Isi

1. [Overview & Scope](#1-overview--scope)
2. [Prasyarat](#2-prasyarat)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Tipe Payload Pembayaran](#4-tipe-payload-pembayaran)
5. [Alur Teknis Detail](#5-alur-teknis-detail)
6. [Perubahan di Sistem yang Ada](#6-perubahan-di-sistem-yang-ada)
7. [Implementasi Backend](#7-implementasi-backend)
8. [Implementasi Penulisan Chip](#8-implementasi-penulisan-chip)
9. [Pengujian](#9-pengujian)
10. [Keamanan & Edge Case](#10-keamanan--edge-case)
11. [Roadmap & Prioritas](#11-roadmap--prioritas)

---

## 1. Overview & Scope

### Apa yang diubah

Sistem NFC keychain yang sudah berjalan saat ini mendukung tipe data:
- Link / URL
- Text
- Email
- Phone
- Absensi

Fitur baru yang akan ditambahkan: **tipe data `payment`** — chip NFC menyimpan payload pembayaran yang ketika di-tap oleh HP user, secara otomatis mengarahkan ke halaman pembayaran (GoPay, OVO, DANA, QRIS, atau payment link kustom).

### Apa yang TIDAK berubah

- Hardware chip NFC tetap **NTAG213 / NTAG215 / NTAG216** — tidak perlu ganti chip
- Cara penulisan chip (NFC writer) tetap sama
- Infrastruktur yang sudah ada tetap dipakai
- Tidak ada integrasi langsung ke bank atau payment processor — semua dihandle oleh app dompet user

### Batasan Flow 1

- User **wajib punya HP** saat tap — karena HP yang memproses pembayaran
- User **wajib punya app dompet** yang sesuai (GoPay, OVO, dll)
- Untuk harga dinamis, terminal/kasir harus update payload sebelum tap, **atau** pakai Opsi B (payment link via backend)
- Tidak bisa tap-and-go otomatis seperti e-toll — user tetap harus konfirmasi di app

---

## 2. Prasyarat

### Hardware

| Item | Spesifikasi | Keterangan |
|---|---|---|
| Chip NFC | NTAG213 (144 byte) atau NTAG215 (504 byte) | Sudah ada di sistem kamu |
| NFC Writer | ACR122U atau PN532 | Sudah ada |
| HP untuk testing | Android (NFC aktif) | iOS support terbatas untuk deep link |

### Software

| Komponen | Pilihan | Keterangan |
|---|---|---|
| Backend | Node.js / Python / Go | Sudah ada — tinggal tambah endpoint |
| Database | PostgreSQL / MySQL / MongoDB | Sudah ada |
| Payment gateway | Midtrans / Xendit | Hanya untuk Opsi B (payment link dinamis) |
| NFC library | ndeflib (Python) / ndef-js (Node) | Untuk generate payload NDEF |

### Akun & API Key

- [ ] Akun Midtrans / Xendit (jika pakai Opsi B)
- [ ] Merchant ID dari GoPay / OVO (jika pakai deep link)
- [ ] Domain dan SSL untuk backend (jika pakai Opsi B)

---

## 3. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────┐
│                  ADMIN / KASIR                      │
│  Pilih tipe: payment                                │
│  Pilih sub-tipe: deep_link / payment_link / qris    │
│  Input: merchant_id, amount (opsional)              │
└───────────────────────┬─────────────────────────────┘
                        │ tulis ke chip
                        ▼
               ┌────────────────┐
               │  NFC Keychain  │
               │  NTAG215       │
               │  Payload NDEF  │
               └───────┬────────┘
                       │ user tap HP ke keychain
                       ▼
               ┌────────────────┐
               │   HP User      │
               │   Baca NDEF    │
               │   Parse URL    │
               └───────┬────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    Deep Link     Payment Link    QRIS URL
    (GoPay/OVO)   (Backend kamu)  (qris.id/...)
          │            │
          │            ▼
          │     ┌─────────────┐
          │     │  Backend    │
          │     │  Tentukan   │
          │     │  nominal    │
          │     │  Redirect   │
          │     └──────┬──────┘
          │            │
          ▼            ▼
    ┌──────────────────────┐
    │  App Dompet User     │
    │  GoPay / OVO / DANA  │
    │  User konfirmasi     │
    └──────────────────────┘
```

---

## 4. Tipe Payload Pembayaran

Ada 3 sub-tipe yang perlu didukung. Rekomendasinya: implementasi ketiganya, biarkan admin/kasir memilih sesuai kebutuhan.

### Opsi A — Deep Link (nominal dikosongkan)

User isi nominal sendiri di app dompet setelah tap.

```
# GoPay
gopay://pay?merchant_id=MERCHANT_ID_KAMU

# OVO
ovo://payment?merchant=MERCHANT_ID_KAMU

# DANA
dana://pay?merchant=MERCHANT_ID_KAMU
```

**Kapan dipakai:** donasi, top-up, atau transaksi di mana nominal bervariasi dan user yang menentukan.

**Kelebihan:** paling simpel, tidak butuh backend tambahan, tidak ada nominal yang perlu di-hardcode.

**Kekurangan:** rawan salah input nominal dari sisi user.

---

### Opsi B — Payment Link Dinamis (DIREKOMENDASIKAN untuk harga beda-beda)

Chip menyimpan URL ke backend kamu. Backend menentukan nominal berdasarkan konteks saat itu.

```
# Yang disimpan di chip (tidak pernah berubah)
https://pay.tokomu.com/nfc?card=CARD_ID_001

# Backend redirect ke payment gateway dengan nominal yang tepat
https://pay.tokomu.com/nfc?card=CARD_ID_001
  → redirect → https://app.midtrans.com/pay/INV-20260511-089
```

**Kapan dipakai:** kasir yang harga tiap transaksi beda, restoran, parkir, dan sebagainya.

**Kelebihan:** nominal akurat, bisa tracking siapa tap kapan, chip tidak perlu ditulis ulang tiap transaksi.

**Kekurangan:** butuh backend aktif, butuh akun payment gateway, tap harus ada internet.

---

### Opsi C — QRIS Static

Chip menyimpan URL QRIS merchant. User scan atau HP redirect ke app yang support QRIS.

```
# Format URL QRIS (shortlink lebih disarankan agar hemat memory chip)
https://qris.nobu.id/s/MERCHANT_CODE

# Atau URL QRIS penuh (butuh chip NTAG215 karena lebih dari 144 byte)
https://qris.id/00020101021226570013ID.CO.BRI...
```

**Kapan dipakai:** merchant yang sudah punya QRIS, ingin pakai NFC sebagai alternatif scan QR.

**Kelebihan:** tidak butuh backend tambahan, nominal diketik di app, paling universal.

**Kekurangan:** user tetap input nominal manual, tidak bisa tracking dari sisi merchant.

---

## 5. Alur Teknis Detail

### 5.1 Alur Opsi A — Deep Link

```
1. Admin buka panel NFC tools
2. Admin pilih tipe: "Payment"
3. Admin pilih sub-tipe: "Deep Link"
4. Admin pilih platform: GoPay / OVO / DANA
5. Admin input Merchant ID
6. Sistem generate URL: gopay://pay?merchant_id=XXX
7. Sistem encode URL ke format NDEF (record tipe URI)
8. Sistem tulis NDEF ke chip NFC
9. Chip siap dipakai

--- saat user tap ---

10. User dekatkan HP ke keychain (area NFC di belakang HP)
11. HP Android membaca chip, detect NDEF URI record
12. Android dispatch intent ke app yang handle scheme "gopay://"
13. GoPay terbuka langsung ke halaman bayar merchant
14. User input nominal
15. User input PIN / biometrik
16. Transaksi selesai — notif masuk ke HP user dan merchant
```

### 5.2 Alur Opsi B — Payment Link Dinamis

```
--- setup awal (sekali saja) ---

1. Admin daftarkan keychain ke sistem
2. Sistem assign Card ID unik: CARD_001, CARD_002, dst
3. Sistem tulis URL ke chip: https://pay.tokomu.com/nfc?card=CARD_001
4. Chip siap dipakai

--- saat transaksi ---

5. Kasir input nominal di POS / sistem kasir: Rp 35.000
6. Sistem kasir buat "sesi aktif" untuk CARD_001 dengan nominal 35.000
   → simpan ke DB: { card_id: "CARD_001", amount: 35000, expires_at: +5 menit }

7. User dekatkan HP ke keychain
8. HP baca NDEF → buka URL: https://pay.tokomu.com/nfc?card=CARD_001

9. Backend kamu terima request GET /nfc?card=CARD_001
10. Backend query DB: ada sesi aktif untuk CARD_001?
    → YA: ambil nominal 35.000, buat invoice di Midtrans/Xendit
    → TIDAK: tampilkan halaman "Tidak ada transaksi aktif"

11. Backend redirect ke payment page Midtrans:
    https://app.midtrans.com/pay/INV-20260511-089

12. HP user tampilkan halaman bayar Midtrans
    (atau deep link ke GoPay/OVO via Midtrans)

13. User konfirmasi bayar + PIN / biometrik

14. Midtrans kirim webhook ke backend kamu:
    POST https://pay.tokomu.com/webhook/midtrans
    { order_id: "INV-20260511-089", status: "settlement" }

15. Backend update DB: sesi CARD_001 → status: "paid"
16. Backend notif ke kasir: "Pembayaran CARD_001 berhasil Rp 35.000"
```

### 5.3 Alur Opsi C — QRIS

```
1. Merchant dapatkan QRIS dari bank (BCA, Mandiri, BNI, BRI, dll)
2. Admin input URL QRIS atau shortlink ke panel NFC tools
3. Sistem tulis URL ke chip sebagai NDEF URI record
4. Chip siap

--- saat user tap ---

5. User dekatkan HP ke keychain
6. HP baca NDEF → buka URL QRIS
7. Browser redirect ke app yang support QRIS
   (atau tampilkan QR code yang bisa di-scan manual)
8. User input nominal di app
9. User konfirmasi
10. Transaksi selesai — notif ke HP user dan merchant
```

---

## 6. Perubahan di Sistem yang Ada

### 6.1 Tambah tipe data baru di schema

```javascript
// Sebelumnya
const PAYLOAD_TYPES = ['link', 'text', 'email', 'phone', 'absensi']

// Sesudah
const PAYLOAD_TYPES = ['link', 'text', 'email', 'phone', 'absensi', 'payment']

// Schema payload untuk tipe payment
const PaymentPayload = {
  type: 'payment',
  sub_type: 'deep_link' | 'payment_link' | 'qris',
  platform: 'gopay' | 'ovo' | 'dana' | 'custom',   // untuk deep_link
  merchant_id: String,                               // untuk deep_link
  card_id: String,                                   // untuk payment_link
  qris_url: String,                                  // untuk qris
  label: String,                                     // nama tampil di UI
}
```

### 6.2 Tambah UI di panel admin

Tambah opsi "Payment" di dropdown tipe saat penulisan chip, dengan sub-form yang muncul sesuai sub-tipe yang dipilih:

- **Deep Link:** dropdown platform + input merchant ID
- **Payment Link:** otomatis generate card ID + tampilkan URL yang akan ditulis
- **QRIS:** input URL QRIS atau shortlink

### 6.3 Tambah endpoint backend (untuk Opsi B)

```
GET  /nfc?card=CARD_ID          → cek sesi aktif, redirect ke payment page
POST /nfc/session               → kasir buat sesi transaksi baru
GET  /nfc/session/:card_id      → cek status sesi
POST /webhook/midtrans          → terima notif dari Midtrans
POST /webhook/xendit            → terima notif dari Xendit
```

### 6.4 Tambah tabel database (untuk Opsi B)

```sql
-- Tabel kartu NFC yang terdaftar
CREATE TABLE nfc_cards (
  id          VARCHAR(50) PRIMARY KEY,   -- CARD_001, CARD_002, dst
  label       VARCHAR(100),              -- nama keychain
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Tabel sesi transaksi aktif
CREATE TABLE payment_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id     VARCHAR(50) REFERENCES nfc_cards(id),
  amount      INTEGER NOT NULL,          -- dalam rupiah
  status      VARCHAR(20) DEFAULT 'pending', -- pending | paid | expired
  invoice_id  VARCHAR(100),              -- ID dari Midtrans/Xendit
  expires_at  TIMESTAMP NOT NULL,        -- sesi hangus setelah X menit
  created_at  TIMESTAMP DEFAULT NOW(),
  paid_at     TIMESTAMP
);

-- Index untuk query cepat
CREATE INDEX idx_payment_sessions_card_status
  ON payment_sessions(card_id, status);
```

---

## 7. Implementasi Backend

### 7.1 Endpoint redirect (Node.js / Express)

```javascript
// GET /nfc?card=CARD_ID
// Dipanggil saat user tap HP ke keychain
app.get('/nfc', async (req, res) => {
  const { card } = req.query

  if (!card) {
    return res.status(400).send('Card ID tidak ditemukan')
  }

  // Cari sesi aktif yang belum expired
  const session = await db.query(`
    SELECT * FROM payment_sessions
    WHERE card_id = $1
      AND status = 'pending'
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `, [card])

  if (!session.rows.length) {
    return res.status(404).send(`
      <html>
        <body style="font-family:sans-serif;text-align:center;padding:40px">
          <h2>Tidak ada transaksi aktif</h2>
          <p>Minta kasir untuk memulai transaksi terlebih dahulu.</p>
        </body>
      </html>
    `)
  }

  const { id, amount } = session.rows[0]

  // Buat invoice di Midtrans
  const invoice = await midtrans.createTransaction({
    transaction_details: {
      order_id: `INV-${Date.now()}`,
      gross_amount: amount,
    },
    customer_details: {
      // opsional
    },
  })

  // Update session dengan invoice ID
  await db.query(
    'UPDATE payment_sessions SET invoice_id = $1 WHERE id = $2',
    [invoice.order_id, id]
  )

  // Redirect ke halaman bayar Midtrans
  return res.redirect(invoice.redirect_url)
})
```

### 7.2 Endpoint buat sesi (dipanggil kasir)

```javascript
// POST /nfc/session
// Body: { card_id, amount, expires_in_minutes }
app.post('/nfc/session', async (req, res) => {
  const { card_id, amount, expires_in_minutes = 5 } = req.body

  if (!card_id || !amount) {
    return res.status(400).json({ error: 'card_id dan amount wajib diisi' })
  }

  // Batalkan sesi pending sebelumnya untuk kartu ini
  await db.query(`
    UPDATE payment_sessions
    SET status = 'expired'
    WHERE card_id = $1 AND status = 'pending'
  `, [card_id])

  // Buat sesi baru
  const result = await db.query(`
    INSERT INTO payment_sessions (card_id, amount, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '${expires_in_minutes} minutes')
    RETURNING id
  `, [card_id, amount])

  return res.json({
    session_id: result.rows[0].id,
    card_id,
    amount,
    message: `Sesi aktif selama ${expires_in_minutes} menit. Minta user tap keychain sekarang.`
  })
})
```

### 7.3 Webhook dari Midtrans

```javascript
// POST /webhook/midtrans
app.post('/webhook/midtrans', async (req, res) => {
  const notification = req.body

  // Verifikasi signature dari Midtrans
  const hash = crypto
    .createHash('sha512')
    .update(`${notification.order_id}${notification.status_code}${notification.gross_amount}${MIDTRANS_SERVER_KEY}`)
    .digest('hex')

  if (hash !== notification.signature_key) {
    return res.status(403).json({ error: 'Signature tidak valid' })
  }

  if (notification.transaction_status === 'settlement') {
    // Update status sesi menjadi paid
    await db.query(`
      UPDATE payment_sessions
      SET status = 'paid', paid_at = NOW()
      WHERE invoice_id = $1
    `, [notification.order_id])

    // Kirim notif ke kasir (via websocket / push notification)
    notifyKasir(notification.order_id, notification.gross_amount)
  }

  return res.json({ status: 'ok' })
})
```

---

## 8. Implementasi Penulisan Chip

### 8.1 Generate NDEF payload

```javascript
// utils/nfc-writer.js
const { NdefMessage, NdefRecord } = require('ndef-js')

function generatePaymentNdef(subType, options) {
  let url = ''

  switch (subType) {
    case 'deep_link_gopay':
      url = `gopay://pay?merchant_id=${options.merchantId}`
      break

    case 'deep_link_ovo':
      url = `ovo://payment?merchant=${options.merchantId}`
      break

    case 'deep_link_dana':
      url = `dana://pay?merchant=${options.merchantId}`
      break

    case 'payment_link':
      // URL ke backend sendiri — tidak pernah berubah
      url = `https://pay.tokomu.com/nfc?card=${options.cardId}`
      break

    case 'qris':
      url = options.qrisUrl
      break

    default:
      throw new Error(`Sub-tipe tidak dikenal: ${subType}`)
  }

  // Encode sebagai NDEF URI record
  const record = NdefRecord.createUri(url)
  const message = new NdefMessage([record])

  return message.toByteArray()
}

module.exports = { generatePaymentNdef }
```

### 8.2 Cek muat di chip

Sebelum menulis, pastikan payload muat di chip yang dipakai:

| Chip | Kapasitas user data | Muat untuk |
|---|---|---|
| NTAG213 | 144 byte | Deep link pendek, QRIS shortlink |
| NTAG215 | 504 byte | Payment link, QRIS URL penuh |
| NTAG216 | 888 byte | Semua tipe + metadata tambahan |

```javascript
function checkFitsInChip(ndefBytes, chipType) {
  const capacity = { NTAG213: 144, NTAG215: 504, NTAG216: 888 }
  const max = capacity[chipType] || 144

  if (ndefBytes.length > max) {
    throw new Error(
      `Payload ${ndefBytes.length} byte terlalu besar untuk ${chipType} (maks ${max} byte). ` +
      `Pakai URL yang lebih pendek atau ganti ke chip yang lebih besar.`
    )
  }
}
```

---

## 9. Pengujian

### 9.1 Checklist sebelum deploy

**Opsi A — Deep Link**
- [ ] Tap dengan GoPay terinstall → app GoPay terbuka ke halaman merchant
- [ ] Tap dengan GoPay tidak terinstall → Google Play / App Store terbuka
- [ ] Tap dengan iPhone → URL dibuka di browser (deep link mungkin tidak bekerja di iOS)
- [ ] Merchant ID valid dan aktif di platform

**Opsi B — Payment Link**
- [ ] Kasir buat sesi → sesi tersimpan di DB
- [ ] User tap → redirect ke payment page Midtrans
- [ ] User bayar → webhook diterima → status DB update → kasir ternotif
- [ ] Sesi expired setelah 5 menit → user tap → pesan "tidak ada transaksi aktif"
- [ ] Dua user tap bersamaan satu kartu → hanya satu yang berhasil bayar
- [ ] Koneksi internet terputus saat tap → error handling yang jelas

**Opsi C — QRIS**
- [ ] Tap → URL QRIS terbuka di browser
- [ ] URL redirect ke app yang support QRIS
- [ ] Scan manual dari browser juga bisa

### 9.2 Testing environment

Gunakan mode **Sandbox** di Midtrans / Xendit selama development. Tidak perlu kartu kredit nyata untuk testing.

```bash
# Environment variables
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx   # Sandbox key
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx
MIDTRANS_IS_PRODUCTION=false
```

---

## 10. Keamanan & Edge Case

### 10.1 Ancaman yang perlu diantisipasi

| Ancaman | Risiko | Solusi |
|---|---|---|
| URL di chip diubah orang lain | Rendah — chip tidak mudah ditulis ulang tanpa writer | Aktifkan lock bit chip setelah penulisan |
| Sesi dibuat berulang kali oleh kasir nakal | Sedang | Log semua pembuatan sesi, notif ke owner |
| Webhook palsu dari Midtrans | Tinggi | Selalu verifikasi signature hash |
| Double tap — user tap dua kali | Sedang | Cek idempotency: satu invoice_id hanya bisa settle sekali |
| Sesi tidak pernah expire | Sedang | Cron job tiap 5 menit untuk update sesi expired |

### 10.2 Idempotency untuk double payment

```javascript
// Pastikan satu invoice hanya bisa diproses sekali
app.post('/webhook/midtrans', async (req, res) => {
  const { order_id, transaction_status } = req.body

  // Cek apakah sudah pernah diproses
  const existing = await db.query(
    'SELECT status FROM payment_sessions WHERE invoice_id = $1',
    [order_id]
  )

  if (existing.rows[0]?.status === 'paid') {
    // Sudah diproses — return OK tanpa proses ulang
    return res.json({ status: 'already_processed' })
  }

  // Proses normal...
})
```

### 10.3 Cron job expire sesi

```javascript
// Jalankan setiap 1 menit
cron.schedule('* * * * *', async () => {
  await db.query(`
    UPDATE payment_sessions
    SET status = 'expired'
    WHERE status = 'pending'
      AND expires_at < NOW()
  `)
})
```

---

## 11. Roadmap & Prioritas

### Phase 1 — MVP (Minggu 1–2)

Tujuan: satu sub-tipe berjalan end-to-end di satu merchant.

- [ ] Tambah tipe `payment` di UI panel admin
- [ ] Implementasi Opsi A (deep link GoPay) — tidak butuh backend baru
- [ ] Tulis chip dan test di HP Android
- [ ] Dokumentasi cara pakai untuk kasir

### Phase 2 — Payment Link (Minggu 3–4)

Tujuan: harga dinamis bisa berjalan.

- [ ] Buat tabel `nfc_cards` dan `payment_sessions` di DB
- [ ] Implementasi endpoint `GET /nfc` dan `POST /nfc/session`
- [ ] Integrasi Midtrans sandbox
- [ ] Implementasi webhook + verifikasi signature
- [ ] Test end-to-end dengan skenario lengkap
- [ ] Tambah notifikasi kasir (minimal: polling atau websocket sederhana)

### Phase 3 — Polish & Multi-platform (Minggu 5–6)

- [ ] Tambah dukungan OVO, DANA, LinkAja (deep link)
- [ ] Implementasi Opsi C (QRIS)
- [ ] Cron job expire sesi
- [ ] Halaman error yang ramah user
- [ ] Dashboard sederhana: history transaksi per kartu
- [ ] Monitoring: alert jika webhook tidak masuk dalam X menit

### Phase 4 — Produksi

- [ ] Ganti ke Midtrans Production key
- [ ] Setup HTTPS dengan SSL certificate yang valid
- [ ] Load test endpoint `/nfc` (simulasi banyak user tap bersamaan)
- [ ] Backup database otomatis
- [ ] Dokumentasi troubleshooting untuk kasir

---

## Catatan Penutup

Flow 1 adalah pendekatan paling pragmatis — semua urusan keuangan tetap di tangan platform yang sudah punya lisensi BI (GoPay, OVO, Midtrans, dll). Tugasmu hanya memastikan chip NFC menyimpan URL yang tepat dan backend kamu (untuk Opsi B) menghubungkan nominal yang benar ke transaksi yang benar.

Mulai dari **Phase 1 Opsi A** — bisa selesai dalam 1–2 hari kerja dan langsung bisa dipakai untuk demo ke merchant pertama.

---

*Dokumen ini dibuat berdasarkan diskusi sistem NFC keychain — versi 1.0, Mei 2026.*