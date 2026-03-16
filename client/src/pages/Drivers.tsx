import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import CompanyDriversContent from "@/components/CompanyDriversContent";
import OwnerOperatorsContent from "@/components/OwnerOperatorsContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function Drivers() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-300">
            <Navbar />

            <div className="min-h-screen pt-0">
                <Tabs defaultValue="company" className="w-full flex flex-col">

                    <div className="fixed top-28 md:top-36 left-0 right-0 z-40 flex justify-center pointer-events-none px-2">
                        <div className="relative pointer-events-auto w-full max-w-md md:max-w-none">
                            <TabsList className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 p-2 sm:p-1 bg-transparent w-full sm:w-auto">
                                <TabsTrigger
                                    value="company"
                                    className="rounded-full text-sm sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 font-bold border-2 border-transparent flex-1 sm:flex-initial data-[state=inactive]:bg-transparent dark:data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400 data-[state=inactive]:border-slate-200 dark:data-[state=inactive]:border-slate-800 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-[1.02] sm:data-[state=active]:scale-105 transition-all duration-300 whitespace-nowrap"
                                >
                                    Company Drivers
                                </TabsTrigger>
                                <TabsTrigger
                                    value="owner"
                                    className="rounded-full text-sm sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 font-bold border-2 border-transparent flex-1 sm:flex-initial data-[state=inactive]:bg-transparent dark:data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400 data-[state=inactive]:border-slate-200 dark:data-[state=inactive]:border-slate-800 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-[1.02] sm:data-[state=active]:scale-105 transition-all duration-300 whitespace-nowrap"
                                >
                                    Owner Operators
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    <TabsContent value="company" className="mt-0 focus-visible:outline-none">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <CompanyDriversContent />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="owner" className="mt-0 focus-visible:outline-none">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <OwnerOperatorsContent />
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>

            <Footer />
        </div>
    );
}
