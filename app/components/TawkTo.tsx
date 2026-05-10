'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function TawkTo() {
  const pathname = usePathname();

  // Hide Tawk.to on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <>
      <Script id="tawk-init" strategy="afterInteractive">
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        `}
      </Script>
      <Script
        id="tawk-script"
        src="https://embed.tawk.to/69eeeffa5559ee1c3cb4053c/1jn6lir7o"
        strategy="afterInteractive"
        charSet="UTF-8"
      />
    </>
  );
}
