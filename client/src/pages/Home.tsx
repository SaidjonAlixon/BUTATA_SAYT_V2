import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { translations } from "@/lib/i18n";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, animate } from "framer-motion";
import { ArrowRight, CheckCircle2, Trophy, Clock, Shield, Globe, Users, Truck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { RequestQuoteForm } from "@/components/RequestQuoteForm";
import { FeatureCards } from "@/components/FeatureCards";
import { WhoWeAre } from "@/components/WhoWeAre";
import { LatestBlogs } from "@/components/LatestBlogs";
import { useState, useEffect, useRef } from "react";

const VIDEO_SOURCES = [
  "/images/home/TUCK_MP4.mp4",
  "/images/home/ONG_TOMONGA.mp4"
];

const Counter = ({ value }: { value: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);

  // Extract numeric part and suffix (e.g., "150+" -> 150 and "+")
  const numericValue = parseInt(value.replace(/,/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");

  useEffect(() => {
    if (isInView) {
      animate(motionValue, numericValue, { duration: 1, ease: "easeOut" });
    }
  }, [isInView, numericValue, motionValue]);

  const displayValue = useTransform(motionValue, (latest) =>
    Math.round(latest).toLocaleString()
  );

  return (
    <span ref={ref}>
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

const HERO_SLIDES = [
  {
    title: "Moving Your Business Forward, Mile by Mile",
    subtitle: "Reliable logistics solutions tailored for the modern world. Join the fastest growing fleet in the region."
  },
  {
    title: "Fast & Secure Transportation",
    subtitle: "Your trusted partner for timely and safe deliveries across the nation. We ensure your cargo arrives on time."
  },
  {
    title: "Modern Fleet, Professional Drivers",
    subtitle: "Experience the difference with our state-of-the-art trucks and dedicated team of expert drivers."
  }
];

function PartnersCarousel() {
  return (
    <div className="pt-12 pb-24 bg-background overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Those Who Chose Us</h2>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        {/* Qator 1 - chap.png chapga harakatlanadi va aylanib turadi */}
        <div className="overflow-hidden">
          <div className="marquee-left flex gap-12 md:gap-16 whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <img key={i} src="/images/hamkorlar/chap.png" alt="Chap" className="h-20 md:h-28 w-auto object-contain shrink-0 inline-block" />
            ))}
            {[...Array(6)].map((_, i) => (
              <img key={`d1-${i}`} src="/images/hamkorlar/chap.png" alt="Chap" className="h-20 md:h-28 w-auto object-contain shrink-0 inline-block" />
            ))}
          </div>
        </div>

        {/* Qator 2 - ong.png o'nga harakatlanadi va aylanib turadi */}
        <div className="overflow-hidden">
          <div className="marquee-right flex gap-12 md:gap-16 whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <img key={i} src="/images/hamkorlar/ong.png" alt="Ong" className="h-20 md:h-28 w-auto object-contain shrink-0 inline-block" />
            ))}
            {[...Array(6)].map((_, i) => (
              <img key={`d2-${i}`} src="/images/hamkorlar/ong.png" alt="Ong" className="h-20 md:h-28 w-auto object-contain shrink-0 inline-block" />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .marquee-left { animation: marquee-left 20s linear infinite; }
        .marquee-right { animation: marquee-right 20s linear infinite; }
      `}</style>
    </div>
  );
}

// Reviews data moved outside component to avoid re-creation
const REVIEWS = [
  { name: "John 'Big Mack' Davis", role: "Driver (15 Years Exp)", text: "I've driven for a lot of companies, but Butata is different. They actually respect the driver. The money is good, but the respect is what keeps me here.", type: "driver" },
  { name: "Sarah Jenkins", role: "Logistics Mgr, FastFreight Inc.", text: "Reliability is non-negotiable for us. Butata LLC has never missed a load. Their communication is top-tier.", type: "broker" },
  { name: "Mike Rodriguez", role: "Owner Operator", text: "Joined 3 years ago and haven't looked back. The fuel program alone saves me thousands. Dispatch keeps me moving.", type: "driver" },
  { name: "David Chen", role: "Broker, Global Logistics", text: "A professional team that solves problems instead of creating them. Highly recommended.", type: "broker" },
  { name: "Tank Williams", role: "Driver (22 Years Exp)", text: "Safety isn't just a slogan here. They keep the equipment in top shape. I feel safe putting my family in the truck with me.", type: "driver" },
  { name: "Emily Carter", role: "Supply Chain Director", text: "We needed a partner who could handle our peak season volume. Butata stepped up and delivered excellence.", type: "broker" },
  { name: "Lisa M.", role: "Team Driver", text: "My husband and I run teams. We get the long miles we want and the support we need 24/7.", type: "driver" },
  { name: "James Wilson", role: "V.P. Operations", text: "Strategic partners like Butata LLC are rare. They understand our business needs intrinsically.", type: "broker" }
];

export default function Home() {
  const t = translations;
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeIndex, setTimeIndex] = useState(0); // For auto-rotating testimonials
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["200%", "-1000%"]);

  // Second truck animation (Left to Right)
  const containerRef2 = useRef(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: containerRef2,
    offset: ["start end", "end start"]
  });
  const x2 = useTransform(scrollYProgress2, [0, 1], ["-100%", "900%"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeIndex((prev) => prev + 1);
    }, 5000); // Change cards every 5s
    return () => clearInterval(interval);
  }, []);

  const handleTimeUpdate = () => {
    const currentVideo = activeVideo === 1 ? video1Ref.current : video2Ref.current;
    if (!currentVideo || isTransitioning) return;

    if (currentVideo.duration - currentVideo.currentTime < 1) {
      setIsTransitioning(true);
      const nextVideo = activeVideo === 1 ? video2Ref.current : video1Ref.current;

      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play();
        setActiveVideo(prev => prev === 1 ? 2 : 1);
        // Reset transition flag after fade completes
        setTimeout(() => setIsTransitioning(false), 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 md:pt-40 overflow-hidden bg-[#0A1120]">
        {/* Background Video with Cross-fade Loop */}
        <div className="absolute inset-0 z-0 select-none bg-black">
          {[1, 2].map((id) => (
            <div
              key={id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-linear ${activeVideo === id ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              <video
                ref={id === 1 ? video1Ref : video2Ref}
                autoPlay={id === 1}
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-top translate-y-40 scale-125"
                onTimeUpdate={activeVideo === id ? handleTimeUpdate : undefined}
              >
                <source src={VIDEO_SOURCES[id - 1]} type="video/mp4" />
              </video>
              {/* Dynamic Gradient per Video */}
              <div
                className={`absolute inset-0 bg-gradient-to-r from-[#020617] via-[#0f172a]/90 z-20 ${id === 1 ? "to-[#ce181e]/30" : "to-[#3b82f6]/40"
                  }`}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-[1400px] px-4 sm:px-6 lg:px-20 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-start text-left lg:w-1/2">
              <div className="max-w-3xl h-[350px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#ce181e] animate-pulse shadow-[0_0_10px_#ce181e]" />
                      <span className="text-white font-bold tracking-[0.2em] uppercase text-sm md:text-base drop-shadow-lg">WELCOME TO BUTATA LLC</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                      <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-400">
                        {HERO_SLIDES[currentSlide].title}
                      </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed font-bold uppercase tracking-wide drop-shadow-lg max-w-2xl">
                      {HERO_SLIDES[currentSlide].subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <Link href="/apply">
                    <Button size="lg" className="group relative overflow-hidden bg-white text-[#ce181e] font-black uppercase tracking-widest text-base lg:text-lg px-6 py-4 lg:px-10 lg:py-8 h-auto rounded-xl shadow-2xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto border-2 border-[#ce181e] backdrop-blur-sm">

                      {/* Left Curtain */}
                      <div className="absolute inset-y-0 left-0 w-[51%] bg-gradient-to-r from-[#ce181e] to-[#ef4444] transition-transform duration-500 ease-out group-hover:-translate-x-full z-10" />

                      {/* Right Curtain */}
                      <div className="absolute inset-y-0 right-0 w-[51%] bg-gradient-to-l from-[#ce181e] to-[#ef4444] transition-transform duration-500 ease-out group-hover:translate-x-full z-10" />

                      {/* Content */}
                      <span className="relative z-20 flex items-center text-white group-hover:text-[#ce181e] transition-colors duration-500">
                        Apply for a Job <ArrowRight className="ml-3 h-5 w-5 lg:h-6 lg:w-6 transition-transform group-hover:translate-x-2" />
                      </span>
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <Link href="/about">
                    <Button variant="outline" size="lg" className="group relative overflow-hidden border-2 border-white/20 text-white bg-white/5 font-bold uppercase tracking-widest text-base lg:text-lg px-6 py-4 lg:px-10 lg:py-8 h-auto rounded-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 w-full sm:w-auto hover:border-white/40">
                      {/* Fill Effect */}
                      <div className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 z-0" />
                      <span className="relative z-10 group-hover:text-[#ce181e] transition-colors duration-500">ABOUT US</span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative z-20 w-full lg:w-[400px] mt-12 lg:mt-0 lg:absolute lg:right-10 lg:top-1/2 lg:-translate-y-1/2 px-4 lg:px-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <RequestQuoteForm />
          </motion.div>
        </div>
      </section>

      {/* Scrolling Truck Section */}
      <section ref={containerRef} className="relative h-40 md:h-52 overflow-hidden bg-background z-30 mt-20">
        <motion.div
          style={{ x, willChange: "transform", transform: "translateZ(0)" }}
          className="absolute bottom-0 right-0 w-64 md:w-80"
        >
          <img
            src="/images/home/YUR.png"
            alt="Moving Truck"
            className="w-full h-auto object-contain mix-blend-multiply"
          />
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <FeatureCards />

      {/* Stats Section */}
      <section className="pb-20 pt-0 bg-background relative mt-4 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Miles Driven", value: "1,000,000+", icon: Globe },
              { label: "Active Drivers", value: "100+", icon: Users },
              { label: "Years in Industry", value: "5", icon: Trophy },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="bg-white dark:bg-card p-8 rounded-2xl shadow-xl shadow-black/5 border border-border/50 text-center hover:bg-accent dark:hover:bg-accent hover:border-accent transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-center gap-6 mb-4">
                  {/* Icon - Left */}
                  <div className="p-3 bg-accent/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                    <stat.icon className="w-12 h-12 text-accent group-hover:!text-white transition-colors duration-300 group-hover:animate-sway" />
                  </div>

                  {/* Number - Right */}
                  <div className="text-5xl font-display font-bold text-primary group-hover:text-white transition-colors">
                    <Counter value={stat.value} />
                  </div>
                </div>

                <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm group-hover:text-white/90 transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Features Alternating Section */}
          <div className="mt-32 space-y-32">
            {[
              {
                title: "Safety is Our #1 Priority",
                desc: "We invest heavily in the latest safety technologies and training programs. Our fleet is equipped with advanced collision avoidance systems, and our drivers undergo rigorous safety certification. We believe that every safe mile is a milestone towards excellence.",
                image: "/images/home/03_Fifth-generation-Freightliner-Cascadia-Family-front-view.jpeg",
                align: "left"
              },
              {
                title: "Modern & Reliable Fleet",
                desc: "Our commitment to efficiency starts with our equipment. We operate a fleet of late-model trucks that are meticulously maintained to ensure minimal downtime and maximum comfort for our drivers. Experience the difference of driving state-of-the-art machinery.",
                image: "/images/home/CascadiaInterior_BlueRadarLines.jpeg",
                align: "right"
              },
              {
                title: "Driver-Centric Culture",
                desc: "At Butata LLC, drivers are not just numbers; they are partners. We offer competitive pay, flexible home time, and 24/7 support. We understand the challenges of the road and are dedicated to making your journey as smooth and rewarding as possible.",
                image: "/images/home/15_Fifth_generation_Freightliner_Cascadia_116_Sleeper_on_the_road.jpeg",
                align: "left"
              }
            ].map((item, idx, arr) => {
              // Calculate different images for the background stack
              const prevItem = arr[(idx + 1) % arr.length];
              const nextItem = arr[(idx + 2) % arr.length];

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${item.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: item.align === 'left' ? -100 : 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex-1 w-full lg:w-1/2 px-4 lg:px-0"
                  >
                    <div className="relative h-[400px] w-full group perspective-1000">

                      {/* Back Left Card - Fanned Out (Different Image) */}
                      <div className="absolute inset-0 bg-card rounded-3xl transform -rotate-12 -translate-x-4 scale-95 overflow-hidden border border-border/50 shadow-lg transition-transform duration-700 group-hover:-rotate-[15deg] group-hover:-translate-x-36 group-hover:scale-100 opacity-80 z-0">
                        <img
                          src={prevItem.image}
                          alt=""
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-accent/20 mix-blend-overlay" />
                      </div>

                      {/* Back Right Card - Fanned Out (Different Image) */}
                      <div className="absolute inset-0 bg-card rounded-3xl transform rotate-12 translate-x-4 scale-95 overflow-hidden border border-border/50 shadow-lg transition-transform duration-700 group-hover:rotate-[15deg] group-hover:translate-x-36 group-hover:scale-100 opacity-80 z-0">
                        <img
                          src={nextItem.image}
                          alt=""
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-accent/20 mix-blend-overlay" />
                      </div>

                      {/* Main Card - Front */}
                      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl z-10 transform transition-transform duration-700 group-hover:scale-105 border-4 border-background">
                        <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-500 z-20" />
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: item.align === 'left' ? 100 : -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="flex-1 w-full lg:w-1/2 space-y-6"
                  >
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                    <Button className="group relative overflow-hidden bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-accent/50 transition-all duration-300">
                      {/* Diagonal Swipe */}
                      <div className="absolute inset-0 bg-white/20 translate-y-full rotate-45 transition-transform duration-500 ease-out group-hover:-translate-y-full group-hover:rotate-45" style={{ transformOrigin: 'top left' }} />

                      <span className="relative flex items-center">
                        Learn More <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                      </span>
                    </Button>
                  </motion.div>
                </div>
              )
            })}
          </div>


        </div>
      </section>

      {/* Second Scrolling Truck Section (Left to Right) */}
      <section ref={containerRef2} className="relative h-40 md:h-52 overflow-hidden bg-background z-30 -mt-8 md:-mt-12 z-0">
        <motion.div
          style={{ x: x2, willChange: "transform", transform: "translateZ(0)" }}
          className="absolute top-0 left-0 w-64 md:w-80"
        >
          <img
            src="/images/home/YUR_ONGA.png"
            alt="Moving Truck Left to Right"
            className="w-full h-auto object-contain mix-blend-multiply"
          />
        </motion.div>
      </section>

      {/* Who We Are Section */}
      <WhoWeAre />

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden" >
        <div className="absolute inset-0 opacity-[0.03]">
          {/* abstract geometric background */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">Ready to Drive With The Best?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied drivers who have made Butata LLC their home. Apply today and start your journey.
          </p>
          <Link href="/apply">
            <Button size="lg" className="group relative overflow-hidden bg-[#ce181e] hover:bg-[#b91c1c] text-white font-bold px-10 py-6 text-xl rounded-xl shadow-2xl shadow-red-600/30 hover:shadow-red-600/50 transition-all border-2 border-white hover:animate-rubberBand">
              <span className="relative flex items-center gap-3">
                Start Application <Trophy className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </span>
            </Button>
          </Link>
        </div>
      </section >

      {/* Technology & Efficiency Section - Removed */}

      {/* Latest Blogs Section */}
      <LatestBlogs />

      {/* Testimonials Section */}
      <div className="pt-24 pb-0 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Voices from the Road</h2>
            <p className="text-xl text-muted-foreground w-full mx-auto">Hear from the drivers who move us forward and the partners who trust us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Drivers Column */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <div className="p-2 bg-accent rounded-full text-white"><Truck className="w-5 h-5" /></div>
                Our Drivers
              </h3>
              <div className="space-y-6 min-h-[300px]">
                {REVIEWS.filter(r => r.type === 'driver').slice(0, 5).map((review, idx, arr) => {
                  // Logic to show 1 card based on timeIndex
                  const isVisible = (idx === timeIndex % arr.length);
                  if (!isVisible) return null;

                  return (
                    <motion.div
                      key={`${review.name}-${timeIndex}`} // Force re-render for animation
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                      className="bg-card p-8 rounded-2xl border border-border shadow-lg h-[280px] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-accent text-white shrink-0">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{review.name}</h4>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{review.role}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground italic leading-relaxed line-clamp-4">"{review.text}"</p>
                      </div>
                      <div className="mt-4 flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <div key={star} className="w-4 h-4 text-accent fill-accent">★</div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Brokers Column */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <div className="p-2 bg-primary text-primary-foreground rounded-full"><Globe className="w-5 h-5" /></div>
                Our Partners
              </h3>
              <div className="space-y-6 min-h-[300px]">
                {REVIEWS.filter(r => r.type === 'broker').slice(0, 5).map((review, idx, arr) => {
                  // Logic to show 1 card based on timeIndex
                  const isVisible = (idx === timeIndex % arr.length);
                  if (!isVisible) return null;

                  return (
                    <motion.div
                      key={`${review.name}-${timeIndex}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                      className="bg-primary/5 p-8 rounded-2xl border border-border/50 shadow-lg h-[280px] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-primary text-primary-foreground shrink-0">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{review.name}</h4>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{review.role}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground italic leading-relaxed line-clamp-4">"{review.text}"</p>
                      </div>
                      <div className="mt-4 flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <div key={star} className="w-4 h-4 text-accent fill-accent">★</div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <PartnersCarousel />

      <Footer />
    </div >
  );
}


