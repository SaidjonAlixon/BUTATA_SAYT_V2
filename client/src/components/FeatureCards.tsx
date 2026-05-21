import { motion } from "framer-motion";
import { Crown, FileBadge, ShieldCheck } from "lucide-react";

// Custom User Red theme
const redGradient = "from-[#d64522] via-[#ee4f27] to-[#d64522]";

const features = [
    {
        id: "01",
        title: "PREMIUM FLEET",
        description: "Our modern fleet of high-performance trucks ensures reliable, on-time delivery for your most critical shipments.",
        icon: Crown,
        gradient: redGradient,
    },
    {
        id: "02",
        title: "FULLY INSURED",
        description: "Operate with confidence. We provide comprehensive cargo and liability insurance for total peace of mind on every load.",
        icon: FileBadge,
        gradient: redGradient,
    },
    {
        id: "03",
        title: "SAFETY FIRST",
        description: "Safety is our culture. Our drivers are regularly trained and certified to meet the highest industry safety standards.",
        icon: ShieldCheck,
        gradient: redGradient,
    },
];

export function FeatureCards() {
    return (
        <section className="pt-4 pb-24 bg-background relative overflow-hidden">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
                            whileHover={{ y: -10 }}
                            className="group relative h-full"
                        >
                            {/* Card Container - Simplified to Single Layer for perfect fill */}
                            <div className="relative h-full bg-slate-100 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[2rem] overflow-hidden transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(238,79,39,0.3)] dark:hover:shadow-[0_20px_60px_-15px_rgba(238,79,39,0.5)] flex flex-col items-center text-center">

                                {/* === REALISTIC SEAMLESS LIQUID WAVE ANIMATION === */}
                                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2rem]">
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#ee4f27] translate-y-[132%] group-hover:translate-y-[-40%] transition-transform duration-[4s] ease-in-out" style={{ willChange: 'transform' }}>
                                        {/* Wave 1 - Fast Rotating Square */}
                                        <div className="absolute top-[-40%] left-[-25%] w-[150%] h-[150%] bg-[#ee4f27] animate-wave opacity-100 rounded-[40%]" style={{ animationDuration: '8s', willChange: 'transform', transform: 'translateZ(0)' }}></div>
                                        {/* Wave 2 - Slow Rotating Square (Offset) */}
                                        <div className="absolute top-[-45%] left-[-20%] w-[150%] h-[150%] bg-[#ee4f27]/40 animate-wave rounded-[45%]" style={{ animationDuration: '12s', animationDelay: '-2s', willChange: 'transform', transform: 'translateZ(0)' }}></div>
                                    </div>
                                </div>

                                {/* Content Wrapper (Z-Index to stay above liquid) */}
                                <div className="relative z-10 p-8 flex flex-col items-center h-full w-full">

                                    {/* Icon Section */}
                                    <div className="relative mb-8 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                                        {/* Rotating Ring */}
                                        <div className="absolute inset-0 rounded-full border border-[#ee4f27]/20 dark:border-[#ee4f27]/30 group-hover:border-white/30 scale-125 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-1000"></div>

                                        {/* Icon Container */}
                                        <div className={`relative w-24 h-24 rounded-full bg-gradient-to-tr ${feature.gradient} p-0.5 shadow-2xl group-hover:shadow-white/20`}>
                                            <div className="w-full h-full bg-white dark:bg-slate-900 group-hover:bg-[#ee4f27] rounded-full flex items-center justify-center relative overflow-hidden transition-colors duration-500">
                                                <feature.icon className={`w-10 h-10 text-[#ee4f27] dark:text-white group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_15px_rgba(238,79,39,0.4)] dark:drop-shadow-[0_0_15px_rgba(238,79,39,0.6)] group-hover:drop-shadow-none animate-sway`} strokeWidth={1.5} />
                                            </div>
                                        </div>

                                        {/* Number Badge */}
                                        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 group-hover:bg-white text-[#ee4f27] font-black font-display text-sm w-10 h-10 flex items-center justify-center rounded-full shadow-lg border-4 border-slate-50 dark:border-slate-900 group-hover:border-[#ee4f27] z-20 group-hover:scale-110 transition-all duration-300">
                                            {feature.id}
                                        </div>
                                    </div>

                                    {/* Text Content - Colors invert on hover */}
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white mb-4 tracking-wide font-display uppercase drop-shadow-sm transition-colors duration-300 transform group-hover:scale-[1.02]">
                                        {feature.title}
                                    </h3>

                                    {/* Animated Divider */}
                                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${feature.gradient} group-hover:bg-white group-hover:from-white group-hover:to-white mb-6 opacity-80 dark:opacity-60 group-hover:w-32 group-hover:opacity-100 transition-all duration-500 ease-out`}></div>

                                    <p className="text-slate-600 dark:text-gray-400 group-hover:text-slate-700 dark:group-hover:text-white/90 leading-relaxed font-medium transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Bottom Line (initially visible, disappears on liquid fill) */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${feature.gradient} group-hover:opacity-0 transition-opacity duration-300`}></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
