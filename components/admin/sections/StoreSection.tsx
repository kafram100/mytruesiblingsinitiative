"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { Loader2, Plus, Trash2, Package, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  price: number;
  compare_price: number | null;
  description: string | null;
  image_url: string | null;
  category: string;
  is_active: number;
  created_at: string;
}

export default function StoreSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", price: "", description: "", imageUrl: "", category: "general" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) setProducts(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/products/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Upload failed");
        return;
      }
      const data = await res.json();
      setForm((p) => ({ ...p, imageUrl: data.imageUrl }));
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          price: parseFloat(form.price) || 0,
          description: form.description || null,
          imageUrl: form.imageUrl || null,
          category: form.category,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create");
      } else {
        setShowForm(false);
        setForm({ title: "", price: "", description: "", imageUrl: "", category: "general" });
        load();
      }
    } catch {
      setError("Network error");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Store Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-full">
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "Add Product"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Price *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Product Image</label>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()} className="rounded-full">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span className="ml-1">{uploading ? "Uploading..." : "Choose File"}</span>
                </Button>
                {form.imageUrl && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))} className="text-red-600 hover:bg-red-50 rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {form.imageUrl && (
                <div className="mt-2 relative inline-block">
                  <img src={form.imageUrl} alt="Preview" className="h-24 w-24 rounded-xl object-cover border border-border" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
                <option value="general">General</option>
                <option value="apparel">Apparel</option>
                <option value="wellness">Wellness</option>
                <option value="journals">Journals</option>
                <option value="accessories">Accessories</option>
                <option value="gifts">Gifts</option>
              </select>
            </div>
          </div>
          <Button type="submit" disabled={saving} className="rounded-full">
            {saving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : "Add Product"}
          </Button>
        </form>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold">Title</th>
                <th className="text-left px-4 py-3 font-semibold">Price</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="text-red-600 hover:bg-red-50">
                      {deleting === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    </Button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground"><Package className="h-8 w-8 mx-auto mb-2 opacity-40" />No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
