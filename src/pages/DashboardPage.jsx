export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Campus Facility Booking System
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage facility bookings and campus spaces.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Available facilities</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
          </article>

          <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Active bookings</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
          </article>

          <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Pending requests</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
          </article>
        </section>
      </div>
    </main>
  );
}