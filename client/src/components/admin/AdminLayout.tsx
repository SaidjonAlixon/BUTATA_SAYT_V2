import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    LogOut,
    FileText,
    Briefcase,
    MessageSquare,
    Newspaper,
    Shield,
} from "lucide-react";

const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/applications", label: "Applications", icon: FileText },
    { path: "/admin/jobs", label: "Job Openings", icon: Briefcase },
    { path: "/admin/contacts", label: "Messages", icon: MessageSquare },
    { path: "/admin/news", label: "News", icon: Newspaper },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [location, setLocation] = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/admin/stats", { credentials: "include" });
                if (res.status === 401) {
                    setLocation("/admin/login");
                }
            } catch {
                setLocation("/admin/login");
            }
        };
        checkAuth();
    }, [setLocation]);

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
            setLocation("/admin/login");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
                <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30">
                        <Shield className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h1 className="font-bold text-zinc-50 text-sm">Admin</h1>
                        <p className="text-xs text-zinc-500">Butata LLC</p>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location === item.path;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.path}
                                onClick={() => setLocation(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-red-600/20 text-red-400 border border-red-500/30"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="p-3 border-t border-zinc-800">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-500/10 gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(238,79,39,0.06),transparent)] pointer-events-none -z-10" />
                <div className="fixed inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none -z-10" />
                <div className="relative py-8 px-6 lg:px-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
