import { Suspense } from 'react';

export const metadata = {
  title: 'Checkout — OneTap',
  description: 'Selesaikan pembayaran untuk mengaktifkan plan OneTap kamu.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      {children}
    </Suspense>
  );
}
