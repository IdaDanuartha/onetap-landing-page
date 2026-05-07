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
    <Script
      id="tawk-to"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/69eeeffa5559ee1c3cb4053c/1jn6lir7o';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
        `,
      }}
    />
  );
}
