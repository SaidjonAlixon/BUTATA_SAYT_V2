
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Users,
  TrendingUp,
  ShieldCheck,
  Target,
  Award,
  CheckCircle,
  MapPin,
  Globe,
  Clock,
  Truck,
  Heart,
  Lightbulb,
  Zap,
  Leaf,
  Recycle,
  Cpu,
  BarChart3,
  Smartphone,
  Calendar,
  Box
} from 'lucide-react';
import { useState, useEffect } from "react";

const GALLERY_PRELOAD_IMAGES = [
  "/images/home/03_Fifth-generation-Freightliner-Cascadia-Family-front-view.jpeg",
  "/images/home/Whisk_10315ef2b7aa90eb82a4a4a7dcf46263dr.jpeg",
  "/images/home/Whisk_401498f4fb886f29122499914b9c51f4dr.jpeg",
];

export default function About() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    GALLERY_PRELOAD_IMAGES.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    });
    return () => links.forEach((link) => link.remove());
  }, []);

  const stats = [
    { label: "Years in Business", value: 5, suffix: "+", icon: Clock, icon2: Calendar },
    { label: "Trucks in Fleet", value: 50, suffix: "+", icon: Truck, icon2: Box },
    { label: "Satisfied Clients", value: 1000, suffix: "+", icon: Users, icon2: Heart },
    { label: "States Covered", value: 48, suffix: "", icon: MapPin, icon2: Globe },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header - Reduced Height with Map Background */}
      <div className="pt-40 pb-12 bg-slate-950 text-white relative overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen">
          <img
            src="/assets/us_map.png"
            alt="Map"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center scale-110 translate-y-32 blur-[1px]"
          />
        </div>

        {/* Map Dots Overlay */}
        <div className="absolute inset-0 z-0 scale-110 translate-y-32 pointer-events-none">
          <div className="relative w-full h-full max-w-7xl mx-auto">
            {/* Approximate locations based on % of container */}
            <MapDot style={{ top: '40%', left: '25%' }} delay={0} />   {/* West Coast / LA */}
            <MapDot style={{ top: '35%', left: '35%' }} delay={1} />   {/* Mountain West */}
            <MapDot style={{ top: '30%', left: '60%' }} delay={0.5} /> {/* Chicago / Midwest */}
            <MapDot style={{ top: '40%', left: '85%' }} delay={1.5} /> {/* East Coast / NY */}
            <MapDot style={{ top: '65%', left: '55%' }} delay={2} />   {/* Texas / Houston */}
            <MapDot style={{ top: '55%', left: '75%' }} delay={2.5} /> {/* Southeast / Atlanta */}
          </div>
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              About Us
            </h1>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-200">
              Driven by experience. Built on integrity.
            </h2>
            <p className="text-lg text-gray-300 max-w-4xl leading-relaxed">
              Butata LLC is a U.S.-based trucking company founded in 2021 with a clear goal: to build a logistics operation centered on reliability, transparency, and respect for drivers and partners. From the beginning, our focus has been simple — move freight the right way and build long-term trust with every customer, broker, and driver we work with.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          <motion.div
            initial="hidden"
            animate="visible"

            className="space-y-6"
          >
            <h2 className="text-3xl font-display font-bold text-primary">Our History & Mission</h2>
            <div className="prose prose-lg text-muted-foreground space-y-4">
              {(() => {
                const historyText = [
                  [
                    "Founded in 2021, ",
                    { text: "Butata LLC", bold: true },
                    " was built with a clear vision: to deliver dependable transportation services while raising the standard for communication, accountability, and operational integrity in the trucking industry."
                  ],
                  [
                    "From day one, our focus has been on doing things the right way — moving freight efficiently, supporting drivers professionally, and building trust with brokers and shippers through consistent performance."
                  ],
                  [
                    "Our mission goes beyond transportation. We aim to be a long-term logistics partner by providing tailored solutions, maintaining strong compliance and safety standards, and treating every load as if it were our own."
                  ]
                ];

                let cumulativeDelay = 0;
                const SPEED = 0.010; // Slightly faster for better flow (10ms per char)

                return historyText.map((paragraphSegments, idx) => {
                  // Calculate length of this paragraph to determine delay for the NEXT one
                  const paragraphLength = paragraphSegments.reduce((acc, seg) =>
                    acc + (typeof seg === 'string' ? seg.length : seg.text.length), 0);

                  const currentDelay = cumulativeDelay;
                  cumulativeDelay += (paragraphLength * SPEED) + 0.5; // +0.5s pause between paragraphs

                  return (
                    <TypewriterParagraph
                      key={idx}
                      text={paragraphSegments}
                      delay={currentDelay}
                      speed={SPEED}
                    />
                  );
                });
              })()}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="font-semibold">Safety First</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="font-semibold">Continuous Growth</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <Award className="w-6 h-6" />
                </div>
                <span className="font-semibold">Award Winning</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <Checks className="w-6 h-6" />
                </div>
                <span className="font-semibold">Reliable Service</span>
              </div>
            </div>
          </motion.div>

          <GalleryGrid />
        </div>

        {/* Stats Section - Premium Redesigned */}
        <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-3xl p-12 mb-24 relative overflow-hidden shadow-lg border border-border/50 dark:border-slate-800">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-primary mb-4">Why Partner With Us?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We deliver more than just cargo; we deliver peace of mind. Here is why hundreds of clients trust Butata LLC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Technology",
                text: "Real-time tracking and state-of-the-art logistics management systems ensure you always know where your freight is.",
                icon: TrendingUp
              },
              {
                title: "Experienced Drivers",
                text: "Our drivers are seasoned professionals with years of experience, ensuring safe and timely deliveries every time.",
                icon: Users
              },
              {
                title: "Customer Centric",
                text: "We offer 24/7 support and dedicated account managers who understand your business needs inside and out.",
                icon: CheckCircle
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="group bg-secondary/50 p-8 rounded-xl border border-border hover:border-accent transition-all duration-300 shadow-sm hover:bg-accent"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-white/90 transition-colors">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Core Values - Bento Grid */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that drive every decision we make and every mile we drive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Integrity - Large Square */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.1 }}
              className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-10 rounded-[2.5rem] border border-slate-800 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-500/20 transition-colors duration-700" />
              <div className="relative z-10">
                <div className="p-4 bg-blue-500/10 w-fit rounded-2xl mb-8 text-blue-400 border border-blue-500/20">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-display font-bold mb-6 text-white tracking-tight">Unwavering Integrity</h3>
                <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
                  We believe that trust is our most valuable asset. In an industry defined by variables, our word is the constant. We are radically transparent in our pricing, honest in our communications, and accountable for every mile. When we make a promise, consider it delivered.
                </p>
              </div>
              <div className="mt-8 relative z-10">
                <span className="text-sm font-bold text-blue-400 tracking-widest uppercase border-b border-blue-500/30 pb-1">The Foundation</span>
              </div>
            </motion.div>

            {/* Innovation - Tall Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.2 }}
              className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-slate-900 to-orange-950/30 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col relative overflow-hidden group shadow-xl hover:border-orange-500/30 transition-colors duration-500"
            >
              <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-orange-600/10 to-transparent opacity-50" />
              <div className="p-3 bg-orange-500/10 w-fit rounded-xl mb-6 text-orange-400 border border-orange-500/20">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Bold Innovation</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                We constantly seek new and better ways to serve. Blending human expertise with cutting-edge technology, we optimize supply chains and predict challenges before they arise.
              </p>
              <div className="mt-auto">
                <p className="text-orange-400 text-sm font-medium">Future Ready &rarr;</p>
              </div>
            </motion.div>

            {/* Safety - Wide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.3 }}
              className="md:col-span-1 md:row-span-1 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group hover:border-red-500/40 transition-colors shadow-lg"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="flex flex-col h-full justify-between">
                <div className="p-3 bg-red-500/10 w-fit rounded-xl text-red-400 border border-red-500/20 mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">Safety First</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Zero compromise. Rigorous training and strict maintenance ensure every journey is accident-free.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Community - Wide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.4 }}
              className="md:col-span-1 md:row-span-1 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-colors shadow-lg"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mb-10" />
              <div className="flex flex-col h-full justify-between">
                <div className="p-3 bg-emerald-500/10 w-fit rounded-xl text-emerald-400 border border-emerald-500/20 mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">Community</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Building diverse teams and supporting local initiatives to leave a positive impact wherever we go.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Innovation & Technology - Removed */}

        {/* Sustainability Section */}
        <div className="rounded-3xl bg-emerald-950 text-white p-12 md:p-20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
          </div>

          <Leaf className="w-64 h-64 text-emerald-500/10 absolute -bottom-10 -right-10 rotate-12" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6 text-emerald-400">
                <Recycle className="w-6 h-6" />
                <span className="font-bold tracking-wider uppercase">Sustainability</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Driving towards a greener future.</h2>
              <p className="text-emerald-100/80 text-lg leading-relaxed mb-8">
                We recognize our responsibility to the planet. By optimizing routes to reduce empty miles and investing in modern, fuel-efficient vehicles, we are committed to minimizing our carbon footprint while maximizing efficiency.
              </p>
              <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl transition-colors flex items-center gap-2 group">
                Our Green Initiatives
                <TrendingUp className="w-5 h-5 group-hover:bg-emerald-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-emerald-900/40 backdrop-blur-sm p-6 rounded-2xl border border-emerald-500/20">
                <h3 className="text-4xl font-bold text-emerald-400 mb-2">30%</h3>
                <p className="text-sm text-emerald-100">Reduction in idle time across our fleet.</p>
              </div>
              <div className="bg-emerald-900/40 backdrop-blur-sm p-6 rounded-2xl border border-emerald-500/20">
                <h3 className="text-4xl font-bold text-emerald-400 mb-2">EPA</h3>
                <p className="text-sm text-emerald-100">SmartWay Transport Partner Certified.</p>
              </div>
              <div className="bg-emerald-900/40 backdrop-blur-sm p-6 rounded-2xl border border-emerald-500/20 col-span-2">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-full">
                    <Truck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Modern Fleet</h4>
                    <p className="text-xs text-emerald-100">Average truck age less than 3 years.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

function MapDot({ style, delay }: { style: React.CSSProperties, delay: number }) {
  return (
    <div style={style} className="absolute flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 2, 2.5], opacity: [0.8, 0.4, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: delay, ease: "easeOut" }}
        className="absolute w-8 h-8 bg-red-500/30 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: delay, ease: "easeOut" }}
        className="absolute w-4 h-4 bg-red-500/50 rounded-full"
      />
      <div className="w-2 h-2 bg-red-500 rounded-full z-10 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
    </div>
  );
}

function TypewriterParagraph({ text, delay, speed }: { text: (string | { text: string, bold?: boolean })[], delay: number, speed: number }) {
  // Flatten content into an array of characters with their styling info
  const chars: { char: string, bold: boolean }[] = [];

  text.forEach(segment => {
    if (typeof segment === 'string') {
      segment.split('').forEach(c => chars.push({ char: c, bold: false }));
    } else {
      segment.text.split('').forEach(c => chars.push({ char: c, bold: segment.bold || false }));
    }
  });

  return (
    <motion.p
      className="leading-relaxed"
      initial="hidden"
      animate="visible"

      variants={{
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: speed
          }
        }
      }}
    >
      {chars.map((item, i) => (
        <motion.span
          key={i}
          className={item.bold ? "text-accent font-bold" : ""}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0 }}
        >
          {item.char}
        </motion.span>
      ))}
    </motion.p>
  );
}

