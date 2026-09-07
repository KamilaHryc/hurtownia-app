"use client";

import { useEffect, useState } from "react";

type UserProfile = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: number;
};

export default function AdminProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");

    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    async function handleLogout() {
        await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/logout.php", {
            method: "GET",
            credentials: "include",
        });

        window.location.href = "/";
    }

    async function loadProfile() {
        try {
            const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/profile_get.php", {
                credentials: "include",
            });

            const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                window.location.href = "/";
                return;
            }

            if (Number(json.user.role) !== 2) {
                window.location.href = "/";
                return;
            }

            setUser(json.user);
            setFirstName(json.user.first_name);
            setLastName(json.user.last_name);
            setEmail(json.user.email);
        } catch {
            window.location.href = "/";
        }
    }

    async function updateProfile(e: React.FormEvent) {
        e.preventDefault();
        setProfileMessage("");
        setProfileError("");

        try {
            const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/profile_update.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                }),
            });

            const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                setProfileError(json.message || "Nie udało się zapisać danych");
                return;
            }

            setProfileMessage(json.message || "Dane zostały zapisane");
            await loadProfile();
        } catch {
            setProfileError("Błąd połączenia z backendem");
        }
    }

    async function changePassword(e: React.FormEvent) {
        e.preventDefault();
        setPasswordMessage("");
        setPasswordError("");

        try {
            const res = await fetch("https://hurtownia-warzywa.42web.io/hurtownia-api/profile_password.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    repeat_password: repeatPassword,
                }),
            });

            const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

            if (!res.ok || !json.success) {
                setPasswordError(json.message || "Nie udało się zmienić hasła");
                return;
            }

            setPasswordMessage(json.message || "Hasło zostało zmienione");
            setCurrentPassword("");
            setNewPassword("");
            setRepeatPassword("");
        } catch {
            setPasswordError("Błąd połączenia z backendem");
        }
    }

    useEffect(() => {
        loadProfile();
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
                            <MenuItem label="Reklamacje" href="/dashboard/admin/reklamacje" />
                            <MenuItem label="Straty" href="/dashboard/admin/straty" />
                            <MenuItem label="Profil" href="/dashboard/admin/profil" active />
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
                                Profil
                            </p>
                            <h1 className="mt-1 text-3xl font-black text-slate-900">
                                Mój profil administratora
                            </h1>
                            <p className="mt-2 text-slate-500">
                                Edycja danych konta i zmiana hasła.
                            </p>
                        </div>
                    </header>

                    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Dane administratora
                                </h2>

                                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                    Login: <span className="font-semibold">{user?.username}</span>
                                    <br />
                                    Rola:{" "}
                                    <span className="font-semibold">
                                        {Number(user?.role) === 1
                                            ? "pracownik"
                                            : Number(user?.role) === 2
                                                ? "admin"
                                                : "nieznana"}
                                    </span>
                                </div>

                                <form onSubmit={updateProfile} className="mt-6 space-y-4">
                                    <Input
                                        label="Imię"
                                        value={firstName}
                                        onChange={setFirstName}
                                    />

                                    <Input
                                        label="Nazwisko"
                                        value={lastName}
                                        onChange={setLastName}
                                    />

                                    <Input
                                        label="E-mail"
                                        type="email"
                                        value={email}
                                        onChange={setEmail}
                                    />

                                    {profileMessage && (
                                        <div className="rounded-xl bg-green-50 p-4 text-green-700">
                                            {profileMessage}
                                        </div>
                                    )}

                                    {profileError && (
                                        <div className="rounded-xl bg-red-50 p-4 text-red-700">
                                            {profileError}
                                        </div>
                                    )}

                                    <button className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
                                        Zapisz dane
                                    </button>
                                </form>
                            </div>

                            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Zmiana hasła
                                </h2>

                                <form onSubmit={changePassword} className="mt-6 space-y-4">
                                    <Input
                                        label="Aktualne hasło"
                                        type="password"
                                        value={currentPassword}
                                        onChange={setCurrentPassword}
                                    />

                                    <Input
                                        label="Nowe hasło"
                                        type="password"
                                        value={newPassword}
                                        onChange={setNewPassword}
                                    />

                                    <Input
                                        label="Powtórz nowe hasło"
                                        type="password"
                                        value={repeatPassword}
                                        onChange={setRepeatPassword}
                                    />

                                    {passwordMessage && (
                                        <div className="rounded-xl bg-green-50 p-4 text-green-700">
                                            {passwordMessage}
                                        </div>
                                    )}

                                    {passwordError && (
                                        <div className="rounded-xl bg-red-50 p-4 text-red-700">
                                            {passwordError}
                                        </div>
                                    )}

                                    <button className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800">
                                        Zmień hasło
                                    </button>
                                </form>
                            </div>
                        </div>
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
            <label className="mb-2 block text-sm font-bold text-slate-700">
                {label}
            </label>
            <input
                value={value}
                type={type}
                required
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />
        </div>
    );
}