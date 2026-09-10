"use client";

import { useEffect, useState } from "react";

type DashboardData = {
    user: {
        id: number;
        username: string;
        name: string;
        surname: string;
        role: number;
    };
    stats: {
        complaints: number;
        losses: number;
        new_complaints: number;
        reported_losses: number;
    };
    recent: {
        type: string;
        id: number;
        date: string;
        quantity: string;
        reason: string;
        status: string;
        product_name: string;
    }[];
};

export default function DashboardPracownikPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDashboard() {
        try {
            const res = await fetch(
                "",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const text = await res.text();
            const cleanText = text.trim().replace(/^\uFEFF/, "");
            const json = JSON.parse(cleanText);

            if (!res.ok || !json.success) {
                setError(json.message || "Nie udało się pobrać danych");
                return;
            }

            setData(json.data);
        } catch {
            setError("Błąd połączenia z backendem PHP");
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/logout.php", {
            method: "GET",
            credentials: "include",
        });

        window.location.href = "/";
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="rounded-3xl bg-white p-8 shadow">
                    Ładowanie dashboardu...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="rounded-3xl bg-white p-8 shadow">
                    <div className="font-semibold text-red-600">{error}</div>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="mt-4 rounded-xl bg-green-700 px-4 py-3 text-white"
                    >
                        Wróć do logowania
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-100">
            <div className="flex min-h-screen">
                <aside className="hidden w-72 flex-col justify-between bg-slate-950 px-6 py-8 text-white lg:flex">
                    <div>
                        <div className="mb-10 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-xl">
                                🥬
                            </div>
                            <div>
                                <div className="text-sm text-slate-400">Panel pracownika</div>
                                <div className="text-lg font-bold">Hurtownia</div>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => (window.location.href = "/dashboard/pracownik")}
                                className="block w-full rounded-2xl bg-white/10 px-4 py-3 text-left font-medium"
                            >
                                Dashboard
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/pracownik/reklamacje")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Reklamacje
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/pracownik/straty")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Straty
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/pracownik/produkty")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Produkty
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/pracownik/profil")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Profil
                            </button>
                        </nav>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Wyloguj się
                    </button>
                </aside>

                <div className="flex-1">
                    <header className="border-b border-slate-200 bg-white">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                                    Dashboard pracownika
                                </p>
                                <h1 className="mt-1 text-3xl font-black text-slate-900">
                                    Witaj, {data?.user.name} {data?.user.surname}
                                </h1>
                                <p className="mt-2 text-slate-500">
                                    Twoje zgłoszenia, reklamacje i straty.
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
                            >
                                Wyloguj
                            </button>
                        </div>
                    </header>

                    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            <Stat
                                title="Moje reklamacje"
                                value={data?.stats.complaints ?? 0}
                                icon="📦"
                            />
                            <Stat
                                title="Moje straty"
                                value={data?.stats.losses ?? 0}
                                icon="📉"
                            />
                            <Stat
                                title="Nowe reklamacje"
                                value={data?.stats.new_complaints ?? 0}
                                icon="📝"
                            />
                            <Stat
                                title="Straty zgłoszone"
                                value={data?.stats.reported_losses ?? 0}
                                icon="⚠️"
                            />
                        </div>

                        <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="mb-5 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Moje ostatnie zgłoszenia
                                    </h2>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                        {data?.recent.length ?? 0} rekordów
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {data?.recent.length === 0 && (
                                        <div className="rounded-2xl border border-slate-200 p-4 text-slate-500">
                                            Brak zgłoszeń do wyświetlenia.
                                        </div>
                                    )}

                                    {data?.recent.map((item) => (
                                        <div
                                            key={`${item.type}-${item.id}`}
                                            className="rounded-2xl border border-slate-200 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="font-semibold text-slate-900">
                                                        {item.type} #{item.id} — {item.product_name}
                                                    </div>
                                                    <div className="mt-1 text-sm text-slate-500">
                                                        {item.date} • ilość: {item.quantity} •{" "}
                                                        {item.reason}
                                                    </div>
                                                </div>

                                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-3xl bg-[linear-gradient(135deg,#065f46_0%,#047857_60%,#166534_100%)] p-7 text-white shadow-xl">
                                    <div className="text-sm font-semibold text-green-100">
                                        Szybkie akcje
                                    </div>

                                    <h2 className="mt-3 text-2xl font-black">
                                        Co chcesz zrobić?
                                    </h2>

                                    <div className="mt-6 grid gap-3">
                                        <button
                                            onClick={() =>
                                            (window.location.href =
                                                "/dashboard/pracownik/reklamacje/dodaj")
                                            }
                                            className="rounded-2xl bg-white px-4 py-3 text-left font-semibold text-green-800"
                                        >
                                            Dodaj reklamację
                                        </button>

                                        <button
                                            onClick={() =>
                                            (window.location.href =
                                                "/dashboard/pracownik/straty/dodaj")
                                            }
                                            className="rounded-2xl bg-white/10 px-4 py-3 text-left font-semibold text-white hover:bg-white/20"
                                        >
                                            Dodaj stratę
                                        </button>

                                        <button
                                            onClick={() =>
                                            (window.location.href =
                                                "/dashboard/pracownik/produkty")
                                            }
                                            className="rounded-2xl bg-white/10 px-4 py-3 text-left font-semibold text-white hover:bg-white/20"
                                        >
                                            Zobacz produkty
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Ostatnie działania
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        Dane pochodzą z tabel reklamacji i strat przypisanych do
                                        zalogowanego pracownika.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

function Stat({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: string;
}) {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 text-3xl">{icon}</div>
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {title}
            </div>
            <div className="mt-3 text-4xl font-black text-slate-900">{value}</div>
        </div>
    );
}