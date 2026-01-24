"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  Smartphone,
  Palette,
  Shield,
  Globe,
  Lock,
  Leaf,
  Settings,
  Fingerprint,
  Link2,
  User,
  Briefcase,
  PartyPopper,
  KeyRound,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Menu,
  X,
  Wifi,
  Check,
  ArrowRight,
  Zap,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// Counter animation hook
function useCounter(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
}

// Section wrapper with animation
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Counter component
function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCounter(value, 2000, isInView);

  return (
    <motion.div ref={ref} variants={fadeInUp} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-secondary-400 counter">
        {count}{suffix}
      </div>
      <p className="mt-2 text-primary-200">{label}</p>
    </motion.div>
  );
}

// 3D NFC Keychain Component - Simple & Clean
function NFCKeychain3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // Multi-axis smooth rotation
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      groupRef.current.rotation.y = t * 0.4; // Continuous Y rotation
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Main circular keychain body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 1.8, 0.2, 64]} />
          <meshStandardMaterial
            color="#0e53df"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Yellow ring at top */}
        <mesh position={[0, 2.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.3, 0.12, 16, 32]} />
          <meshStandardMaterial
            color="#ffd200"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* Connection between ring and body */}
        <mesh position={[0, 1.9, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
          <meshStandardMaterial
            color="#ffd200"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* NFC Icon - Yellow circle background */}
        <mesh position={[0, 0, 0.11]} castShadow>
          <cylinderGeometry args={[1.1, 1.1, 0.02, 32]} />
          <meshStandardMaterial
            color="#ffd200"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* NFC Wave Symbol - Blue */}
        <group position={[0, 0, 0.13]}>
          <mesh position={[-0.2, 0, 0]}>
            <ringGeometry args={[0.3, 0.35, 32, 1, 0, Math.PI]} />
            <meshStandardMaterial color="#0e53df" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[-0.2, 0, 0]}>
            <ringGeometry args={[0.5, 0.55, 32, 1, 0, Math.PI]} />
            <meshStandardMaterial color="#0e53df" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[-0.2, 0, 0]}>
            <ringGeometry args={[0.7, 0.75, 32, 1, 0, Math.PI]} />
            <meshStandardMaterial color="#0e53df" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[-0.2, 0, 0]}>
            <circleGeometry args={[0.1, 16]} />
            <meshStandardMaterial color="#0e53df" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>

        {/* Animated NFC signal rings - Static for simplicity */}
        <mesh position={[0, 0, 0.5]}>
          <ringGeometry args={[1.3, 1.35, 64]} />
          <meshBasicMaterial color="#ffd200" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.5]}>
          <ringGeometry args={[1.6, 1.65, 64]} />
          <meshBasicMaterial color="#ffd200" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.5]}>
          <ringGeometry args={[1.9, 1.95, 64]} />
          <meshBasicMaterial color="#ffd200" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </Float>
    </group>
  );
}



