"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProjectsData, Project, Category } from "./types";
import {
  ExternalLink,
  Github,
  Play,
  BookOpen,
  Search,
  Settings,
  ChevronRight,
  ChevronDown,
  Link as LinkIcon,
  Check,
} from "lucide-react";

function isUrl(val: string | null | undefined): val is string {
  return (
    typeof val === "string" &&
    (val.startsWith("http://") || val.startsWith("https://"))
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ── Link button ───────────────────────────────────────────────────────────

function LinkButton({
  href,
  icon,
  label,
  color,
}: {
  href: string | null | undefined;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  if (!isUrl(href)) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-btn inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all"
      style={{
        backgroundColor: color + "20",
        color: color,
        borderColor: color + "40",
      }}
    >
      {icon}
      {label}
    </a>
  );
}

// ── Project card ──────────────────────────────────────────────────────────

function ProjectCard({
  project,
  categories,
  index,
}: {
  project: Project;
  categories: Category[];
  index: number;
}) {
  const projectCats = categories.filter((c) =>
    project.categories.includes(c.id)
  );
  const primaryColor = projectCats[0]?.color ?? "#6366f1";
  const rgb = hexToRgb(primaryColor);

  return (
    <div
      className="hub-card flex flex-col rounded-2xl border overflow-hidden"
      style={
        {
          backgroundColor: "#111827",
          borderColor: "#1f2937",
          "--glow": `rgba(${rgb},0.45)`,
          animationDelay: `${index * 55}ms`,
        } as React.CSSProperties
      }
    >
      {/* Top accent bar */}
      <div
        style={{
          height: "3px",
          background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
        }}
      />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Name + version */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-white text-sm leading-snug">
            {project.name}
          </h3>
          {project.version && (
            <span
              className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "#1f2937",
                color: "#94a3b8",
                border: "1px solid #374151",
              }}
            >
              v{project.version}
            </span>
          )}
        </div>

        {/* Purpose */}
        {project.purpose && (
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#94a3b8" }}>
            {project.purpose}
          </p>
        )}

        {/* Category tags */}
        {projectCats.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {projectCats.map((cat) => {
              const catRgb = hexToRgb(cat.color);
              return (
                <span
                  key={cat.id}
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: `rgba(${catRgb},0.15)`,
                    color: cat.color,
                    border: `1px solid rgba(${catRgb},0.3)`,
                  }}
                >
                  {cat.name}
                </span>
              );
            })}
          </div>
        )}

        {/* Push links to bottom */}
        <div className="flex-1" />

        {/* Link buttons */}
        <div
          className="flex flex-wrap gap-1.5 pt-3"
          style={{ borderTop: "1px solid #1f2937" }}
        >
          <LinkButton href={project.demoLink} icon={<ExternalLink size={10} />} label="Live Demo" color="#10b981" />
          <LinkButton href={project.githubLink} icon={<Github size={10} />} label="GitHub" color="#94a3b8" />
          <LinkButton href={project.videoLink} icon={<Play size={10} />} label="Video" color="#ef4444" />
          <LinkButton href={project.guidelineLink} icon={<BookOpen size={10} />} label="Docs" color="#3b82f6" />
          <LinkButton href={project.alternativeLink} icon={<LinkIcon size={10} />} label="Alt Link" color="#a855f7" />
        </div>
      </div>
    </div>
  );
}

// ── Filter bar with searchable dropdown ──────────────────────────────────

