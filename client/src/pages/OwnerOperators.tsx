import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Check, DollarSign, Fuel, Wrench, TrendingUp, Shield,
  MapPin, Clock, Truck, Newspaper, ArrowRight, Star,
  Quote, FileText, PhoneCall, CheckCircle2
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { EarningsCalculator } from "@/components/EarningsCalculator";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop",
  "/images/home/BlueCascadia_BlueRadarLines_Road.jpg",
  "/images/home/24_Fifth-generation-Freightliner-Cascadia-116-hero-shot.jpg",
  "/images/home/15_Fifth_generation_Freightliner_Cascadia_116_Sleeper_on_the_road.jpeg"
];

const EARNINGS_DATA = [
  { month: 'Jan', amount: 18000 },
  { month: 'Feb', amount: 22000 },
  { month: 'Mar', amount: 20000 },
  { month: 'Apr', amount: 25000 },
  { month: 'May', amount: 28000 },
  { month: 'Jun', amount: 32000 },
];

const NEWS_ITEMS = [
  {
    category: "Industry Update",
    title: "2026 Fuel Surcharge Trends",
    date: "Feb 01, 2026",
    image: "/images/home/CascadiaInterior_BlueRadarLines.jpg"
  },
  {
    category: "Maintenance",
    title: "Winter Care for Heavy Duty Rigs",
    date: "Jan 28, 2026",
    image: "/images/home/pexels-carloscruz-artegrafia-172084181-11087837.jpg"
  },
  {
    category: "Strategy",
    title: "Maximizing RPM on West Coast Lanes",
    date: "Jan 15, 2026",
    image: "/images/home/mak-fVDOn6sXWps-unsplash.jpg"
  }
];

const TESTIMONIALS = [
  {
    quote: "Since joining Butata, my take-home pay has increased by 40%. The 88% split is a game changer for my family.",
    author: "Sarah Jenkins",
    role: "Owner Operator, 5 Years",
    image: "/images/home/CascadiaInterior_BlueRadarLines.jpg"
  },
  {
    quote: "The transparency is real. No hidden fees, no surprise deductions. Just honest dispatch that keeps me moving.",
    author: "Michael Torres",
    role: "Fleet Owner, 3 Trucks",
    image: "/images/home/pexels-carloscruz-artegrafia-172084181-11087837.jpg"
  },
  {
    quote: "They treat you like family, not just a truck number. Dispatch actually listens to my lane preferences.",
    author: "David Ross",
    role: "Owner Operator, 8 Years",
    image: "/images/home/mak-fVDOn6sXWps-unsplash.jpg"
  }
];

const ONBOARDING_STEPS = [
  {
    icon: FileText,
    title: "Apply Online",
    desc: "Simple 5-minute form to get the ball rolling."
  },
  {
    icon: Shield,
    title: "Quick Approval",
    desc: "Compliance check completed within 24 hours."
  },
  {
    icon: Truck,
    title: "Orientation & Equipment Set up",
    desc: "Complete orientation process fully online, we will ship documents, stickers, fuel card, prepass and ELD device."
  },
  {
    icon: CheckCircle2,
    title: "First Load",
    desc: "Start hauling and earning immediately."
  }
];

const FAQS = [
  {
    question: "Do you have trailer rentals available?",
    answer: "Yes! We offer well-maintained dry vans and reefers at competitive weekly rates. We handle the maintenance so you can focus on driving."
  },
  {
    question: "Is there forced dispatch?",
    answer: "Never. You are the boss of your business. We offer loads based on your preferences, but you always have the final say to accept or decline."
  },
  {
    question: "How does payment work?",
    answer: "We offer weekly settlements via direct deposit every Friday. You get a detailed rate confirmation and settlement sheet for complete transparency."
  },
  {
    question: "Do you provide fuel cards?",
    answer: "Yes, we provide EFS fuel cards with significant discounts at major truck stops nationwide (Loves, TA, Petro, etc.), saving you up to $0.60 per gallon."
  },
  {
    question: "What are the requirements to join?",
    answer: "You need a valid CDL Class A, at least 2 years of verifiable experience, and a truck that meets DOT inspection standards. No SAP drivers at this time."
  }
];