// Header Component
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-lg" : "bg-transparent"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
              <Wifi className="w-5 h-5 text-secondary-400" />
            </div>
            <span className="text-xl font-bold">OneTap</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Statistics", "Products", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-foreground-secondary hover:text-primary-500 transition-colors font-medium"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="#contact"
              className="hidden sm:flex btn-primary text-sm px-5 py-2.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-foreground/10"
          >
            {["Features", "Statistics", "Products", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-3 text-foreground-secondary hover:text-primary-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}

// Hero Section with 3D
function HeroSection() {
  const [mounted, setMounted] = useState(false);

  // Pre-generate particle positions to avoid hydration mismatch
  const particles = useMemo(() => {
    if (!mounted) return [];
    return [...Array(15)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-animated">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-secondary-400 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-secondary-400/30 mb-6">
              <Zap className="w-4 h-4 text-secondary-400" />
              <span className="text-secondary-400 text-sm font-medium">NFC Technology</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              OneTap,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 via-secondary-300 to-secondary-400">
                Everything Connected
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 text-lg md:text-xl text-primary-200 max-w-lg">
              Hubungkan dunia fisik dan digital dalam satu sentuhan. NFC keychain untuk kebutuhan personal, bisnis, dan event.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
              <motion.a
                href="#contact"
                className="btn-accent inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Order Sekarang
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#features"
                className="btn-secondary border-white/30 text-white hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pelajari Lebih
              </motion.a>
            </motion.div>
          </motion.div>

          {/* 3D NFC Keychain */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative h-[400px] md:h-[500px]"
          >
            <Canvas
              camera={{ position: [0, 0, 6], fov: 45 }}
              className="three-canvas"
              style={{ pointerEvents: "auto" }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={2}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 1.5}
                />
                <NFCKeychain3D />
                <Environment preset="city" />
              </Suspense>
            </Canvas>

            {/* Instruction text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              <span>Auto-rotating • Drag to interact</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white/50" />
      </motion.div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Smartphone,
      title: "Tap & Connect",
      description: "Tidak perlu aplikasi tambahan. Cukup sentuh ke smartphone untuk berbagi informasi.",
    },
    {
      icon: Palette,
      title: "Custom Design",
      description: "Desain keychain sesuai brand dan identitas Anda. Premium dan profesional.",
    },
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Material berkualitas tinggi, tahan air, dan awet untuk penggunaan sehari-hari.",
    },
    {
      icon: Globe,
      title: "Multi-Platform",
      description: "Kompatibel dengan semua smartphone modern Android dan iOS.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Data Anda aman. Anda kontrol penuh atas informasi yang dibagikan.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Solusi ramah lingkungan, kurangi penggunaan kartu nama kertas.",
    },
  ];

  return (
    <AnimatedSection className="section bg-background-secondary" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Fitur Unggulan</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">
            Mengapa Pilih <span className="gradient-text">OneTap?</span>
          </h2>
          <p className="mt-4 text-foreground-muted max-w-2xl mx-auto">
            NFC keychain dengan teknologi terdepan untuk menghubungkan Anda dengan dunia
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="card group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <feature.icon className="w-7 h-7 text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Statistics Section
function StatisticsSection() {
  return (
    <AnimatedSection className="section bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950" id="statistics">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="text-secondary-400 font-semibold text-sm uppercase tracking-wider">Data Pasar Indonesia 2024</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white">
            Momentum NFC di <span className="text-secondary-400">Indonesia</span>
          </h2>
          <p className="mt-4 text-primary-200 max-w-2xl mx-auto">
            Indonesia memimpin adopsi pembayaran digital di Asia Tenggara dengan pertumbuhan pesat teknologi NFC
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <StatCounter value={53} suffix="M+" label="Pengguna QRIS" />
          <StatCounter value={96} suffix="%" label="Adopsi E-Wallet" />
          <StatCounter value={79} suffix="%" label="Penetrasi Internet" />
          <StatCounter value={209} suffix="%" label="Pertumbuhan YoY" />
        </div>

        <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-secondary-400/20">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary-400" />
                Tren Utama
              </h3>
              <ul className="space-y-3 text-primary-200">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary-400 mt-0.5 flex-shrink-0" />
                  Bank Indonesia meluncurkan QRIS Tap NFC pilot (Des 2024)
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary-400 mt-0.5 flex-shrink-0" />
                  34.23 juta merchant sudah menerima pembayaran digital
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary-400 mt-0.5 flex-shrink-0" />
                  Pasar pembayaran proximity tumbuh 21.74% CAGR
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-secondary-400" />
                Proyeksi 2025
              </h3>
              <ul className="space-y-3 text-primary-200">
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  Digital payment market: USD 115.34 Miliar
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  E-commerce market: USD 95 Miliar
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  Smartphone ownership terus meningkat
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Program",
      description: "Isi data profil, link sosial media, atau informasi bisnis Anda ke NFC keychain.",
      icon: Settings,
    },
    {
      step: "02",
      title: "Tap",
      description: "Sentuhkan keychain ke smartphone target. Tidak perlu aplikasi tambahan.",
      icon: Fingerprint,
    },
    {
      step: "03",
      title: "Connected",
      description: "Informasi langsung muncul di layar. Simpan kontak atau akses link dengan mudah.",
      icon: Link2,
    },
  ];

  return (
    <AnimatedSection className="section" id="howitworks">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Cara Kerja</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">
            Semudah <span className="gradient-text">1-2-3</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative text-center"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-400/0"></div>
              )}

              <motion.div
                className="relative z-10 w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <step.icon className="w-12 h-12 text-secondary-400" />
              </motion.div>

              <div className="mt-6">
                <span className="text-secondary-400 font-bold text-lg">{step.step}</span>
                <h3 className="text-2xl font-bold mt-2">{step.title}</h3>
                <p className="mt-3 text-foreground-muted">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Products Section
function ProductsSection() {
  const products = [
    {
      name: "Personal Edition",
      description: "Untuk personal branding dan networking sehari-hari",
      features: ["Custom design", "NFC chip premium", "Profile digital", "Link sosial media"],
      price: "Mulai Rp 99.000",
      popular: false,
    },
    {
      name: "Business Edition",
      description: "Untuk profesional dan pelaku bisnis",
      features: ["Logo perusahaan", "Kartu nama digital", "vCard download", "Analytics dashboard", "Unlimited updates"],
      price: "Mulai Rp 149.000",
      popular: true,
    },
    {
      name: "Event Edition",
      description: "Untuk event, komunitas, dan organisasi",
      features: ["Bulk order discount", "Custom branding", "QR code backup", "Event registration", "Sponsor showcase"],
      price: "Custom Quote",
      popular: false,
    },
  ];

  return (
    <AnimatedSection className="section bg-background-secondary" id="products">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Produk Kami</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">
            Pilihan <span className="gradient-text">Tepat</span> untuk Anda
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className={`card relative ${product.popular ? "border-secondary-400 border-2" : ""}`}
            >
              {product.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-secondary-400 to-secondary-500 text-primary-950 text-sm font-semibold rounded-full">
                  Popular
                </div>
              )}

              <h3 className="text-2xl font-bold">{product.name}</h3>
              <p className="mt-2 text-foreground-muted">{product.description}</p>

              <ul className="mt-6 space-y-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-500" />
                    </span>
                    <span className="text-foreground-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-foreground/10">
                <p className="text-2xl font-bold gradient-text-blue">{product.price}</p>
                <motion.a
                  href="#contact"
                  className={`mt-4 block text-center py-3 rounded-full font-semibold transition-all ${product.popular
                    ? "btn-accent w-full inline-block"
                    : "btn-secondary w-full"
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Pesan Sekarang
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Use Cases Section
function UseCasesSection() {
  const useCases = [
    {
      title: "Personal Branding",
      description: "Bagikan profil profesional Anda dengan sentuhan elegan",
      icon: User,
    },
    {
      title: "Business Networking",
      description: "Kartu nama digital yang tidak akan pernah hilang",
      icon: Briefcase,
    },
    {
      title: "Event & Conference",
      description: "Badge peserta dengan akses informasi event instant",
      icon: PartyPopper,
    },
    {
      title: "Access Control",
      description: "Kunci pintar untuk akses gedung atau ruangan",
      icon: KeyRound,
    },
  ];

  return (
    <AnimatedSection className="section">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Use Cases</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">
            Cocok untuk <span className="gradient-text">Berbagai</span> Kebutuhan
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20 text-center cursor-pointer group"
            >
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <useCase.icon className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="font-semibold text-lg">{useCase.title}</h3>
              <p className="mt-2 text-sm text-foreground-muted">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// CTA Section
function CTASection() {
  return (
    <AnimatedSection className="section bg-gradient-animated" id="contact">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Siap Untuk Lebih <span className="text-secondary-400">Terhubung?</span>
          </h2>
          <p className="mt-6 text-lg text-primary-200 max-w-2xl mx-auto">
            Mulai perjalanan digital Anda dengan OneTap. Hubungi kami untuk konsultasi gratis dan penawaran terbaik.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap justify-center gap-4">
          <motion.a
            href="https://wa.me/6281234567890?text=Halo%20min!%20Saya%20tertarik%20dengan%20NFC%20Keychain.%20Boleh%20minta%20info%20lebih%20lanjut%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-5 h-5" />
            Chat WhatsApp
          </motion.a>

          <motion.a
            href="mailto:hello@onetap.id"
            className="inline-flex items-center gap-3 px-8 py-4 bg-secondary-400 hover:bg-secondary-500 text-primary-950 font-semibold rounded-full transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5" />
            Email Kami
          </motion.a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-primary-950 text-primary-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-secondary-400" />
              </div>
              <span className="text-xl font-bold text-white">OneTap</span>
            </div>
            <p className="text-primary-300 max-w-md">
              OneTap mengubah cara berbagi identitas dengan NFC keychain. Satu sentuhan, terhubung selamanya.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-secondary-400 transition-colors">Features</a></li>
              <li><a href="#products" className="hover:text-secondary-400 transition-colors">Products</a></li>
              <li><a href="#contact" className="hover:text-secondary-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary-400" />
                hello@onetap.id
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary-400" />
                +62 812-3456-7890
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary-400" />
                Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-400">
            © 2025 OneTap. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-primary-700 hover:text-secondary-400 transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-primary-700 hover:text-secondary-400 transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-primary-700 hover:text-secondary-400 transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Page
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatisticsSection />
        <HowItWorksSection />
        <ProductsSection />
        <UseCasesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
