import { useEffect, useState, useRef } from "react";
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
    DialogDescription,
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
import { Switch } from "@/components/ui/switch";
import { upload } from "@vercel/blob/client";
import { Plus, Pencil, Trash2, Loader2, ImageIcon, Link } from "lucide-react";

interface NewsItem {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    imageUrl?: string | null;
    published: boolean;
    createdAt: string;
}

const emptyNews: Omit<NewsItem, "id" | "createdAt"> = {
    title: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    published: false,
};

export default function NewsSection() {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<NewsItem | null>(null);
    const [adding, setAdding] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
    const [formData, setFormData] = useState(emptyNews);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [imageMode, setImageMode] = useState<"url" | "upload">("url");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/admin/news", { credentials: "include" });
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

    const openEdit = (item: NewsItem) => {
        setEditing(item);
        setFormData({
            title: item.title,
            content: item.content,
            excerpt: item.excerpt,
            imageUrl: item.imageUrl || "",
            published: item.published,
        });
        setImageMode(item.imageUrl?.startsWith("/uploads/") || item.imageUrl?.includes("blob.vercel-storage.com") ? "upload" : "url");
    };

    const openAdd = () => {
        setAdding(true);
        setFormData(emptyNews);
        setImageMode("url");
    };

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const pathname = `news/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            const blob = await upload(pathname, file, {
                access: "public",
                handleUploadUrl: "/api/admin/upload-url",
                multipart: file.size > 4.5 * 1024 * 1024,
            });
            if (blob?.url) {
                setFormData((p) => ({ ...p, imageUrl: blob.url }));
                setImageMode("upload");
                toast({ title: "Yuklandi", description: "Rasm muvaffaqiyatli yuklandi" });
            } else throw new Error("No URL returned");
        } catch {
            toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
        }
        e.target.value = "";
    };

    const handleSave = async () => {
        if (!formData.title || !formData.content || !formData.excerpt) {
            toast({ title: "Error", description: "Please fill in title, excerpt and content", variant: "destructive" });
            return;
        }
        setSaving(true);
        try {
            const body = { ...formData, imageUrl: formData.imageUrl || undefined };
            if (editing) {
                const res = await fetch(`/api/admin/news/${editing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    credentials: "include",
                });
                if (res.ok) {
                    toast({ title: "Saved", description: "News updated" });
                    setEditing(null);
                } else throw new Error("Failed");
            } else {
                const res = await fetch("/api/admin/news", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    credentials: "include",
                });
                if (res.ok) {
                    toast({ title: "Added", description: "New news added" });
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
            const res = await fetch(`/api/admin/news/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
            if (res.ok) {
                toast({ title: "Deleted", description: "News deleted" });
                setDeleteTarget(null);
                fetchItems();
            } else throw new Error("Failed");
        } catch {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        } finally {
            setDeleting(false);
        }
    };

    const getImageSrc = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        if (url.startsWith("/")) return url;
        return `https://${url}`;
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
                    <h2 className="text-2xl font-bold text-zinc-50">News</h2>
                    <p className="text-zinc-500 mt-1">Manage blog and news</p>
                </div>
                <Button onClick={openAdd} className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
            </div>

            <Card className="bg-zinc-900/80 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-zinc-100">All news</CardTitle>
                    <CardDescription className="text-zinc-400">Total {items.length}</CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <p className="text-zinc-500 py-12 text-center">No news yet</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                    <TableHead className="text-zinc-400">Title</TableHead>
                                    <TableHead className="text-zinc-400">Status</TableHead>
                                    <TableHead className="text-zinc-400 w-[120px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="text-zinc-200 font-medium">{item.title}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs ${item.published ? "bg-green-500/20 text-green-400" : "bg-zinc-600/20 text-zinc-400"}`}>
                                                {item.published ? "Published" : "Draft"}
                                            </span>
                                        </TableCell>
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
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-lg" >
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit" : "New news"}</DialogTitle>
                        <DialogDescription className="sr-only">Enter news details</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                                className="bg-zinc-800 border-zinc-700"
                                placeholder="News title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Excerpt</Label>
                            <Textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                                className="bg-zinc-800 border-zinc-700 min-h-[60px]"
                                placeholder="Short summary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Full text</Label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                                className="bg-zinc-800 border-zinc-700 min-h-[120px]"
                                placeholder="Full content"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Image</Label>
                            <div className="flex gap-2 mb-2">
                                <Button
                                    type="button"
                                    variant={imageMode === "url" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setImageMode("url")}
                                    className={imageMode === "url" ? "bg-red-600" : "border-zinc-700"}
                                >
                                    <Link className="w-4 h-4 mr-1" /> URL
                                </Button>
                                <Button
                                    type="button"
                                    variant={imageMode === "upload" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={imageMode === "upload" ? "bg-red-600" : "border-zinc-700"}
                                >
                                    <ImageIcon className="w-4 h-4 mr-1" /> Upload
                                </Button>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
                            {imageMode === "url" && (
                                <Input
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                                    className="bg-zinc-800 border-zinc-700"
                                    placeholder="https://..."
                                />
                            )}
                            {formData.imageUrl && (
                                <div className="mt-2">
                                    <p className="text-xs text-zinc-500 mb-1">Uploaded image:</p>
                                    <img
                                        key={formData.imageUrl}
                                        src={getImageSrc(formData.imageUrl)}
                                        alt="Preview"
                                        className="h-32 rounded object-cover border border-zinc-700 w-full"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={formData.published}
                                onCheckedChange={(v) => setFormData((p) => ({ ...p, published: v }))}
                            />
                            <Label>Publish</Label>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => { setEditing(null); setAdding(false); }} className="border-zinc-700">Cancel</Button>
                            <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                            </Button>
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
