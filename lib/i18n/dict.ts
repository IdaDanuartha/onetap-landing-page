export type Locale = "id" | "en";

export const translations = {
  id: {
    nav: {
      blog: "Blog",
      about: "Tentang",
      howItWorks: "Cara Kerja",
      features: "Fitur",
      scan: "Scan & Tulis NFC",
      orderNow: "Order Sekarang",
      pricing: "Paket & Harga",
      products: "Produk Kami",
    },
    firstTimePopup: {
      title: "Konfigurasi Keychain OneTap Anda!",
      desc: "Punya gantungan kunci NFC baru dari OneTap? Yuk, langsung hubungkan link profil digital, WhatsApp, atau portofolio Anda sekarang secara instan!",
      cta: "Mulai Scan & Tulis",
      checkbox: "Jangan tunjukkan pesan ini lagi",
      close: "Nanti Saja",
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
      ctaCatalog: "Lihat Katalog",
      imageAlt: "Pengalaman OneTap NFC",
      statHappy: "Pengguna Aktif",
      statRating: "Uptime SLA",
      statApps: "Integrasi",
      floating: {
        profile: "Profil Digital",
        profileAlt: "Avatar Yogik Pratama",
        attendance: "Absensi Tercatat",
        attendanceTime: "Yogik — 08:42 WIB ✓",
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
          title: "Setup Sangat Mudah",
          desc: "Siap digunakan dalam hitungan menit tanpa ribet atau perlu paham coding. Cukup buat profil, lalu bagikan identitas digital Anda secara instan!",
        },
        security: {
          title: "Keamanan Tingkat Tinggi",
          desc: "Perlindungan data terbaik dan enkripsi mutakhir memastikan seluruh data profil Anda serta data kehadiran tim tetap aman dan terlindungi.",
        },
        analytics: {
          title: "Pantau Statistik Lengkap",
          desc: "Pantau langsung berapa kali profil Anda dilihat, total tap gantungan kunci, klik pada tombol sosial media Anda, hingga laporan riwayat kehadiran secara real-time lewat dashboard Anda.",
        },
        everywhere: {
          title: "Mudah Diakses di HP Mana Pun",
          desc: "Lewat tap gantungan kunci, scan barcode, atau klik link — profil digital Anda bisa dibuka dengan mulus di HP Android maupun iPhone tanpa perlu download aplikasi tambahan.",
        },
        domain: {
          title: "Bisa Pakai Domain Sendiri",
          desc: "Hubungkan alamat website pribadi (domain kustom) Anda sendiri untuk memperkuat identitas brand Anda di internet. Sepenuhnya personal dan profesional!",
        },
        support: {
          title: "Bantuan Responsif 24/7",
          desc: "Tim support kami selalu siap sedia membantu segala kebutuhan Anda kapan saja. Nikmati layanan prioritas khusus untuk akun bisnis dan instansi.",
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
      badge: "Paket & Harga",
      title: "Harga Terjangkau & Transparan",
      description:
        "Mulai gratis, tingkatkan saat Anda siap. Tanpa biaya tersembunyi, batalkan kapan saja.",
      order: "Order via WhatsApp",
      detail: "Lihat Detail",
      billing: {
        monthly: "Bulanan",
        yearly: "Tahunan",
        save: "Hemat 20% per tahun",
        period: "/bulan",
        saveTag: "-20%",
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
          price: { monthly: "Rp 20K", yearly: "Rp 16K", originalMonthly: "Rp 29K", originalYearly: "Rp 25K" },
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
          price: { monthly: "Rp 79K", yearly: "Rp 63K", originalMonthly: "Rp 119K", originalYearly: "Rp 95K" },
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
      statTitle: "20+ Industri",
      statLabel: "melayani seluruh Asia Tenggara",
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
      presentStat: "43 dari 50 siswa hadir",
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
      waMessage: "Halo OneTap, saya ingin konsultasi mengenai setup sistem absensi NFC OneTap untuk instansi/sekolah saya.",
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
          name: "Yogik Pratama",
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
          a: "Tidak perlu! Untuk membaca/scan keychain, semua smartphone Android & iOS bisa langsung tap tanpa aplikasi. Untuk menulis/memprogram data, pengguna Android bisa langsung scan & write via browser. Sedangkan untuk pengguna iOS/iPhone, Anda tetap bisa mengaturnya dengan flow yang sangat mudah, yaitu mengklaim kode keychain di Dashboard OneTap Anda (Gantungan Kunci Dinamis) dan mengelolanya secara online tanpa perlu scan fisik.",
        },
        {
          q: "Berapa lama proses produksi?",
          a: "Estimasi produksi adalah 5-8 hari kerja setelah desain dan pembayaran dikonfirmasi, dan bisa lebih cepat. Pengiriman tersedia ke seluruh Indonesia.",
        },
        {
          q: "Apakah bisa custom desain?",
          a: "Tentu saja bisa! Anda bebas memesan gantungan kunci dengan bentuk karakter custom sesuai dengan keinginan Anda.",
        },
        {
          q: "Berapa harga gantungan kunci OneTap?",
          a: "Harga minimum gantungan kunci kami adalah Rp 35.000 untuk ukuran 5x5 cm dan Rp 40.000 untuk ukuran 6x6 cm. Menariknya, saat ini sedang ada promo diskon sebesar Rp 5.000 per pcs!",
        },
        {
          q: "Apakah data di chip NFC bisa diubah?",
          a: "Tentu saja! Anda bisa mengubah data atau link di dalam keychain Anda kapan saja dengan sangat praktis, baik melalui scan langsung keychain-nya (untuk menulis ulang) maupun dengan mengganti datanya langsung melalui dashboard akun OneTap Anda.",
        },
        {
          q: "Bagaimana cara order?",
          a: "Cukup klik tombol 'Order via WhatsApp', nanti tim kami akan membantu Anda memilih produk, mengirim desain, dan mengkonfirmasi pembayaran.",
        },
        {
          q: "Apakah ada garansi produk?",
          a: "Ya! Kami memberikan garansi resmi selama 2 minggu (14 hari) untuk segala jenis cacat produksi. Jika ada masalah pada keychain Anda, kami ganti dengan yang baru tanpa biaya tambahan.",
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
      chatWa: "Chat WA",
      waTooltip: "Butuh Bantuan? Chat Kami",
      waMessage: "Halo OneTap, saya ingin bertanya mengenai detail produk NFC OneTap yang tersedia.",
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
        name: "Yogik Pratama",
        role: "Creative Designer",
        portfolio: "Portofolio",
        email: "Kirim Email",
      },
      stats: "Klik Profil",
    },
    dashboard: {
      title: "Dashboard",
      nfc: {
        title: "NFC Activator",
        modeLabel: "Pilih Mode Aksi",
        payment: {
          title: "Pembayaran Digital",
          subtitle: "Terima pembayaran langsung lewat tap NFC.",
          typeLabel: "Tipe Pembayaran",
          types: {
            deepLink: "E-Wallet",
            qris: "QRIS Static"
          },
          platformLabel: "Pilih Platform",
          merchantLabel: "Merchant ID / Username",
          merchantPlaceholder: "Masukkan Merchant ID Anda",
          qrisLabel: "Link/URL QRIS",
          qrisPlaceholder: "https://qris.id/...",
          platforms: {
            gopay: "GoPay",
            ovo: "OVO",
            dana: "DANA",
            shopeepay: "ShopeePay",
            linkaja: "LinkAja"
          }
        },
        success: {
          title: "NFC Siap Digunakan",
          subtitle: "Keychain kamu sekarang telah terprogram dan siap dibagikan.",
          ready: "Sekarang keychain kamu siap digunakan dengan mode",
          programOther: "Program Tag Lain",
          done: "Selesai"
        }
      },
      welcome: "Halo",
      manageLink: "Kelola halaman Linktree Anda di",
      copyLink: "Link disalin ke clipboard!",
      editPage: "Edit Halaman",
      actions: {
        save: "Simpan",
        cancel: "Batal",
        editUrl: "Ubah URL",
        share: "Share link",
        logout: "Keluar",
        settings: "Pengaturan"
      },
      url: {
        placeholder: "username",
        errorFormat: "URL hanya boleh berisi huruf, angka, - dan _",
        errorTaken: "URL sudah digunakan orang lain",
        errorFailed: "Gagal memperbarui URL",
        shareText: "Cek kartu digital saya di OneTap!",
      },
      analytics: {
        title: "Statistik Performa",
        overview: "Overview Klik",
        monitoring: "Monitoring Aktif",
        totalInteractions: "Total Interaksi",
        activeLinks: "Link Aktif",
        realtime: "Data Real-time",
        detailTitle: "Detail Klik per Link",
        popularityOrder: "Urutan Terpopuler",
        allProfiles: "Semua Profil",
        noData: {
          title: "Belum Ada Data",
          desc: "Tidak ada statistik untuk filter yang dipilih."
        },
        noLabel: "Tanpa Label",
        clicks: "Klik",
        tipTitle: "Tips Pro:",
        tipDesc: "Link dengan ikon yang relevan dan label yang menarik memiliki conversion rate 30% lebih tinggi!"
      },
      builder: {
        title: "OneTap Card Builder",
        loading: "Memuat OneTap Builder...",
        saved: "Tersimpan",
        save: "Simpan",
        customization: {
          title: "Kustomisasi Profil",
          desc: "Kelola tampilan halaman digital kamu."
        },
        addProfile: "Tambah Profil",
        untitled: "Tanpa Judul",
        profile: {
          avatar: {
            failed: "Gagal mengunggah foto."
          },
          name: "Nama / Brand",
          namePlaceholder: "Contoh: Budi Santoso",
          slug: "Custom Link (Slug)",
          slugPlaceholder: "username-kamu",
          bio: "Bio Singkat",
          bioPlaceholder: "Ceritakan tentang dirimu...",
          status: "Status Publikasi",
          public: "Publik",
          private: "Privat",
          copyLink: "Salin Link",
          slugError: "Slug harus memiliki minimal 3 karakter.",
          saveSuccess: "Perubahan berhasil disimpan!",
          saveFailed: "Gagal menyimpan perubahan.",
          saveError: "Terjadi kesalahan saat menyimpan.",
          newProfile: "Profil Baru",
          premiumTemplateError: "Maaf, Anda perlu paket premium untuk menggunakan template ini!"
        },
        links: {
          title: "Koleksi Link",
          add: "Tambah Link",
          empty: "Belum ada link",
          emptyDesc: "Mulai tambahkan sosial media websitemu."
        },
        appearance: {
          theme: "Warna & Tema",
          template: "Template Layout",
          premiumInfo: "Kamu bisa mencoba preview template di atas, tapi kamu perlu upgrade ke paket premium untuk menyimpan perubahan dengan template premium!"
        },
        preview: {
          title: "Live Preview",
          open: "Buka Halaman Penuh"
        },
        premiumLimit: {
          title: "Butuh Lebih Dari {limit} Profil?",
          desc: "Upgrade paketmu untuk mendapatkan kuota profil yang lebih banyak dan fitur eksklusif lainnya."
        }
      },
      stats: {
        activeProfiles: "Profil Aktif",
        totalClicks: "Total Klik",
        conversionRate: "Conversion Rate",
      },
      menu: {
        title: "Menu Utama",
        editCard: "Edit OneTap Card",
        editCardDesc: "Sesuaikan link, profil, dan tema kartu digitalmu secara real-time.",
        nfc: "Connect NFC Tag",
        nfcDesc: "Hubungkan OneTap-mu ke NFC Keychain OneTap hanya dengan sekali tempel.",
        analytics: "Insight & Statistik",
        analyticsDesc: "Analisa performa linkmu dengan data klik dan demografi pengunjung.",
        attendance: "Attendance (Absensi)",
        attendanceDesc: "Kelola data kehadiran dan setup notifikasi WhatsApp otomatis.",
        settings: "Pengaturan Akun",
        settingsDesc: "Update profil, ganti password, dan kelola keamanan akun kamu.",
        manageNow: "Kelola Sekarang",
        upgradePlan: "Upgrade Plan",
        locked: "Terkunci",
      },
      planInfo: {
        title: "Informasi Paket",
        currentPlan: "Paket Saat Ini",
        expiresAt: "Berakhir pada",
        expired: "Sudah Berakhir",
        neverExpires: "Selamanya",
        upgrade: "Upgrade Paket",
        renew: "Perpanjang",
        status: "Status",
        active: "Aktif",
      },
      support: {
        title: "Butuh bantuan?",
        desc: "Tim support kami siap membantumu kapan saja jika ada kendala setting NFC atau OneTap Card.",
        cta: "Hubungi Kami",
      },
      profileLimit: {
        reached: "Limit Profil Tercapai",
        reachedDesc: "Paket {plan} terbatas {limit} profil. Upgrade untuk menambah lebih banyak.",
        disabled: "Profil Dinonaktifkan",
        disabledDesc: "Profil ini dinonaktifkan karena paket Anda telah berakhir atau melampaui limit.",
      },
      settings: {
        back: "Kembali",
        title: "Pengaturan",
        profile: {
          title: "Informasi Profil",
          desc: "Perbarui informasi dasar akun kamu.",
          nameLabel: "Nama Tampilan",
          namePlaceholder: "Masukkan nama kamu",
          usernameLabel: "Username",
          usernamePlaceholder: "username_kamu",
          usernameHint: "Username digunakan untuk identitas profil unik kamu.",
          emailLabel: "Email",
          saveBtn: "Simpan Perubahan",
          success: "Profil berhasil diperbarui!",
          error: "Gagal memperbarui profil.",
          usernameError: "Username hanya boleh huruf kecil, angka, - dan _",
          usernameTaken: "Username sudah digunakan orang lain.",
        },
        password: {
          title: "Ganti Password",
          desc: "Amankan akun kamu dengan password yang kuat.",
          newPassLabel: "Password Baru",
          newPassPlaceholder: "••••••••",
          confirmPassLabel: "Konfirmasi Password Baru",
          confirmPassPlaceholder: "••••••••",
          updateBtn: "Update Password",
          success: "Password berhasil diubah!",
          errorMatch: "Konfirmasi password tidak cocok.",
          errorLength: "Password minimal 6 karakter.",
          errorFailed: "Gagal mengubah password.",
        },
        delete: {
          title: "Hapus Akun",
          desc: "Sekali dihapus, data tidak bisa dikembalikan.",
          dangerTitle: "Hapus Akun",
          dangerDesc: "Semua data profil digital, link, dan log absensi akan dihapus permanen dari sistem kami.",
          cta: "Hapus Akun Saya",
          modalTitle: "Hapus Akun?",
          modalDesc: "Tindakan ini permanen. Ketik {phrase} di bawah untuk mengonfirmasi.",
          modalInputPlaceholder: "HAPUS AKUN SAYA",
          modalConfirmBtn: "Ya, Hapus Permanen",
          modalCancelBtn: "Batalkan",
          confirmPhrase: "HAPUS AKUN SAYA",
          error: "Gagal menghapus akun. Silakan coba lagi.",
        },
      },
      tour: {
        restart: "Panduan",
        skip: "Lewati",
        next: "Lanjut",
        back: "Kembali",
        finish: "Selesai",
        builder: {
          profile: {
            title: "Kustomisasi Profil",
            desc: "Ubah foto avatar, nama brand, biografi singkat, dan atur status publikasi halaman digital Anda."
          },
          addLink: {
            title: "Tambah Link Baru",
            desc: "Klik di sini untuk menambahkan link media sosial, website portofolio, WhatsApp, atau tautan penting lainnya."
          },
          linksList: {
            title: "Kelola Koleksi Link",
            desc: "Semua tautan yang Anda buat akan muncul di sini. Anda bisa menggeser posisinya (drag & drop), mengubah label, menonaktifkan, atau menghapus link dengan mudah."
          },
          themes: {
            title: "Warna & Tema",
            desc: "Pilih skema warna dan template menarik yang paling sesuai dengan identitas profesional Anda."
          },
          save: {
            title: "Simpan Perubahan",
            desc: "Jangan lupa untuk mengklik tombol simpan di atas untuk memperbarui profil digital Anda di internet secara instan!"
          }
        },
        nfc: {
          scan: {
            title: "Scan Keychain NFC",
            desc: "Tempelkan keychain OneTap Anda ke bagian belakang handphone untuk membaca link yang tersimpan di dalamnya secara instan."
          },
          write: {
            title: "Tulis ke Keychain NFC",
            desc: "Gunakan fitur ini untuk merekam link atau mode profil digital baru langsung ke dalam keychain NFC Anda."
          },
          linkInput: {
            title: "Input Link Kustom",
            desc: "Masukkan link apa pun yang ingin Anda rekam ke dalam keychain NFC (misalnya link WhatsApp, Portofolio, atau Linktree)."
          }
        },
        attendance: {
          schoolName: {
            title: "Nama Sekolah & Instansi",
            desc: "Ketik nama sekolah atau instansi Anda di sini dan tekan Enter untuk menyimpan identitas instansi absensi Anda."
          },
          addStudent: {
            title: "Tambah Siswa Baru",
            desc: "Klik tombol ini untuk membuka formulir registrasi data siswa baru."
          },
          studentForm: {
            title: "Isi Formulir Siswa",
            desc: "Lengkapi data siswa (Nama, Kelas, dan No. WhatsApp orang tua) agar notifikasi kehadiran terkirim dengan benar, lalu simpan."
          },
          writeNFC: {
            title: "Hubungkan Gantungan Kunci NFC",
            desc: "Klik tombol ikon sinyal WiFi di kolom siswa pertama untuk mulai mendaftarkan data siswa tersebut ke keychain/kartu NFC fisik."
          },
          writingModal: {
            title: "Proses Penulisan NFC",
            desc: "Dekatkan gantungan kunci NFC siswa ke bagian belakang handphone Anda untuk menulis data token absensi unik siswa secara instan."
          },
          bulkScan: {
            title: "Mulai Absensi Massal",
            desc: "Klik tombol 'Scan Massal' untuk membuka layar pemindaian absensi multi-siswa berturut-turut tanpa jeda."
          },
          scanModal: {
            title: "Layar Absensi Real-Time",
            desc: "Di layar ini, guru cukup mendekatkan keychain NFC masing-masing siswa. Sistem akan otomatis mencatat kehadiran dan mengirim notifikasi WhatsApp!"
          },
          historyLink: {
            title: "Riwayat Kehadiran",
            desc: "Setelah selesai praktik absensi, klik di sini untuk memeriksa laporan, grafik rekapitulasi, dan histori kehadiran harian siswa."
          }
        }
      },
      attendance: {
        title: "Manajemen Absensi",
        back: "Kembali ke Dashboard",
        stats: {
          totalStudents: "Total Siswa",
          presentToday: "Hadir Hari Ini",
          activeTags: "Tag Aktif",
        },
        globalSettings: {
          title: "Pengaturan Global WhatsApp",
          templateLabel: "Template Pesan Kehadiran",
          saveTemplate: "Simpan Template",
          saveSuccess: "Template WhatsApp berhasil disimpan!",
          templateNotice: "* Perubahan template ini akan berlaku untuk semua siswa yang terdaftar di bawah akun Anda.",
        },
        school: {
          placeholder: "Nama Instansi...",
          saveSuccess: "Nama Sekolah/Instansi berhasil disimpan!",
        },
        actions: {
          history: "Histori Absensi",
          importCsv: "Import CSV",
          bulkScan: "Scan Massal",
          addStudent: "Tambah Siswa",
        },
        modal: {
          addTitle: "Tambah Siswa Baru",
          editTitle: "Edit Data Siswa",
          name: "Nama Lengkap",
          class: "Kelas",
          subject: "Mata Pelajaran (Opsional)",
          wa: "WhatsApp Pendamping",
          active: "Status Aktif",
          save: "Simpan Perubahan",
        },
        nfc: {
          writing: "Siap Menulis...",
          tap: "Tempelkan kartu NFC Anda di belakang HP sekarang.",
          success: "Berhasil!",
          error: "Gagal Menulis",
        },
        table: {
          searchPlaceholder: "Cari nama atau kelas...",
          noData: "Belum ada data siswa.",
          actions: "Aksi",
          edit: "Edit",
          delete: "Hapus",
          writeNfc: "Tulis NFC",
          student: "Siswa",
          classSubject: "Kelas / Mapel",
          status: "Status",
          selected: "Terpilih",
          allClasses: "Semua Kelas",
          allSubjects: "Semua Mapel",
          active: "Aktif",
          inactive: "Nonaktif",
          noDataFound: "Data Tidak Ditemukan",
          addFirst: "Tambah Siswa Pertama",
          cancel: "Batal",
          updateAll: "Perbarui Semua",
          confirmDelete: "Ya, Hapus",
          success: "Berhasil!",
          error: "Gagal!",
          linkCopied: "Link Disalin!",
          understand: "Saya Mengerti",
          saved: "Tersimpan!",
          liveSync: "Live Sync",
          saveTooltip: "Simpan (Enter)",
        },
        bulkScan: {
          title: "Absensi Massal",
          activeSystem: "Sistem Aktif",
          instruction: "Dekatkan kartu siswa ke sensor NFC perangkat Anda.",
          waiting: "Menunggu Tap...",
          activity: "Aktivitas",
          detected: "Terdeteksi",
          noActivity: "Belum ada aktivitas",
          tips: "Pastikan layar HP menyala. Tempelkan kartu di area sensor NFC (biasanya di belakang atas).",
          nfcFallbackDesc: "NFC Writing tidak didukung di browser ini. URL absensi telah disalin! Silakan paste ke aplikasi NFC Tools untuk menulis ke kartu.",
        },
        import: {
          title: "Import Data Siswa",
          desc: "Import data siswa dari file CSV. Gunakan template yang disediakan di bawah.",
          downloadTemplate: "Unduh Template CSV",
          dropFile: "Pilih File CSV",
          processing: "Mengimpor...",
          success: "Berhasil mengimpor data siswa!",
          error: "Gagal mengimpor data.",
          csvFormat: "Format File CSV:",
          csvFormatDesc: "Gunakan koma (,) sebagai pemisah. Pastikan urutan kolom sesuai:",
          columns: "Nama, Kelas, Mapel, WhatsApp",
          chooseFile: "Pilih File & Import",
          dragDropDesc: "Seret file CSV ke sini atau klik untuk mencari",
          uploading: "Mengupload data...",
          autoGenerateNotice: "Token absensi akan digenerate secara otomatis untuk setiap siswa.",
          noValidData: "Tidak ada data valid yang ditemukan untuk diimport.",
          invalidRow: "Baris {row} tidak valid: Nama dan Kelas wajib diisi.",
        },
        scan: {
          title: "Scan Absensi NFC",
          status: "Status",
          lastLogs: "Log Scan Terakhir",
          ready: "Siap memindai...",
          success: "Kehadiran berhasil dicatat!",
          duplicate: "Sudah absen hari ini.",
        },
        warning: {
          waMissing: "Beberapa siswa belum memiliki nomor WhatsApp",
          waMissingDesc: "Sistem tidak bisa mengirim notifikasi ke pendamping jika nomor WA kosong.",
          bulkWaUpdate: "Gunakan Bulk Update WA di tabel",
        },
        locked: {
          title: "Fitur Absensi Terkunci",
          desc: "Fitur Absensi hanya tersedia untuk pengguna paket Education.",
          upgrade: "Upgrade ke Paket Education",
        }
      }
    },
    write: {
      gate: {
        title: "Akses Premium",
        desc: "Masukkan kode unik yang terdapat pada box keychain OneTap Anda.",
        error: "Kode akses tidak valid. Silakan cek QR code pada box.",
        lost: "Kehilangan kode?",
        support: "Hubungi Support"
      },
      writer: {
        unsupported: {
          title: "Browser Tidak Mendukung",
          desc: "Fitur penulisan NFC saat ini hanya tersedia melalui peramban Google Chrome di perangkat Android yang memiliki sensor NFC."
        },
        verified: "Terverifikasi",
        title: "Kustomisasi Keychain",
        desc: "Tentukan aksi apa yang akan terjadi saat orang lain menyentuh keychain Anda.",
        type: "Tipe Aksi",
        mode: "Pilih Mode",
        content: "Konten Data",
        erase: {
          title: "Format Ulang Chip",
          desc: "Tindakan ini akan mengosongkan seluruh data pada keychain."
        },
        inputLabel: "Masukkan",
        waPlaceholder: "Nomor WhatsApp (628...)",
        waMsgPlaceholder: "Pesan otomatis (Opsional)",
        profileLabel: "Pilih Profil Digital",
        profilePlaceholder: "Pilih profil yang ingin dihubungkan",
        noProfiles: "Belum ada profil digital. Buat sekarang di dashboard.",
        success: "Berhasil menulis data ke NFC Keychain!",
        btnFormat: "Mulai Proses Format",
        btnWrite: "Tulis ke Keychain",
        waiting: {
          title: "Siap Menerima Data",
          desc: "Tempelkan dan tahan bagian belakang HP Anda ke keychain OneTap sekarang.",
          cancel: "Batalkan Proses"
        }
      },
      upsell: {
        title: "Buka Fitur Lebih Lengkap",
        desc: "Aktifkan perlindungan password, profil digital premium, dan analytics canggih.",
        login: "Masuk",
        register: "Daftar"
      },
      footer: {
        title: "Writer App for OneTap Owners",
        desc: "Membutuhkan perangkat Android dengan sensor NFC dan browser Google Chrome untuk dapat menulis data ke keychain."
      }
    },
    protection: {
      title: "Profil Terproteksi",
      desc: "Masukkan password untuk melihat profil ini.",
      placeholder: "Masukkan password...",
      button: "Buka Profil",
      connecting: "Menghubungkan...",
      error: "Password salah. Silakan coba lagi.",
      tagProtected: "Tag ini terproteksi password. Masukkan password yang benar di kolom Keamanan Lanjutan.",
      paymentTitle: "Halaman Terproteksi",
      paymentDesc: "Halaman pembayaran {name} dilindungi password.",
      advanced: "Keamanan Lanjutan",
      linkPassLabel: "Password Proteksi Link",
      linkPassPlaceholder: "Kosongkan jika tidak perlu",
      linkPassInfo: "Pintu masuk link akan memerlukan password ini.",
      tagPassLabel: "Password Proteksi Tag NFC",
      tagPassPlaceholder: "Mencegah orang lain me-write ulang",
      tagPassInfo: "Chip akan terkunci secara sistem (NFC Software Lock).",
      step1: "Buka di Chrome Android",
      step2: "Tempel keychain di belakang HP",
      searching: "Mencari Tag...",
      startBtn: "Mulai Proses Aktivasi",
      preparingLink: "Menyiapkan Link Terproteksi..."
    },
    paymentBridge: {
      chooseApp: "Pilih Aplikasi Pembayaran",
      directOpen: "Langsung buka aplikasi",
      showQris: "Tampilkan Gambar QRIS",
      hideQris: "Sembunyikan QRIS",
      manualScan: "Scan QRIS {name}",
      screenshotInfo: "Screenshot QRIS di atas untuk discan dari galeri aplikasi pembayaran Anda.",
      fallbackInfo: "Jika aplikasi tidak terbuka otomatis, silakan pilih \"Tampilkan Gambar QRIS\" dan scan secara manual.",
    },
    logoutConfirm: {
      title: "Konfirmasi Logout",
      desc: "Apakah Anda yakin ingin keluar dari akun OneTap Anda?",
      confirm: "Ya, Keluar",
      cancel: "Batal"
    },
    onboarding: {
      title: "Selamat Datang di OneTap!",
      skip: "Lewati Panduan",
      next: "Selanjutnya",
      back: "Kembali",
      finish: "Mulai Jelajahi!",
      viewGuide: "Lihat Panduan",
      step: "Langkah",
      of: "dari",
      steps: {
        welcome: {
          title: "Selamat Datang di OneTap!",
          desc: "OneTap adalah platform identitas digital NFC all-in-one. Kamu bisa buat profil digital, hubungkan ke keychain NFC, dan bahkan kelola absensi — semua dari satu tempat.",
          cta: "Yuk, Mulai!",
        },
        profile: {
          title: "Buat Profil Digital Kamu",
          desc: "Buat halaman profil digital yang bisa kamu share ke siapapun. Tambahkan link media sosial, portofolio, WhatsApp, dan banyak lagi — semua di satu halaman yang keren.",
          cta: "Buat Profil Sekarang",
          hint: "Profil digitalmu bisa diakses via link, QR code, atau tap NFC.",
        },
        nfc: {
          title: "Hubungkan ke NFC Keychain",
          desc: "Setelah profil siap, hubungkan ke gantungan kunci NFC OneTap-mu. Cukup buka halaman Connect NFC, tempelkan keychain ke belakang HP, dan data tersimpan secara instan!",
          cta: "Connect NFC Sekarang",
          hint: "Butuh Chrome di Android + NFC aktif untuk proses ini.",
        },
        attendance: {
          title: "Setup Absensi Otomatis",
          desc: "Daftarkan siswa, buat tag NFC individual, dan biarkan sistem mencatat kehadiran secara otomatis — lengkap dengan notifikasi WhatsApp ke orang tua/pendamping!",
          cta: "Kelola Absensi",
          hint: "Fitur eksklusif untuk paket Education. Setiap tap = absensi tercatat.",
        },
        done: {
          title: "Semua Siap!",
          desc: "Kamu sudah tahu cara menggunakan fitur utama OneTap. Eksplorasi dashboard dan mulai manfaatkan semua fitur yang tersedia untukmu.",
          cta: "Buka Dashboard",
        },
      },
    },
    catalog: {
      badge: "New Arrival",
      title: "Produk",
      titleHighlight: "Unggulan",
      subtitle: "Koleksi chibi keychain akrilik premium dengan karakter anime favoritmu — cute, kawaii, dan collectible!",
      viewAll: "Lihat Semua Produk",
      allProducts: "Semua",
      allProductsTitle: "Semua",
      allProductsTitleHighlight: "Produk",
      productsFound: "{count} produk ditemukan",
      loadingProducts: "Memuat produk...",
      searchLabel: "Cari Produk",
      searchPlaceholder: "Nama produk, karakter...",
      sizeLabel: "Ukuran",
      priceLabel: "Harga",
      resetFilter: "Reset Filter",
      filterLabel: "Filter",
      filterProducts: "Filter Produk",
      showProducts: "Tampilkan {count} Produk",
      sortLabel: "Urutkan:",
      sortBestSeller: "Best Seller",
      sortPriceAsc: "Harga Terendah",
      sortPriceDesc: "Harga Tertinggi",
      soldCount: "Terjual",
      startingFrom: "Mulai ",
      comingSoon: "Coming Soon",
      comingSoonSub: "Segera Hadir",
      viewDetail: "Lihat Detail",
      notFound: "Produk Tidak Ditemukan",
      notFoundDesc: "Coba ubah kata kunci pencarian atau reset filter yang aktif.",
      breadcrumbHome: "Home",
      breadcrumbAll: "Semua Produk",
      detail: {
        size: "Ukuran",
        sold: "Terjual",
        minOrder: "Minimum order:",
        orderWa: "Pesan via WhatsApp",
        viewOther: "Lihat Produk Lainnya",
        trustPremium: "Produk Premium",
        trustShipping: "Pengiriman Cepat",
        trustQuality: "Kualitas Terjamin",
        highlights: "Keunggulan Produk",
        description: "Deskripsi Produk",
        specs: "Spesifikasi",
        related: "Produk",
        relatedHighlight: "Terkait",
      },
    },
  },
  en: {
    nav: {
      blog: "Blog",
      about: "About",
      howItWorks: "How It Works",
      features: "Features",
      scan: "Scan & Write NFC",
      orderNow: "Order Now",
      pricing: "Pricing",
      products: "Our Products",
    },
    firstTimePopup: {
      title: "Configure Your OneTap Keychain!",
      desc: "Have a brand new OneTap NFC keychain? Let's connect your digital profile, WhatsApp, or portfolio right now in seconds!",
      cta: "Start Scan & Write",
      checkbox: "Don't show this message again",
      close: "Maybe Later",
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
      ctaCatalog: "View Catalog",
      imageAlt: "OneTap NFC Experience",
      statHappy: "Active Users",
      statRating: "Uptime SLA",
      statApps: "Integrations",
      floating: {
        profile: "Digital Profile",
        profileAlt: "Yogik Pratama Avatar",
        attendance: "Attendance Logged",
        attendanceTime: "Yogik — 08:42 AM ✓",
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
      badge: "Plans & Pricing",
      title: "Simple, Transparent Pricing",
      description:
        "Start free, scale when you're ready. No hidden fees, cancel anytime.",
      order: "Order via WhatsApp",
      detail: "View Details",
      billing: {
        monthly: "Monthly",
        yearly: "Yearly",
        save: "Save 20% annually",
        period: "/month",
        saveTag: "-20%",
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
          price: { monthly: "Rp 20K", yearly: "Rp 16K", originalMonthly: "Rp 29K", originalYearly: "Rp 25K" },
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
          price: { monthly: "Rp 79K", yearly: "Rp 63K", originalMonthly: "Rp 119K", originalYearly: "Rp 95K" },
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
      statTitle: "20+ Industries",
      statLabel: "served across Southeast Asia",
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
      presentStat: "43 of 50 students present",
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
      ctaSecondary: "Consultation Setup",
      waMessage: "Hello OneTap, I would like to consult about setting up the OneTap NFC attendance system for my institution/school.",
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
          name: "Yogik Pratama",
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
          a: "No app required! To read/scan the keychain, all Android & iOS smartphones can tap it directly without any app. To program/write data, Android users can scan & write directly via browser. For iOS/iPhone users, you can still set it up easily with a different flow: simply claim your keychain code in the OneTap Dashboard (Dynamic Keychain) and manage it online without physically scanning it.",
        },
        {
          q: "How long is the production process?",
          a: "The production process takes about 5-8 business days after design and payment are confirmed, but it can be faster. Shipping is available throughout Indonesia.",
        },
        {
          q: "Can I customize the design?",
          a: "Yes, you absolutely can! You can freely order a keychain with a custom character shape of your choice.",
        },
        {
          q: "How much does a OneTap keychain cost?",
          a: "The minimum price is Rp 35,000 for the 5x5 cm size and Rp 40,000 for the 6x6 cm size. Better yet, we are currently running a promo discount of Rp 5,000 per pcs!",
        },
        {
          q: "Can the data on the NFC chip be changed?",
          a: "Of course! You can easily update the data or link stored in your keychain anytime, either by directly scanning/rewriting the physical keychain or by changing the data directly inside your OneTap dashboard.",
        },
        {
          q: "How do I order?",
          a: "Just click the 'Order via WhatsApp' button, and our team will help you choose products, send designs, and confirm payment.",
        },
        {
          q: "Is there a product warranty?",
          a: "Yes! We provide a 2-week (14-day) warranty for any production defects. If there is any issue with your keychain, we will replace it with a new one at no extra charge.",
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
      chatWa: "Chat WA",
      waTooltip: "Need Help? Chat with Us",
      waMessage: "Hello OneTap, I would like to ask about the details of available OneTap NFC products.",
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
        name: "Yogik Pratama",
        role: "Creative Designer",
        portfolio: "Portfolio",
        email: "Send Email",
      },
      stats: "Profile Clicks",
    },
    dashboard: {
      title: "Dashboard",
      nfc: {
        title: "NFC Activator",
        modeLabel: "Choose Action Mode",
        payment: {
          title: "Digital Payment",
          subtitle: "Receive payments instantly via NFC tap.",
          typeLabel: "Payment Type",
          types: {
            deepLink: "E-Wallet",
            qris: "Static QRIS"
          },
          platformLabel: "Select Platform",
          merchantLabel: "Merchant ID / Username",
          merchantPlaceholder: "Enter your Merchant ID",
          qrisLabel: "QRIS Link/URL",
          qrisPlaceholder: "https://qris.id/...",
          platforms: {
            gopay: "GoPay",
            ovo: "OVO",
            dana: "DANA",
            shopeepay: "ShopeePay",
            linkaja: "LinkAja"
          }
        },
        success: {
          title: "NFC Ready to Use",
          subtitle: "Your keychain is now programmed and ready to be shared.",
          ready: "Your keychain is now ready to use with mode",
          programOther: "Program Other Tag",
          done: "Done"
        }
      },
      welcome: "Hello",
      manageLink: "Manage your Linktree page at",
      copyLink: "Link copied to clipboard!",
      editPage: "Edit Page",
      actions: {
        save: "Save",
        cancel: "Cancel",
        editUrl: "Edit URL",
        share: "Share link",
        logout: "Logout",
        settings: "Settings"
      },
      url: {
        placeholder: "username",
        errorFormat: "URL can only contain letters, numbers, - and _",
        errorTaken: "URL already taken",
        errorFailed: "Failed to update URL",
        shareText: "Check out my digital card on OneTap!",
      },
      analytics: {
        title: "Performance Statistics",
        overview: "Click Overview",
        monitoring: "Active Monitoring",
        totalInteractions: "Total Interactions",
        activeLinks: "Active Links",
        realtime: "Real-time Data",
        detailTitle: "Click Detail per Link",
        popularityOrder: "Most Popular Order",
        allProfiles: "All Profiles",
        noData: {
          title: "No Data Yet",
          desc: "No statistics available for the selected filter."
        },
        noLabel: "No Label",
        clicks: "Clicks",
        tipTitle: "Pro Tip:",
        tipDesc: "Links with relevant icons and catchy labels have a 30% higher conversion rate!"
      },
      builder: {
        title: "OneTap Card Builder",
        loading: "Loading OneTap Builder...",
        saved: "Saved",
        save: "Save",
        customization: {
          title: "Profile Customization",
          desc: "Manage your digital page appearance."
        },
        addProfile: "Add Profile",
        untitled: "Untitled",
        profile: {
          avatar: {
            failed: "Failed to upload photo."
          },
          name: "Name / Brand",
          namePlaceholder: "Example: John Doe",
          slug: "Custom Link (Slug)",
          slugPlaceholder: "your-username",
          bio: "Short Bio",
          bioPlaceholder: "Tell us about yourself...",
          status: "Publication Status",
          public: "Public",
          private: "Private",
          copyLink: "Copy Link",
          slugError: "Slug must be at least 3 characters.",
          saveSuccess: "Changes saved successfully!",
          saveFailed: "Failed to save changes.",
          saveError: "An error occurred while saving.",
          newProfile: "New Profile",
          premiumTemplateError: "Sorry, you need a premium plan to use this template!"
        },
        links: {
          title: "Link Collection",
          add: "Add Link",
          empty: "No links yet",
          emptyDesc: "Start adding your social media websites."
        },
        appearance: {
          theme: "Color & Theme",
          template: "Layout Template",
          premiumInfo: "You can try the preview template above, but you need to upgrade to a premium plan to save changes with premium templates!"
        },
        preview: {
          title: "Live Preview",
          open: "Open Full Page"
        },
        premiumLimit: {
          title: "Need More Than {limit} Profiles?",
          desc: "Upgrade your plan to get more profile quota and other exclusive features."
        }
      },
      stats: {
        activeProfiles: "Active Profiles",
        totalClicks: "Total Clicks",
        conversionRate: "Conversion Rate",
      },
      menu: {
        title: "Main Menu",
        editCard: "Edit OneTap Card",
        editCardDesc: "Customize your link, profile, and digital card theme in real-time.",
        nfc: "Connect NFC Tag",
        nfcDesc: "Connect your OneTap to an OneTap NFC Keychain with just one tap.",
        analytics: "Insight & Statistics",
        analyticsDesc: "Analyze your link performance with click data and visitor demographics.",
        attendance: "Attendance",
        attendanceDesc: "Manage attendance data and set up automated WhatsApp notifications.",
        settings: "Account Settings",
        settingsDesc: "Update profile, change password, and manage account security.",
        manageNow: "Manage Now",
        upgradePlan: "Upgrade Plan",
        locked: "Locked",
      },
      planInfo: {
        title: "Plan Information",
        currentPlan: "Current Plan",
        expiresAt: "Expires on",
        expired: "Expired",
        neverExpires: "Forever",
        upgrade: "Upgrade Plan",
        renew: "Renew Now",
        status: "Status",
        active: "Active",
      },
      support: {
        title: "Need help?",
        desc: "Our support team is ready to help you anytime with NFC or OneTap Card settings.",
        cta: "Contact Us",
      },
      profileLimit: {
        reached: "Profile Limit Reached",
        reachedDesc: "The {plan} plan is limited to {limit} profiles. Upgrade to add more.",
        disabled: "Profile Disabled",
        disabledDesc: "This profile is disabled because your plan has expired or exceeded the limit.",
      },
      attendance: {
        title: "Attendance Management",
        back: "Back to Dashboard",
        stats: {
          totalStudents: "Total Students",
          presentToday: "Present Today",
          activeTags: "Active Tags",
        },
        globalSettings: {
          title: "Global WhatsApp Settings",
          templateLabel: "Attendance Message Template",
          saveTemplate: "Save Template",
          saveSuccess: "WhatsApp Template saved successfully!",
          templateNotice: "* Changes to this template will apply to all students registered under your account.",
        },
        school: {
          placeholder: "Institution Name...",
          saveSuccess: "Institution name saved successfully!",
        },
        actions: {
          history: "Attendance History",
          importCsv: "Import CSV",
          bulkScan: "Bulk Scan",
          addStudent: "Add Student",
        },
        modal: {
          addTitle: "Add New Student",
          editTitle: "Edit Student Data",
          name: "Full Name",
          class: "Class",
          subject: "Subject (Optional)",
          wa: "Parent WhatsApp",
          active: "Active Status",
          save: "Save Changes",
        },
        nfc: {
          writing: "Ready to Write...",
          tap: "Tap your NFC card on the back of your phone now.",
          success: "Success!",
          error: "Write Failed",
        },
        table: {
          searchPlaceholder: "Search name or class...",
          noData: "No student data yet.",
          actions: "Actions",
          edit: "Edit",
          delete: "Delete",
          writeNfc: "Write NFC",
          student: "Student",
          classSubject: "Class / Subject",
          status: "Status",
          selected: "Selected",
          allClasses: "All Classes",
          allSubjects: "All Subjects",
          active: "Active",
          inactive: "Inactive",
          noDataFound: "Data Not Found",
          addFirst: "Add First Student",
          cancel: "Cancel",
          updateAll: "Update All",
          confirmDelete: "Yes, Delete",
          success: "Success!",
          error: "Error!",
          linkCopied: "Link Copied!",
          understand: "I Understand",
          saved: "Saved!",
          liveSync: "Live Sync",
          saveTooltip: "Save (Enter)",
        },
        bulkScan: {
          title: "Bulk Attendance",
          activeSystem: "System Active",
          instruction: "Bring student cards close to your device's NFC sensor.",
          waiting: "Waiting for Tap...",
          activity: "Activity",
          detected: "Detected",
          noActivity: "No activity yet",
          tips: "Ensure HP screen is on. Tap card near NFC sensor area (usually top back).",
          nfcFallbackDesc: "NFC Writing is not supported in this browser. Attendance URL has been copied! Please paste it into the NFC Tools app to write to the card.",
        },
        import: {
          title: "Import Student Data",
          desc: "Import student data from a CSV file. Use the template provided below.",
          downloadTemplate: "Download CSV Template",
          dropFile: "Select CSV File",
          processing: "Importing...",
          success: "Successfully imported student data!",
          error: "Failed to import data.",
          csvFormat: "CSV File Format:",
          csvFormatDesc: "Use commas (,) as separators. Ensure column order matches:",
          columns: "Name, Class, Subject, WhatsApp",
          chooseFile: "Choose File & Import",
          dragDropDesc: "Drag and drop CSV file here or click to browse",
          uploading: "Uploading data...",
          autoGenerateNotice: "Attendance tokens will be generated automatically for each student.",
          noValidData: "No valid data was found to import.",
          invalidRow: "Row {row} is invalid: Name and Class are required.",
        },
        scan: {
          title: "NFC Attendance Scanner",
          status: "Status",
          lastLogs: "Last Scan Logs",
          ready: "Ready to scan...",
          success: "Attendance recorded successfully!",
          duplicate: "Already attended today.",
        },
        warning: {
          waMissing: "Some students don't have WhatsApp numbers yet",
          waMissingDesc: "The system cannot send notifications to guardians if the WA number is empty.",
          bulkWaUpdate: "Use Bulk Update WA in the table",
        },
        locked: {
          title: "Attendance Feature Locked",
          desc: "The Attendance feature is only available for Education plan users.",
          upgrade: "Upgrade to Education Plan",
        },
      },
      settings: {
        back: "Back",
        title: "Settings",
        profile: {
          title: "Profile Information",
          desc: "Update your basic account information.",
          nameLabel: "Display Name",
          namePlaceholder: "Enter your name",
          usernameLabel: "Username",
          usernamePlaceholder: "your_username",
          usernameHint: "Username is used for your unique profile identity.",
          emailLabel: "Email",
          saveBtn: "Save Changes",
          success: "Profile updated successfully!",
          error: "Failed to update profile.",
          usernameError: "Username can only contain lowercase letters, numbers, - and _",
          usernameTaken: "Username is already taken by someone else.",
        },
        password: {
          title: "Change Password",
          desc: "Secure your account with a strong password.",
          newPassLabel: "New Password",
          newPassPlaceholder: "••••••••",
          confirmPassLabel: "Confirm New Password",
          confirmPassPlaceholder: "••••••••",
          updateBtn: "Update Password",
          success: "Password successfully changed!",
          errorMatch: "Password confirmation does not match.",
          errorLength: "Password must be at least 6 characters.",
          errorFailed: "Failed to change password.",
        },
        delete: {
          title: "Delete Account",
          desc: "Once deleted, data cannot be recovered.",
          dangerTitle: "Delete Account",
          dangerDesc: "All digital profile data, links, and attendance logs will be permanently deleted from our system.",
          cta: "Delete My Account",
          modalTitle: "Delete Account?",
          modalDesc: "This action is permanent. Type {phrase} below to confirm.",
          modalInputPlaceholder: "DELETE MY ACCOUNT",
          modalConfirmBtn: "Yes, Delete Permanently",
          modalCancelBtn: "Cancel",
          confirmPhrase: "DELETE MY ACCOUNT",
          error: "Failed to delete account. Please try again.",
        }
      },
      tour: {
        restart: "Guide",
        skip: "Skip",
        next: "Next",
        back: "Back",
        finish: "Finish",
        builder: {
          profile: {
            title: "Profile Customization",
            desc: "Change your avatar photo, brand name, short biography, and manage your digital page's publication status."
          },
          addLink: {
            title: "Add New Link",
            desc: "Click here to add social media links, portfolio websites, WhatsApp, or other important links."
          },
          linksList: {
            title: "Manage Link Collection",
            desc: "All links you create will appear here. You can easily drag and drop to reorder, edit labels, disable, or delete links."
          },
          themes: {
            title: "Color & Theme",
            desc: "Select attractive color schemes and templates that best fit your professional identity."
          },
          save: {
            title: "Save Changes",
            desc: "Do not forget to click the save button above to instantly update your digital profile on the internet!"
          }
        },
        nfc: {
          scan: {
            title: "Scan NFC Keychain",
            desc: "Tap your OneTap keychain to the back of your smartphone to instantly read the saved link inside."
          },
          write: {
            title: "Write to NFC Keychain",
            desc: "Use this feature to record a new link or digital profile mode directly into your NFC keychain."
          },
          linkInput: {
            title: "Custom Link Input",
            desc: "Enter any link you want to write to the NFC keychain (e.g., WhatsApp, Portfolio, or Linktree link)."
          }
        },
        attendance: {
          schoolName: {
            title: "School & Institution Name",
            desc: "Type your school or institution name here and press Enter to save your institution's identity for attendance."
          },
          addStudent: {
            title: "Add New Student",
            desc: "Click this button to open the registration form modal for a new student."
          },
          studentForm: {
            title: "Fill Student Details",
            desc: "Complete the student details (Name, Class, and Parent's WhatsApp number) to ensure notifications are sent correctly, then save."
          },
          writeNFC: {
            title: "Register NFC Keychain",
            desc: "Click the WiFi icon in the first student row to start registering this student's digital token onto a physical NFC card/keychain."
          },
          writingModal: {
            title: "NFC Writing Process",
            desc: "Hold a physical NFC keychain against the back of your phone to write the unique student token instantly."
          },
          bulkScan: {
            title: "Start Bulk Attendance",
            desc: "Click 'Bulk Scan' to open the high-speed scanning screen for registering multiple students in sequence."
          },
          scanModal: {
            title: "Real-Time Attendance Monitor",
            desc: "On this screen, simply tap each student's NFC keychain. The system records presence and sends WhatsApp updates automatically!"
          },
          historyLink: {
            title: "Attendance History",
            desc: "Once done with practice, click here to examine complete reports, recap charts, and daily attendance logs."
          }
        }
      }
    },
    write: {
      gate: {
        title: "Premium Access",
        desc: "Enter the unique code found on your OneTap keychain box.",
        error: "Invalid access code. Please check the QR code on the box.",
        lost: "Lost your code?",
        support: "Contact Support"
      },
      writer: {
        unsupported: {
          title: "Browser Not Supported",
          desc: "NFC writing feature is currently only available through Google Chrome browser on Android devices with NFC sensor."
        },
        verified: "Verified",
        title: "Customize Keychain",
        desc: "Determine what action happens when someone taps your keychain.",
        type: "Action Type",
        mode: "Select Mode",
        content: "Data Content",
        erase: {
          title: "Reformat Chip",
          desc: "This action will clear all data on the keychain."
        },
        inputLabel: "Enter",
        waPlaceholder: "WhatsApp Number (628...)",
        waMsgPlaceholder: "Automated message (Optional)",
        profileLabel: "Select Digital Profile",
        profilePlaceholder: "Choose the profile to link",
        noProfiles: "No digital profiles found. Create one in the dashboard.",
        success: "Successfully wrote data to NFC Keychain!",
        btnFormat: "Start Formatting",
        btnWrite: "Write to Keychain",
        waiting: {
          title: "Ready to Receive Data",
          desc: "Tap and hold the back of your phone to your OneTap keychain now.",
          cancel: "Cancel Process"
        }
      },
      upsell: {
        title: "Unlock More Features",
        desc: "Unlock password protection, premium digital profiles, and advanced analytics.",
        login: "Login",
        register: "Register"
      },
      footer: {
        title: "Writer App for OneTap Owners",
        desc: "Requires an Android device with NFC sensor and Google Chrome browser to write data to the keychain."
      }
    },
    protection: {
      title: "Protected Profile",
      desc: "Enter password to view this profile.",
      placeholder: "Enter password...",
      button: "View Profile",
      connecting: "Connecting...",
      error: "Incorrect password. Please try again.",
      tagProtected: "This tag is password protected. Enter the correct password in the Protection Password field.",
      paymentTitle: "Protected Page",
      paymentDesc: "The payment page for {name} is password protected.",
      advanced: "Advanced Security",
      linkPassLabel: "Link Protection Password",
      linkPassPlaceholder: "Leave blank if not needed",
      linkPassInfo: "Link entry will require this password.",
      tagPassLabel: "NFC Tag Protection Password",
      tagPassPlaceholder: "Prevent others from rewriting",
      tagPassInfo: "Chip will be locked via software (NFC Software Lock).",
      step1: "Open in Chrome Android",
      step2: "Tap keychain on back of phone",
      searching: "Searching for Tag...",
      startBtn: "Start Activation Process",
      preparingLink: "Preparing Protected Link..."
    },
    paymentBridge: {
      chooseApp: "Choose Payment App",
      directOpen: "Open app directly",
      showQris: "Show QRIS Image",
      hideQris: "Hide QRIS Image",
      manualScan: "Scan {name} QRIS",
      screenshotInfo: "Screenshot the QRIS above to scan it from your payment app's gallery.",
      fallbackInfo: "If the app doesn't open automatically, please select \"Show QRIS Image\" and scan manually.",
    },
    logoutConfirm: {
      title: "Confirm Logout",
      desc: "Are you sure you want to log out of your OneTap account?",
      confirm: "Yes, Logout",
      cancel: "Cancel"
    },
    onboarding: {
      title: "Welcome to OneTap!",
      skip: "Skip Guide",
      next: "Next",
      back: "Back",
      finish: "Start Exploring!",
      viewGuide: "View Guide",
      step: "Step",
      of: "of",
      steps: {
        welcome: {
          title: "Welcome to OneTap!",
          desc: "OneTap is an all-in-one NFC digital identity platform. Create a digital profile, connect to an NFC keychain, and manage attendance — all from one place.",
          cta: "Let's Get Started!",
        },
        profile: {
          title: "Create Your Digital Profile",
          desc: "Build a stunning digital profile page to share with anyone. Add social media links, portfolio, WhatsApp, and more — all on one beautiful page.",
          cta: "Create Profile Now",
          hint: "Your profile is accessible via link, QR code, or NFC tap.",
        },
        nfc: {
          title: "Connect Your NFC Keychain",
          desc: "Once your profile is ready, link it to your OneTap NFC keychain. Open the Connect NFC page, tap the keychain to the back of your phone, and data is written instantly!",
          cta: "Connect NFC Now",
          hint: "Requires Chrome on Android + active NFC for this process.",
        },
        attendance: {
          title: "Set Up Automated Attendance",
          desc: "Register students, create individual NFC tags, and let the system automatically record attendance — complete with WhatsApp notifications to parents/guardians!",
          cta: "Manage Attendance",
          hint: "Exclusive to the Education plan. Every tap = attendance logged.",
        },
        done: {
          title: "All Set!",
          desc: "You now know how to use OneTap's core features. Explore the dashboard and start making the most of everything available to you.",
          cta: "Open Dashboard",
        },
      },
    },
    catalog: {
      badge: "New Arrival",
      title: "Featured",
      titleHighlight: "Products",
      subtitle: "Premium chibi acrylic keychain collection featuring your favorite anime characters — cute, kawaii, and collectible!",
      viewAll: "View All Products",
      allProducts: "All",
      allProductsTitle: "All",
      allProductsTitleHighlight: "Products",
      productsFound: "{count} products found",
      loadingProducts: "Loading products...",
      searchLabel: "Search Products",
      searchPlaceholder: "Product name, character...",
      sizeLabel: "Size",
      priceLabel: "Price",
      resetFilter: "Reset Filters",
      filterLabel: "Filter",
      filterProducts: "Filter Products",
      showProducts: "Show {count} Products",
      sortLabel: "Sort:",
      sortBestSeller: "Best Seller",
      sortPriceAsc: "Lowest Price",
      sortPriceDesc: "Highest Price",
      soldCount: "Sold",
      startingFrom: "From ",
      comingSoon: "Coming Soon",
      comingSoonSub: "Coming Soon",
      viewDetail: "View Detail",
      notFound: "Products Not Found",
      notFoundDesc: "Try changing your search keyword or reset the active filters.",
      breadcrumbHome: "Home",
      breadcrumbAll: "All Products",
      detail: {
        size: "Size",
        sold: "Sold",
        minOrder: "Minimum order:",
        orderWa: "Order via WhatsApp",
        viewOther: "View Other Products",
        trustPremium: "Premium Product",
        trustShipping: "Fast Shipping",
        trustQuality: "Guaranteed Quality",
        highlights: "Product Highlights",
        description: "Product Description",
        specs: "Specifications",
        related: "Related",
        relatedHighlight: "Products",
      },
    },
  },
};
export const dict = translations;
