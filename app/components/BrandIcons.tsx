'use client';

import React from 'react';

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Instagram = ({ className = "w-5 h-5", ...props }: BrandIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const Facebook = ({ className = "w-5 h-5", ...props }: BrandIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const Linkedin = ({ className = "w-5 h-5", ...props }: BrandIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Twitter = ({ className = "w-5 h-5", ...props }: BrandIconProps) => {
  // Use X logo SVG
  const fill = props.fill || "currentColor";
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={fill}
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
};

export const Youtube = ({ className = "w-5 h-5", ...props }: BrandIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export const Tiktok = ({ className = "w-5 h-5", ...props }: BrandIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.52-4.06-1.39-.28-.2-.55-.42-.79-.66-.08 2.39.02 4.79-.01 7.18-.11 2.22-1.07 4.39-2.82 5.73-2.12 1.69-5.11 2.05-7.55 1.05C4.7 20.89 3.01 18.06 3.3 15.08c.2-2.92 2.31-5.58 5.23-6.19 1.13-.26 2.33-.21 3.47.11V13.3c-1.12-.49-2.44-.45-3.5.17-1.19.67-1.89 2.04-1.74 3.4.12 1.44 1.25 2.67 2.68 2.87 1.48.27 3.07-.48 3.63-1.89.26-.59.29-1.25.29-1.89.02-5.91-.01-11.83.02-17.74z"/>
  </svg>
);

export const Telegram = ({ className = "w-5 h-5", ...props }: BrandIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M11.94 0C5.34 0 0 5.34 0 11.94C0 18.54 5.34 23.88 11.94 23.88C18.54 23.88 23.88 18.54 23.88 11.94C23.88 5.34 18.54 0 11.94 0ZM18.08 7.9c-.18 1.9-1.08 7.37-1.63 10.3c-.23 1.24-.69 1.66-1.13 1.7c-.96.09-1.69-.63-2.62-1.24c-1.46-1-2.28-1.63-3.69-2.56c-1.63-1.07-.57-1.67.36-2.63c.24-.25 4.47-4.1 4.55-4.45c.01-.04.02-.2-.07-.28c-.09-.08-.23-.05-.33-.03c-.14.03-2.39 1.52-6.75 4.46c-.64.44-1.22.65-1.74.64c-.57-.01-1.68-.32-2.5-.59c-1-.33-1.8-.5-1.73-1.06c.04-.29.44-.59 1.19-.9c4.64-2.02 7.73-3.36 9.27-4c4.41-1.84 5.33-2.16 5.93-2.17c.13 0 .42.03.61.19c.16.13.2.32.22.45c.02.09.03.27.01.37Z" />
  </svg>
);

// Aliases for compatibility
export const InstagramIcon = Instagram;
export const FacebookIcon = Facebook;
export const LinkedinIcon = Linkedin;
export const XIcon = Twitter;
export const YoutubeIcon = Youtube;
export const TwitterIcon = Twitter;
export const TiktokIcon = Tiktok;
export const TelegramIcon = Telegram;
