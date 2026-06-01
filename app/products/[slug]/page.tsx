import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { mapDbProductToProduct } from "@/app/data/products";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const supabase = createPublicClient();
    const { data: products } = await supabase
      .from("catalog_products")
      .select("slug");
    return (products || []).map((p) => ({ slug: p.slug }));
  } catch (e) {
    console.error("Error in generateStaticParams:", e);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = createPublicClient();
    const { data: product } = await supabase
      .from("catalog_products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!product) return { title: "Produk Tidak Ditemukan" };
    return {
      title: `${product.name} — OneTap`,
      description: product.description,
    };
  } catch (e) {
    return { title: "Error — OneTap" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createPublicClient();
  
  // Fetch main product
  const { data: dbProduct, error } = await supabase
    .from("catalog_products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !dbProduct || dbProduct.status === "inactive" || dbProduct.status === "coming_soon") notFound();

  const product = mapDbProductToProduct(dbProduct);

  // Fetch related products (same category, excluding current product, only active or coming_soon, ordered by best_seller, limit 4)
  const { data: dbRelated } = await supabase
    .from("catalog_products")
    .select("*")
    .neq("slug", slug)
    .eq("category", product.category)
    .neq("status", "inactive")
    .order("is_best_seller", { ascending: false })
    .order("id", { ascending: true })
    .limit(4);

  const relatedProducts = (dbRelated || []).map(mapDbProductToProduct);

  return <ProductDetailClient product={product} related={relatedProducts} />;
}
