"use client";

import { useEffect, useMemo, useState } from "react";

type Complaint = {
    id: number;
    complaint_date: string;
    quantity: string;
    reason: string;
    description: string;
    status: string;
    company_name: string;
    product_name: string;
    author_id: number;
    author_username: string;
    author_name: string;
};

export default function AdminComplaintsPage() {
    const [items, setItems] = useState<Complaint[]>([]);
    const [search, setSearch] = useState("");
    const [authorFilter, setAuthorFilter] = useState("");
    const [error, setError] = useState("");

    async function handleLogout() {
        await fetch("/api/php/logout.php", {
            credentials: "include",
        });
        window.location.href = "/";
    }

    async function loadComplaints() {
        try {
            const res = await fetch("/api/php/admin_complaints.php", {
                credentials: "include",
            });

            const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                setError(json.message || "Nie udało się pobrać reklamacji");
                return;
            }

            setItems(json.items || []);
        } catch {
            setError("Błąd połączenia z backendem");
        }
    }

    const authors = useMemo(() => {
        const map = new Map<string, string>();

        items.forEach((item) => {
            map.set(String(item.author_id), `${item.author_name} (${item.author_username})`);
        });

        return Array.from(map.entries());
    }, [items]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return items.filter((item) => {
            const matchesSearch = [
                item.id,
                item.complaint_date,
                item.company_name,
                item.product_name,
                item.reason,
                item.description,
                item.status,
                item.author_name,
                item.author_username,
            ]
                .join(" ")
                .toLowerCase()
                .includes(q);

            const matchesAuthor = authorFilter === "" || String(item.author_id) === authorFilter;

            return matchesSearch && matchesAuthor;
        });
    }, [items, search, authorFilter]);

    useEffect(() => {
        loadComplaints();
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
                                <div className="text-sm text-slate-400">Panel admina</div>
                                <div className="text-lg font-bold">Hurtownia</div>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <MenuItem label="Dashboard" href="/dashboard/admin" />
                            <MenuItem label="Użytkownicy" href="/dashboard/admin/uzytkownicy" />
                            <MenuItem label="Klienci" href="/dashboard/admin/klienci" />
                            <MenuItem label="Produkty" href="/dashboard/admin/produkty" />
                            <MenuItem label="Reklamacje" href="/dashboard/admin/reklamacje" active />
                            <MenuItem label="Straty" href="/dashboard/admin/straty" />
                            <MenuItem label="Profil" href="/dashboard/admin/profil" />
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
                        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
                            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                                Reklamacje
                            </p>
                            <h1 className="mt-1 text-3xl font-black text-slate-900">
                                Zarządzanie reklamacjami
                            </h1>
                            <p className="mt-2 text-slate-500">
                                Lista wszystkich reklamacji, autor zgłoszenia, wyszukiwanie i szczegóły.
                            </p>
                        </div>
                    </header>

                    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                        <div className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:grid-cols-[1fr_320px]">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Szukaj po kliencie, produkcie, statusie, autorze, powodzie..."
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                            />

                            <select
                                value={authorFilter}
                                onChange={(e) => setAuthorFilter(e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                            >
                                <option value="">Wszyscy autorzy</option>
                                {authors.map(([id, label]) => (
                                    <option key={id} value={id}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-sm uppercase text-slate-500">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Data</th>
                                        <th className="p-4">Klient</th>
                                        <th className="p-4">Produkt</th>
                                        <th className="p-4">Autor</th>
                                        <th className="p-4">Powód</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() =>
                                                (window.location.href = `/dashboard/admin/reklamacje/${item.id}`)
                                            }
                                            className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50"
                                        >
                                            <td className="p-4 font-semibold">#{item.id}</td>
                                            <td className="p-4">{item.complaint_date}</td>
                                            <td className="p-4">{item.company_name}</td>
                                            <td className="p-4">{item.product_name}</td>
                                            <td className="p-4">
                                                <div className="font-medium text-slate-900">{item.author_name}</div>
                                                <div className="text-xs text-slate-500">{item.author_username}</div>
                                            </td>
                                            <td className="p-4">{item.reason}</td>
                                            <td className="p-4">
                                                <StatusBadge status={item.status} />
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

function StatusBadge({ status }: { status: string }) {
    return (
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {status}
        </span>
    );
}

function MenuItem({
    label,
    href,
    active = false,
}: {
    label: string;
    href: string;
    active?: boolean;
}) {
    return (
        <button
            onClick={() => (window.location.href = href)}
            className={`block w-full rounded-2xl px-4 py-3 text-left ${active
                    ? "bg-white/10 font-medium text-white"
                    : "text-slate-300 hover:bg-white/5"
                }`}
        >
            {label}
        </button>
    );
}