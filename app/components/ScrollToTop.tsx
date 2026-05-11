"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top immediately on route change, bypassing smooth scroll if necessary
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as any
    });
  }, [pathname]);

  return null;
}
