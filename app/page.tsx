"use client";

import { useState } from "react";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const text = await res.text();
      const cleanText = text.trim().replace(/^\uFEFF/, "");

      let data: any = {};
      try {
        data = JSON.parse(cleanText);
      } catch {
        setError("Backend nie zwrócił poprawnego JSON-a");
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Logowanie nieudane");
        return;
      }

      window.location.href = data.redirect || "/dashboard";
    } catch {
      setError("Nie udało się połączyć z backendem PHP");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-green-800 via-green-700 to-emerald-700 px-16 py-14 text-white">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <span>🥬</span>
              <span>System operacyjny hurtowni</span>
            </div>

            <h1 className="mt-10 text-6xl font-black leading-tight">
              Hurtownia <span className="text-lime-300">Warzyw i Owoców</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
              Panel do obsługi reklamacji, strat magazynowych, produktów,
              klientów i raportów operacyjnych w hurtowni warzywno-owocowej.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-5 max-w-3xl">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <div className="mb-3 text-2xl">📦</div>
                <h3 className="text-lg font-bold">Reklamacje</h3>
                <p className="mt-2 text-sm leading-6 text-green-50">
                  Rejestracja zgłoszeń klientów i kontrola ich statusów.
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <div className="mb-3 text-2xl">📉</div>
                <h3 className="text-lg font-bold">Straty</h3>
                <p className="mt-2 text-sm leading-6 text-green-50">
                  Ewidencja uszkodzeń, psucia towaru i innych ubytków.
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <div className="mb-3 text-2xl">🥕</div>
                <h3 className="text-lg font-bold">Produkty</h3>
                <p className="mt-2 text-sm leading-6 text-green-50">
                  Zarządzanie asortymentem, jednostkami i kategoriami.
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <div className="mb-3 text-2xl">📊</div>
                <h3 className="text-lg font-bold">Raporty</h3>
                <p className="mt-2 text-sm leading-6 text-green-50">
                  Szybki podgląd działań i sytuacji operacyjnej hurtowni.
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-green-50/90">
            © 2026 Hurtownia Warzywno-Owocowa
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
            <div className="mb-8">
              <h2 className="text-4xl font-black text-slate-900">
                Logowanie do systemu
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-500">
                Dostęp dla administratorów i pracowników hurtowni.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">
                  Login
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="np. jkowalski"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">
                  Hasło
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wpisz hasło"
                  required 
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button className="w-full rounded-xl bg-green-700 py-3.5 text-base font-semibold text-white transition hover:bg-green-800">
                Zaloguj się
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
              <div className="font-semibold text-slate-800">Konto testowe</div>
              <div className="mt-2">jkowalski / test123</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
