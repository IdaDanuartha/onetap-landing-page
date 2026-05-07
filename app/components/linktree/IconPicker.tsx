'use client';

import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe, 
  Mail, 
  Phone, 
  MessageCircle, 
  Github,
  Video,
  Link as LinkIcon,
  ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const iconMap: Record<string, any> = {
  instagram: Instagram,
  whatsapp: MessageCircle,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: Video,
  youtube: Youtube,
  website: Globe,
  email: Mail,
  phone: Phone,
  github: Github,
  link: LinkIcon
};

export const linkIcons = [
  { id: 'instagram', Icon: Instagram, label: 'Instagram' },
  { id: 'whatsapp', Icon: MessageCircle, label: 'WhatsApp' },
  { id: 'facebook', Icon: Facebook, label: 'Facebook' },
  { id: 'twitter', Icon: Twitter, label: 'Twitter/X' },
  { id: 'linkedin', Icon: Linkedin, label: 'LinkedIn' },
  { id: 'tiktok', Icon: Video, label: 'TikTok' },
  { id: 'youtube', Icon: Youtube, label: 'YouTube' },
  { id: 'website', Icon: Globe, label: 'Website' },
  { id: 'email', Icon: Mail, label: 'Email' },
  { id: 'phone', Icon: Phone, label: 'Telepon' },
  { id: 'github', Icon: Github, label: 'GitHub' },
  { id: 'link', Icon: LinkIcon, label: 'Lainnya' },
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const SelectedIcon = iconMap[value] || LinkIcon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 rounded-xl flex items-center justify-center bg-white border border-[#F6B7C8]/20 hover:border-[#FF5FA2]/40 transition-all shadow-sm"
        title="Pilih Ikon"
      >
        <SelectedIcon className="w-5 h-5 text-[#18080F]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-full left-0 mt-2 p-3 bg-white border border-[#F6B7C8]/30 rounded-2xl shadow-2xl z-50 grid grid-cols-4 gap-2 min-w-[200px]"
          >
            {linkIcons.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setIsOpen(false);
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  value === item.id 
                    ? 'bg-[#FF5FA2] text-white shadow-lg shadow-[#FF5FA2]/20' 
                    : 'hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2]'
                }`}
                title={item.label}
              >
                <item.Icon className="w-5 h-5" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