export default function OwnerOperators() {
  const [calcOpen, setCalcOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* 1. ULTRA WIDE HERO WITH CAROUSEL & TICKER */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col">
        {/* Background Layer */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={HERO_IMAGES[currentImage]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              alt="Owner Operator"
              className="w-full h-full object-cover blur-[2px]"
            />
          </AnimatePresence>
          {/* Gradient Overlay - darker in dark mode, slightly lighter in light mode but still dark enough for white text */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-red-900/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:from-slate-950 via-transparent to-transparent" />
        </motion.div>

        {/* Content Layer */}
        <div className="relative z-10 flex-grow flex items-center justify-center px-4">
          <motion.div
            style={{ y: textY }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 text-red-200 dark:text-red-400 font-bold uppercase tracking-widest text-sm mb-6 backdrop-blur-md"
            >
              <Star className="w-4 h-4 fill-current" /> Premium Partner Program
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-display font-black text-white mb-8 tracking-tight drop-shadow-2xl"
            >
              DRIVE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">DESTINY</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-3xl text-slate-200 dark:text-slate-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed drop-shadow-md"
            >
              Take control with <span className="text-white font-bold">88% Gross Revenue</span>, transparency, and a partner who treats you like royalty.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/apply">
                <Button size="lg" className="h-16 px-10 text-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl shadow-xl shadow-red-900/50 hover:scale-105 transition-all">
                  Partner With Us
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={() => setCalcOpen(true)} className="h-16 px-10 text-xl border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900 font-bold uppercase tracking-wider rounded-xl backdrop-blur-sm transition-all">
                Calc Earnings
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Live Ticker */}
        <div className="relative z-20 w-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-4 overflow-hidden transition-colors duration-300">
          <div className="flex animate-marquee whitespace-nowrap">
            {/* Repeat for seamless loop */}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 mx-8 text-slate-600 dark:text-slate-400 font-mono text-sm uppercase tracking-wider">
                <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Avg Rate: <span className="text-slate-900 dark:text-white font-bold">$2.50/mile</span></span>
                <span className="flex items-center gap-2"><Fuel className="w-4 h-4 text-orange-500" /> Fuel Discount: <span className="text-slate-900 dark:text-white font-bold">ave 70cpm</span></span>
                <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-blue-500" /> Active Fleet: <span className="text-slate-900 dark:text-white font-bold">50+</span></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THE NUMBERS (EARNINGS) */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 dark:opacity-30 invert dark:invert-0"></div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div className="w-full lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}

                className="space-y-6"
              >
                <h2 className="text-5xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                  Transparent <br /> <span className="text-red-600 dark:text-red-500">Earnings</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  See exactly what you can earn. No hidden fees, no surprise deductions. Just honest business.
                </p>

                <div className="grid grid-cols-1 gap-6 mt-8">
                  <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">$250k+</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest">Potential Annual Gross</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-500 mb-1">Weekly</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest">Settlements</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="w-full lg:w-2/3 h-[500px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}

                className="w-full h-full bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 backdrop-blur-sm shadow-2xl dark:shadow-none"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Monthly Revenue Trend</h3>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Your Potential</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={EARNINGS_DATA}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--tooltip-bg, #0f172a)', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PREMIUM GLASSMORPHISM BENEFITS */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6 uppercase">Why Drivers <span className="text-red-500">Choose Us</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We don’t just offer a job; we offer a lifestyle upgrade. Check out the perks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: DollarSign, title: "Industry Leading Split", desc: "Keep 88% of the gross. We operate with complete transparency." },
              { icon: Fuel, title: "Massive Fuel Savings", desc: "Access our corporate discounts at major chains nationwide." },
              { icon: Truck, title: "Trailer Rentals", desc: "Need equipment? Rent our well-maintained trailers at competitive rates." },
              { icon: Clock, title: "You Control Your Time", desc: "No forced dispatch. You run when you want, where you want." },
              { icon: Wrench, title: "Maintenance Support", desc: "National tire and maintenance accounts to keep you rolling for less." },
              { icon: Shield, title: "24/7 Safety & Dispatch", desc: "We never sleep. Our team is always one call away to assist you." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white dark:bg-slate-900/40 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden shadow-lg dark:shadow-none"
              >
                {/* Hover Glow */}
                <div className="absolute -inset-[100px] bg-red-600/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center mb-8 shadow-lg shadow-red-900/30 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DRIVER INTEL (NEWS) */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">Driver Intel</h2>
              <p className="text-slate-600 dark:text-slate-400">Stay ahead of the curve with our latest updates.</p>
            </div>
            <Button variant="ghost" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">View All News <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NEWS_ITEMS.map((news, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}

                transition={{ delay: idx * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-md dark:shadow-none">
                  <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {news.category}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {news.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors leading-tight">
                  {news.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SUCCESS STORIES */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-red-500/5 skew-x-12"></div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}

            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">Real Driver <span className="text-red-500">Stories</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Don't just take our word for it.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: idx * 0.2 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 relative"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-red-500/20" />
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 italic leading-relaxed">"{testi.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={testi.image} alt={testi.author} className="w-12 h-12 rounded-full object-cover ring-2 ring-red-500" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{testi.author}</h4>
                    <p className="text-sm text-slate-500">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ONBOARDING ROADMAP */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-6">Your Road to the <span className="text-red-500">Fleet</span></h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We've streamlined our onboarding so you can stop waiting and start earning.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {ONBOARDING_STEPS.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}

                  transition={{ delay: idx * 0.2 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl text-center border border-slate-100 dark:border-slate-800 shadow-lg dark:shadow-none md:shadow-none"
                >
                  <div className="w-16 h-16 mx-auto bg-red-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold relative ring-4 ring-white dark:ring-slate-900">
                    <step.icon className="w-8 h-8" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white dark:border-slate-900">{idx + 1}</div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked <span className="text-red-500">Questions</span></h2>

          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6  shadow-sm transition-all data-[state=open]:border-red-500/50">
                <AccordionTrigger className="text-lg font-bold text-slate-900 dark:text-white hover:text-red-500 dark:hover:text-red-400 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 5. CTA - APPLY NOW */}
      <section className="py-32 relative overflow-hidden flex items-center justify-center bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/home/24_Fifth-generation-Freightliner-Cascadia-116-hero-shot.jpg"
            className="w-full h-full object-cover blur-sm opacity-30"
            alt="Road Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <h2 className="text-5xl md:text-7xl font-display font-black text-red-600 mb-8">READY TO ROLL?</h2>
          <p className="text-2xl text-slate-300 mb-12">
            Join the elite fleet. Start your application today and get on the road by next week.
          </p>
          <Link href="/apply">
            <Button className="h-20 px-16 text-2xl bg-white text-slate-950 hover:bg-slate-200 font-black uppercase rounded-full shadow-2xl hover:scale-105 transition-all">
              Start Application
            </Button>
          </Link>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
      <EarningsCalculator open={calcOpen} onOpenChange={setCalcOpen} />
    </div>
  );
}
