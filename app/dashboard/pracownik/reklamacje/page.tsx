"use client";

import { useEffect, useMemo, useState } from "react";

type Complaint = {
    id: number;
    complaint_date: string;
    quantity: string;
    reason: string;
    description: string;
    status: string;
    product_name: string;
    company_name: string;
};

export default function EmployeeComplaintsPage() {
    const [items, setItems] = useState<Complaint[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    async function handleLogout() {
        await fetch("http://localhost/hurtownia-api/logout.php", {
            credentials: "include",
        });
        window.location.href = "/";
    }

    async function loadData() {
        try {
            const res = await fetch("http://localhost/hurtownia-api/employee_complaints.php", {
                credentials: "include",
            });

            const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                setError(json.message || "Błąd pobierania reklamacji");
                return;
            }

            setItems(json.items || []);
        } catch {
            setError("Błąd połączenia z backendem");
        }
    }

    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return items.filter((item) =>
            [
                item.id,
                item.product_name,
                item.company_name,
                item.reason,
                item.description,
                item.status,
                item.complaint_date,
            ]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [items, search]);

    useEffect(() => {
        loadData();
    }, []);

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
                            <button onClick={() => (window.location.href = "/dashboard/pracownik")} className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5">
                                Dashboard
                            </button>
                            <button onClick={() => (window.location.href = "/dashboard/pracownik/reklamacje")} className="block w-full rounded-2xl bg-white/10 px-4 py-3 text-left font-medium">
                                Reklamacje
                            </button>
                            <button onClick={() => (window.location.href = "/dashboard/pracownik/straty")} className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5">
                                Straty
                            </button>
                            <button onClick={() => (window.location.href = "/dashboard/pracownik/produkty")} className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5">
                                Produkty
                            </button>
                            <button onClick={() => (window.location.href = "/dashboard/pracownik/profil")} className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5">
                                Profil
                            </button>
                        </nav>
                    </div>

                    <button onClick={handleLogout} className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">
                        Wyloguj się
                    </button>
                </aside>

                <div className="flex-1">
                    <header className="border-b border-slate-200 bg-white">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                                    Reklamacje
                                </p>
                                <h1 className="mt-1 text-3xl font-black text-slate-900">
                                    Moje reklamacje
                                </h1>
                                <p className="mt-2 text-slate-500">
                                    Lista Twoich reklamacji z możliwością wyszukiwania.
                                </p>
                            </div>

                            <button
                                onClick={() => (window.location.href = "/dashboard/pracownik/reklamacje/dodaj")}
                                className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                            >
                                Dodaj reklamację
                            </button>
                        </div>
                    </header>

                    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Szukaj po produkcie, kliencie, statusie, powodzie..."
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                            />
                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
                        )}

                        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-sm uppercase text-slate-500">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Data</th>
                                        <th className="p-4">Klient</th>
                                        <th className="p-4">Produkt</th>
                                        <th className="p-4">Ilość</th>
                                        <th className="p-4">Powód</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => (window.location.href = `/dashboard/pracownik/reklamacje/${item.id}`)}
                                            className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50"
                                        >
                                            <td className="p-4 font-semibold">#{item.id}</td>
                                            <td className="p-4">{item.complaint_date}</td>
                                            <td className="p-4">{item.company_name}</td>
                                            <td className="p-4">{item.product_name}</td>
                                            <td className="p-4">{item.quantity}</td>
                                            <td className="p-4">{item.reason}</td>
                                            <td className="p-4">
                                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-6 text-slate-500">
                                                Brak reklamacji do wyświetlenia.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}