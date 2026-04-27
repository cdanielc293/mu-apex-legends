import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/AuthContext";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/profile";
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await login(loginName, password);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Welcome back, adventurer.");
    navigate(redirect, { replace: true });
  };

  const fillDemo = (kind: "admin" | "user") => {
    if (kind === "admin") {
      setLoginName("gamemaster");
      setPassword("admin123");
    } else {
      setLoginName("wanderinghero");
      setPassword("player123");
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Return to the eternal continent. Your saga continues."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="loginName">LoginName</Label>
          <Input
            id="loginName"
            type="text"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            placeholder="gamemaster"
            required
            autoComplete="username"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button type="button" className="text-xs text-primary hover:underline">
              Forgot?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : null}
          Enter the Realm
        </Button>

        <div className="rounded-sm border border-border bg-surface-1 p-4 text-xs">
          <p className="mb-2 flex items-center gap-2 font-semibold text-primary">
            <ShieldCheck size={13} /> Demo accounts
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="rounded-sm border border-border bg-surface-2 px-3 py-2 text-left transition-colors hover:border-primary/40"
            >
              <p className="font-semibold text-foreground">Admin</p>
              <p className="text-muted-foreground">gamemaster / admin123</p>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("user")}
              className="rounded-sm border border-border bg-surface-2 px-3 py-2 text-left transition-colors hover:border-primary/40"
            >
              <p className="font-semibold text-foreground">Player</p>
              <p className="text-muted-foreground">wanderinghero / player123</p>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New to {`Mu Eternia`}?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create your account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