function Checks(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function StatCard({ stat, index }: { stat: any, index: number }) {
  const [showSecondIcon, setShowSecondIcon] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowSecondIcon(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onViewportEnter={() => {
        animate(count, stat.value, { duration: 2, ease: "easeOut" });
      }}

      transition={{ delay: index * 0.1 }}
      className="text-center group"
    >
      <div className="flex justify-center mb-4 text-accent h-12 relative">
        <AnimatePresence mode="wait">
          {!showSecondIcon ? (
            <motion.div
              key="icon1"
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              transition={{ duration: 0.5 }}
            >
              <stat.icon className="w-10 h-10" />
            </motion.div>
          ) : (
            <motion.div
              key="icon2"
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              transition={{ duration: 0.5 }}
            >
              <stat.icon2 className="w-10 h-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="text-4xl font-bold font-display mb-2 group-hover:scale-110 transition-transform duration-300 text-slate-900 dark:text-white flex justify-center items-center">
        <motion.span>{rounded}</motion.span>
        <span>{stat.suffix}</span>
      </div>
      <div className="text-slate-600 dark:text-slate-300 font-medium tracking-wide">{stat.label}</div>
    </motion.div>
  );
}

function GalleryGrid() {
  const imageSets = [
    [
      "/images/home/03_Fifth-generation-Freightliner-Cascadia-Family-front-view.jpeg",
      "/images/home/Whisk_10315ef2b7aa90eb82a4a4a7dcf46263dr.jpeg",
      "/images/home/Whisk_401498f4fb886f29122499914b9c51f4dr.jpeg"
    ],
    [
      "/images/home/04_Fifth_generation_Freightliner_Cascadia_hero_shot_including_126.jpeg",
      "/images/home/Whisk_63583bc72762c848fc94a9204364a9fddr.jpeg",
      "/images/home/Whisk_7b29f21a2134f069e3747c43520f585fdr.jpeg"
    ],
    [
      "/images/home/15_Fifth_generation_Freightliner_Cascadia_116_Sleeper_on_the_road.jpeg",
      "/images/home/Whisk_80bdc75c934115596b64baae92d764dfdr.jpeg",
      "/images/home/24_Fifth-generation-Freightliner-Cascadia-116-hero-shot.jpeg"
    ]
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const CyclingImageCell = ({ src, className, priority }: { src: string, className?: string, priority?: boolean }) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
      setLoaded(false);
    }, [src]);
    return (
      <div className={`relative overflow-hidden group ${className} bg-slate-800`}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-[1]">
            <div className="w-6 h-6 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={src}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        {loaded && <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto h-auto md:h-[600px] pl-4 md:pl-8">
      {/* Decorative Red Line */}
      <div className="absolute left-0 top-0 bottom-0 w-2 md:w-3 bg-red-600 rounded-full" />

      <div className="grid grid-cols-12 gap-1 h-full">
        {/* Main Left Image (Span 7) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}

          transition={{ duration: 0.8 }}
          className="col-span-12 md:col-span-7 h-[300px] md:h-full rounded-2xl md:rounded-r-2xl md:rounded-l-none relative overflow-hidden shadow-2xl"
        >
          <CyclingImageCell src={imageSets[0][activeIndex]} className="w-full h-full" priority />
        </motion.div>

        {/* Right Column (Span 5) - Stacked Images */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-1 h-full">
          {/* Top Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden shadow-xl flex-1 rounded-2xl"
          >
            <CyclingImageCell src={imageSets[1][activeIndex]} className="w-full h-full" />
          </motion.div>

          {/* Bottom Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative overflow-hidden shadow-xl flex-1 rounded-2xl"
          >
            <CyclingImageCell src={imageSets[2][activeIndex]} className="w-full h-full" />
          </motion.div>
        </div>
      </div>

      {/* Floating Badge (Overlapping) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}

        transition={{ delay: 0.6, type: "spring" }}
        className="absolute top-[10%] left-[50%] md:left-[55%] -translate-x-1/2 p-6 bg-white dark:bg-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl border-l-4 border-red-600 z-20 hidden md:block"
      >
        <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-1">4+</h3>
        <p className="text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">Years of Excellence</p>
      </motion.div>
    </div>
  );
}
