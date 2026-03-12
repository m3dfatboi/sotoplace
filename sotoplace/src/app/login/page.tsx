"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeSlash } from "@phosphor-icons/react";

const DEMO_ACCOUNTS = [
  { email: "ivan@metalpro.ru",    role: "Менеджер" },
  { email: "maria@metalpro.ru",   role: "Конструктор" },
  { email: "buyer@officeplus.ru", role: "Клиент" },
  { email: "admin@sotoplace.ru",  role: "Администратор" },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("ivan@metalpro.ru");
  const [password, setPassword] = useState("demo");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setError("Неверный email или пароль");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app px-4">
      <div className="w-full max-w-sm space-y-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Sotoplace</h1>
          <p className="text-sm text-text-secondary mt-1">B2B маркетплейс и ERP/CRM</p>
        </div>

        {/* Form */}
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-text-primary">Вход в систему</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 pr-10 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-[var(--radius-md)] px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-1" loading={loading}>
              Войти
            </Button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-2">
          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">Демо-аккаунты (любой пароль)</p>
          <div className="space-y-1">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => setEmail(a.email)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors text-left ${
                  email === a.email
                    ? "bg-primary-light text-primary"
                    : "hover:bg-subtle text-text-secondary"
                }`}
              >
                <span className="font-mono text-xs">{a.email}</span>
                <span className="text-xs font-medium">{a.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
