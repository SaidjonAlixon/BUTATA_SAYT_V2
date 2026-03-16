import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface Job {
    id: number;
    title: string;
    description: string;
    type: string;
    location: string;
    createdAt: string;
}

const emptyJob: Omit<Job, "id" | "createdAt"> = {
    title: "",
    description: "",
    type: "Full-time",
    location: "",
};

export default function JobsSection() {
    const [items, setItems] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Job | null>(null);
    const [adding, setAdding] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
    const [formData, setFormData] = useState(emptyJob);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { toast } = useToast();

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/admin/jobs", { credentials: "include" });
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

    const openEdit = (job: Job) => {
        setEditing(job);
        setFormData({
            title: job.title,
            description: job.description,
            type: job.type,
            location: job.location,
        });
    };

    const openAdd = () => {
        setAdding(true);
        setFormData(emptyJob);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.description || !formData.location) {
            toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
            return;
        }
        setSaving(true);
        try {
            const body = { ...formData };
            if (editing) {
                const res = await fetch(`/api/admin/jobs/${editing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    credentials: "include",
                });
                if (res.ok) {
                    toast({ title: "Saved", description: "Job updated" });
                    setEditing(null);
                } else throw new Error("Failed");
            } else {
                const res = await fetch("/api/admin/jobs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    credentials: "include",
                });
                if (res.ok) {
                    toast({ title: "Added", description: "New job posted" });
                    setAdding(false);
                } else throw new Error("Failed");
            }
            fetchItems();
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
            const res = await fetch(`/api/admin/jobs/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
            if (res.ok) {
                toast({ title: "Deleted", description: "Job deleted" });
                setDeleteTarget(null);
                fetchItems();
            } else throw new Error("Failed");
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
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-50">Job Openings</h2>
                    <p className="text-zinc-500 mt-1">Manage job vacancies</p>
                </div>
                <Button onClick={openAdd} className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
            </div>

            <Card className="bg-zinc-900/80 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-zinc-100">All job openings</CardTitle>
                    <CardDescription className="text-zinc-400">Total {items.length}</CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <p className="text-zinc-500 py-12 text-center">No job openings yet</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                    <TableHead className="text-zinc-400">Title</TableHead>
                                    <TableHead className="text-zinc-400">Type</TableHead>
                                    <TableHead className="text-zinc-400">Location</TableHead>
                                    <TableHead className="text-zinc-400 w-[120px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="text-zinc-200 font-medium">{item.title}</TableCell>
                                        <TableCell className="text-zinc-400">{item.type}</TableCell>
                                        <TableCell className="text-zinc-400">{item.location}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-amber-400" onClick={() => openEdit(item)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-red-400" onClick={() => setDeleteTarget(item)}>
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

            <Dialog open={!!editing || adding} onOpenChange={(o) => { if (!o) { setEditing(null); setAdding(false); } }}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit" : "New job opening"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="bg-zinc-800 border-zinc-700" placeholder="Job title" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} className="bg-zinc-800 border-zinc-700 min-h-[100px]" placeholder="Description" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={formData.type} onValueChange={(v) => setFormData((p) => ({ ...p, type: v }))}>
                                    <SelectTrigger className="bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Temporary">Temporary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} className="bg-zinc-800 border-zinc-700" placeholder="Location" />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => { setEditing(null); setAdding(false); }} className="border-zinc-700">Cancel</Button>
                            <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm delete?</AlertDialogTitle>
                        <AlertDialogDescription>{deleteTarget?.title} will be deleted.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
