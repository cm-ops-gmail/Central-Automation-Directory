"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Project, Category, ProjectsData } from "../types";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ExternalLink,
  Github,
  Play,
  BookOpen,
  Search,
  Tag,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  LogOut,
  Zap,
  Shield,
  Link as LinkIcon,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ListOrdered,
  CheckCircle2,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const EMPTY_PROJECT: Omit<Project, "id"> = {
  name: "",
  version: "",
  purpose: "",
  demoLink: "",
  githubLink: "",
  videoLink: "",
  guidelineLink: "",
  alternativeLink: "",
  categories: [],
};

// ── Input style ───────────────────────────────────────────────────────────

const inputCls =
  "w-full text-sm bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all";
const labelCls =
  "block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase";

// ── ProjectForm ───────────────────────────────────────────────────────────

function ProjectForm({
  initial,
  categories,
  onSave,
  onCancel,
}: {
  initial: Project | null;
  categories: Category[];
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<Project, "id">>(
    initial
      ? {
          name: initial.name,
          version: initial.version ?? "",
          purpose: initial.purpose ?? "",
          demoLink: initial.demoLink ?? "",
          githubLink: initial.githubLink ?? "",
          videoLink: initial.videoLink ?? "",
          guidelineLink: initial.guidelineLink ?? "",
          alternativeLink: initial.alternativeLink ?? "",
          categories: [...initial.categories],
        }
      : { ...EMPTY_PROJECT }
  );

  function set(field: keyof typeof form, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCat(id: string) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ id: initial?.id ?? generateId(), ...form });
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="admin-drawer relative ml-auto w-full max-w-2xl h-full bg-slate-950 border-l border-slate-800 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Shield size={15} className="text-indigo-400" />
            {initial ? "Edit Project" : "New Project"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className={labelCls}>Name <span className="text-red-400 normal-case">*</span></label>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Quiz Maker [Sheet to Slide]" required />
          </div>

          <div>
            <label className={labelCls}>Version</label>
            <input className={inputCls} value={form.version ?? ""} onChange={(e) => set("version", e.target.value)}
              placeholder="e.g. 2.0" />
          </div>

          <div>
            <label className={labelCls}>Purpose</label>
            <textarea className={inputCls + " resize-none"} rows={2} value={form.purpose ?? ""}
              onChange={(e) => set("purpose", e.target.value)} placeholder="What does this tool do?" />
          </div>

          {/* Links block */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Links</p>

            <div>
              <label className={labelCls}><ExternalLink size={10} className="inline mr-1 opacity-60" />Live Demo / Dashboard</label>
              <input className={inputCls} value={form.demoLink ?? ""} onChange={(e) => set("demoLink", e.target.value)}
                placeholder="https://..." type="url" />
            </div>
            <div>
              <label className={labelCls}><Github size={10} className="inline mr-1 opacity-60" />GitHub / Code</label>
              <input className={inputCls} value={form.githubLink ?? ""} onChange={(e) => set("githubLink", e.target.value)}
                placeholder="https://github.com/..." type="url" />
            </div>
            <div>
              <label className={labelCls}><Play size={10} className="inline mr-1 opacity-60" />Video Tutorial</label>
              <input className={inputCls} value={form.videoLink ?? ""} onChange={(e) => set("videoLink", e.target.value)}
                placeholder="https://drive.google.com/..." type="url" />
            </div>
            <div>
              <label className={labelCls}><BookOpen size={10} className="inline mr-1 opacity-60" />Guideline / Docs</label>
              <input className={inputCls} value={form.guidelineLink ?? ""} onChange={(e) => set("guidelineLink", e.target.value)}
                placeholder="https://notion.so/..." type="url" />
            </div>
            <div>
              <label className={labelCls}><LinkIcon size={10} className="inline mr-1 opacity-60" />Alternative Link</label>
              <input className={inputCls} value={form.alternativeLink ?? ""} onChange={(e) => set("alternativeLink", e.target.value)}
                placeholder="https://..." type="url" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className={labelCls}><Tag size={10} className="inline mr-1 opacity-60" />Assign Teams</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => {
                const active = form.categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCat(cat.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                    style={
                      active
                        ? { backgroundColor: cat.color, color: "#fff", borderColor: cat.color }
                        : {
                            backgroundColor: cat.color + "18",
                            color: cat.color,
                            borderColor: cat.color + "40",
                          }
                    }
                  >
                    {active ? "✓ " : ""}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit}
            className="px-5 py-2 text-sm font-bold text-white rounded-xl flex items-center gap-2 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <Save size={13} />
            {initial ? "Save Changes" : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CategoryForm ──────────────────────────────────────────────────────────

function CategoryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Category | null;
  onSave: (c: Category) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? "#6366f1");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ id: initial?.id ?? name.toLowerCase().replace(/\s+/g, "-"), name, color });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-sm p-7 space-y-5"
        style={{ boxShadow: "0 0 40px rgba(99,102,241,0.15)" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white">{initial ? "Edit Category" : "New Category"}</h2>
          <button onClick={onCancel} className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
            <X size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Category Name</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CDT Team" required autoFocus />
          </div>
          <div>
            <label className={labelCls}>Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                className="h-10 w-16 rounded-xl border border-slate-700 cursor-pointer bg-slate-900 p-1" />
              <span
                className="text-xs px-3 py-1.5 rounded-full font-bold text-white"
                style={{ backgroundColor: color }}>
                {name || "Preview"}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel}
              className="px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2 text-sm font-bold text-white rounded-xl flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Save size={13} />
              {initial ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Admin Page ────────────────────────────────────────────────────────────

type Tab = "projects" | "categories" | "order";

// ── OrderTab ──────────────────────────────────────────────────────────────

function OrderTab({ data, onOrderSaved }: { data: ProjectsData; onOrderSaved: () => void }) {
  // Local copy of order so changes are instant
  const [order, setOrder] = useState<Record<string, string[]>>(
    () => JSON.parse(JSON.stringify(data.categoryOrder ?? {}))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragInfo, setDragInfo] = useState<{ catId: string; idx: number } | null>(null);
  const [dragOver, setDragOver] = useState<{ catId: string; idx: number } | null>(null);

  // Keep local order in sync when data reloads (e.g. after project add/edit)
  useEffect(() => {
    setOrder(JSON.parse(JSON.stringify(data.categoryOrder ?? {})));
  }, [data.categoryOrder]);

  async function persist(newOrder: Record<string, string[]>) {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryOrder: newOrder }),
      });
      setSaved(true);
      onOrderSaved();
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  // Returns the full display list for a category (order + any unlisted projects)
  function getMerged(catId: string): string[] {
    const catOrderIds = order[catId] ?? [];
    const allCatIds = data.projects
      .filter((p) => p.categories.includes(catId))
      .map((p) => p.id);
    return [
      ...catOrderIds.filter((id) => allCatIds.includes(id)),
      ...allCatIds.filter((id) => !catOrderIds.includes(id)),
    ];
  }

  function moveItem(catId: string, fromIdx: number, toIdx: number) {
    // Use the same merged list as the UI so indices always match
    const mergedList = getMerged(catId);
    if (toIdx < 0 || toIdx >= mergedList.length) return;
    const arr = [...mergedList];
    const [item] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, item);
    const newOrder = { ...order, [catId]: arr };
    setOrder(newOrder);
    persist(newOrder);
  }

  function handleDragStart(catId: string, idx: number) {
    setDragInfo({ catId, idx });
  }

  function handleDragOver(e: React.DragEvent, catId: string, idx: number) {
    e.preventDefault();
    if (dragInfo?.catId !== catId) return;
    setDragOver({ catId, idx });
  }

  function handleDrop(catId: string, toIdx: number) {
    if (!dragInfo || dragInfo.catId !== catId) return;
    moveItem(catId, dragInfo.idx, toIdx);
    setDragInfo(null);
    setDragOver(null);
  }

  function handleDragEnd() {
    setDragInfo(null);
    setDragOver(null);
  }

  const projectMap = new Map(data.projects.map((p) => [p.id, p]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "15px", margin: 0 }}>
            Card Order per Team
          </h2>
          <p style={{ color: "#475569", fontSize: "12px", marginTop: "4px" }}>
            Drag rows or use the arrows to set which tool shows first in each team section.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {saving && (
            <span style={{ fontSize: "12px", color: "#6366f1", fontStyle: "italic" }}>Saving…</span>
          )}
          {saved && (
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#10b981" }}>
              <CheckCircle2 size={13} /> Saved
            </span>
          )}
        </div>
      </div>

      {data.categories.map((cat) => {
        const merged = getMerged(cat.id);

        const r = parseInt(cat.color.slice(1, 3), 16);
        const g = parseInt(cat.color.slice(3, 5), 16);
        const b = parseInt(cat.color.slice(5, 7), 16);

        return (
          <div key={cat.id}>
            {/* Category header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  backgroundColor: `rgba(${r},${g},${b},0.12)`,
                  border: `1px solid rgba(${r},${g},${b},0.3)`,
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "999px",
                    backgroundColor: cat.color,
                  }}
                />
                <span style={{ fontWeight: 800, fontSize: "13px", color: cat.color }}>
                  {cat.name}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: `linear-gradient(90deg, rgba(${r},${g},${b},0.3) 0%, transparent 100%)`,
                }}
              />
              <span style={{ fontSize: "11px", color: "#475569" }}>
                {merged.length} tools
              </span>
            </div>

            {/* Draggable list */}
            <div
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #1f2937",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              {merged.length === 0 && (
                <div style={{ padding: "20px 16px", color: "#374151", fontSize: "13px", textAlign: "center" }}>
                  No projects in this category
                </div>
              )}
              {merged.map((id, idx) => {
                const project = projectMap.get(id);
                if (!project) return null;
                const isDragging = dragInfo?.catId === cat.id && dragInfo?.idx === idx;
                const isOver = dragOver?.catId === cat.id && dragOver?.idx === idx;

                return (
                  <div
                    key={id}
                    draggable
                    onDragStart={() => handleDragStart(cat.id, idx)}
                    onDragOver={(e) => handleDragOver(e, cat.id, idx)}
                    onDrop={() => handleDrop(cat.id, idx)}
                    onDragEnd={handleDragEnd}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      borderBottom: idx < merged.length - 1 ? "1px solid #1a2535" : "none",
                      cursor: "grab",
                      backgroundColor: isDragging
                        ? "#1a2535"
                        : isOver
                        ? `rgba(${r},${g},${b},0.08)`
                        : "transparent",
                      borderLeft: isOver
                        ? `3px solid ${cat.color}`
                        : "3px solid transparent",
                      opacity: isDragging ? 0.5 : 1,
                      transition: "background-color 0.15s, border-color 0.15s",
                      userSelect: "none",
                    }}
                  >
                    {/* Grip handle */}
                    <GripVertical size={15} style={{ color: "#374151", flexShrink: 0 }} />

                    {/* Position number */}
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        fontFamily: "monospace",
                        color: "#374151",
                        width: "20px",
                        flexShrink: 0,
                        textAlign: "right",
                      }}
                    >
                      {idx + 1}
                    </span>

                    {/* Project name */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#cbd5e1",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.name}
                    </span>

                    {/* Up / Down arrows */}
                    <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                      <button
                        onClick={() => moveItem(cat.id, idx, idx - 1)}
                        disabled={idx === 0}
                        title="Move up"
                        style={{
                          padding: "5px",
                          borderRadius: "7px",
                          border: "none",
                          backgroundColor: idx === 0 ? "transparent" : "#1f2937",
                          color: idx === 0 ? "#1f2937" : "#94a3b8",
                          cursor: idx === 0 ? "default" : "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => moveItem(cat.id, idx, idx + 1)}
                        disabled={idx === merged.length - 1}
                        title="Move down"
                        style={{
                          padding: "5px",
                          borderRadius: "7px",
                          border: "none",
                          backgroundColor: idx === merged.length - 1 ? "transparent" : "#1f2937",
                          color: idx === merged.length - 1 ? "#1f2937" : "#94a3b8",
                          cursor: idx === merged.length - 1 ? "default" : "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<ProjectsData | null>(null);
  const [tab, setTab] = useState<Tab>("projects");
  const [search, setSearch] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null | "new">(null);
  const [editingCategory, setEditingCategory] = useState<Category | null | "new">(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    if (localStorage.getItem("hub_admin") !== "1") {
      router.replace("/admin/login");
    } else {
      setAuthed(true);
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("hub_admin");
    router.push("/admin/login");
  }

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      setData(json);
    } catch {
      setError("Failed to load data");
    }
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  async function saveProject(project: Project) {
    setSaving(true);
    try {
      const isNew = editingProject === "new";
      const res = await fetch(isNew ? "/api/projects" : `/api/projects/${project.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error();
      await loadData();
      setEditingProject(null);
    } catch {
      setError("Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id: string) {
    setSaving(true);
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      await loadData();
      setDeletingId(null);
    } catch {
      setError("Failed to delete");
    } finally {
      setSaving(false);
    }
  }

  async function saveCategory(cat: Category) {
    setSaving(true);
    try {
      const isNew = editingCategory === "new";
      await fetch(isNew ? "/api/categories" : `/api/categories/${cat.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      await loadData();
      setEditingCategory(null);
    } catch {
      setError("Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(id: string) {
    setSaving(true);
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      await loadData();
    } catch {
      setError("Failed to delete category");
    } finally {
      setSaving(false);
    }
  }

  const filteredProjects = (data?.projects ?? []).filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.purpose ?? "").toLowerCase().includes(q)
    );
  });

  if (!authed || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "#030712" }}>
        <div className="text-slate-600 text-sm animate-pulse font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #030712 0%, #0a0f1e 50%, #030712 100%)" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link href="/"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white border border-slate-800 hover:border-slate-600 bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-xl transition-all">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" style={{ width: "28px", height: "28px", borderRadius: "7px", objectFit: "contain" }} />
              <h1 className="font-extrabold text-white text-sm">Admin Panel</h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-xs text-indigo-400 animate-pulse font-mono">Saving...</span>
            )}
            <button onClick={logout}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-800/50 bg-slate-900 hover:bg-red-950/30 px-3 py-2 rounded-xl transition-all">
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
        <div className="nav-glow-line" />
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-950/50 border border-red-800/40 text-red-400 text-sm px-4 py-3 rounded-2xl">
            <AlertCircle size={14} /> {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-400">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-900/80 border border-slate-800 p-1 rounded-2xl w-fit">
          {([
            { id: "projects", label: "Projects", icon: <Layers size={14} />, count: data.projects.length },
            { id: "categories", label: "Categories", icon: <Tag size={14} />, count: data.categories.length },
            { id: "order", label: "Order", icon: <ListOrdered size={14} />, count: null },
          ] as { id: Tab; label: string; icon: React.ReactNode; count: number | null }[]).map(({ id, label, icon, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                tab === id ? "text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              }`}
              style={tab === id ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : {}}>
              {icon}
              {label}
              {count !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? "bg-white/20" : "bg-slate-800 text-slate-500"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── PROJECTS TAB ── */}
        {tab === "projects" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input type="text" placeholder="Search projects..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />
              </div>
              <button onClick={() => setEditingProject("new")}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shrink-0 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <Plus size={14} /> Add Project
              </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80">
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Project</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">Teams</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Links</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, i) => {
                    const cats = data.categories.filter((c) => project.categories.includes(c.id));
                    const isExpanded = expandedId === project.id;
                    return (
                      <>
                        <tr key={project.id}
                          className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${i % 2 === 1 ? "bg-slate-900/30" : ""}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <button onClick={() => setExpandedId(isExpanded ? null : project.id)}
                                className="mt-0.5 text-slate-600 hover:text-slate-400 transition-colors">
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                              <div>
                                <p className="font-semibold text-slate-200 text-sm">{project.name}</p>
                                {project.version && (
                                  <span className="text-[10px] text-slate-600 font-mono">v{project.version}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {cats.length === 0 ? (
                                <span className="text-xs text-slate-700 italic">None</span>
                              ) : cats.map((cat) => (
                                <span key={cat.id}
                                  className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                  style={{ backgroundColor: cat.color + "20", color: cat.color, border: `1px solid ${cat.color}30` }}>
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex gap-2">
                              {project.demoLink && <a href={project.demoLink} target="_blank" rel="noopener noreferrer"
                                className="text-emerald-500 hover:text-emerald-300 transition-colors" title="Live Demo"><ExternalLink size={13} /></a>}
                              {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white transition-colors" title="GitHub"><Github size={13} /></a>}
                              {project.videoLink && <a href={project.videoLink} target="_blank" rel="noopener noreferrer"
                                className="text-red-400 hover:text-red-300 transition-colors" title="Video"><Play size={13} /></a>}
                              {project.guidelineLink && <a href={project.guidelineLink} target="_blank" rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors" title="Docs"><BookOpen size={13} /></a>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-end">
                              <button onClick={() => setEditingProject(project)}
                                className="p-2 rounded-xl text-slate-600 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" title="Edit">
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => setDeletingId(project.id)}
                                className="p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={project.id + "-exp"} className="bg-indigo-950/20 border-b border-slate-800/50">
                            <td colSpan={5} className="px-10 py-3">
                              <div className="text-xs text-slate-500 space-y-1.5">
                                {project.purpose && <p><span className="text-slate-400 font-semibold">Purpose: </span>{project.purpose}</p>}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-14 text-slate-700 text-sm">
                        No projects found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {tab === "categories" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setEditingCategory("new")}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <Plus size={14} /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.categories.map((cat) => {
                const count = data.projects.filter((p) => p.categories.includes(cat.id)).length;
                const r = parseInt(cat.color.slice(1, 3), 16);
                const g = parseInt(cat.color.slice(3, 5), 16);
                const b = parseInt(cat.color.slice(5, 7), 16);
                return (
                  <div key={cat.id}
                    className="rounded-2xl border bg-slate-900/60 backdrop-blur-sm p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
                    style={{ borderColor: `rgba(${r},${g},${b},0.25)`, boxShadow: `0 0 20px rgba(${r},${g},${b},0.05)` }}>
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white shrink-0"
                      style={{ backgroundColor: cat.color, boxShadow: `0 0 20px rgba(${r},${g},${b},0.4)` }}>
                      {cat.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{cat.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{count} project{count !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingCategory(cat)}
                        className="p-2 rounded-xl text-slate-600 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => deleteCategory(cat.id)}
                        className="p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ORDER TAB ── */}
        {tab === "order" && (
          <OrderTab data={data} onOrderSaved={loadData} />
        )}
      </main>

      {/* Delete confirm */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeletingId(null)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-7 w-full max-w-sm text-center space-y-5"
            style={{ boxShadow: "0 0 40px rgba(239,68,68,0.15)" }}>
            <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-800/30 flex items-center justify-center mx-auto">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Delete Project?</h3>
              <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold border border-slate-700 text-slate-400 hover:bg-slate-800 rounded-xl transition-all">
                Cancel
              </button>
              <button onClick={() => deleteProject(deletingId)}
                className="flex-1 px-4 py-2.5 text-sm font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project form */}
      {editingProject !== null && (
        <ProjectForm
          initial={editingProject === "new" ? null : editingProject}
          categories={data.categories}
          onSave={saveProject}
          onCancel={() => setEditingProject(null)}
        />
      )}

      {/* Category form */}
      {editingCategory !== null && (
        <CategoryForm
          initial={editingCategory === "new" ? null : editingCategory}
          onSave={saveCategory}
          onCancel={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}
