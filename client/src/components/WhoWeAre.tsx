import { motion } from "framer-motion";
import { ArrowRight, Globe, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function WhoWeAre() {
    return (
        <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column - Image Composition */}
                    <div className="relative h-[600px] w-full hidden lg:block">
                        {/* Main Large Image (Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="absolute left-0 top-0 w-[55%] h-full rounded-3xl overflow-hidden z-10"
                        >
                            <img
                                src="/images/home/04_Fifth_generation_Freightliner_Cascadia_hero_shot_including_126.jpeg"
                                alt="Truck Front"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </motion.div>

                        {/* Top Right Image - Interior (completely different from truck exterior) */}
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                            className="absolute right-0 top-0 w-[40%] h-[45%] rounded-3xl overflow-hidden"
                        >
                            <img
                                src="/images/home/Whisk_10315ef2b7aa90eb82a4a4a7dcf46263dr.jpeg"
                                alt="Truck Interior"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Bottom Right Image - Landscape / different scene */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                            className="absolute right-0 bottom-0 w-[40%] h-[45%] rounded-3xl overflow-hidden"
                        >
                            <img
                                src="/images/home/Whisk_401498f4fb886f29122499914b9c51f4dr.jpeg"
                                alt="Logistics"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Experience Badge - Centered/Overlapping */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                            className="absolute left-[45%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                        >
                            <div className="bg-[#1e293b] text-white p-8 rounded-3xl shadow-2xl border-l-[6px] border-[#ee4f27] min-w-[200px]">
                                <div className="text-center">
                                    <span className="block text-5xl font-black text-white mb-2">5+</span>
                                    <span className="text-gray-300 font-bold uppercase tracking-wider text-sm block">Years of<br />Excellence</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Mobile View Placeholder (Single Image) */}
                    <div className="lg:hidden relative rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src="/images/home/04_Fifth_generation_Freightliner_Cascadia_hero_shot_including_126.jpeg"
                            alt="Logistics Operations"
                            className="w-full h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-6 right-6 bg-[#1e293b] p-4 rounded-xl shadow-xl border-l-4 border-[#ee4f27]">
                            <div className="text-center">
                                <span className="block text-3xl font-black text-white">5+</span>
                                <span className="text-gray-300 font-bold uppercase text-xs">Years</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="h-[2px] w-12 bg-[#ee4f27]"></span>
                                <span className="text-[#ee4f27] font-bold tracking-[0.2em] uppercase text-sm">Who We Are</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 font-display uppercase">
                                BUTATA <span className="text-[#ee4f27]">LLC</span>
                            </h2>
                            <p className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed">
                                Butata LLC is a premier logistics provider committed to excellence in every mile. We specialize in providing reliable, efficient, and safe transportation solutions tailored to meet the dynamic needs of modern businesses. Our dedicated team and modern fleet ensure your cargo reaches its destination on time, every time.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Feature Item 1 */}
                            <div className="group bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-lg">
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-[#ee4f27] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#ee4f27]/30">
                                        <Globe className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#ee4f27] transition-colors">Global Service</h3>
                                        <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                                            We offer comprehensive logistics solutions that connect your business to markets across states with seamless efficiency.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Item 2 */}
                            <div className="group bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-lg">
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-[#ee4f27] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#ee4f27]/30">
                                        <Truck className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#ee4f27] transition-colors">Local Service</h3>
                                        <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                                            Expert local distribution services ensuring rapid and reliable delivery within regional networks.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link href="/apply">
                                <Button className="bg-[#ee4f27] hover:bg-[#d64522] text-white font-black uppercase tracking-widest px-8 h-12 rounded-lg shadow-lg shadow-[#ee4f27]/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group">
                                    Apply Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
