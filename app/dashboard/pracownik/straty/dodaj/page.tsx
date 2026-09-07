"use client";

import { useEffect, useState } from "react";

type Product = { id: number; name: string };

export default function AddLossPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogout() {
        await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/logout.php", {
            method: "GET",
            credentials: "include",
        });
        window.location.href = "/";
    }

    async function loadProducts() {
        const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/products_list.php", {
            credentials: "include",
        });

        const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));
        setProducts(json.items || []);
    }

    async function submitForm(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");

        const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/loss_add.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                product_id: productId,
                quantity,
                reason,
                description,
            }),
        });

        const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

        if (!res.ok || !json.success) {
            setMessage(json.message || "Błąd dodawania straty");
            return;
        }

        window.location.href = "/dashboard/pracownik";
    }

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
                                className="block w-full rounded-2xl bg-white/10 px-4 py-3 text-left font-medium"
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

                    <button onClick={handleLogout} className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">
                        Wyloguj się
                    </button>
                </aside>

                <div className="flex-1">
                    <header className="border-b border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
                            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                                Straty
                            </p>
                            <h1 className="mt-1 text-3xl font-black text-slate-900">
                                Dodaj stratę
                            </h1>
                            <p className="mt-2 text-slate-500">
                                Zgłoś stratę magazynową dla wybranego produktu.
                            </p>
                        </div>
                    </header>

                    <section className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
                        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                            <form onSubmit={submitForm} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Produkt
                                    </label>
                                    <select value={productId} onChange={(e) => setProductId(e.target.value)} required className="w-full rounded-xl border border-slate-300 p-3">
                                        <option value="">Wybierz produkt</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <input value={quantity} onChange={(e) => setQuantity(e.target.value)} required type="number" step="0.01" placeholder="Ilość" className="w-full rounded-xl border border-slate-300 p-3" />
                                <input value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="Powód straty" className="w-full rounded-xl border border-slate-300 p-3" />
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opis" className="min-h-28 w-full rounded-xl border border-slate-300 p-3" />

                                {message && <div className="rounded-xl bg-red-50 p-4 text-red-700">{message}</div>}

                                <button className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
                                    Zapisz stratę
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}