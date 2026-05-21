export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel główny hurtowni</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Reklamacje</h2>
          <p>Obsługa zgłoszeń reklamacyjnych klientów.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Straty</h2>
          <p>Ewidencja strat magazynowych i uszkodzeń towaru.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Produkty i klienci</h2>
          <p>Zarządzanie bazą produktów, klientów i raportów.</p>
        </div>
      </div>
    </main>
  );
}