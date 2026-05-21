import { Link, useLocation } from "wouter";
import { translations } from "@/lib/i18n";
import { Menu, X, Globe, Mail, Phone, Clock, Facebook, Instagram, Twitter, Linkedin, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const t = translations;

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/drivers", label: "Drivers" },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden lg:block bg-slate-100 dark:bg-[#0A1120] text-slate-800 dark:text-white py-2.5 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-20 flex justify-between items-center text-[13px] font-medium">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="bg-slate-300/60 dark:bg-white/10 p-1.5 rounded-md group-hover:bg-[#ee4f27] group-hover:text-white transition-colors">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Mon-Fri 8am-6pm</span>
            </div>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="bg-slate-300/60 dark:bg-white/10 p-1.5 rounded-md group-hover:bg-[#ee4f27] group-hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">hr@butatallc.com</span>
            </div>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="bg-slate-300/60 dark:bg-white/10 p-1.5 rounded-md group-hover:bg-[#ee4f27] group-hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">(206) 274-8232</span>
            </div>
          </div>

          {/* <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 mr-2">Follow Us On:</span>
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-[#ee4f27] transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-auto p-0 text-gray-400 hover:text-white hover:bg-transparent flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{language}</span>
            </Button>
          </div> */}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white dark:bg-[#0f172a] shadow-lg relative h-14 lg:h-16 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between relative px-4 lg:px-20">

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center h-full">
            <div className="lg:ml-0">
              <img
                src="/logo_white.png"
                alt="Butata LLC"
                className="h-11 lg:h-13 w-auto object-contain dark:hidden"
              />
              <img
                src="/logo_dark.png"
                alt="Butata LLC"
                className="h-11 lg:h-13 w-auto object-contain hidden dark:block"
              />
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className={`px-5 py-2 text-[15px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer relative group ${location === link.href ? "text-[#ee4f27]" : "text-slate-800 dark:text-white"}`}>
                    {link.label}
                    <span className={`absolute bottom-0 left-5 right-5 h-0.5 bg-[#ee4f27] transition-all duration-300 ${location === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 lg:gap-6 relative z-10">
            <ThemeToggle />

            <Link href="/apply">
              <Button className="bg-[#ee4f27] hover:bg-[#d64522] text-white font-black uppercase tracking-widest px-6 h-10 rounded-md shadow-lg shadow-[#ee4f27]/30 transition-all active:scale-95 flex items-center gap-2 group text-xs hover:shadow-xl hover:shadow-[#ee4f27]/40 animate-float">
                {t.nav.applyNow}
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="group-hover:translate-x-1 transition-transform">
                  →
                </motion.span>
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-slate-900 dark:text-white p-2"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-8 space-y-4">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                    <div className={`text-lg font-bold uppercase tracking-wide py-2 ${location === link.href ? "text-[#ee4f27]" : "text-slate-800 dark:text-white"}`}>
                      {link.label}
                    </div>
                  </Link>
                ))}
                <div className="pt-6 border-t border-slate-100 dark:border-white/10 space-y-4">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <Phone className="w-4 h-4 text-[#ee4f27]" /> (206) 274-8232
                  </div>
                  <Link href="/apply" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-[#ee4f27] hover:bg-[#d64522] text-white font-bold h-14 uppercase tracking-widest">
                      {t.nav.applyNow}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
