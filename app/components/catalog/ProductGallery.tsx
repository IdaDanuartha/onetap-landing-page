"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 4;

  const prev = () => setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  const openLightbox = () => {
    setLightboxOpen(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, MAX_ZOOM));
  const zoomOut = () => {
    setZoom((z) => {
      const newZ = Math.max(z - 0.5, MIN_ZOOM);
      if (newZ === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return newZ;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setZoom((z) => {
      const newZ = Math.min(Math.max(z + delta, MIN_ZOOM), MAX_ZOOM);
      if (newZ === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return newZ;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  const handleLightboxNav = (dir: "prev" | "next") => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (dir === "prev") prev();
    else next();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handleLightboxNav("prev");
      if (e.key === "ArrowRight") handleLightboxNav("next");
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-[#FFF8F2] border border-[#F6B7C8]/30 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeIdx]}
                alt={`${productName} - Image ${activeIdx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint overlay */}
          <button
            onClick={openLightbox}
            className="absolute inset-0 w-full h-full cursor-zoom-in"
            aria-label="Open image zoom view"
          />

          {/* Zoom icon badge */}
          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center text-[#FF5FA2] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <Maximize2 className="w-4 h-4" />
          </div>

          {/* Prev / Next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center text-[#18080F] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center text-[#18080F] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dot indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-200 pointer-events-auto ${
                  i === activeIdx
                    ? "bg-[#FF5FA2] w-5"
                    : "bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto py-2 px-2 -mx-2 scrollbar-hide">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                  i === activeIdx
                    ? "border-[#FF5FA2] shadow-md shadow-[#FF5FA2]/20 scale-105"
                    : "border-transparent hover:border-[#F6B7C8]"
                }`}
              >
                <Image
                  src={src}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Image container */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transition: isDragging ? "none" : "transform 0.2s ease",
                    userSelect: "none",
                  }}
                  className="relative w-[90vw] h-[90vh] max-w-5xl"
                >
                  <Image
                    src={images[activeIdx]}
                    alt={`${productName} - Image ${activeIdx + 1}`}
                    fill
                    sizes="90vw"
                    className="object-contain"
                    unoptimized
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Top bar */}
            <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-5 z-10">
              {/* Image counter */}
              <span className="text-white/60 text-sm font-medium px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                {activeIdx + 1} / {images.length}
              </span>

              {/* Zoom controls + close */}
              <div className="flex items-center gap-2">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-white/80 text-xs font-mono px-2 py-1 bg-white/10 rounded-lg min-w-[48px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#FF5FA2] hover:border-[#FF5FA2] transition-colors ml-2"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLightboxNav("prev"); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLightboxNav("next"); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Bottom thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveIdx(i); setZoom(1); setPan({ x: 0, y: 0 }); }}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      i === activeIdx
                        ? "border-[#FF5FA2] scale-110 shadow-lg shadow-[#FF5FA2]/30"
                        : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${productName} thumbnail ${i + 1}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Hint text */}
            <p className="absolute bottom-5 right-5 text-white/30 text-xs hidden lg:block">
              Scroll to zoom · Drag to pan · ESC to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
