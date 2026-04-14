import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    const cards = [
        {
            title: 'Monitoring Backend',
            description: 'Ambil data status layanan backend dan tampilkan kondisi sistem saat ini.',
            cta: 'Buka Monitoring Sistem',
            href: route('monitoring.index'),
        },
        {
            title: 'Lihat Data Analisis User',
            description: 'Tinjau hasil analisis user terbaru beserta status prosesnya.',
            cta: 'Buka Data Analisis',
            href: route('analysis.index'),
        },
        {
            title: 'Kelola Rekomendasi',
            description: 'Review rekomendasi yang dihasilkan dari proses analisis.',
            cta: 'Buka Rekomendasi',
            href: route('recommendations.index'),
        },
        {
            title: 'Kelola Data Bahan',
            description: 'Pantau ringkasan ingredient dan bahan yang sering muncul di analisis.',
            cta: 'Buka Data Bahan',
            href: route('ingredients.index'),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin Panel</p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-emerald-950">
                        Dashboard Admin SkinCare Analysis System
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <section className="brand-card bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 p-8 text-white">
                        <h3 className="text-2xl font-semibold">Selamat datang di Admin Dashboard</h3>
                        <p className="mt-2 max-w-2xl text-sm text-emerald-50/95">
                            Anda sudah login sebagai admin. Gunakan modul di bawah untuk monitoring sistem, melihat data analisis user, mengelola rekomendasi, dan mengelola data bahan.
                        </p>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        {cards.map((card) => (
                            <Link
                                key={card.title}
                                href={card.href}
                                className="brand-card group block p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <h4 className="text-lg font-semibold text-emerald-900">{card.title}</h4>
                                <p className="mt-2 text-sm text-emerald-800/80">{card.description}</p>
                                <p className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
                                    {card.cta}
                                    <span className="ml-2">→</span>
                                </p>
                            </Link>
                        ))}
                    </section>

                    <section className="brand-card p-6">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-600">Akses</h4>
                        <p className="mt-2 text-sm text-emerald-900/85">
                            Flow admin: Login Admin, Monitoring Sistem, Lihat Data Analisis User, Kelola Rekomendasi, lalu Kelola Data Bahan.
                        </p>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