function FilterBar({
  categories,
  projects,
  activeCategory,
  setActiveCategory,
  search,
  setSearch,
  filteredCount,
}: {
  categories: Category[];
  projects: Project[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  search: string;
  setSearch: (s: string) => void;
  filteredCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [ddSearch, setDdSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setDdSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeCat = categories.find((c) => c.id === activeCategory);

  const filteredCats = ddSearch.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(ddSearch.toLowerCase()))
    : categories;

  function select(id: string) {
    setActiveCategory(id);
    setOpen(false);
    setDdSearch("");
  }

  return (
    <div
      style={{
        position: "sticky",
        top: "140px",
        zIndex: 40,
        backgroundColor: "#040b16",
        borderBottom: "1px solid #1a2535",
        padding: "12px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        {/* Left: dropdown + count */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Searchable dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => { setOpen((o) => !o); setDdSearch(""); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                border: "1px solid",
                cursor: "pointer",
                transition: "all 0.2s",
                minWidth: "190px",
                backgroundColor: activeCat ? activeCat.color + "18" : "#1f2937",
                borderColor: activeCat ? activeCat.color + "50" : "#374151",
                color: activeCat ? activeCat.color : "#94a3b8",
              }}
            >
              {activeCat && (
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: activeCat.color,
                    flexShrink: 0,
                  }}
                />
              )}
              <span style={{ flex: 1, textAlign: "left" }}>
                {activeCat ? activeCat.name : "All Teams"}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  backgroundColor: activeCat ? activeCat.color + "30" : "#374151",
                  padding: "1px 6px",
                  borderRadius: "999px",
                  color: activeCat ? activeCat.color : "#64748b",
                }}
              >
                {activeCat
                  ? projects.filter((p) => p.categories.includes(activeCat.id)).length
                  : projects.length}
              </span>
              <ChevronDown
                size={13}
                style={{
                  transition: "transform 0.2s",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  flexShrink: 0,
                  color: activeCat ? activeCat.color : "#64748b",
                }}
              />
            </button>

            {open && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  minWidth: "230px",
                  backgroundColor: "#0f172a",
                  border: "1px solid #1f2937",
                  borderRadius: "14px",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                {/* Search inside dropdown */}
                <div
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid #1a2535",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Search
                      size={11}
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#475569",
                      }}
                    />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search teams..."
                      value={ddSearch}
                      onChange={(e) => setDdSearch(e.target.value)}
                      style={{
                        width: "100%",
                        paddingLeft: "28px",
                        paddingRight: "8px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        fontSize: "12px",
                        backgroundColor: "#0a0f1e",
                        border: "1px solid #1f2937",
                        borderRadius: "8px",
                        color: "#cbd5e1",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Options */}
                <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                  {/* All option */}
                  {(!ddSearch.trim()) && (
                    <button
                      onClick={() => select("all")}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 14px",
                        fontSize: "13px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: activeCategory === "all" ? "rgba(99,102,241,0.12)" : "transparent",
                        color: activeCategory === "all" ? "#818cf8" : "#94a3b8",
                        textAlign: "left",
                        borderBottom: "1px solid #1a2535",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => { if (activeCategory !== "all") (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a2535"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = activeCategory === "all" ? "rgba(99,102,241,0.12)" : "transparent"; }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#6366f1",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ flex: 1 }}>All Teams</span>
                      <span
                        style={{
                          fontSize: "10px",
                          backgroundColor: "rgba(99,102,241,0.2)",
                          color: "#818cf8",
                          padding: "1px 6px",
                          borderRadius: "999px",
                        }}
                      >
                        {projects.length}
                      </span>
                      {activeCategory === "all" && <Check size={12} style={{ color: "#818cf8", flexShrink: 0 }} />}
                    </button>
                  )}

                  {filteredCats.map((cat) => {
                    const count = projects.filter((p) => p.categories.includes(cat.id)).length;
                    const isActive = activeCategory === cat.id;
                    const rgb = hexToRgb(cat.color);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => select(cat.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 14px",
                          fontSize: "13px",
                          fontWeight: 600,
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: isActive ? `rgba(${rgb},0.12)` : "transparent",
                          color: isActive ? cat.color : "#94a3b8",
                          textAlign: "left",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a2535"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = isActive ? `rgba(${rgb},0.12)` : "transparent"; }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: cat.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ flex: 1 }}>{cat.name}</span>
                        <span
                          style={{
                            fontSize: "10px",
                            backgroundColor: `rgba(${rgb},0.2)`,
                            color: cat.color,
                            padding: "1px 6px",
                            borderRadius: "999px",
                          }}
                        >
                          {count}
                        </span>
                        {isActive && <Check size={12} style={{ color: cat.color, flexShrink: 0 }} />}
                      </button>
                    );
                  })}

                  {filteredCats.length === 0 && (
                    <div style={{ padding: "16px 14px", fontSize: "12px", color: "#374151", textAlign: "center" }}>
                      No teams found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <span style={{ fontSize: "12px", color: "#334155" }}>
            {filteredCount} tool{filteredCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Right: search */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Search
            size={12}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#475569",
            }}
          />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              paddingLeft: "32px",
              paddingRight: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "12px",
              backgroundColor: "#0f172a",
              border: "1px solid #1f2937",
              borderRadius: "10px",
              color: "#cbd5e1",
              outline: "none",
              width: "220px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────

export default function Dashboard({
  initialData,
}: {
  initialData: ProjectsData;
}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const viewer = localStorage.getItem("hub_viewer") === "1";
    const admin = localStorage.getItem("hub_admin") === "1";
    if (viewer || admin) {
      setAuthed(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  // All hooks must run before any conditional return
  const filteredProjects = useMemo(() => {
    if (!authed) return [];
    let list = initialData.projects;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.categories.includes(activeCategory));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.purpose ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [authed, initialData, activeCategory, search]);

  const visibleCategories = useMemo(() => {
    if (activeCategory !== "all") {
      return initialData.categories.filter((c) => c.id === activeCategory);
    }
    return initialData.categories.filter((cat) =>
      filteredProjects.some((p) => p.categories.includes(cat.id))
    );
  }, [initialData, activeCategory, filteredProjects]);

  const uncategorised = useMemo(
    () => filteredProjects.filter((p) => p.categories.length === 0),
    [filteredProjects]
  );

  if (!authed) return null;

  function orderedForCategory(catId: string, projects: Project[]): Project[] {
    const order = initialData.categoryOrder?.[catId];
    if (!order || order.length === 0) return projects;
    const indexed = new Map(order.map((id, i) => [id, i]));
    return [...projects].sort(
      (a, b) =>
        (indexed.get(a.id) ?? 9999) - (indexed.get(b.id) ?? 9999)
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#030712" }}>
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "#050d1a",
          borderBottom: "1px solid #1f2937",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: "128px",
                height: "128px",
                borderRadius: "10px",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            <div style={{ fontWeight: 800, color: "white", fontSize: "15px", lineHeight: 1 }}>
              Central Automation Hub
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: "#475569" }}>
              {filteredProjects.length} tools
            </span>
            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#94a3b8",
                border: "1px solid #1f2937",
                backgroundColor: "#0f172a",
                padding: "7px 14px",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              <Settings size={12} />
              Admin
              <ChevronRight size={11} style={{ opacity: 0.5 }} />
            </Link>
          </div>
        </div>
        {/* glow line */}
        <div className="nav-glow-line" />
      </nav>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <FilterBar
        categories={initialData.categories}
        projects={initialData.projects}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
        filteredCount={filteredProjects.length}
      />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {activeCategory === "all" ? (
          /* Flat grid — no repetition for multi-category projects */
          filteredProjects.length > 0 ? (
            <div
              className="hub-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  categories={initialData.categories}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px", opacity: 0.3 }}>⚡</div>
              <p style={{ color: "#64748b", fontWeight: 600, fontSize: "16px" }}>No tools found</p>
              <p style={{ color: "#334155", fontSize: "13px", marginTop: "4px" }}>
                Try a different search or filter
              </p>
            </div>
          )
        ) : (
          /* Category-grouped view for specific team filter */
          <>
            {visibleCategories.map((cat) => {
              const catProjects = filteredProjects.filter((p) =>
                p.categories.includes(cat.id)
              );
              if (catProjects.length === 0) return null;
              const rgb = hexToRgb(cat.color);

              return (
                <div key={cat.id} style={{ marginBottom: "48px" }}>
                  {/* Section header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 14px",
                        borderRadius: "10px",
                        backgroundColor: `rgba(${rgb},0.12)`,
                        border: `1px solid rgba(${rgb},0.3)`,
                        flexShrink: 0,
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
                        background: `linear-gradient(90deg, rgba(${rgb},0.4) 0%, transparent 100%)`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: cat.color,
                        backgroundColor: `rgba(${rgb},0.12)`,
                        padding: "2px 8px",
                        borderRadius: "999px",
                        flexShrink: 0,
                      }}
                    >
                      {catProjects.length}
                    </span>
                  </div>

                  {/* Cards grid */}
                  <div
                    className="hub-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {orderedForCategory(cat.id, catProjects).map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        categories={initialData.categories}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Uncategorised — only shown in category filter view */}
            {uncategorised.length > 0 && (
              <div style={{ marginBottom: "48px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 14px",
                      borderRadius: "10px",
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ width: "7px", height: "7px", borderRadius: "999px", backgroundColor: "#64748b" }} />
                    <span style={{ fontWeight: 800, fontSize: "13px", color: "#64748b" }}>
                      Uncategorised
                    </span>
                  </div>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#1f2937" }} />
                </div>
                <div
                  className="hub-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {uncategorised.map((project, i) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      categories={initialData.categories}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredProjects.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px", opacity: 0.3 }}>⚡</div>
                <p style={{ color: "#64748b", fontWeight: 600, fontSize: "16px" }}>No tools found</p>
                <p style={{ color: "#334155", fontSize: "13px", marginTop: "4px" }}>
                  Try a different search or filter
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1f2937", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", color: "#374151", fontFamily: "monospace" }}>
          Central Automation Hub · Content Operations
        </p>
      </div>
    </div>
  );
}
