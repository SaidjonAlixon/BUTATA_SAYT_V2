import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    MessageSquare,
    Newspaper,
    Loader2,
    ArrowUpRight,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface DashboardStats {
    applications: number;
    jobs: number;
    messages: number;
    news?: number;
}

const statCards = [
    {
        title: "Applications",
        path: "/admin/applications",
        icon: FileText,
        gradient: "from-amber-500/20 to-orange-600/10",
        borderColor: "border-amber-500/30",
        iconColor: "text-amber-500",
    },
    {
        title: "Job Openings",
        path: "/admin/jobs",
        icon: Briefcase,
        gradient: "from-emerald-500/20 to-green-600/10",
        borderColor: "border-emerald-500/30",
        iconColor: "text-emerald-500",
    },
    {
        title: "Messages",
        path: "/admin/contacts",
        icon: MessageSquare,
        gradient: "from-blue-500/20 to-cyan-600/10",
        borderColor: "border-blue-500/30",
        iconColor: "text-blue-500",
    },
    {
        title: "News",
        path: "/admin/news",
        icon: Newspaper,
        gradient: "from-violet-500/20 to-purple-600/10",
        borderColor: "border-violet-500/30",
        iconColor: "text-violet-500",
    },
];

function DashboardContent() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetch("/api/admin/stats", { credentials: "include" });
                if (res.status === 401) {
                    setLocation("/admin/login");
                    return;
                }
                if (!res.ok) throw new Error("Failed to load dashboard");
                const data = await res.json();
                setStats(data.stats);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load dashboard data",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [setLocation, toast]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            </div>
        );
    }

    const values = {
        applications: stats?.applications ?? 0,
        jobs: stats?.jobs ?? 0,
        messages: stats?.messages ?? 0,
        news: stats?.news ?? 0,
    };

    return (
        <>
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-zinc-50 tracking-tight">Statistics</h2>
                <p className="text-zinc-500 mt-1">Monitor all your data in one place</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const value = values[stat.title === "Applications" ? "applications" : stat.title === "Job Openings" ? "jobs" : stat.title === "Messages" ? "messages" : "news"];
                    return (
                        <Card
                            key={stat.title}
                            className={`bg-zinc-900/80 border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-zinc-700 transition-all duration-300 cursor-pointer ${stat.borderColor}`}
                            onClick={() => setLocation(stat.path)}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} ${stat.iconColor}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between">
                                    <span className="text-4xl font-bold text-zinc-50 tabular-nums">{value}</span>
                                    <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="mt-8 bg-zinc-900/50 border-zinc-800/80 border-dashed">
                <CardHeader>
                    <CardTitle className="text-zinc-400 font-medium">Navigate to sections</CardTitle>
                    <p className="text-zinc-500 text-sm">
                        Click the cards above - each section allows editing, deleting, adding and saving.
                    </p>
                </CardHeader>
            </Card>
        </>
    );
}

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <DashboardContent />
        </AdminLayout>
    );
}
