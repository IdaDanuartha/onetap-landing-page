import { products } from "@/lib/products";
import ProductDetailContent from "./ProductDetailContent";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailContent product={product} />;
}
