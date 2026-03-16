import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Application {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    positionType: string;
    experienceYears: number;
    cdlNumber?: string | null;
    hasCleanRecord: boolean;
    resumeUrl?: string | null;
    status: string;
    createdAt: string;
}

export default function ApplicationsSection() {
    const [items, setItems] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Application | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { toast } = useToast();

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/admin/applications", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSaveStatus = async () => {
        if (!editing) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/applications/${editing.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: editing.status }),
                credentials: "include",
            });
            if (res.ok) {
                toast({ title: "Saved", description: "Status updated" });
                setEditing(null);
                fetchItems();
            } else {
                throw new Error("Failed");
            }
        } catch {
            toast({ title: "Error", description: "Failed to save", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/applications/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
            if (res.ok) {
                toast({ title: "Deleted", description: "Application deleted" });
                setDeleteTarget(null);
                fetchItems();
            } else {
                throw new Error("Failed");
            }
        } catch {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-zinc-50">Applications</h2>
                <p className="text-zinc-500 mt-1">Manage driver applications</p>
            </div>

            <Card className="bg-zinc-900/80 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-zinc-100">All applications</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Total {items.length} applications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <p className="text-zinc-500 py-12 text-center">No applications yet</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                    <TableHead className="text-zinc-400">Name</TableHead>
                                    <TableHead className="text-zinc-400">Email</TableHead>
                                    <TableHead className="text-zinc-400">Phone</TableHead>
                                    <TableHead className="text-zinc-400">Position</TableHead>
                                    <TableHead className="text-zinc-400">Status</TableHead>
                                    <TableHead className="text-zinc-400 w-[120px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="text-zinc-200 font-medium">{item.fullName}</TableCell>
                                        <TableCell className="text-zinc-400">{item.email}</TableCell>
                                        <TableCell className="text-zinc-400">{item.phone}</TableCell>
                                        <TableCell className="text-zinc-400">{item.positionType}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                item.status === "accepted" ? "bg-green-500/20 text-green-400" :
                                                item.status === "rejected" ? "bg-red-500/20 text-red-400" :
                                                "bg-amber-500/20 text-amber-400"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-zinc-400 hover:text-amber-400"
                                                    onClick={() => setEditing(item)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-zinc-400 hover:text-red-400"
                                                    onClick={() => setDeleteTarget(item)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <DialogHeader>
                        <DialogTitle>Edit</DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={editing.status}
                                    onValueChange={(v) => setEditing({ ...editing, status: v })}
                                >
                                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">pending</SelectItem>
                                        <SelectItem value="reviewed">reviewed</SelectItem>
                                        <SelectItem value="accepted">accepted</SelectItem>
                                        <SelectItem value="rejected">rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditing(null)} className="border-zinc-700">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveStatus} disabled={saving} className="bg-red-600 hover:bg-red-700">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm delete?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget?.fullName}'s application will be deleted. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
