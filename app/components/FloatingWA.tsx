"use client";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WA_LINK =
  "https://wa.me/6283114227745?text=Halo%20OneTap%2C%20saya%20ingin%20bertanya%20mengenai%20detail%20produk%20NFC%20OneTap%20yang%20tersedia.";

export default function FloatingWA() {
  return (
    <motion.a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa"
      style={{ bottom: '100px' }} // Lifted to avoid chatbot overlap
      aria-label="Chat WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <MessageCircle className="w-5 h-5" />
      <span>Chat WA</span>
    </motion.a>
  );
}
