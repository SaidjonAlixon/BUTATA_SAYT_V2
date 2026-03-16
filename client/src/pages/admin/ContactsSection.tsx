import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

interface Contact {
    id: number;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

export default function ContactsSection() {
    const [items, setItems] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
    const [deleting, setDeleting] = useState(false);
    const { toast } = useToast();

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/admin/contacts", { credentials: "include" });
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

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/contacts/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
            if (res.ok) {
                toast({ title: "Deleted", description: "Message deleted" });
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
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-zinc-50">Messages</h2>
                <p className="text-zinc-500 mt-1">Contact form messages</p>
            </div>

            <Card className="bg-zinc-900/80 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-zinc-100">All messages</CardTitle>
                    <CardDescription className="text-zinc-400">Total {items.length}</CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <p className="text-zinc-500 py-12 text-center">No messages yet</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                    <TableHead className="text-zinc-400">Name</TableHead>
                                    <TableHead className="text-zinc-400">Email</TableHead>
                                    <TableHead className="text-zinc-400">Message</TableHead>
                                    <TableHead className="text-zinc-400">Date</TableHead>
                                    <TableHead className="text-zinc-400 w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="text-zinc-200 font-medium">{item.name}</TableCell>
                                        <TableCell className="text-zinc-400">{item.email}</TableCell>
                                        <TableCell className="text-zinc-400 max-w-[300px] truncate">{item.message}</TableCell>
                                        <TableCell className="text-zinc-500 text-sm">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-zinc-400 hover:text-red-400"
                                                onClick={() => setDeleteTarget(item)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm delete?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget?.name}'s message will be deleted.
                        </AlertDialogDescription>
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
