"use client";

import { useEffect, useMemo, useState } from "react";

type Customer = {
    id: number;
    company_name: string;
    contact_person: string;
    phone_number: string;
    email: string;
    address: string;
};

export default function AdminCustomersPage() {
    const [items, setItems] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [editing, setEditing] = useState<Customer | null>(null);

    async function handleLogout() {
        await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/logout.php", {
            credentials: "include",
        });
        window.location.href = "/";
    }

    async function loadCustomers() {
        try {
            const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/admin_customers.php", {
                credentials: "include",
            });

            const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                setError(json.message || "Nie udało się pobrać klientów");
                return;
            }

            setItems(json.items || []);
        } catch {
            setError("Błąd połączenia z backendem");
        }
    }

    async function deleteCustomer(customer: Customer) {
        if (!confirm(`Czy na pewno usunąć klienta ${customer.company_name}?`)) return;

        setMessage("");
        setError("");

        const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/admin_customer_delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: customer.id }),
        });

        const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

        if (!res.ok || !json.success) {
            setError(json.message || "Nie udało się usunąć klienta");
            return;
        }

        setMessage("Klient został usunięty");
        await loadCustomers();
    }

    async function updateCustomer(e: React.FormEvent) {
        e.preventDefault();
        if (!editing) return;

        setMessage("");
        setError("");

        const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/admin_customer_update.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(editing),
        });

        const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

        if (!res.ok || !json.success) {
            setError(json.message || "Nie udało się zapisać zmian");
            return;
        }

        setMessage("Klient został zaktualizowany");
        setEditing(null);
        await loadCustomers();
    }

    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return items.filter((item) =>
            [
                item.id,
                item.company_name,
                item.contact_person,
                item.phone_number,
                item.email,
                item.address,
            ]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [items, search]);

    useEffect(() => {
        loadCustomers();
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
                            <MenuItem label="Klienci" href="/dashboard/admin/klienci" active />
                            <MenuItem label="Produkty" href="/dashboard/admin/produkty" />
                            <MenuItem label="Reklamacje" href="/dashboard/admin/reklamacje" />
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
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                                    Klienci
                                </p>
                                <h1 className="mt-1 text-3xl font-black text-slate-900">
                                    Zarządzanie klientami
                                </h1>
                                <p className="mt-2 text-slate-500">
                                    Dodawanie, edycja, usuwanie i wyszukiwanie klientów.
                                </p>
                            </div>

                            <button
                                onClick={() => (window.location.href = "/dashboard/admin/klienci/dodaj")}
                                className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                            >
                                Dodaj klienta
                            </button>
                        </div>
                    </header>

                    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Szukaj po nazwie firmy, osobie kontaktowej, telefonie, emailu lub adresie..."
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                            />
                        </div>

                        {message && (
                            <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">
                                {message}
                            </div>
                        )}

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
                                        <th className="p-4">Firma</th>
                                        <th className="p-4">Osoba kontaktowa</th>
                                        <th className="p-4">Telefon</th>
                                        <th className="p-4">E-mail</th>
                                        <th className="p-4">Adres</th>
                                        <th className="p-4 text-right">Akcje</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((customer) => (
                                        <tr key={customer.id} className="border-t border-slate-100">
                                            <td className="p-4 font-semibold">#{customer.id}</td>
                                            <td className="p-4 font-semibold">{customer.company_name}</td>
                                            <td className="p-4">{customer.contact_person || "-"}</td>
                                            <td className="p-4">{customer.phone_number || "-"}</td>
                                            <td className="p-4">{customer.email || "-"}</td>
                                            <td className="p-4">{customer.address || "-"}</td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditing(customer)}
                                                        className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                                    >
                                                        Edytuj
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCustomer(customer)}
                                                        className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                                    >
                                                        Usuń
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-6 text-slate-500">
                                                Brak klientów do wyświetlenia.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            {editing && (
                <Modal
                    title={`Edytuj klienta: ${editing.company_name}`}
                    onClose={() => setEditing(null)}
                >
                    <form onSubmit={updateCustomer} className="space-y-4">
                        <Input
                            label="Nazwa firmy"
                            value={editing.company_name}
                            onChange={(value) => setEditing({ ...editing, company_name: value })}
                        />

                        <Input
                            label="Osoba kontaktowa"
                            value={editing.contact_person || ""}
                            onChange={(value) => setEditing({ ...editing, contact_person: value })}
                            required={false}
                        />

                        <Input
                            label="Telefon"
                            value={editing.phone_number || ""}
                            onChange={(value) => setEditing({ ...editing, phone_number: value })}
                            required={false}
                        />

                        <Input
                            label="E-mail"
                            type="email"
                            value={editing.email || ""}
                            onChange={(value) => setEditing({ ...editing, email: value })}
                            required={false}
                        />

                        <Input
                            label="Adres"
                            value={editing.address || ""}
                            onChange={(value) => setEditing({ ...editing, address: value })}
                            required={false}
                        />

                        <button className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
                            Zapisz zmiany
                        </button>
                    </form>
                </Modal>
            )}
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

function Input({
    label,
    value,
    onChange,
    type = "text",
    required = true,
}: {
    label: string;
    value: string;
    type?: string;
    required?: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
                {label}
            </label>
            <input
                value={value}
                type={type}
                required={required}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />
        </div>
    );
}

function Modal({
    title,
    children,
    onClose,
}: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-6">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                    >
                        Zamknij
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}