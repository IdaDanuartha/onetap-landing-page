export type ProductCategory = "Keychain" | "Sticker" | "Bundle";

export interface Product {
  id: string;
  slug: string;
  name: string;
  character: string;
  category: ProductCategory;
  badge?: "Best Seller";
  size: string;
  price: number;
  originalPrice?: number;
  minOrder: number;
  sold: number;
  description: string;
  material: string;
  specs: { label: string; value: string }[];
  highlights: string[];
  images: string[]; // index 0 = main image
  waMessage: string;
  is_custom?: boolean;
  is_best_seller?: boolean;
  sizes?: string[];
  status?: "active" | "inactive" | "coming_soon";
}

const WA_NUMBER = "6283114227745";
export const WA_BASE_URL = `https://wa.me/${WA_NUMBER}`;

export function mapDbProductToProduct(dbProduct: any): Product {
  const badge = dbProduct.is_best_seller ? "Best Seller" : undefined;
  
  let size = "Custom";
  if (dbProduct.is_custom) {
    size = "Semua Ukuran";
  } else if (dbProduct.sizes && dbProduct.sizes.length > 0) {
    const s = dbProduct.sizes[0];
    if (s === "5x5") size = "Mini 5×5 cm";
    else if (s === "6x6") size = "Regular 6×6 cm";
    else size = `${s.replace(/x/g, "×")} cm`;
  }

  const specs = [
    { label: "Ukuran", value: dbProduct.is_custom ? "Custom (Sesuai Design Anda)" : size },
    { label: "Bahan", value: "Akrilik Premium 3mm" },
    { label: "Finishing", value: "UV Print, Full Color" },
    { label: "Gantungan", value: "Ring silver + lobster clasp" },
    { label: "Min. Order", value: `${dbProduct.min_order} pcs` },
  ];

  const highlights = dbProduct.is_custom
    ? [
        "Bisa cetak custom menggunakan design sendiri",
        "Ukuran fleksibel menyesuaikan bentuk design",
        "Bahan Akrilik Premium tebal dan tahan lama",
        "Pengerjaan cepat & kualitas cetakan tajam",
      ]
    : [
        "Bahan Akrilik Premium tebal dan tahan lama",
        "Desain Chibi Super Gemas dan menggemaskan",
        "Cocok untuk koleksi atau hadiah",
        "Detail karakter tajam & warna cerah",
      ];

  let waMessage = "";
  if (dbProduct.is_custom) {
    waMessage = `Halo OneTap! 👋 Saya ingin memesan gantungan kunci custom dengan design saya sendiri. Bagaimana prosedur pengiriman file design dan detail biayanya? Terima kasih!`;
  } else {
    waMessage = `Halo OneTap! 👋 Saya ingin memesan:\n\n🛒 *${dbProduct.name}*\n📏 Ukuran: ${size}\n💰 Harga: Rp ${dbProduct.price.toLocaleString("id-ID")}/pcs\n\nMohon info ketersediaan dan cara pemesanan. Terima kasih!`;
  }

  return {
    id: String(dbProduct.id),
    slug: dbProduct.slug,
    name: dbProduct.name,
    character: dbProduct.character,
    category: dbProduct.category as ProductCategory,
    badge: badge as any,
    size,
    price: dbProduct.price,
    originalPrice: dbProduct.original_price ?? undefined,
    minOrder: dbProduct.min_order,
    sold: dbProduct.sold,
    description: dbProduct.description,
    material: "Akrilik Premium",
    specs,
    highlights,
    images: dbProduct.images || [],
    waMessage,
    is_custom: dbProduct.is_custom,
    is_best_seller: dbProduct.is_best_seller,
    sizes: dbProduct.sizes || [],
    status: dbProduct.status || "active",
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
