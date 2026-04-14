import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const formatDateTime = (value) => {
    if (!value) {
        return '-';
    }

    try {
        return new Date(value).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch (error) {
        return value;
    }
};

const truncate = (value, maxLength = 220) => {
    const text = typeof value === 'string' ? value : JSON.stringify(value ?? '-');
    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength)}...`;
};

export default function RecommendationIndex() {
    const { recommendations = [], lastUpdated = null } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin Flow</p>
                        <h2 className="mt-2 text-2xl font-semibold leading-tight text-emerald-950">
                            Kelola Rekomendasi
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-emerald-700/75">Terakhir diambil: {formatDateTime(lastUpdated)}</p>
                        <Link
                            href={route('recommendations.index')}
                            className="inline-flex items-center rounded-2xl border border-transparent bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                        >
                            Muat Ulang
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Kelola Rekomendasi" />

            <div className="py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <section className="brand-card p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Ringkasan
                        </h3>
                        <p className="mt-3 text-sm text-emerald-900/90">
                            Total rekomendasi yang bisa ditinjau admin: <span className="font-semibold">{recommendations.length}</span>
                        </p>
                        <p className="mt-2 text-xs text-emerald-700/75">
                            Data bersumber dari hasil analisis backend. Halaman ini hanya menampilkan hasil untuk review admin.
                        </p>
                    </section>

                    <section>
                        <div className="brand-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-emerald-100 text-sm">
                                    <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-700/85">
                                        <tr>
                                            <th className="px-4 py-3">ID Analisis</th>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Produk</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Rekomendasi</th>
                                            <th className="px-4 py-3">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-100 bg-white">
                                        {recommendations.map((item) => (
                                            <tr key={`${item.analysisId}-${item.createdAt}`} className="hover:bg-emerald-50/45">
                                                <td className="px-4 py-3 font-medium text-emerald-950">{item.analysisId ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.user ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.product ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.status ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{truncate(item.recommendation)}</td>
                                                <td className="px-4 py-3 text-emerald-700/75">{formatDateTime(item.createdAt)}</td>
                                            </tr>
                                        ))}
                                        {recommendations.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-6 text-center text-emerald-700/75">
                                                    Belum ada rekomendasi yang bisa ditampilkan.
                                                </td>
                                            </tr>
                                        ) : null}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
