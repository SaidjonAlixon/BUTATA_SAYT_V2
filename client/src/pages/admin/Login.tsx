import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2, Shield } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            toast({
                title: "Success",
                description: "Logged in successfully",
            });

            setLocation("/admin/dashboard");
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Login failed",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
            {/* Background gradient & grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(238,79,39,0.15),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-500/10 rounded-full blur-[120px]" />

            <div className="relative w-full max-w-md mx-4">
                <div className=" backdrop-blur-xl bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 p-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-600/20 border border-red-500/30 mb-2">
                            <Shield className="w-7 h-7 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
                            Admin Panel
                        </h1>
                        <p className="text-sm text-zinc-400">
                            Butata LLC - Enter your credentials to sign in
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-zinc-300 font-medium">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                className="h-11 bg-zinc-800/50 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-red-500/50 focus-visible:border-red-500/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300 font-medium">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-11 bg-zinc-800/50 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-red-500/50 focus-visible:border-red-500/50"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>
                </div>
                <p className="text-center text-xs text-zinc-500 mt-6">
                    © Butata LLC. All rights reserved.
                </p>
            </div>
        </div>
    );
}
