export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readingTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'apa-itu-nfc-dan-cara-kerjanya',
    title: 'Apa itu NFC dan Bagaimana Cara Kerjanya di Tahun 2024?',
    excerpt: 'Mengenal teknologi Near Field Communication yang kini menjadi standar baru dalam berbagi informasi dan pembayaran digital.',
    content: `
      <p>Teknologi NFC (Near Field Communication) mungkin terdengar teknis, namun sebenarnya Anda mungkin sudah menggunakannya setiap hari. Mulai dari tap kartu e-money hingga fitur sharing file di smartphone.</p>
      <h2>Bagaimana NFC Bekerja?</h2>
      <p>NFC bekerja dengan induksi elektromagnetik antar dua perangkat yang berdekatan (kurang dari 4cm). Berbeda dengan Bluetooth, NFC tidak memerlukan proses pairing yang rumit.</p>
      <h2>Keuntungan Menggunakan OneTap NFC Keychain</h2>
      <ul>
        <li>Instan: Cukup tap, informasi langsung terkirim.</li>
        <li>Tanpa Baterai: Chip NFC di keychain kami bekerja secara pasif.</li>
        <li>Customizable: Anda bisa mengubah link tujuan kapan saja.</li>
      </ul>
    `,
    date: '15 April 2024',
    author: 'Admin OneTap',
    category: 'Teknologi',
    image: '/images/logo_simple.png',
    readingTime: '5 min read',
  },
  {
    id: '2',
    slug: 'tips-networking-modern-dengan-nfc',
    title: 'Tips Networking Modern: Tinggalkan Kartu Nama Kertas!',
    excerpt: 'Pelajari bagaimana keychain NFC dapat meningkatkan konversi networking Anda hingga 300% dibanding kartu nama tradisional.',
    content: `
      <p>Pernahkah Anda memberikan kartu nama kertas dan merasa kartu tersebut akan berakhir di tempat sampah? Anda tidak sendirian.</p>
      <h2>Masalah dengan Kartu Nama Kertas</h2>
      <p>Kartu nama kertas seringkali hilang, data di dalamnya tidak bisa diupdate, dan memakan biaya cetak yang besar secara terus menerus.</p>
      <h2>Era Kartu Nama Digital</h2>
      <p>Dengan OneTap, Anda hanya perlu satu keychain untuk selamanya. Jika nomor WhatsApp atau profil LinkedIn Anda berubah, Anda cukup mengupdate linknya tanpa harus mencetak ulang.</p>
    `,
    date: '20 April 2024',
    author: 'Admin OneTap',
    category: 'Networking',
    image: '/images/logo_simple.png',
    readingTime: '4 min read',
  },
  {
    id: '3',
    slug: 'cara-setting-nfc-keychain-pertama-kali',
    title: 'Panduan Lengkap: Cara Setting OneTap Keychain Pertama Kali',
    excerpt: 'Langkah-langkah mudah untuk menghubungkan keychain NFC Anda ke profil media sosial atau link custom dalam hitungan detik.',
    content: `
      <p>Selamat! Anda baru saja mendapatkan OneTap Keychain pertama Anda. Sekarang, mari kita buat keychain tersebut bekerja untuk Anda.</p>
      <h2>Langkah 1: Aktifkan NFC di Smartphone</h2>
      <p>Pastikan fitur NFC di smartphone Anda sudah aktif melalui menu Settings atau Control Center.</p>
      <h2>Langkah 2: Tap Keychain ke Area Sensor</h2>
      <p>Tempelkan keychain OneTap Anda ke area sensor NFC di smartphone Anda (biasanya di bagian belakang dekat kamera).</p>
      <h2>Langkah 3: Konfigurasi Link</h2>
      <p>Anda akan diarahkan ke halaman setup. Masukkan link profil LinkedIn, Instagram, atau portofolio Anda. Simpan, dan Anda siap beraksi!</p>
    `,
    date: '25 April 2024',
    author: 'Tutorial',
    category: 'Panduan',
    image: '/images/logo_simple.png',
    readingTime: '6 min read',
  },
];
