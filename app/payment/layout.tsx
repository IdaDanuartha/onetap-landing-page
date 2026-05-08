import { Suspense } from 'react';

export const metadata = {
  title: 'Pembayaran — OneTap',
  description: 'Selesaikan pembayaran untuk mengaktifkan plan OneTap kamu.',
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      {children}
    </Suspense>
  );
}
