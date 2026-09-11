"use client";

import { useEffect, useMemo, useState } from "react";

type User = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: number;
};

export default function AdminUsersPage() {
    const [items, setItems] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editing, setEditing] = useState<User | null>(null);
    const [resetUser, setResetUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");

    async function handleLogout() {
        await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/logout.php", {
            credentials: "include",
        });
        window.location.href = "/";
    }

    async function loadUsers() {
        try {
            const res = await fetch("/api/php/admin_users.php", {
                credentials: "include",
            });

            const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                setError(json.message || "Nie udało się pobrać użytkowników");
                return;
            }

            setItems(json.items || []);
        } catch {
            setError("Błąd połączenia z backendem");
        }
    }

    async function deleteUser(user: User) {
        if (!confirm(`Czy na pewno usunąć użytkownika ${user.username}?`)) return;

        setMessage("");
        setError("");

        const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/admin_user_delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: user.id }),
        });

        const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

        if (!res.ok || !json.success) {
            setError(json.message || "Nie udało się usunąć użytkownika");
            return;
        }

        setMessage("Użytkownik został usunięty");
        await loadUsers();
    }

    async function updateUser(e: React.FormEvent) {
        e.preventDefault();
        if (!editing) return;

        setMessage("");
        setError("");

        const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/admin_user_update.php", {
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

        setMessage("Użytkownik został zaktualizowany");
        setEditing(null);
        await loadUsers();
    }

    async function resetPassword(e: React.FormEvent) {
        e.preventDefault();
        if (!resetUser) return;

        setMessage("");
        setError("");

        const res = await fetch(
            "https://hurtownia-warzywa.42web.io/hurtownia-api/admin_user_reset_password.php",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    id: resetUser.id,
                    new_password: newPassword,
                }),
            }
        );

        const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

        if (!res.ok || !json.success) {
            setError(json.message || "Nie udało się zresetować hasła");
            return;
        }

        setMessage(`Hasło użytkownika ${resetUser.username} zostało zresetowane`);
        setResetUser(null);
        setNewPassword("");
    }

    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return items.filter((item) =>
            [
                item.id,
                item.username,
                item.first_name,
                item.last_name,
                item.email,
                item.role === 1 ? "pracownik" : "admin",
            ]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [items, search]);

    useEffect(() => {
        loadUsers();
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
                            <MenuItem label="Użytkownicy" href="/dashboard/admin/uzytkownicy" active />
                            <MenuItem label="Klienci" href="/dashboard/admin/klienci" />
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
                                    Użytkownicy
                                </p>
                                <h1 className="mt-1 text-3xl font-black text-slate-900">
                                    Zarządzanie użytkownikami
                                </h1>
                                <p className="mt-2 text-slate-500">
                                    Dodawanie, edycja, usuwanie, reset hasła i wyszukiwanie.
                                </p>
                            </div>

                            <button
                                onClick={() => (window.location.href = "/dashboard/admin/uzytkownicy/dodaj")}
                                className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                            >
                                Dodaj użytkownika
                            </button>
                        </div>
                    </header>

                    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Szukaj po loginie, imieniu, nazwisku, emailu lub roli..."
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
                                        <th className="p-4">Login</th>
                                        <th className="p-4">Imię i nazwisko</th>
                                        <th className="p-4">E-mail</th>
                                        <th className="p-4">Rola</th>
                                        <th className="p-4 text-right">Akcje</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((user) => (
                                        <tr key={user.id} className="border-t border-slate-100">
                                            <td className="p-4 font-semibold">#{user.id}</td>
                                            <td className="p-4">{user.username}</td>
                                            <td className="p-4">
                                                {user.first_name} {user.last_name}
                                            </td>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {Number(user.role) === 1 ? "pracownik" : "admin"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditing(user)}
                                                        className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                                    >
                                                        Edytuj
                                                    </button>
                                                    <button
                                                        onClick={() => setResetUser(user)}
                                                        className="rounded-xl bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                                                    >
                                                        Reset hasła
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user)}
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
                                            <td colSpan={6} className="p-6 text-slate-500">
                                                Brak użytkowników do wyświetlenia.
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
                <Modal title={`Edytuj użytkownika: ${editing.username}`} onClose={() => setEditing(null)}>
                    <form onSubmit={updateUser} className="space-y-4">
                        <Input
                            label="Login"
                            value={editing.username}
                            onChange={(value) => setEditing({ ...editing, username: value })}
                        />
                        <Input
                            label="Imię"
                            value={editing.first_name}
                            onChange={(value) => setEditing({ ...editing, first_name: value })}
                        />
                        <Input
                            label="Nazwisko"
                            value={editing.last_name}
                            onChange={(value) => setEditing({ ...editing, last_name: value })}
                        />
                        <Input
                            label="E-mail"
                            type="email"
                            value={editing.email}
                            onChange={(value) => setEditing({ ...editing, email: value })}
                        />

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">Rola</label>
                            <select
                                value={editing.role}
                                onChange={(e) =>
                                    setEditing({ ...editing, role: Number(e.target.value) })
                                }
                                className="w-full rounded-xl border border-slate-300 p-3"
                            >
                                <option value={1}>pracownik</option>
                                <option value={2}>admin</option>
                            </select>
                        </div>

                        <button className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
                            Zapisz zmiany
                        </button>
                    </form>
                </Modal>
            )}

            {resetUser && (
                <Modal title={`Reset hasła: ${resetUser.username}`} onClose={() => setResetUser(null)}>
                    <form onSubmit={resetPassword} className="space-y-4">
                        <Input
                            label="Nowe hasło"
                            type="password"
                            value={newPassword}
                            onChange={setNewPassword}
                        />

                        <button className="w-full rounded-xl bg-yellow-600 py-3 font-semibold text-white hover:bg-yellow-700">
                            Zresetuj hasło
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
            className={`block w-full rounded-2xl px-4 py-3 text-left ${active ? "bg-white/10 font-medium text-white" : "text-slate-300 hover:bg-white/5"
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
}: {
    label: string;
    value: string;
    type?: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
            <input
                value={value}
                type={type}
                onChange={(e) => onChange(e.target.value)}
                required
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