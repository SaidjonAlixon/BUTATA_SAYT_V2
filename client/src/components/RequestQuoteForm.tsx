
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    fullName: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    phone: z.string().min(5, {
        message: "Phone number is required.",
    }),
    comment: z.string().optional(),
});

export function RequestQuoteForm() {
    const { toast } = useToast();
    const [isPending, setIsPending] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            comment: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsPending(true);
        try {
            const res = await fetch("/api/quotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(values),
            });

            if (!res.ok) throw new Error("Failed to send request");

            toast({
                title: "Request Sent",
                description: "We have received your request and will contact you shortly.",
            });
            form.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Card className="w-full bg-black/5 backdrop-blur-[2px] border-white/5 text-white shadow-xl hover:bg-black/80 hover:backdrop-blur-md hover:border-white/20 transition-all duration-500 hover:scale-[1.01] group">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold uppercase tracking-wide text-center text-white/90">
                    Contact Us
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300 text-xs font-medium uppercase tracking-wider">Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            {...field}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:bg-white/10 h-10 text-sm transition-all"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300 text-xs font-medium uppercase tracking-wider">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="+1 (555) 000-0000"
                                            {...field}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:bg-white/10 h-10 text-sm transition-all"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300 text-xs font-medium uppercase tracking-wider">Comment</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="How can we help you?"
                                            {...field}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:bg-white/10 min-h-[80px] text-sm transition-all resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full group relative overflow-hidden bg-gradient-to-r from-[#ce181e] to-[#ef4444] hover:from-[#b91c1c] hover:to-[#ce181e] text-white font-bold uppercase tracking-widest text-sm py-5 mt-2 shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] border border-red-600/30"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                            </span>
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
