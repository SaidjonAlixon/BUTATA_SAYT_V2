import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateContact } from "@/hooks/use-contacts";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const { mutate: submitContact, isPending } = useCreateContact();

    return (
        <div className="min-h-screen bg-background font-body">
            <Navbar />

            <main className="pt-20">
                {/* === HEADER SECTION === */}
                <section className="relative h-[400px] md:h-[500px] flex items-center overflow-hidden">

                    {/* Layer 0: Full Background Image (The Truck/Logistics) */}
                    <div className="absolute inset-0 z-0 bg-gray-900">
                        <img
                            src="/images/home/BlueCascadia_BlueRadarLines_Road.jpg"
                            alt="Logistics"
                            className="w-full h-full object-cover opacity-90"
                        />
                    </div>

                    {/* Layer 1: Dark Blue Gradient Overlay (The "Left Side" background) */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0F172A] via-[#0F172A] to-transparent/0 via-40% md:via-50%"></div>

                    {/* Layer 2: Map Texture (On top of gradient, limited to left side) */}
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-3/4 md:w-1/2 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/1a/Blank_US_Map_(states_only).svg')] bg-no-repeat bg-contain bg-center mix-blend-overlay"></div>
                        {/* Gradient Mask for Map to fade it out visually before the image starts */}
                        <div className="absolute left-0 top-0 bottom-0 w-3/4 md:w-1/2 bg-gradient-to-r from-transparent to-[#0F172A]"></div>
                    </div>

                    {/* Layer 3: Content */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center md:justify-start px-8 md:px-20">
                        <div className="max-w-xl text-white">
                            <div className="inline-block px-3 py-1 bg-[#ce181e] mb-4 text-xs font-bold uppercase tracking-widest pl-2 border-l-4 border-white animate-fade-in-up">
                                Contact Us
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tight mb-4 drop-shadow-lg">
                                Contact Us
                            </h1>
                            <div className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-400">
                                <span className="hover:text-[#ce181e] cursor-pointer transition-colors">Home</span>
                                <span className="text-[#ce181e]">→</span>
                                <span className="text-white">Contact Us</span>
                            </div>
                        </div>
                    </div>

                    {/* Slanted Decorator (Optional, keeping it subtle) */}
                    <div className="absolute left-[45%] top-0 bottom-0 w-32 bg-gradient-to-r from-[#0F172A]/80 to-transparent skew-x-[12deg] z-10 hidden md:block blur-xl"></div>
                </section>


                {/* === CONTACT CONTENT SECTION === */}
                <section className="py-24 relative bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
                    {/* Background Map Decoration */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                            {/* Left Column - Info */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="h-[2px] w-8 bg-[#ce181e]"></span>
                                    <span className="text-[#ce181e] font-bold uppercase tracking-wider text-sm">Contact Us</span>
                                    <span className="text-[#ce181e]">→</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black font-display uppercase text-slate-900 dark:text-white mb-6 leading-tight">
                                    Get in Touch With Butata LLC
                                </h2>
                                <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                                    Whether you're a driver looking to join our team or a broker seeking reliable Power Only capacity, our team is ready to assist you.
                                    <br /><br />
                                    We value clear communication and respond quickly to all inquiries.
                                </p>

                                {/* Social Icons */}
                                <div className="flex items-center gap-4">
                                    {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                                        <div key={idx} className="w-12 h-12 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#ce181e] hover:border-[#ce181e] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column - Form */}
                            <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700/50">
                                <form
                                    className="space-y-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.currentTarget;
                                        const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim();
                                        const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim();
                                        const phone = (form.querySelector('[name="phone"]') as HTMLInputElement)?.value?.trim();
                                        const subject = (form.querySelector('[name="subject"]') as HTMLInputElement)?.value?.trim();
                                        const msg = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value?.trim();
                                        if (!name || !email || !msg) {
                                            toast({
                                                variant: "destructive",
                                                title: "Required fields",
                                                description: "Please fill in Name, Email, and Message.",
                                            });
                                            return;
                                        }
                                        const parts = [subject && `Subject: ${subject}`, phone && `Phone: ${phone}`, msg].filter(Boolean);
                                        submitContact(
                                            { name, email, message: parts.join("\n\n") },
                                            { onSuccess: () => { form.reset(); } }
                                        );
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Input name="name" placeholder="Name" required className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-[#ce181e] focus:ring-0 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Input name="email" placeholder="Email" type="email" required className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-[#ce181e] focus:ring-0 rounded-xl" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Input name="phone" placeholder="Phone" type="tel" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-[#ce181e] focus:ring-0 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Input name="subject" placeholder="Subject" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-[#ce181e] focus:ring-0 rounded-xl" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Textarea name="message" placeholder="Message" required className="min-h-[150px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-[#ce181e] focus:ring-0 rounded-xl resize-none" />
                                    </div>

                                    <Button type="submit" disabled={isPending} className="w-full md:w-auto bg-[#ce181e] hover:bg-[#b91c1c] text-white font-bold h-12 px-8 uppercase tracking-wider rounded-xl shadow-lg shadow-[#ce181e]/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-70">
                                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Now <ArrowRight className="ml-2 w-5 h-5" /></>}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === MAP SECTION === */}
                <section className="relative">
                    {/* Floating Info Card */}
                    <div className="container mx-auto px-4 z-20 relative -mb-20 pointer-events-none">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pointer-events-auto border border-slate-100 dark:border-slate-700">
                            {/* Location */}
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-[#ce181e]">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Location</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    596 Industry Drive, Suite 259<br />Tukwila, WA 98188
                                </p>
                            </div>

                            {/* Working Hours */}
                            <div className="text-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-8 md:pt-0">
                                <div className="w-12 h-12 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-[#ce181e]">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Working Hours</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Mon - Sun<br />7:00 AM - 5:00 PM
                                </p>
                            </div>

                            {/* Email */}
                            <div className="text-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-700 pt-8 lg:pt-0">
                                <div className="w-12 h-12 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-[#ce181e]">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Email</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    hr@butatallc.com
                                </p>
                            </div>

                            {/* phone */}
                            <div className="text-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-700 pt-8 lg:pt-0">
                                <div className="w-12 h-12 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-[#ce181e]">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Phones</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    (206) 274-8232
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Google Map Iframe */}
                    <div className="h-[500px] w-full bg-slate-200 z-0 relative">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src="https://maps.google.com/maps?q=596+Industry+Drive,+Suite+259,+Tukwila,+WA+98188&t=&z=13&ie=UTF8&iwloc=&output=embed&ehbc=2E312F"
                            className="w-full h-full grayscale-[50%] hover:grayscale-0 transition-all duration-500"
                        >
                        </iframe>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
