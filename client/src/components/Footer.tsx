import { Link } from "wouter";
import { Truck, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowRight, Twitter, Map, Headset, Package, Plane, Globe, ShieldCheck, Clock, Handshake, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function Footer() {
  const [showScroll, setShowScroll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const content = [
    {
      text: "EFFICIENT, SAFE, & SWIFT LOGISTICS SOLUTIONS!",
      icon: ShieldCheck
    },
    {
      text: "RELIABLE TRANSPORTATION FOR YOUR BUSINESS!",
      icon: Truck
    },
    {
      text: "FAST & SECURE DELIVERY ACROSS THE NATION!",
      icon: Clock
    },
    {
      text: "YOUR TRUSTED PARTNER IN SUPPLY CHAIN!",
      icon: Handshake
    },
    {
      text: "MOVING YOUR BUSINESS FORWARD, EVERY MILE!",
      icon: TrendingUp
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % content.length);
        setIsExiting(false);
      }, 500); // Wait for exit animation to complete
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  const CurrentIcon = content[currentIndex].icon;

  return (
    <footer className="relative mt-20">
      {/* Top Orange Banner */}
      <div className="bg-[#ce181e] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="text-white space-y-4 ml-0 lg:-ml-80">
              <div key={currentIndex} className={`flex items-center gap-3 ${isExiting ? "animate-slide-out-right" : "animate-slide-in-left"}`}>
                <CurrentIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0" />
                <h2 className="text-xl sm:text-2xl md:text-4xl font-black uppercase italic tracking-wider max-w-xl leading-tight">
                  {content[currentIndex].text}
                </h2>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-end items-center gap-6 lg:gap-8">
              <Link href="/apply">
                <Button className="bg-white text-black hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-xl group animate-heartbeat font-bold text-base sm:text-lg px-6 sm:px-8 py-3 rounded-full border-2 border-white/20 w-full sm:w-auto relative lg:top-24">
                  APPLY FOR A JOB
                  <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              {/* Decorative Truck Image - visible on mobile, larger on desktop */}
              <div className="flex justify-center lg:flex lg:justify-end translate-y-0 lg:translate-y-2 w-full lg:max-w-none">
                <img src="/images/home/fut_truck.png" alt="Truck" className="w-[340px] sm:w-[420px] lg:w-[860px] xl:w-[1050px] h-auto object-contain animate-drive" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#0F172A] text-white pt-12 sm:pt-20 pb-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">

            {/* Col 1: Brand */}
            <div className="space-y-4 sm:space-y-6">
              <Link href="/" className="inline-block">
                <img src="/logo_dark.png" alt="Butata LLC" className="h-10 sm:h-12 w-auto object-contain" />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Logistic service provider company plays a pivotal role in the global supply chain logistic service provider.
              </p>

              <div className="bg-[#ce181e] p-4 rounded-lg flex items-center gap-4 w-fit">
                <div className="bg-white/20 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white/80 uppercase font-bold">Make a Call</div>
                  <div className="text-white font-black text-lg">(206) 274-8232</div>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-2">
                Quick Links <Map className="w-5 h-5 text-[#ce181e] -rotate-12" />
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "Home", href: "/" },
                  { label: "About Us", href: "/about" },
                  { label: "Drivers", href: "/drivers" },
                  { label: "Contact", href: "/contact" }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="text-gray-400 hover:text-[#ce181e] transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 text-[#ce181e] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Get In Touch */}
            <div>
              <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-2">
                Get In Touch <Headset className="w-5 h-5 text-[#ce181e] -rotate-12" />
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <MapPin className="w-6 h-6 text-[#ce181e] group-hover:animate-bounce" />
                  <span className="text-gray-400">596 Industry Drive, Suite 259<br />Tukwila, WA 98188</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <Mail className="w-6 h-6 text-[#ce181e] group-hover:skew-y-12 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-gray-400">hr@butatallc.com</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <Phone className="w-6 h-6 text-[#ce181e] group-hover:rotate-12 transition-transform" />
                  <span className="text-gray-400">(206) 274-8232</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Subscribe */}


          </div>

          {/* Bottom Strip */}
          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © Copyright {new Date().getFullYear()} Butata LLC. All Rights Reserved
            </p>
            <div className="flex items-center gap-2">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                <div key={idx} className="w-10 h-10 bg-white/5 hover:bg-[#FF4D00] flex items-center justify-center transition-colors cursor-pointer group">
                  <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Go Back Top */}
        <div
          onClick={scrollTop}
          className={`fixed right-4 sm:right-8 bottom-6 sm:bottom-8 z-50 transition-all duration-500 cursor-pointer group flex flex-col items-center gap-2 ${showScroll ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        >
          <div className="text-[10px] uppercase font-bold text-[#FF4D00] rotate-90 origin-bottom translate-y-8 tracking-widest whitespace-nowrap">Go Back Top</div>
          <div className="w-[1px] h-12 bg-[#FF4D00] mt-12 group-hover:h-16 transition-all duration-300"></div>
          <div className="w-2 h-2 rounded-full bg-[#FF4D00]"></div>
        </div>

      </div>
    </footer>
  );
}
