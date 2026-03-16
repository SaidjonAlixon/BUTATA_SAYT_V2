import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Zap, Trophy, Shield, Banknote,
  Clock, Smartphone, ChevronRight,
  BatteryCharging, Star
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const BENEFITS = [
  {
    title: "Top Tier Pay",
    value: "$0.75",
    unit: "CPM",
    desc: "Starting pay for experienced drivers. Earn what you're worth.",
    icon: Banknote,
    colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
    bg: "bg-emerald-950/30 border-emerald-500/20 text-emerald-400"
  },
  {
    title: "Sign-on Bonus",
    value: "$5,000",
    unit: "",
    desc: "Paid out over your first 6 months. Welcome to the team.",
    icon: Trophy,
    colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
    bg: "bg-amber-950/30 border-amber-500/20 text-amber-400"
  },
  {
    title: "New Equipment",
    value: "2024+",
    unit: "Models",
    desc: "Volvo VNL 860s & Freightliner Cascadias. Fully loaded.",
    icon: TruckIcon,
    colSpan: "col-span-12 md:col-span-12 lg:col-span-4",
    bg: "bg-blue-950/30 border-blue-500/20 text-blue-400"
  },
  {
    title: "Home Time",
    value: "Flexible",
    unit: "Schedule",
    desc: "We prioritize your life off the road. 2 weeks out, 2 days home.",
    icon: Clock,
    colSpan: "col-span-12 md:col-span-6",
    bg: "bg-slate-900/50 border-slate-700/50 text-slate-200"
  },
  {
    title: "Full Benefits",
    value: "100%",
    unit: "Coverage",
    desc: "Medical, Dental, Vision available from Day 1.",
    icon: Shield,
    colSpan: "col-span-12 md:col-span-6",
    bg: "bg-purple-950/30 border-purple-500/20 text-purple-400"
  }
];

function TruckIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
  );
}

