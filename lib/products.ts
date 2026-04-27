export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  formattedPrice: string;
  features: string[];
  category: 'Personal' | 'Bisnis' | 'Event';
  images: string[];
  popular?: boolean;
  badge?: string;
  variants?: string[];
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'basic-keychain',
    name: 'Basic Keychain',
    description: 'Keychain stylish tanpa fitur NFC',
    fullDescription: 'Keychain premium dengan material berkualitas tinggi. Sangat cocok untuk Anda yang menginginkan gantungan kunci dengan desain custom yang tahan lama dan elegan.',
    price: 25000,
    formattedPrice: 'Rp 25.000',
    features: ['Desain custom', 'Material premium', 'Berbagai pilihan warna', 'Tahan lama'],
    category: 'Personal',
    images: ['/images/logo_simple.png'], // Placeholders
    popular: false,
  },
  {
    id: '2',
    slug: 'onetap-keychain',
    name: 'OneTap Keychain',
    description: 'Keychain dengan teknologi NFC untuk berbagi link & profil',
    fullDescription: 'Produk unggulan kami. Keychain yang dilengkapi dengan chip NFC premium untuk berbagi profil media sosial, kontak, atau link portofolio Anda hanya dengan satu sentuhan. Data dapat diupdate kapan saja.',
    price: 45000,
    formattedPrice: 'Rp 45.000',
    features: ['Semua fitur Basic', 'NFC chip premium', 'Link profil & sosmed', 'Update data kapan saja'],
    category: 'Personal',
    images: ['/images/logo_simple.png'],
    popular: true,
    badge: 'Terlaris',
    variants: ['Gold Edition', 'Silver Edition', 'Midnight Black'],
  },
  {
    id: '3',
    slug: 'business-card-nfc',
    name: 'NFC Business Card',
    description: 'Kartu nama digital untuk profesional',
    fullDescription: 'Tinggalkan kesan profesional yang mendalam. Kartu nama PVC dengan chip NFC terintegrasi. Bagikan informasi bisnis Anda secara instan dan ramah lingkungan.',
    price: 75000,
    formattedPrice: 'Rp 75.000',
    features: ['Material PVC Premium', 'Full Color Printing', 'NFC & QR Code', 'Analytics Dashboard'],
    category: 'Bisnis',
    images: ['/images/logo_simple.png'],
    badge: 'Baru',
  },
  {
    id: '4',
    slug: 'event-badge-nfc',
    name: 'NFC Event Badge',
    description: 'Solusi badge untuk event dan konferensi',
    fullDescription: 'Badge pintar untuk manajemen event yang lebih baik. Memudahkan registrasi, networking antar peserta, dan akses ke jadwal event secara real-time.',
    price: 35000,
    formattedPrice: 'Rp 35.000',
    features: ['Bulk Order Only', 'Full Custom Design', 'Lead Retrieval System', 'Attendance Tracking'],
    category: 'Event',
    images: ['/images/logo_simple.png'],
  },
];
