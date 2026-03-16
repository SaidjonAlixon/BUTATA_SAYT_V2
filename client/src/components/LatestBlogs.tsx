import { useEffect, useState } from "react";
import { ArrowRight, User, Calendar, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

const FALLBACK_IMAGES = [
    "/images/home/CascadiaInterior_BlueRadarLines.jpeg",
    "/images/home/15_Fifth_generation_Freightliner_Cascadia_116_Sleeper_on_the_road.jpeg",
    "/images/home/24_Fifth-generation-Freightliner-Cascadia-116-hero-shot.jpeg",
];

interface NewsItem {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    imageUrl?: string | null;
    image_url?: string | null;
    published: boolean;
    createdAt: string;
    created_at?: string;
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
}

export function LatestBlogs() {
    const [blogs, setBlogs] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        fetch("/api/news")
            .then((res) => res.ok ? res.json() : [])
            .then((data: NewsItem[]) => {
                const normalized = (Array.isArray(data) ? data : []).map((item) => ({
                    ...item,
                    imageUrl: item.imageUrl ?? item.image_url ?? null,
                    createdAt: item.createdAt ?? item.created_at ?? "",
                }));
                setBlogs(normalized);
            })
            .catch(() => setBlogs([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!api || blogs.length <= 1) return;
        const interval = setInterval(() => {
            api.scrollNext();
        }, 4000);
        return () => clearInterval(interval);
    }, [api, blogs.length]);
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-[#ce181e] font-display font-bold uppercase tracking-widest text-sm">
                        <span className="w-8 h-[2px] bg-[#ce181e]"></span>
                        LATEST BLOGS
                        <div className="overflow-hidden w-8 h-6 relative flex items-center">
                            <motion.div
                                animate={{ x: [-20, 40] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    repeatDelay: 0.5
                                }}
                            >
                                <Truck className="w-5 h-5 text-[#ce181e]" />
                            </motion.div>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white">
                        Latest Blogs & <span className="text-[#ce181e] underline decoration-[#ce181e]/30 underline-offset-8">NEWS</span>
                    </h2>
                </div>

                {/* Carousel */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-10 h-10 animate-spin text-[#ce181e]" />
                    </div>
                ) : blogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16">No news updates at this time</p>
                ) : (
                    <div className="relative px-12">
                        <Carousel
                            setApi={setApi}
                            opts={{ loop: true, align: "start" }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4 md:-ml-6">
                                {blogs.map((blog, idx) => (
                                    <CarouselItem
                                        key={blog.id}
                                        className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}

                                            transition={{ delay: Math.min(idx * 0.1, 0.5) }}
                                            className="group bg-white dark:bg-card border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300 h-full"
                                        >
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={(blog.imageUrl || blog.image_url) || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => {
                                                        e.currentTarget.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                                <div className="absolute bottom-4 left-4 flex gap-0">
                                                    <div className="bg-[#ce181e] text-white px-4 py-2 text-xs font-bold uppercase flex items-center gap-2 rounded-l-md">
                                                        <User className="w-3 h-3" /> Admin
                                                    </div>
                                                    <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase flex items-center gap-2 rounded-r-md">
                                                        <Calendar className="w-3 h-3 text-[#ce181e]" /> {formatDate(blog.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-4">
                                                <h3 className="text-xl font-bold font-display leading-tight group-hover:text-[#ce181e] transition-colors line-clamp-2">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                                                    {blog.excerpt}
                                                </p>
                                                <div className="pt-4">
                                                    <Button className="bg-[#ce181e] hover:bg-[#b91c1c] text-white font-bold uppercase tracking-wider text-xs px-6 rounded-lg transition-transform hover:translate-x-1">
                                                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-0 -translate-y-1/2 border-[#ce181e]/30 bg-slate-900/90 hover:bg-slate-800 text-white" />
                            <CarouselNext className="right-0 -translate-y-1/2 border-[#ce181e]/30 bg-slate-900/90 hover:bg-slate-800 text-white" />
                        </Carousel>
                    </div>
                )}
            </div>
        </section>
    );
}
