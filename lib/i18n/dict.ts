export type Locale = "id" | "en";

export const translations = {
  id: {
    nav: {
      blog: "Blog",
      about: "Tentang",
      howItWorks: "Cara Kerja",
      features: "Fitur",
      orderNow: "Order Sekarang",
      attendance: "Absensi",
    },
    hero: {
      badge: "New: Smart NFC Cards Now Available",
      title1: "One Tap,",
      title2: "Semuanya",
      title3: "Terhubung",
      description:
        "Platform identitas digital all-in-one. Bagikan profil, lacak kehadiran, dan kelola kehadiran digital Anda — semua dengan satu sentuhan.",
      ctaPrimary: "Mulai Gratis",
      ctaSecondary: "Tonton Demo",
      statHappy: "Pengguna Aktif",
      statRating: "Uptime SLA",
      statApps: "Integrasi",
      floating: {
        profile: "Profil Digital",
        attendance: "Absensi Tercatat",
        link: "1 Link untuk Semuanya",
      },
    },
    features: {
      badge: "Kenapa Memilih Kami",
      title: "Solusi Identitas Digital Terlengkap",
      description:
        "Lebih dari sekadar kartu digital — OneTap adalah ekosistem identitas digital lengkap yang dibangun untuk profesional modern.",
      items: {
        setup: {
          title: "Setup Instan",
          desc: "Tayang dalam hitungan menit. Tidak perlu keahlian teknis — cukup tap, konfigurasi, dan bagikan identitas digital Anda ke dunia.",
        },
        security: {
          title: "Keamanan Enterprise",
          desc: "Enkripsi kelas bank dan kontrol privasi memastikan data Anda dan catatan kehadiran tim Anda tetap terlindungi.",
        },
        analytics: {
          title: "Analitik Cerdas",
          desc: "Dashboard real-time dengan wawasan mendalam tentang tayangan profil, jumlah tap, klik link, dan tren kehadiran.",
        },
        everywhere: {
          title: "Bekerja di Mana Saja",
          desc: "NFC, kode QR, dan link langsung — profil Anda berfungsi di setiap perangkat, setiap OS, tanpa instalasi aplikasi apa pun.",
        },
        domain: {
          title: "Domain Kustom",
          desc: "Gunakan domain bermerek Anda sendiri atau link pintar kami. Kehadiran digital Anda, sepenuhnya disesuaikan dengan identitas brand Anda.",
        },
        support: {
          title: "Dukungan 24/7",
          desc: "Tim dukungan khusus siap membantu Anda kapan saja. Bantuan prioritas untuk tim dan akun enterprise.",
        },
      },
    },
    howItWorks: {
      badge: "Cara Kerja",
      title: "Mulai dalam 3 langkah mudah",
      description:
        "Tanpa setup teknis, tanpa onboarding yang rumit. Mulai bagikan identitas digital Anda dalam hitungan menit.",
      step1: {
        title: "Buat Akun Anda",
        desc: "Daftar dalam hitungan detik. Pilih paket Anda, tentukan URL unik Anda, dan klaim identitas OneTap Anda secara instan.",
      },
      step2: {
        title: "Kustomisasi Profil",
        desc: "Desain halaman profil Anda dengan warna brand, foto, bio, link, dan media sosial — semuanya di satu tempat.",
      },
      step3: {
        title: "Bagikan & Hubungkan",
        desc: "Bagikan melalui tap kartu NFC, scan kode QR, atau link langsung. Mulai bangun koneksi bermakna di dunia nyata.",
      },
      cta: "Coba Sekarang Gratis",
    },
    products: {
      badge: "Produk Kami",
      title: "Harga Sederhana & Transparan",
      description:
        "Mulai gratis, tingkatkan saat Anda siap. Tanpa biaya tersembunyi, batalkan kapan saja.",
      order: "Order via WhatsApp",
      detail: "Lihat Detail",
      billing: {
        monthly: "Bulanan",
        yearly: "Tahunan",
        save: "Hemat 20% per tahun",
      },
      cta: {
        free: "Mulai Gratis",
        paid: "Mulai Sekarang",
      },
      plans: {
        starter: {
          name: "Starter",
          desc: "Sempurna untuk memulai profil digital pertamamu.",
          price: { monthly: "Gratis", yearly: "Gratis" },
          features: [
            "1 Profil Digital (Slug)",
            "Link Kustom & Sosmed",
            "Analitik Dasar",
            "Tema Standar",
            "Link Dilindungi Password",
            "Branding Kustom",
            "Koneksi Kartu NFC Basic",
          ],
        },
        professional: {
          name: "Professional",
          tag: "Paling Populer",
          desc: "Untuk profesional yang ingin kontrol penuh dengan NFC.",
          price: { monthly: "Rp 25K", yearly: "Rp 20K" },
          features: [
            "3 Profil Digital (Multi-Slug)",
            "Koneksi Kartu NFC OneTap Pro",
            "Analitik Lanjutan",
            "Dukungan Prioritas",
            "Branding Kustom",
            "Link Dilindungi Password",
            "Tema Premium & Kustom",
          ],
        },
        education: {
          name: "Education",
          desc: "Solusi lengkap untuk sekolah, kampus, dan manajemen absensi otomatis.",
          price: { monthly: "Rp 79K", yearly: "Rp 63K" },
          features: [
            "Profil Digital Tanpa Batas (OneTap Card)",
            "Pelacakan Kehadiran Multi-lokasi",
            "Notifikasi WhatsApp Otomatis",
            "Ekspor Data Excel/CSV",
            "Setup & Konsultasi Gratis",
            "Garansi SLA 99.9%",
          ],
        },
      },
    },
    useCases: {
      badge: "Use Cases",
      title: "Dibangun untuk setiap profesi",
      description:
        "Baik Anda seorang kreator solo atau tim perusahaan, OneTap beradaptasi dengan kebutuhan Anda.",
      items: {
        corporate: {
          title: "Profesional Korporat",
          desc: "Ganti kartu nama kertas dengan profil digital cerdas yang diperbarui secara real-time.",
          tag: "Bisnis",
        },
        artist: {
          title: "Musisi & Artis",
          desc: "Bagikan Spotify, SoundCloud, info pemesanan, dan merchandise Anda — semuanya dari satu sentuhan.",
          tag: "Kreatif",
        },
        creator: {
          title: "Content Creator",
          desc: "Dorong pengikut di semua platform dengan satu link yang berfungsi di setiap perangkat.",
          tag: "Kreator",
        },
        property: {
          title: "Agen Properti",
          desc: "Bagikan portofolio, daftar, dan info kontak Anda secara instan di setiap open house.",
          tag: "Properti",
        },
        health: {
          title: "Penyedia Layanan Kesehatan",
          desc: "Kartu pasien digital, link janji temu, dan info klinik — tanpa kertas dan instan.",
          tag: "Kesehatan",
        },
        education: {
          title: "Pendidik & Siswa",
          desc: "Bagikan profil penelitian, materi kelas, dan portofolio akademik dengan satu sentuhan.",
          tag: "Pendidikan",
        },
        fnb: {
          title: "Restoran & F&B",
          desc: "Menu digital, link ulasan, pemesanan reservasi — semuanya tanpa kontak dan cerdas.",
          tag: "F&B",
        },
        fitness: {
          title: "Fitness & Wellness",
          desc: "Pelatih dan coach berbagi jadwal, pemesanan kelas, dan rencana diet secara instan.",
          tag: "Fitness",
        },
      },
    },
    newFeatures: {
      badge: "Fitur Baru",
      title: "Alat baru yang powerful, khusus untuk Anda",
      description:
        "Kami terus meluncurkan fitur baru untuk menjaga kehadiran digital Anda tetap di depan.",
      items: {
        links: {
          title: "Smart Bio Links",
          desc: "Tambah link tanpa batas dengan ikon kustom, animasi, dan analitik pelacakan klik.",
        },
        analytics: {
          title: "Analitik Langsung",
          desc: "Lihat siapa yang melihat profil Anda, dari mana mereka berasal, dan link mana yang mereka klik.",
        },
        notif: {
          title: "Notifikasi Instan",
          desc: "Dapatkan peringatan real-time setiap kali seseorang mengetuk kartu Anda atau melihat profil Anda.",
        },
        qr: {
          title: "Kode QR Dinamis",
          desc: "Kode QR yang diperbarui dengan profil Anda — tidak perlu mencetak ulang lagi.",
        },
        portfolio: {
          title: "Showcase Portofolio",
          desc: "Sematkan gambar, video, dan dokumen langsung ke dalam profil digital Anda.",
        },
      },
      cta: "Lihat semua fitur →",
      release: "Dirilis",
    },
    education: {
      badge: "Untuk Pendidikan",
      title: "Absensi NFC & Notifikasi WhatsApp",
      description:
        "Solusi kehadiran otomatis untuk sekolah dan kampus. Siswa cukup tap keychain NFC, dan notifikasi kehadiran terkirim instan ke WhatsApp.",
      items: {
        absensi: {
          title: "Absensi Tap-to-WA",
          desc: "Siswa mengetuk kartu/keychain NFC — kehadiran tercatat dan notifikasi WA terkirim otomatis.",
        },
        management: {
          title: "Setup WhatsApp Mudah",
          desc: "Hubungkan API Key WhatsApp Gateway Anda dan mulai kirim notifikasi WhatsApp otomatis tanpa coding.",
        },
        profile: {
          title: "Cek Log Real-time",
          desc: "Dashboard transparan untuk melihat histori kehadiran siswa/mahasiswa secara real-time.",
        },
      },
      stats: {
        schools: "Sekolah & Kampus",
        taps: "Tap Siswa / Bulan",
        accuracy: "Tingkat Akurasi",
      },
      ctaPrimary: "Cek Log Absen",
      ctaSecondary: "Konsultasi Setup",
      live: "Live",
      attendanceLabel: "Absensi Hari Ini",
      presentLabel: "siswa hadir",
    },
    attendanceSection: {
      badge: "Sistem Absensi NFC",
      title: "Absensi Cerdas dengan Notifikasi WhatsApp",
      description: "Transformasi absensi tradisional menjadi digital. Integrasi mulus dengan WhatsApp Gateway untuk memastikan setiap kehadiran terlaporkan secara instan.",
      items: {
        tap: {
          title: "Tap & Go",
          desc: "Siswa cukup tap keychain NFC, kehadiran tercatat instan tanpa perlu aplikasi.",
        },
        wa: {
          title: "WA Gateway",
          desc: "Notifikasi kehadiran otomatis terkirim ke WhatsApp orang tua/guru secara real-time.",
        },
        security: {
          title: "Anti-Fraud",
          desc: "Sistem enkripsi dan rate-limiting memastikan data kehadiran akurat dan tidak bisa dimanipulasi.",
        },
      },
      ctaPrimary: "Cek Log Absen",
      ctaSecondary: "Konsultasi Setup",
      mock: {
        title: "Notifikasi Kehadiran",
        body1: "Halo Bapak/Ibu, Siswa **Budi Santoso** telah hadir di sekolah pada pukul **07:15 WIB**.",
        body2: "Siswa **Siti Aminah** telah hadir di sekolah pada pukul **07:20 WIB**.",
        status: "Live Status",
        connected: "WhatsApp Connected",
        response: "Waktu Respon",
      },
    },
    testimonials: {
      badge: "Testimoni",
      title: "Dipercaya oleh 50.000+ pengguna",
      description:
        "Dari solopreneur hingga tim perusahaan — dengar apa yang mereka katakan tentang OneTap.",
      rating: "4.9 / 5 dari 2.000+ ulasan",
      items: [
        {
          name: "Andi Pratama",
          role: "Marketing Manager",
          company: "Tokopedia",
          text: "OneTap benar-benar mengubah cara saya membangun jaringan di acara. Satu tap dan profil lengkap saya dibagikan — tidak perlu lagi mencari kartu nama. Analitik yang menunjukkan siapa yang melihat profil saya adalah pengubah permainan.",
        },
        {
          name: "Sarah Wijaya",
          role: "Founder & CEO",
          company: "Kreativa Studio",
          text: "Saya menyiapkan sistem absensi tim kami dalam satu sore. Fitur tap-to-check-in menghemat begitu banyak waktu kami dan laporannya sangat mendetail. OneTap adalah investasi paling cerdas yang pernah kami buat.",
        },
        {
          name: "Dr. Budi Santoso",
          role: "Wakil Rektor",
          company: "Universitas Indonesia",
          text: "Kami menerapkan OneTap di 12 fakultas dan 8.000 mahasiswa. Integrasinya mulus dan akurasi kehadiran meningkat dari 70% menjadi 98%. Benar-benar luar biasa.",
        },
        {
          name: "Rizky Mahendra",
          role: "Desainer Freelance",
          company: "Independen",
          text: "Profil OneTap saya ADALAH portofolio saya sekarang. Klien mengetuk kartu saya, melihat pekerjaan saya, tarif saya, dan memesan saya — semuanya di satu tempat. Tingkat konversi saya benar-benar meningkat dua kali lipat sejak beralih.",
        },
        {
          name: "Maya Kusuma",
          role: "Direktur HR",
          company: "Bank Mandiri",
          text: "Mengelola profil digital dan kehadiran 2.000 karyawan dari satu dashboard dulu terdengar seperti mimpi. Dengan OneTap Business, itu menjadi kenyataan harian kami sekarang.",
        },
        {
          name: "Kevin Tanoto",
          role: "Event Organizer",
          company: "Neo Events",
          text: "Untuk konferensi, OneTap tak tertandingi. Peserta mengetuk untuk check-in, berbagi kontak, dan mengakses info acara. Kami mengganti tumpukan 3 aplikasi hanya dengan OneTap.",
        },
      ],
    },
    faq: {
      badge: "FAQ",
      title: "Pertanyaan Sering Diajukan",
      items: [
        {
          q: "Apa itu NFC keychain OneTap?",
          a: "NFC keychain OneTap adalah aksesori berbentuk gantungan kunci yang dilengkapi chip NFC. Cukup tempelkan ke smartphone, dan orang lain bisa langsung mengakses link atau info yang Anda simpan.",
        },
        {
          q: "Apakah perlu aplikasi khusus untuk menggunakannya?",
          a: "Tidak perlu aplikasi apapun! Semua smartphone Android dan iPhone modern sudah mendukung NFC bawaan.",
        },
        {
          q: "Berapa lama proses produksi?",
          a: "Estimasi produksi 3–7 hari kerja setelah desain dan pembayaran dikonfirmasi. Pengiriman ke seluruh Indonesia.",
        },
        {
          q: "Apakah bisa custom desain sepenuhnya?",
          a: "Tentu! Kami menerima desain custom sesuai keinginan Anda — logo, warna, ukuran, bahkan bentuk khusus tersedia di paket Custom Edition.",
        },
        {
          q: "Berapa harga minimum order?",
          a: "Mulai dari Rp 25.000 untuk Basic Keychain dan Rp 45.000 untuk NFC Keychain. Untuk bulk order 10 pcs ke atas ada diskon khusus.",
        },
        {
          q: "Apakah data di chip NFC bisa diubah?",
          a: "Ya! Data yang tersimpan di chip bisa diubah kapan saja melalui platform kami tanpa perlu mengganti fisik keychain.",
        },
        {
          q: "Bagaimana cara order?",
          a: "Cukup klik tombol 'Order via WhatsApp', nanti tim kami akan membantu Anda memilih produk, mengirim desain, dan mengkonfirmasi pembayaran.",
        },
        {
          q: "Apakah ada garansi produk?",
          a: "Ya, kami memberikan garansi 30 hari untuk cacat produksi. Jika ada masalah, kami ganti tanpa biaya tambahan.",
        },
      ],
    },
    cta: {
      title: "Siap Untuk Lebih Terhubung?",
      description:
        "Platform identitas digital all-in-one Anda menunggu. Bergabunglah dengan ribuan profesional yang sudah modern.",
      chat: "Dapatkan OneTap Sekarang",
    },
    footer: {
      description:
        "OneTap mengubah cara berbagi identitas dengan teknologi NFC. Satu sentuhan, terhubung selamanya.",
      quickLinks: "Tautan Cepat",
      contact: "Kontak",
      social: "Media Sosial",
      legal: "Hukum",
      privacy: "Kebijakan Privasi",
      terms: "Syarat & Ketentuan",
      cookie: "Kebijakan Cookie",
      madeWith: "Dibuat dengan",
      in: "di",
    },
    common: {
      login: "Masuk",
      register: "Daftar",
      dashboard: "Masuk ke Dashboard",
      language: "Bahasa",
      consultation: "Konsultasi Gratis",
    },
    checkout: {
      title: "Penyelesaian Pembayaran",
      description: "Lengkapi data diri kamu untuk mengaktifkan plan OneTap.",
      summary: "Ringkasan Pesanan",
      billing: {
        monthly: "Bulanan",
        yearly: "Tahunan",
      },
      form: {
        name: "Nama Lengkap",
        email: "Email",
        mobile: "No. WhatsApp",
        placeholderName: "Budi Santoso",
        placeholderEmail: "budi@example.com",
        placeholderMobile: "08123456789",
        submit: "Lanjutkan ke Pembayaran",
        processing: "Memproses...",
        required: "Wajib diisi",
        loginRequired: "Silakan masuk terlebih dahulu untuk melanjutkan.",
      },
      redirecting: "Mengarahkan ke halaman pembayaran aman...",
    },
    paymentSuccess: {
      loading: "Memeriksa Pembayaran",
      loadingDesc: "Harap tunggu, kami sedang memverifikasi status pembayaran Anda.",
      paid: "Pembayaran Berhasil",
      paidDesc: "Plan kamu sudah aktif. Selamat datang di OneTap! Masuk ke dashboard untuk mulai menggunakan semua fitur.",
      unpaid: "Menunggu Pembayaran",
      unpaidDesc: "Invoice kamu sudah dibuat. Selesaikan pembayaran dan halaman ini akan otomatis terupdate.",
      expired: "Invoice Kadaluarsa",
      expiredDesc: "Invoice ini sudah tidak aktif. Kamu bisa memilih plan kembali dari halaman pricing.",
      error: "Terjadi Kesalahan",
      errorDesc: "Tidak dapat memeriksa status pembayaran. Hubungi kami jika sudah membayar.",
      ctaDashboard: "Buka Dashboard",
      ctaPricing: "Kembali ke Pricing",
      ctaRetry: "Coba Lagi",
      ctaSupport: "Hubungi Support",
      ctaCheck: "Cek Status Ulang",
    },
    onetap_card: {
      badge: "OneTap Card",
      title1: "Satu Link,",
      title2: "Untuk Semuanya",
      description: "Bangun kehadiran digital Anda dengan profil yang menawan. Bagikan semua link, sosial media, dan konten Anda hanya dengan satu sentuhan.",
      cta: "Buat Profil Sekarang",
      features: {
        links: "Link Tanpa Batas",
        themes: "Kustomisasi Tema",
        analytics: "Analitik Mendalam",
        nfc: "Koneksi NFC",
      },
      mockup: {
        name: "Andi Pratama",
        role: "Creative Designer",
        portfolio: "Portofolio",
        email: "Kirim Email",
      },
      stats: "Klik Profil",
    },
  },
  en: {
    nav: {
      blog: "Blog",
      about: "About",
      howItWorks: "How It Works",
      features: "Features",
      orderNow: "Order Now",
      attendance: "Attendance",
    },
    hero: {
      badge: "New: Smart NFC Cards Now Available",
      title1: "One Tap,",
      title2: "Everything",
      title3: "Connected",
      description:
        "The all-in-one digital identity platform. Share your profile, track attendance, and manage your digital presence — all with a single tap.",
      ctaPrimary: "Get Started Free",
      ctaSecondary: "Watch Demo",
      statHappy: "Active Users",
      statRating: "Uptime SLA",
      statApps: "Integrations",
      floating: {
        profile: "Digital Profile",
        attendance: "Attendance Logged",
        link: "1 Link for Everything",
      },
    },
    features: {
      badge: "Why Choose Us",
      title: "The Most Complete Digital Identity Solution",
      description:
        "More than just a digital card — OneTap is a complete digital identity ecosystem built for the modern professional.",
      items: {
        setup: {
          title: "Instant Setup",
          desc: "Go live in minutes. No technical skills needed — just tap, configure, and share your digital identity with the world.",
        },
        security: {
          title: "Enterprise Security",
          desc: "Bank-grade encryption and privacy controls ensure your data and your team's attendance records stay protected.",
        },
        analytics: {
          title: "Smart Analytics",
          desc: "Real-time dashboard with deep insights on profile views, tap counts, link clicks, and attendance trends.",
        },
        everywhere: {
          title: "Works Everywhere",
          desc: "NFC, QR code, and direct link — your profile works on every device, every OS, without any app install.",
        },
        domain: {
          title: "Custom Domain",
          desc: "Use your own branded domain or our smart links. Your digital presence, fully customized to your brand identity.",
        },
        support: {
          title: "24/7 Support",
          desc: "Dedicated support team ready to help you anytime. Priority assistance for teams and enterprise accounts.",
        },
      },
    },
    howItWorks: {
      badge: "How It Works",
      title: "Up and running in 3 simple steps",
      description:
        "No technical setup, no complicated onboarding. Start sharing your digital identity in minutes.",
      step1: {
        title: "Create Your Account",
        desc: "Sign up in seconds. Choose your plan, pick your unique URL, and claim your OneTap identity instantly.",
      },
      step2: {
        title: "Customize Your Profile",
        desc: "Design your profile page with your brand colors, photo, bio, links, and social media — everything in one place.",
      },
      step3: {
        title: "Share & Connect",
        desc: "Share via your NFC card tap, QR code scan, or direct link. Start building meaningful connections in the real world.",
      },
      cta: "Try Now for Free",
    },
    products: {
      badge: "Our Products",
      title: "Simple, Transparent Pricing",
      description:
        "Start free, scale when you're ready. No hidden fees, cancel anytime.",
      order: "Order via WhatsApp",
      detail: "View Details",
      billing: {
        monthly: "Monthly",
        yearly: "Yearly",
        save: "Save 20% annually",
      },
      cta: {
        free: "Get Started Free",
        paid: "Start Now",
      },
      plans: {
        starter: {
          name: "Starter",
          desc: "Perfect for starting your first digital profile.",
          price: { monthly: "Free", yearly: "Free" },
          features: [
            "1 Digital Profile (Slug)",
            "Custom Links & Socials",
            "Basic Analytics",
            "Standard Themes",
            "Password Protected Links",
            "Custom Branding",
            "NFC Basic Connection",
          ],
        },
        professional: {
          name: "Professional",
          tag: "Most Popular",
          desc: "For professionals who want full control with NFC.",
          price: { monthly: "Rp 25K", yearly: "Rp 20K" },
          features: [
            "3 Digital Profiles (Multi-Slug)",
            "OneTap NFC Pro Connection",
            "Advanced Analytics",
            "Priority Support",
            "Custom Branding",
            "Password Protected Links",
            "Premium & Custom Themes",
          ],
        },
        education: {
          name: "Education",
          desc: "Full solution for schools, campuses, and automated attendance management.",
          price: { monthly: "Rp 79K", yearly: "Rp 63K" },
          features: [
            "Unlimited Digital Profiles",
            "Multi-location Attendance Tracking",
            "Automated WhatsApp Notifications",
            "Export Data Excel/CSV",
            "Free Setup & Consultation",
            "SLA Guarantee 99.9%",
          ],
        },
      },
    },
    useCases: {
      badge: "Use Cases",
      title: "Built for every profession",
      description:
        "Whether you're a solo creator or an enterprise team, OneTap adapts to your needs.",
      items: {
        corporate: {
          title: "Corporate Professionals",
          desc: "Replace paper business cards with a smart digital profile that updates in real-time.",
          tag: "Business",
        },
        artist: {
          title: "Musicians & Artists",
          desc: "Share your Spotify, SoundCloud, booking info, and merch — all from one tap.",
          tag: "Creative",
        },
        creator: {
          title: "Content Creators",
          desc: "Drive followers across all platforms with a single link that works on every device.",
          tag: "Creator",
        },
        property: {
          title: "Real Estate Agents",
          desc: "Share your portfolio, listings, and contact info instantly at every open house.",
          tag: "Property",
        },
        health: {
          title: "Healthcare Providers",
          desc: "Digital patient cards, appointment links, and clinic info — paperless and instant.",
          tag: "Health",
        },
        education: {
          title: "Educators & Students",
          desc: "Share research profiles, class materials, and academic portfolios with one tap.",
          tag: "Education",
        },
        fnb: {
          title: "Restaurant & F&B",
          desc: "Digital menus, reviews link, reservation booking — all contactless and smart.",
          tag: "F&B",
        },
        fitness: {
          title: "Fitness & Wellness",
          desc: "Trainers and coaches share schedules, class bookings, and diet plans instantly.",
          tag: "Fitness",
        },
      },
    },
    newFeatures: {
      badge: "New Features",
      title: "Powerful new tools, just for you",
      description:
        "We're constantly shipping new features to keep your digital presence ahead of the curve.",
      items: {
        links: {
          title: "Smart Bio Links",
          desc: "Add unlimited links with custom icons, animations, and click-tracking analytics.",
        },
        analytics: {
          title: "Live Analytics",
          desc: "See who viewed your profile, where they came from, and which links they clicked.",
        },
        notif: {
          title: "Instant Notifications",
          desc: "Get real-time alerts whenever someone taps your card or views your profile.",
        },
        qr: {
          title: "Dynamic QR Codes",
          desc: "QR codes that update with your profile — no reprinting ever needed again.",
        },
        portfolio: {
          title: "Portfolio Showcase",
          desc: "Embed images, videos, and documents directly into your digital profile.",
        },
      },
      cta: "See all features →",
      release: "Released",
    },
    education: {
      badge: "For Education",
      title: "NFC Attendance & WhatsApp Notifications",
      description:
        "Automated attendance solution for schools and campuses. Students simply tap the NFC keychain, and attendance notifications are sent instantly to WhatsApp.",
      items: {
        absensi: {
          title: "Tap-to-WA Attendance",
          desc: "Students tap the NFC card/keychain — attendance is recorded and WA notification is sent automatically.",
        },
        management: {
          title: "Easy WhatsApp Setup",
          desc: "Connect your WhatsApp Gateway API Key and start sending automated WhatsApp notifications without coding.",
        },
        profile: {
          title: "Real-time Log Check",
          desc: "Transparent dashboard to view student/campus attendance history in real-time.",
        },
      },
      stats: {
        schools: "Schools & Campuses",
        taps: "Student Taps / Month",
        accuracy: "Accuracy Rate",
      },
      ctaPrimary: "Check Attendance Logs",
      ctaSecondary: "Setup Consultation",
      live: "Live",
      attendanceLabel: "Today's Attendance",
      presentLabel: "students present",
    },
    attendanceSection: {
      badge: "NFC Attendance System",
      title: "Smart Attendance with WhatsApp Notifications",
      description: "Transform traditional attendance into digital. Seamless integration with WhatsApp Gateway to ensure every presence is reported instantly.",
      items: {
        tap: {
          title: "Tap & Go",
          desc: "Students just tap the NFC keychain, attendance is recorded instantly without an app.",
        },
        wa: {
          title: "WA Gateway",
          desc: "Automated attendance notifications sent to parents/teachers' WhatsApp in real-time.",
        },
        security: {
          title: "Anti-Fraud",
          desc: "Encryption and rate-limiting system ensure accurate attendance data that cannot be manipulated.",
        },
      },
      ctaPrimary: "Check Attendance Logs",
      ctaSecondary: "Setup Consultation",
      mock: {
        title: "Attendance Notification",
        body1: "Hello Parent, Student **Budi Santoso** has arrived at school at **07:15 AM**.",
        body2: "Student **Siti Aminah** has arrived at school at **07:20 AM**.",
        status: "Live Status",
        connected: "WhatsApp Connected",
        response: "Response Time",
      },
    },
    testimonials: {
      badge: "Testimonials",
      title: "Trusted by 50,000+ users",
      description:
        "From solopreneurs to enterprise teams — hear what people are saying about OneTap.",
      rating: "4.9 / 5 from 2,000+ reviews",
      items: [
        {
          name: "Andi Pratama",
          role: "Marketing Manager",
          company: "Tokopedia",
          text: "OneTap completely changed how I network at events. One tap and my full profile is shared — no more fumbling for business cards. The analytics showing who viewed my profile is a game changer.",
        },
        {
          name: "Sarah Wijaya",
          role: "Founder & CEO",
          company: "Kreativa Studio",
          text: "I set up our team's attendance system in one afternoon. The tap-to-check-in feature saves us so much time and the reports are incredibly detailed. OneTap is the smartest investment we've made.",
        },
        {
          name: "Dr. Budi Santoso",
          role: "Vice Rector",
          company: "Universitas Indonesia",
          text: "We deployed OneTap across 12 faculties and 8,000 students. The integration was smooth and the attendance accuracy improved from 70% to 98%. Absolutely outstanding.",
        },
        {
          name: "Rizky Mahendra",
          role: "Freelance Designer",
          company: "Independent",
          text: "My OneTap profile IS my portfolio now. Clients tap my card, see my work, my rates, and book me — all in one place. My conversion rate has literally doubled since switching.",
        },
        {
          name: "Maya Kusuma",
          role: "HR Director",
          company: "Bank Mandiri",
          text: "Managing 2,000 employees' digital profiles and attendance from one dashboard used to sound like a dream. With OneTap Business, it's our daily reality now.",
        },
        {
          name: "Kevin Tanoto",
          role: "Event Organizer",
          company: "Neo Events",
          text: "For conferences, OneTap is unbeatable. Attendees tap to check in, share contacts, and access event info. We replaced a 3-app stack with just OneTap.",
        },
      ],
    },
    faq: {
      badge: "Frequently Asked Questions",
      title: "Frequently Asked Questions",
      items: [
        {
          q: "What is a OneTap NFC keychain?",
          a: "A OneTap NFC keychain is an accessory equipped with an NFC chip. Simply tap it to a smartphone, and others can instantly access the links or info you have stored.",
        },
        {
          q: "Do I need a special app to use it?",
          a: "No app required! All modern Android smartphones and iPhones have built-in NFC support.",
        },
        {
          q: "How long is the production process?",
          a: "Production estimated at 3–7 business days after design and payment are confirmed. Shipping across Indonesia.",
        },
        {
          q: "Can I fully customize the design?",
          a: "Certainly! We accept custom designs according to your wishes — logos, colors, sizes, and even special shapes are available in the Custom Edition package.",
        },
        {
          q: "What is the minimum order price?",
          a: "Starting from Rp 25,000 for Basic Keychain and Rp 45,000 for NFC Keychain. Special discounts for bulk orders of 10 pcs or more.",
        },
        {
          q: "Can the data on the NFC chip be changed?",
          a: "Yes! The data stored on the chip can be changed anytime through our platform without needing to replace the physical keychain.",
        },
        {
          q: "How do I order?",
          a: "Just click the 'Order via WhatsApp' button, and our team will help you choose products, send designs, and confirm payment.",
        },
        {
          q: "Is there a product warranty?",
          a: "Yes, we provide a 30-day warranty for production defects. If there are any issues, we replace it at no additional cost.",
        },
      ],
    },
    cta: {
      title: "Ready to Get Connected?",
      description:
        "Your all-in-one digital identity platform awaits. Join thousands of professionals who have already gone modern.",
      chat: "Get OneTap Now",
    },
    footer: {
      description:
        "OneTap redefines how you share identity with NFC technology. One touch, connected forever.",
      quickLinks: "Quick Links",
      contact: "Contact",
      social: "Social Media",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookie: "Cookie Policy",
      madeWith: "Made with",
      in: "in",
    },
    common: {
      login: "Login",
      register: "Register",
      dashboard: "Go to Dashboard",
      language: "Language",
      consultation: "Free Consultation",
    },
    checkout: {
      title: "Checkout",
      description: "Complete your details to activate your OneTap plan.",
      summary: "Order Summary",
      billing: {
        monthly: "Monthly",
        yearly: "Yearly",
      },
      form: {
        name: "Full Name",
        email: "Email",
        mobile: "WhatsApp No.",
        placeholderName: "John Doe",
        placeholderEmail: "john@example.com",
        placeholderMobile: "08123456789",
        submit: "Proceed to Payment",
        processing: "Processing...",
        required: "Required",
        loginRequired: "Please login first to continue.",
      },
      redirecting: "Redirecting to secure payment page...",
    },
    paymentSuccess: {
      loading: "Checking Payment",
      loadingDesc: "Please wait while we verify your payment status.",
      paid: "Payment Successful",
      paidDesc: "Your plan is now active. Welcome to OneTap! Go to the dashboard to start using all features.",
      unpaid: "Waiting for Payment",
      unpaidDesc: "Your invoice has been created. Complete the payment and this page will update automatically.",
      expired: "Invoice Expired",
      expiredDesc: "This invoice is no longer active. You can choose a plan again from the pricing page.",
      error: "An Error Occurred",
      errorDesc: "Unable to check payment status. Contact us if you have already paid.",
      ctaDashboard: "Go to Dashboard",
      ctaPricing: "Back to Pricing",
      ctaRetry: "Try Again",
      ctaSupport: "Contact Support",
      ctaCheck: "Check Status Again",
    },
    onetap_card: {
      badge: "OneTap Card",
      title1: "One Link,",
      title2: "For Everything",
      description: "Build your digital presence with a stunning profile. Share all your links, social media, and content with just one touch.",
      cta: "Create Profile Now",
      features: {
        links: "Unlimited Links",
        themes: "Custom Themes",
        analytics: "Deep Analytics",
        nfc: "NFC Connection",
      },
      mockup: {
        name: "Andi Pratama",
        role: "Creative Designer",
        portfolio: "Portfolio",
        email: "Send Email",
      },
      stats: "Profile Clicks",
    },
  },
};
