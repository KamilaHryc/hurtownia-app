"use client";

import { useEffect, useState } from "react";

type AdminDashboardData = {
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
        users: number;
        products: number;
        customers: number;
    };
    recent: {
        type: string;
        id: number;
        date: string;
        quantity: string;
        reason: string;
        status: string;
        product_name: string;
        reported_by: string;
    }[];
};

export default function DashboardAdminPage() {
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDashboard() {
        try {
            const res = await fetch("http://localhost/hurtownia-api/admin_dashboard.php", {
                method: "GET",
                credentials: "include",
            });

            const text = await res.text();
            const json = JSON.parse(text.trim().replace(/^\uFEFF/, ""));

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
        await fetch("http://localhost/hurtownia-api/logout.php", {
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
                    Ładowanie dashboardu admina...
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
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-xl shadow-lg shadow-green-600/30">
                                🥬
                            </div>
                            <div>
                                <div className="text-sm text-slate-400">Panel admina</div>
                                <div className="text-lg font-bold">Hurtownia</div>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => (window.location.href = "/dashboard/admin")}
                                className="block w-full rounded-2xl bg-white/10 px-4 py-3 text-left font-medium text-white"
                            >
                                Dashboard
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/admin/uzytkownicy")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Użytkownicy
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/admin/klienci")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Klienci
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/admin/produkty")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Produkty
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/admin/reklamacje")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Reklamacje
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/admin/straty")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Straty
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/admin/profil")}
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
                                    Dashboard admina
                                </p>
                                <h1 className="mt-1 text-3xl font-black text-slate-900">
                                    Witaj, {data?.user.name} {data?.user.surname}
                                </h1>
                                <p className="mt-2 text-slate-500">
                                    Podsumowanie systemu, zgłoszeń i aktywności w hurtowni.
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
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
                            <Stat title="Reklamacje" value={data?.stats.complaints ?? 0} icon="📦" />
                            <Stat title="Straty" value={data?.stats.losses ?? 0} icon="📉" />
                            <Stat title="Użytkownicy" value={data?.stats.users ?? 0} icon="👥" />
                            <Stat title="Produkty" value={data?.stats.products ?? 0} icon="🥕" />
                            <Stat title="Klienci" value={data?.stats.customers ?? 0} icon="🏢" />
                        </div>

                        <div className="mt-8 rounded-3xl bg-[linear-gradient(135deg,#065f46_0%,#047857_60%,#166534_100%)] p-7 text-white shadow-xl">
                            <div className="text-sm font-semibold text-green-100">
                                Szybkie akcje admina
                            </div>

                            <h2 className="mt-3 text-2xl font-black">
                                Co chcesz zrobić?
                            </h2>

                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                <button
                                    onClick={() => (window.location.href = "/dashboard/admin/uzytkownicy/dodaj")}
                                    className="rounded-2xl bg-white px-5 py-4 text-left font-semibold text-green-800 hover:bg-green-50"
                                >
                                    Dodaj użytkownika
                                </button>

                                <button
                                    onClick={() => (window.location.href = "/dashboard/admin/klienci/dodaj")}
                                    className="rounded-2xl bg-white/10 px-5 py-4 text-left font-semibold text-white hover:bg-white/20"
                                >
                                    Dodaj klienta
                                </button>

                                <button
                                    onClick={() => (window.location.href = "/dashboard/admin/produkty/dodaj")}
                                    className="rounded-2xl bg-white/10 px-5 py-4 text-left font-semibold text-white hover:bg-white/20"
                                >
                                    Dodaj produkt
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="mb-5 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Ostatnie zgłoszenia w systemie
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
                                                        {item.date} • ilość: {item.quantity} • {item.reason}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-400">
                                                        Zgłosił: {item.reported_by}
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

                            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Podsumowanie systemu
                                </h3>

                                <div className="mt-5 space-y-4">
                                    <SummaryItem
                                        icon="👥"
                                        title="Użytkownicy"
                                        text="Admin może zarządzać kontami pracowników i administratorów."
                                    />

                                    <SummaryItem
                                        icon="📦"
                                        title="Reklamacje i straty"
                                        text="Admin widzi wszystkie zgłoszenia w systemie i może zmieniać ich status."
                                    />

                                    <SummaryItem
                                        icon="🥕"
                                        title="Produkty i klienci"
                                        text="Admin zarządza bazą produktów oraz kontrahentów hurtowni."
                                    />
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
            <div className="mt-3 text-4xl font-black text-slate-900">
                {value}
            </div>
        </div>
    );
}

function SummaryItem({
    icon,
    title,
    text,
}: {
    icon: string;
    title: string;
    text: string;
}) {
    return (
        <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="mt-1 text-lg">{icon}</div>
            <div>
                <div className="font-medium text-slate-900">{title}</div>
                <div className="mt-1 text-sm text-slate-500">{text}</div>
            </div>
        </div>
    );
}