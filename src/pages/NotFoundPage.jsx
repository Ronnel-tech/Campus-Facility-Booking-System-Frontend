export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
          Campus Facility Booking System
        </p>

        <h1 className="mt-4 text-6xl font-bold text-neutral-900">404</h1>

        <p className="mt-4 text-neutral-600">
          The page you are looking for does not exist.
        </p>

        <a
          href="/"
          className="mt-6 inline-block rounded-lg bg-primary-500 px-5 py-3 font-medium text-white transition hover:bg-primary-600"
        >
          Return to dashboard
        </a>
      </section>
    </main>
  );
}
