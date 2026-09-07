"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
    id: number;
    name: string;
    category: string;
    unit: string;
    price: string;
};

export default function ProductsPage() {
    const [items, setItems] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [name, setName] = useState("");
    const [category, setCategory] = useState("warzywo");
    const [unit, setUnit] = useState("kg");
    const [price, setPrice] = useState("");

    async function handleLogout() {
        await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/logout.php", {
            method: "GET",
            credentials: "include",
        });

        window.location.href = "/";
    }

    async function loadProducts() {
        try {
            const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/products_list.php", {
                credentials: "include",
            });

            const text = await res.text();
            const json = JSON.parse(text.trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                setError(json.message || "Błąd pobierania produktów");
                return;
            }

            setItems(json.items || []);
        } catch {
            setError("Błąd połączenia z backendem");
        }
    }

    async function addProduct(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/product_add.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    category,
                    unit,
                    price,
                }),
            });

            const text = await res.text();
            const json = JSON.parse(text.trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                setError(json.message || "Nie udało się dodać produktu");
                return;
            }

            setMessage("Produkt został dodany");
            setName("");
            setCategory("warzywo");
            setUnit("kg");
            setPrice("");

            await loadProducts();
        } catch {
            setError("Błąd połączenia z backendem");
        }
    }

    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return items.filter((item) =>
            [item.name, item.category, item.unit, item.price]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [items, search]);

    useEffect(() => {
        loadProducts();
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
                            <button
                                onClick={() => (window.location.href = "/dashboard/pracownik")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
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
                                className="block w-full rounded-2xl bg-white/10 px-4 py-3 text-left font-medium"
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
                        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
                            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                                Produkty
                            </p>
                            <h1 className="mt-1 text-3xl font-black text-slate-900">
                                Lista produktów
                            </h1>
                            <p className="mt-2 text-slate-500">
                                Przeglądanie, wyszukiwanie i dodawanie produktów.
                            </p>
                        </div>
                    </header>

                    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Dodaj produkt
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Uzupełnij dane produktu i zapisz go w bazie.
                                </p>

                                <form onSubmit={addProduct} className="mt-6 space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Nazwa
                                        </label>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="np. Marchew"
                                            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Kategoria
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                        >
                                            <option value="warzywo">warzywo</option>
                                            <option value="owoc">owoc</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Jednostka
                                        </label>
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                        >
                                            <option value="kg">kg</option>
                                            <option value="szt">szt</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Cena
                                        </label>
                                        <input
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="np. 2.50"
                                            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                        />
                                    </div>

                                    {message && (
                                        <div className="rounded-xl bg-green-50 p-4 text-green-700">
                                            {message}
                                        </div>
                                    )}

                                    {error && (
                                        <div className="rounded-xl bg-red-50 p-4 text-red-700">
                                            {error}
                                        </div>
                                    )}

                                    <button className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
                                        Dodaj produkt
                                    </button>
                                </form>
                            </div>

                            <div>
                                <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Szukaj po nazwie, kategorii, jednostce lub cenie..."
                                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                    />
                                </div>

                                <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-sm uppercase text-slate-500">
                                            <tr>
                                                <th className="p-4">Nazwa</th>
                                                <th className="p-4">Kategoria</th>
                                                <th className="p-4">Jednostka</th>
                                                <th className="p-4">Cena</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map((item) => (
                                                <tr key={item.id} className="border-t border-slate-100">
                                                    <td className="p-4 font-semibold">{item.name}</td>
                                                    <td className="p-4">{item.category}</td>
                                                    <td className="p-4">{item.unit}</td>
                                                    <td className="p-4">{item.price} zł</td>
                                                </tr>
                                            ))}

                                            {filtered.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="p-6 text-slate-500">
                                                        Brak produktów do wyświetlenia.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}