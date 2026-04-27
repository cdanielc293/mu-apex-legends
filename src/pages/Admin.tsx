import { useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/store/AuthContext";
import { useData, type NewsItem, type MockUser, type Settings } from "@/store/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Home as HomeIcon,
  LogOut,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { to: "/admin", label: "Overview", icon: HomeIcon, end: true },
  { to: "/admin/news", label: "News", icon: FileText },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Logo size="sm" />
        </div>
        <div className="px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Logged in as</p>
          <p className="mt-1 text-sm font-semibold">{user?.username}</p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            <Shield size={10} /> {user?.role}
          </span>
        </div>
        <nav className="space-y-1 px-3">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                  }`
                }
              >
                <Icon size={16} /> {n.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="absolute inset-x-3 bottom-4 space-y-2">
          <Button asChild variant="obsidian" size="sm" className="w-full">
            <Link to="/">View Site</Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={logout}>
            <LogOut size={14} /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-surface-1 lg:hidden"
            aria-label="Toggle nav"
          >
            <SettingsIcon size={16} />
          </button>
          <h1 className="font-display text-lg font-semibold uppercase tracking-widest text-primary">
            Admin · {NAV.find((n) => n.to === location.pathname)?.label ?? "Dashboard"}
          </h1>
          <div />
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="surface-card rounded-sm p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-gold-gradient">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Overview() {
  const { news, users, rankings, serverStatus, settings } = useData();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Players Online" value={serverStatus.online_count.toLocaleString()} />
        <StatCard label="Registered Users" value={users.length} />
        <StatCard label="Top Rankings" value={rankings.length} />
        <StatCard label="News Articles" value={news.length} />
      </div>
      <div className="surface-card rounded-sm p-6">
        <h2 className="font-display text-sm uppercase tracking-widest text-primary">
          Server Snapshot
        </h2>
        <div className="ornate-divider my-4" />
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          {[
            ["Server", settings.server_name],
            ["Season", settings.season],
            ["EXP Rate", `x${settings.exp_rate}`],
            ["Drop Rate", `${settings.drop_rate}%`],
            ["Maintenance", settings.maintenance_mode ? "ON" : "OFF"],
            ["Uptime", `${serverStatus.uptime_days} days`],
          ].map(([k, v]) => (
            <div key={k as string}>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
              <dd className="mt-1 font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function NewsEditor() {
  const { news, createNews, updateNews, deleteNews } = useData();
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [open, setOpen] = useState(false);

  const startNew = () => {
    setEditing({
      id: 0,
      title: "",
      category: "Update",
      date: new Date().toISOString().slice(0, 10),
      excerpt: "",
      content: "",
    });
    setOpen(true);
  };

  const startEdit = (n: NewsItem) => {
    setEditing(n);
    setOpen(true);
  };

  const save = () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (editing.id === 0) {
      createNews({
        title: editing.title,
        category: editing.category,
        date: editing.date,
        excerpt: editing.excerpt,
        content: editing.content,
      });
      toast.success("News article published");
    } else {
      updateNews(editing.id, editing);
      toast.success("News article updated");
    }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage news articles displayed on the public site.
        </p>
        <Button variant="gold" onClick={startNew}>
          <Plus size={14} /> New Article
        </Button>
      </div>

      <div className="surface-card overflow-hidden rounded-sm">
        <ul className="divide-y divide-border/60">
          {news.map((n) => (
            <li key={n.id} className="flex items-center gap-4 px-5 py-4">
              <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                {n.category}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.date}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => startEdit(n)}>
                <Pencil size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => {
                  deleteNews(n.id);
                  toast.success("Article removed");
                }}
              >
                <Trash2 size={14} />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Article" : "New Article"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_140px_160px]">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={editing.date}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                  rows={2}
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  rows={8}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={save}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UsersEditor() {
  const { users, updateUser, deleteUser } = useData();
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Manage mock users — change roles, suspend accounts, or remove them.
      </p>
      <div className="surface-card overflow-hidden rounded-sm">
        <div className="hidden grid-cols-[1fr_1.4fr_120px_120px_120px] border-b border-border bg-surface-2/80 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:grid">
          <span>Username</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <ul className="divide-y divide-border/60">
          {users.map((u: MockUser) => (
            <li
              key={u.id}
              className="grid grid-cols-1 items-center gap-3 px-5 py-3 sm:grid-cols-[1fr_1.4fr_120px_120px_120px]"
            >
              <p className="font-semibold">{u.username}</p>
              <p className="truncate text-sm text-muted-foreground">{u.email}</p>
              <Select
                value={u.role}
                onValueChange={(v) => updateUser(u.id, { role: v as MockUser["role"] })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={u.status}
                onValueChange={(v) => updateUser(u.id, { status: v as MockUser["status"] })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    deleteUser(u.id);
                    toast.success("User removed");
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SettingsEditor() {
  const { settings, updateSettings } = useData();
  const [draft, setDraft] = useState<Settings>(settings);

  const updateLink = (i: number, patch: Partial<{ title: string; url: string; size: string }>) => {
    const links = draft.download_links.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
    setDraft({ ...draft, download_links: links });
  };
  const addLink = () =>
    setDraft({
      ...draft,
      download_links: [...draft.download_links, { title: "New mirror", url: "https://", size: "" }],
    });
  const removeLink = (i: number) =>
    setDraft({ ...draft, download_links: draft.download_links.filter((_, idx) => idx !== i) });

  const save = () => {
    updateSettings(draft);
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-6">
      <div className="surface-card rounded-sm p-6">
        <h2 className="font-display text-sm uppercase tracking-widest text-primary">General</h2>
        <div className="ornate-divider my-4" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Server Name</Label>
            <Input
              value={draft.server_name}
              onChange={(e) => setDraft({ ...draft, server_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Season</Label>
            <Input
              value={draft.season}
              onChange={(e) => setDraft({ ...draft, season: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>EXP Rate</Label>
            <Input
              type="number"
              value={draft.exp_rate}
              onChange={(e) => setDraft({ ...draft, exp_rate: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Drop Rate (%)</Label>
            <Input
              type="number"
              value={draft.drop_rate}
              onChange={(e) => setDraft({ ...draft, drop_rate: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="surface-card rounded-sm p-6">
        <h2 className="font-display text-sm uppercase tracking-widest text-primary">
          Maintenance Mode
        </h2>
        <div className="ornate-divider my-4" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Enable maintenance banner</p>
            <p className="text-sm text-muted-foreground">
              Displays a global banner and changes server status to maintenance.
            </p>
          </div>
          <Switch
            checked={draft.maintenance_mode}
            onCheckedChange={(v) => setDraft({ ...draft, maintenance_mode: v })}
          />
        </div>
        <div className="mt-4 space-y-2">
          <Label>Maintenance Message</Label>
          <Textarea
            rows={2}
            value={draft.maintenance_message}
            onChange={(e) => setDraft({ ...draft, maintenance_message: e.target.value })}
          />
        </div>
      </div>

      <div className="surface-card rounded-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm uppercase tracking-widest text-primary">
            Download Mirrors
          </h2>
          <Button size="sm" variant="ghostGold" onClick={addLink}>
            <Plus size={14} /> Add
          </Button>
        </div>
        <div className="ornate-divider my-4" />
        <div className="space-y-3">
          {draft.download_links.map((l, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_100px_40px]">
              <Input
                placeholder="Title"
                value={l.title}
                onChange={(e) => updateLink(i, { title: e.target.value })}
              />
              <Input
                placeholder="URL"
                value={l.url}
                onChange={(e) => updateLink(i, { url: e.target.value })}
              />
              <Input
                placeholder="Size"
                value={l.size ?? ""}
                onChange={(e) => updateLink(i, { size: e.target.value })}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeLink(i)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setDraft(settings)}>
          Reset
        </Button>
        <Button variant="gold" onClick={save}>
          Save All Changes
        </Button>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminShell>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="news" element={<NewsEditor />} />
        <Route path="users" element={<UsersEditor />} />
        <Route path="settings" element={<SettingsEditor />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminShell>
  );
}
