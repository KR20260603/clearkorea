export default function AdminPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <section className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">
          ClearKorea Admin
        </p>
        <h1 className="mt-4 text-4xl font-black">Admin queue scaffold</h1>
        <p className="mt-4 text-zinc-300">
          Role-gated queues, settings, and audit logs will be implemented after
          the database and auth foundation are in place.
        </p>
      </section>
    </main>
  );
}
