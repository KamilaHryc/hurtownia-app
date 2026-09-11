"use client";

import { useEffect, useState } from "react";

type Product = { id: number; name: string };
type Customer = { id: number; company_name: string };

export default function AddComplaintPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerId, setCustomerId] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogout() {
        await fetch("/api/php/logout.php", {
            method: "GET",
            credentials: "include",
        });
        window.location.href = "/";
    }

    async function loadData() {
        const productsRes = await fetch("/api/php/products_list.php", {
            credentials: "include",
        });
        const customersRes = await fetch("/api/php/customers_list.php", {
            credentials: "include",
        });

        const productsJson = JSON.parse((await productsRes.text()).trim().replace(/^\uFEFF/, ""));
        const customersJson = JSON.parse((await customersRes.text()).trim().replace(/^\uFEFF/, ""));

        setProducts(productsJson.items || []);
        setCustomers(customersJson.items || []);
    }

    async function submitForm(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");

        const res = await fetch("/api/php/complaint_add.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                customer_id: customerId,
                product_id: productId,
                quantity,
                reason,
                description,
            }),
        });

        const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

        if (!res.ok || !json.success) {
            setMessage(json.message || "Błąd dodawania reklamacji");
            return;
        }

        window.location.href = "/dashboard/pracownik";
    }

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
                            <button
                                onClick={() => (window.location.href = "/dashboard/pracownik")}
                                className="block w-full rounded-2xl px-4 py-3 text-left text-slate-300 hover:bg-white/5"
                            >
                                Dashboard
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard/pracownik/reklamacje")}
                                className="block w-full rounded-2xl bg-white/10 px-4 py-3 text-left font-medium"
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

                    <button onClick={handleLogout} className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">
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
                                Dodaj reklamację
                            </h1>
                            <p className="mt-2 text-slate-500">
                                Zgłoś reklamację dotyczącą klienta i produktu.
                            </p>
                        </div>
                    </header>

                    <section className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
                        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                            <form onSubmit={submitForm} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Klient
                                    </label>
                                    <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required className="w-full rounded-xl border border-slate-300 p-3">
                                        <option value="">Wybierz klienta</option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>{c.company_name}</option>
                                        ))}
                                    </select>
                                </div>

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
                                <input value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="Powód reklamacji" className="w-full rounded-xl border border-slate-300 p-3" />
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opis" className="min-h-28 w-full rounded-xl border border-slate-300 p-3" />

                                {message && <div className="rounded-xl bg-red-50 p-4 text-red-700">{message}</div>}

                                <button className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
                                    Zapisz reklamację
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}