"use client";

import { useState } from "react";

export default function AdminAddCustomerPage() {
    const [companyName, setCompanyName] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleLogout() {
        await fetch("/api/php/logout.php", {
            credentials: "include",
        });
        window.location.href = "/";
    }

    async function submitForm(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");
        setError("");

        const res = await fetch("/api/php/admin_customer_add.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                company_name: companyName,
                contact_person: contactPerson,
                phone_number: phoneNumber,
                email,
                address,
            }),
        });

        const json = JSON.parse((await res.text()).trim().replace(/^\uFEFF/, ""));

        if (!res.ok || !json.success) {
            setError(json.message || "Nie udało się dodać klienta");
            return;
        }

        setMessage("Klient został dodany");
        setCompanyName("");
        setContactPerson("");
        setPhoneNumber("");
        setEmail("");
        setAddress("");
    }

    return (
        <AdminLayout active="Klienci" handleLogout={handleLogout}>
            <Header title="Dodaj klienta" subtitle="Dodaj nowego kontrahenta hurtowni." />

            <FormCard>
                <form onSubmit={submitForm} className="space-y-4">
                    <Input label="Nazwa firmy" value={companyName} setValue={setCompanyName} />
                    <Input label="Osoba kontaktowa" value={contactPerson} setValue={setContactPerson} required={false} />
                    <Input label="Telefon" value={phoneNumber} setValue={setPhoneNumber} required={false} />
                    <Input label="E-mail" value={email} setValue={setEmail} type="email" required={false} />
                    <Input label="Adres" value={address} setValue={setAddress} required={false} />

                    {message && <div className="rounded-xl bg-green-50 p-4 text-green-700">{message}</div>}
                    {error && <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

                    <button className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
                        Dodaj klienta
                    </button>
                </form>
            </FormCard>
        </AdminLayout>
    );
}

function AdminLayout({ children, active, handleLogout }: any) {
    const items = [
        ["Dashboard", "/dashboard/admin"],
        ["Użytkownicy", "/dashboard/admin/uzytkownicy"],
        ["Klienci", "/dashboard/admin/klienci"],
        ["Produkty", "/dashboard/admin/produkty"],
        ["Reklamacje", "/dashboard/admin/reklamacje"],
        ["Straty", "/dashboard/admin/straty"],
        ["Profil", "/dashboard/admin/profil"],
    ];

    return (
        <main className="min-h-screen bg-slate-100">
            <div className="flex min-h-screen">
                <aside className="hidden w-72 flex-col justify-between bg-slate-950 px-6 py-8 text-white lg:flex">
                    <div>
                        <div className="mb-10 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-xl">🥬</div>
                            <div>
                                <div className="text-sm text-slate-400">Panel admina</div>
                                <div className="text-lg font-bold">Hurtownia</div>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {items.map(([name, href]) => (
                                <button
                                    key={name}
                                    onClick={() => (window.location.href = href)}
                                    className={`block w-full rounded-2xl px-4 py-3 text-left ${active === name ? "bg-white/10 font-medium text-white" : "text-slate-300 hover:bg-white/5"
                                        }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <button onClick={handleLogout} className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">
                        Wyloguj się
                    </button>
                </aside>

                <div className="flex-1">{children}</div>
            </div>
        </main>
    );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
                <p className="text-sm font-semibold uppercase tracking-wider text-green-700">Panel admina</p>
                <h1 className="mt-1 text-3xl font-black text-slate-900">{title}</h1>
                <p className="mt-2 text-slate-500">{subtitle}</p>
            </div>
        </header>
    );
}

function FormCard({ children }: { children: React.ReactNode }) {
    return (
        <section className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">{children}</div>
        </section>
    );
}

function Input({ label, value, setValue, type = "text", required = true }: any) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required={required}
                type={type}
                className="w-full rounded-xl border border-slate-300 p-3"
            />
        </div>
    );
}