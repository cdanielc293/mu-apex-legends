import { useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/store/AuthContext";
import {
  useData,
  type Account,
  type NewsItem,
  type Settings,
  type ShopItem,
} from "@/store/DataContext";
import { SHOP_IMAGE_KEYS, shopImageFor } from "@/lib/shopImages";
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
} from "@/components/ui/dialog";
import {
  FileText,
  Home as HomeIcon,
  LogOut,
  Pencil,
  Plus,
  Server,
  Settings as SettingsIcon,
  Shield,
  ShoppingBag,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { to: "/admin", label: "Overview", icon: HomeIcon, end: true },
  { to: "/admin/news", label: "News", icon: FileText },
  { to: "/admin/shop", label: "Web Shop", icon: ShoppingBag },
  { to: "/admin/accounts", label: "Accounts", icon: Users },
  { to: "/admin/maintenance", label: "Server Maintenance", icon: Server },
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
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Logged in as
          </p>
          <p className="mt-1 text-sm font-semibold">{user?.loginName}</p>
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

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-surface-1 lg:hidden"
            aria-label="Toggle nav"
          >
            <SettingsIcon size={16} />
          </button>
          <h1 className="font-display text-base font-semibold uppercase tracking-widest text-primary md:text-lg">
            Admin · {NAV.find((n) => n.to === location.pathname)?.label ?? "Dashboard"}
          </h1>
          <div />
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="surface-card rounded-sm p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-gold-gradient">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// --------------------------------------------------------------
// Overview
// --------------------------------------------------------------
function Overview() {
  const {
    news,
    accounts,
    rankings,
    onlinePlayerCount,
    gameServerConfig,
    settings,
    shopItems,
    characters,
  } = useData();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label='Online (Account.State > 0)'
          value={onlinePlayerCount.toLocaleString()}
          hint={`Capacity ${gameServerConfig.MaximumPlayers.toLocaleString()}`}
        />
        <StatCard label="data.Account rows" value={accounts.length} />
        <StatCard label="data.Character rows" value={characters.length} />
        <StatCard label="shop_items rows" value={shopItems.length} />
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
            ["Max Players", gameServerConfig.MaximumPlayers.toLocaleString()],
            ["News articles", news.length],
            ["Top character EXP", rankings[0]?.Experience.toLocaleString() ?? "—"],
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

// --------------------------------------------------------------
// News editor
// --------------------------------------------------------------
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
      const { id: _omit, ...rest } = editing;
      createNews(rest);
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

// --------------------------------------------------------------
// Web Shop editor
// --------------------------------------------------------------
function ShopEditor() {
  const { shopItems, createShopItem, updateShopItem, deleteShopItem } = useData();
  const [editing, setEditing] = useState<ShopItem | null>(null);
  const [open, setOpen] = useState(false);
  const isNew = editing?.id === "";

  const startNew = () => {
    setEditing({
      id: "",
      name: "",
      description: "",
      price_points: 100,
      category: "Bundle",
      image_key: SHOP_IMAGE_KEYS[0],
    });
    setOpen(true);
  };

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (isNew) {
      const { id: _omit, ...rest } = editing;
      createShopItem(rest);
      toast.success("Shop item added");
    } else {
      updateShopItem(editing.id, editing);
      toast.success("Shop item updated");
    }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage the public Web Shop catalog (table{" "}
          <code className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-xs">shop_items</code>).
        </p>
        <Button variant="gold" onClick={startNew}>
          <Plus size={14} /> New Item
        </Button>
      </div>

      <div className="surface-card overflow-hidden rounded-sm">
        <div className="hidden grid-cols-[60px_1fr_120px_120px_120px] border-b border-border bg-surface-2/80 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:grid">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span className="text-right">Price</span>
          <span className="text-right">Actions</span>
        </div>
        <ul className="divide-y divide-border/60">
          {shopItems.map((s) => (
            <li
              key={s.id}
              className="grid grid-cols-[60px_1fr_auto] items-center gap-3 px-5 py-3 sm:grid-cols-[60px_1fr_120px_120px_120px]"
            >
              <img
                src={shopImageFor(s.image_key)}
                alt=""
                loading="lazy"
                className="h-12 w-12 rounded-sm border border-border object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold">{s.name}</p>
                <p className="truncate text-xs text-muted-foreground">{s.description}</p>
              </div>
              <span className="hidden text-xs uppercase tracking-widest text-primary sm:block">
                {s.category}
              </span>
              <span className="hidden text-right font-mono text-sm font-semibold text-primary sm:block">
                {s.price_points.toLocaleString()}
              </span>
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditing(s);
                    setOpen(true);
                  }}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    deleteShopItem(s.id);
                    toast.success("Item removed");
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "New Shop Item" : "Edit Shop Item"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (points)</Label>
                  <Input
                    type="number"
                    value={editing.price_points}
                    onChange={(e) =>
                      setEditing({ ...editing, price_points: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <Select
                    value={editing.image_key}
                    onValueChange={(v) => setEditing({ ...editing, image_key: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SHOP_IMAGE_KEYS.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 rounded-sm border border-border bg-surface-1 p-3">
                <img
                  src={shopImageFor(editing.image_key)}
                  alt=""
                  className="h-14 w-14 rounded-sm object-cover"
                />
                <p className="text-xs text-muted-foreground">
                  Live preview of the selected image asset.
                </p>
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

// --------------------------------------------------------------
// Accounts editor (data.Account)
// --------------------------------------------------------------
function AccountsEditor() {
  const { accounts, updateAccount, deleteAccount } = useData();

  const stateLabel = (s: number) =>
    s === 0 ? "Offline" : s >= 1 ? "Online" : `State ${s}`;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Mock representation of <code className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-xs">data.&quot;Account&quot;</code>. Toggle State to flip the live online count.
      </p>
      <div className="surface-card overflow-hidden rounded-sm">
        <div className="hidden grid-cols-[1.2fr_1.4fr_120px_140px_60px] border-b border-border bg-surface-2/80 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:grid">
          <span>LoginName</span>
          <span>EMail</span>
          <span>State</span>
          <span>RegistrationDate</span>
          <span className="text-right">Actions</span>
        </div>
        <ul className="divide-y divide-border/60">
          {accounts.slice(0, 50).map((a: Account) => (
            <li
              key={a.Id}
              className="grid grid-cols-1 items-center gap-3 px-5 py-3 sm:grid-cols-[1.2fr_1.4fr_120px_140px_60px]"
            >
              <p className="font-semibold">{a.LoginName}</p>
              <p className="truncate text-sm text-muted-foreground">{a.EMail}</p>
              <Select
                value={String(a.State)}
                onValueChange={(v) => updateAccount(a.Id, { State: Number(v) })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue>{stateLabel(a.State)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 · Offline</SelectItem>
                  <SelectItem value="1">1 · Online</SelectItem>
                  <SelectItem value="2">2 · In-Game</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                {a.RegistrationDate.slice(0, 10)}
              </span>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    deleteAccount(a.Id);
                    toast.success("Account removed");
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing first 50 of {accounts.length.toLocaleString()} accounts.
      </p>
    </div>
  );
}

// --------------------------------------------------------------
// Server Maintenance — config.GameServerConfiguration.MaximumPlayers
// --------------------------------------------------------------
function ServerMaintenance() {
  const { gameServerConfig, updateGameServerConfig, onlinePlayerCount, settings, updateSettings } =
    useData();
  const [maxPlayers, setMaxPlayers] = useState<number>(gameServerConfig.MaximumPlayers);
  const [maintenance, setMaintenance] = useState(settings.maintenance_mode);
  const [message, setMessage] = useState(settings.maintenance_message);

  const utilisation = Math.min(
    100,
    Math.round((onlinePlayerCount / Math.max(1, maxPlayers)) * 100)
  );

  const save = () => {
    updateGameServerConfig({ MaximumPlayers: Math.max(1, Math.floor(maxPlayers)) });
    updateSettings({ maintenance_mode: maintenance, maintenance_message: message });
    toast.success("Server configuration saved");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Online players" value={onlinePlayerCount.toLocaleString()} />
        <StatCard label="MaximumPlayers" value={maxPlayers.toLocaleString()} />
        <StatCard label="Utilisation" value={`${utilisation}%`} />
      </div>

      <div className="surface-card rounded-sm p-6">
        <h2 className="font-display text-sm uppercase tracking-widest text-primary">
          GameServerConfiguration
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Maps to{" "}
          <code className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-xs">
            config.&quot;GameServerConfiguration&quot;
          </code>
        </p>
        <div className="ornate-divider my-4" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>MaximumPlayers</Label>
            <Input
              type="number"
              min={1}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Hard cap of concurrent players the realm will accept.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Capacity bar</Label>
            <div className="h-3 overflow-hidden rounded-sm border border-border bg-surface-2">
              <div
                className="h-full bg-gradient-gold transition-all"
                style={{ width: `${utilisation}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {onlinePlayerCount.toLocaleString()} / {maxPlayers.toLocaleString()} online
            </p>
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
              Closes the realm and shows a global warning bar to visitors.
            </p>
          </div>
          <Switch checked={maintenance} onCheckedChange={setMaintenance} />
        </div>
        <div className="mt-4 space-y-2">
          <Label>Message</Label>
          <Textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            setMaxPlayers(gameServerConfig.MaximumPlayers);
            setMaintenance(settings.maintenance_mode);
            setMessage(settings.maintenance_message);
          }}
        >
          Reset
        </Button>
        <Button variant="gold" onClick={save}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
}

// --------------------------------------------------------------
// Settings (CMS)
// --------------------------------------------------------------
function SettingsEditor() {
  const { settings, updateSettings } = useData();
  const [draft, setDraft] = useState<Settings>(settings);

  const updateLink = (
    i: number,
    patch: Partial<{ title: string; url: string; size: string }>
  ) => {
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

// --------------------------------------------------------------
// Routes
// --------------------------------------------------------------
export default function Admin() {
  return (
    <AdminShell>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="news" element={<NewsEditor />} />
        <Route path="shop" element={<ShopEditor />} />
        <Route path="accounts" element={<AccountsEditor />} />
        <Route path="maintenance" element={<ServerMaintenance />} />
        <Route path="settings" element={<SettingsEditor />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminShell>
  );
}
