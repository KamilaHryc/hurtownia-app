"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type LossDetails = {
    id: number;
    loss_date: string;
    quantity: string;
    reason: string;
    description: string;
    status: string;
    product_id: number;
    product_name: string;
    category: string;
    unit: string;
    price: string;
    author_id: number;
    author_username: string;
    author_name: string;
    author_email: string;
};

export default function AdminLossDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [item, setItem] = useState<LossDetails | null>(null);
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleLogout() {
        await fetch("/api/php/logout.php", {
            credentials: "include",
        });
        window.location.href = "/";
    }

    async function loadDetails() {
        try {
            const res = await fetch(
                `/api/php/admin_loss_details.php?id=${params.id}`,
                { credentials: "include" }
            );

            const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                setError(json.message || "Nie udało się pobrać szczegółów");
                return;
            }

            setItem(json.item);
            setStatus(json.item.status);
        } catch {
            setError("Błąd połączenia z backendem");
        }
    }

    async function updateStatus(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");
        setError("");

        const res = await fetch("/api/php/admin_loss_status.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                id: params.id,
                status,
            }),
        });

        const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

        if (!res.ok || !json.success) {
            setError(json.message || "Nie udało się zmienić statusu");
            return;
        }

        setMessage("Status został zmieniony");
        await loadDetails();
    }

    useEffect(() => {
        loadDetails();
    }, []);

    const estimatedValue =
        item ? Number(item.quantity) * Number(item.price) : 0;

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
                            <MenuItem label="Reklamacje" href="/dashboard/admin/reklamacje" />
                            <MenuItem label="Straty" href="/dashboard/admin/straty" active />
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
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                                    Straty
                                </p>
                                <h1 className="mt-1 text-3xl font-black text-slate-900">
                                    Szczegóły straty #{params.id}
                                </h1>
                                <p className="mt-2 text-slate-500">
                                    Podgląd zgłoszonej straty, autora, produktu i zmiana statusu.
                                </p>
                            </div>

                            <button
                                onClick={() => (window.location.href = "/dashboard/admin/straty")}
                                className="rounded-2xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                            >
                                Wróć do listy
                            </button>
                        </div>
                    </header>

                    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                        {error && (
                            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">
                                {message}
                            </div>
                        )}

                        {item && (
                            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                                <div className="space-y-6">
                                    <Card title="Dane straty">
                                        <Info label="Data" value={item.loss_date} />
                                        <Info label="Status" value={item.status} />
                                        <Info label="Powód" value={item.reason} />
                                        <Info label="Ilość" value={`${item.quantity} ${item.unit}`} />
                                        <Info label="Szacunkowa wartość" value={`${estimatedValue.toFixed(2)} zł`} />
                                        <Info label="Opis" value={item.description || "-"} />
                                    </Card>

                                    <Card title="Produkt">
                                        <Info label="ID produktu" value={`#${item.product_id}`} />
                                        <Info label="Nazwa" value={item.product_name} />
                                        <Info label="Kategoria" value={item.category} />
                                        <Info label="Jednostka" value={item.unit} />
                                        <Info label="Cena jednostkowa" value={`${item.price} zł`} />
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card title="Autor zgłoszenia">
                                        <Info label="Autor" value={item.author_name} />
                                        <Info label="Login" value={item.author_username} />
                                        <Info label="E-mail" value={item.author_email || "-"} />
                                    </Card>

                                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                        <h2 className="text-xl font-bold text-slate-900">
                                            Zmień status
                                        </h2>

                                        <form onSubmit={updateStatus} className="mt-5 space-y-4">
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                            >
                                                <option value="zgloszona">zgloszona</option>
                                                <option value="zatwierdzona">zatwierdzona</option>
                                                <option value="odrzucona">odrzucona</option>
                                            </select>

                                            <button className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
                                                Zapisz status
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
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

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-5 text-xl font-bold text-slate-900">{title}</h2>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </div>
            <div className="mt-1 font-medium text-slate-900">{value}</div>
        </div>
    );
}