export default function CompanyDrivers() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white selection:bg-red-600 selection:text-white font-sans overflow-x-hidden transition-colors duration-500">
      <Navbar />

      {/* 1. HERO SECTION: "NEXT-GEN FLEET" */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-500">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-200 via-white to-white dark:from-slate-900 dark:via-black dark:to-black opacity-100 dark:opacity-100 transition-colors duration-500">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop')] opacity-5 dark:opacity-20 bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05] bg-[length:50px_50px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-4 px-6 py-2 rounded-full border border-red-500/30 bg-red-500/10 dark:bg-red-900/10 backdrop-blur-md"
          >
            <span className="text-red-600 dark:text-red-500 font-mono tracking-widest uppercase text-sm font-bold flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 dark:bg-red-500"></span>
              </span>
              Recruiting High Performance Drivers
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl md:text-9xl font-display font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 drop-shadow-2xl dark:drop-shadow-none"
          >
            ELITE <span className="text-red-600">FLEET</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-3xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-10"
          >
            Drive the best equipment. Earn top-tier pay. Experience the future of trucking logistics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/apply">
              <Button className="h-16 px-10 text-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-none skew-x-[-10deg] border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)] dark:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:skew-x-0">
                <span className="skew-x-[10deg] inline-block">Apply Now</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicators (Left & Right) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-8 left-8 z-20 text-slate-400 dark:text-white/50 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors flex flex-col items-center gap-2"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono hidden md:block">Scroll</span>
          <ChevronRight className="w-6 h-6 rotate-90" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-8 right-8 z-20 text-slate-400 dark:text-white/50 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors flex flex-col items-center gap-2"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono hidden md:block">Scroll</span>
          <ChevronRight className="w-6 h-6 rotate-90" />
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-black to-transparent"></div>
      </section>

      {/* 2. BENTO GRID BENEFITS */}
      <section className="py-24 bg-white dark:bg-black relative transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-4">ENGINEERED FOR <span className="text-red-600">SUCCESS</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">We've redesigned the driver experience from the ground up. Unmatched pay, premium benefits, and respect.</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {[
              {
                title: "Top Tier Pay",
                value: "$0.80",
                unit: "CPM",
                desc: "Starting pay for experienced drivers. Includes detention, layover, and stop pay.",
                icon: Banknote,
                colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
                bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500"
              },
              {
                title: "Sign-on Bonus",
                value: "$5,000",
                unit: "BONUS",
                desc: "Fast-track payout structure over your first 6 months. Plus quarterly performance bonuses.",
                icon: Trophy,
                colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
                bg: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500"
              },
              {
                title: "New Equipment",
                value: "2025",
                unit: "MODELS",
                desc: "Volvo VNL 860s & Freightliner Cascadias. Equipped with Fridge, Inverter, and APU.",
                icon: TruckIcon,
                colSpan: "col-span-12 md:col-span-12 lg:col-span-4",
                bg: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500"
              },
              {
                title: "Flexible Schedule",
                value: "2 WEEKS",
                unit: "OUT",
                desc: "2 days home for every 2 weeks out. Want to run harder? We support it. Your schedule, your choice.",
                icon: Clock,
                colSpan: "col-span-12 md:col-span-6",
                bg: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-200"
              },
              {
                title: "Full Coverage",
                value: "DAY 1",
                unit: "BENEFITS",
                desc: "Comprehensive Medical, Dental, and Vision insurance starts the day you're hired. 401k with company match.",
                icon: Shield,
                colSpan: "col-span-12 md:col-span-6",
                bg: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: idx * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className={`${item.colSpan} relative group p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden flex flex-col justify-between min-h-[320px] hover:border-slate-300 dark:hover:border-white/10 shadow-sm hover:shadow-xl dark:shadow-none transition-all`}
              >
                {/* Minimalistic Background Icon Watermark */}
                <div className="absolute -bottom-8 -right-8 opacity-[0.05] group-hover:opacity-[0.1] dark:opacity-[0.03] dark:group-hover:opacity-[0.05] transition-opacity duration-700 rotate-[-15deg]">
                  <item.icon className="w-64 h-64 text-slate-900 dark:text-white" />
                </div>

                <div className="relative z-10 flex justify-between items-start mb-8">
                  <div className={`p-3 rounded-xl ${item.bg} backdrop-blur-md`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <div className="flex items-baseline gap-3 mb-3">
                    <div className="text-5xl font-medium text-slate-900 dark:text-white tracking-tight">{item.value}</div>
                    <div className="text-sm text-slate-500 font-medium uppercase tracking-widest">{item.unit}</div>
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Card Tile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}

              className="col-span-12 md:col-span-12 lg:col-span-8 relative rounded-3xl overflow-hidden min-h-[240px] p-10 border border-slate-200 dark:border-white/5 bg-slate-800 dark:bg-slate-900/80 shadow-lg dark:shadow-none flex flex-col justify-end"
            >
              <div>
                <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium uppercase tracking-wider rounded-full mb-4">Premium Fleet</div>
                <h3 className="text-3xl font-medium text-white mb-2">Luxury on Wheels</h3>
                <p className="text-slate-300 text-lg font-light max-w-xl">Every truck is equipped with premium interiors, upgraded mattresses, fridges, and power inverters for your comfort.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. PAY BREAKDOWN (NUMBERS) */}
      <section className="py-24 bg-white dark:bg-black relative overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}

            className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-20"
          >
            EARNINGS <span className="text-red-600">UNLOCKED</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: "Annual Potential", value: "$95k+", desc: "Top performers earn significantly more.", color: "text-emerald-600 dark:text-emerald-500" },
              { label: "Weekly Average", value: "$1,800+", desc: "Consistent miles, consistent pay.", color: "text-slate-900 dark:text-white" },
              { label: "Safety Bonus", value: "$3,000", desc: "Clean inspections pay off quarterly.", color: "text-amber-500 dark:text-amber-500" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}

                transition={{ delay: idx * 0.2 }}
                className="relative py-10 px-6 border border-slate-200 dark:border-white/10 rounded-3xl bg-slate-50 dark:bg-white/5 backdrop-blur-sm group hover:border-red-500/50 transition-colors shadow-sm hover:shadow-lg dark:hover:shadow-none"
              >
                <div className="text-slate-500 font-mono text-sm uppercase tracking-widest mb-4 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{stat.label}</div>
                <div className={`text-6xl md:text-7xl font-black mb-4 ${stat.color} tracking-tighter`}>{stat.value}</div>
                <p className="text-slate-600 dark:text-slate-400 text-lg">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5. PILOT QUALIFICATIONS (NEW SECTION) */}
      <section className="py-24 bg-zinc-950 dark:bg-black relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}

              >
                <div className="inline-block px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono mb-6 uppercase tracking-wider">
                  System Requirements
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">MISS<span className="text-red-600">ION</span> READY?</h2>
                <p className="text-slate-400 text-lg mb-8">
                  We maintain the highest standards in the industry. Our fleet is reserved for professionals who treat trucking as a craft, not just a job.
                </p>

                <div className="space-y-4">
                  {[
                    { label: "CDL CLASS A", sub: "Valid Commercial Driver's License", status: "REQUIRED" },
                    { label: "2 YEARS EXPERIENCE", sub: "Verifiable OTR experience", status: "PREFERRED" },
                    { label: "CLEAN MVR", sub: "No major violations in last 3 years", status: "CRITICAL" },
                    { label: "NO SAP", sub: "Clean drug & alcohol record", status: "MANDATORY" },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 10 }}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-red-500/30 transition-all cursor-default group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 group-hover:bg-green-500 group-hover:text-black transition-all">
                          <Shield className="w-5 h-5 text-green-500 group-hover:text-black transition-colors" />
                        </div>
                        <div>
                          <div className="font-bold text-white tracking-wide">{item.label}</div>
                          <div className="text-xs text-slate-500 font-mono group-hover:text-slate-300">{item.sub}</div>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <span className={`text-[10px] font-mono border px-2 py-1 rounded ${item.status === 'REQUIRED' || item.status === 'MANDATORY' ? 'border-red-500/30 text-red-500' : 'border-blue-500/30 text-blue-400'}`}>
                          {item.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="w-full md:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}

                className="relative z-10"
              >
                <div className="absolute inset-0 bg-red-600 blur-[100px] opacity-10"></div>
                <img
                  src="/images/home/BlueCascadia_BlueRadarLines_Road.jpg"
                  alt="Butata Fleet Truck"
                  className="relative z-10 rounded-3xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 w-full"
                />

                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 z-20 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-xl"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Top 1% Fleet</div>
                    <div className="text-xs text-slate-400">Join the best</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIFE ON THE ROAD (MEDIA) */}
      <section className="py-24 bg-slate-100 dark:bg-zinc-950 border-t border-slate-300 dark:border-slate-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-2">LIFE ON THE <span className="text-red-600">ROAD</span></h2>
            <p className="text-slate-600 dark:text-slate-400">Join a community of elite professionals.</p>
          </div>
          <Button variant="ghost" className="text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/5">View Gallery <ChevronRight className="ml-2 w-4 h-4" /></Button>
        </div>

        {/* Masonry-style Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
          <div className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group shadow-lg">
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2070&auto=format&fit=crop" alt="Truck Stop Sunset" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
              <div className="text-white font-bold text-xl">Sunset in Arizona</div>
              <div className="text-slate-300 text-sm">Submitted by Driver Mike T.</div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden group shadow-lg">
            <img src="/images/home/15_Fifth_generation_Freightliner_Cascadia_116_Sleeper_on_the_road.jpeg" alt="Highway" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-white font-bold text-lg">On The Move</div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden group shadow-lg">
            <img src="https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=2070&auto=format&fit=crop" alt="Freedom" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden group shadow-lg">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" alt="Open Road" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
              <div className="text-white font-bold text-xl">The Open Road</div>
              <div className="text-slate-300 text-sm">Coast to Coast</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
