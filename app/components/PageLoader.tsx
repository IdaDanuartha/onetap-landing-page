"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load or wait for window load
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 1500);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* No background, just the logo */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative"
          >
            <div className="flex items-center justify-center overflow-hidden">
               <Image 
                src="/images/logo_simple.png" 
                alt="OneTap Loader" 
                width={80} 
                height={80} 
                className="object-contain relative z-10"
                priority
               />
            </div>
            
            {/* Ambient Pulse Ring */}
            <motion.div
              animate={{ 
                scale: [1, 1.5],
                opacity: [0.5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeOut" 
              }}
              className="absolute inset-0 rounded-3xl border-2 border-[#FF5FA2]/30 -z-10"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
