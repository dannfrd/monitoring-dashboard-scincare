import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

const MetricCard = ({ title, value, hint }) => (
    <div className="brand-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700/90">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-emerald-950">{value}</p>
        {hint ? <p className="mt-1 text-xs text-emerald-700/70">{hint}</p> : null}
    </div>
);

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

const truncate = (value, maxLength = 140) => {
    const text = typeof value === 'string' ? value : JSON.stringify(value ?? '-');
    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength)}...`;
};

export default function AnalysisIndex() {
    const { analysisSummary = {}, analyses = [] } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin Flow</p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-emerald-950">
                        Lihat Data Analisis User
                    </h2>
                </div>
            }
        >
            <Head title="Analisis User" />

            <div className="py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Ringkasan Analisis
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                            <MetricCard title="Total Analisis" value={analysisSummary.total ?? 0} />
                            <MetricCard title="24 Jam Terakhir" value={analysisSummary.last_24h ?? 0} />
                            <MetricCard title="7 Hari Terakhir" value={analysisSummary.last_7d ?? 0} />
                            <MetricCard title="Rata-rata / Hari" value={analysisSummary.average_per_day ?? 0} />
                            <MetricCard title="Pending" value={analysisSummary.pending ?? 0} />
                            <MetricCard title="Completed" value={analysisSummary.completed ?? 0} />
                            <MetricCard title="Failed" value={analysisSummary.failed ?? 0} />
                        </div>
                        <p className="mt-2 text-xs text-emerald-700/65">
                            Analisis terakhir: {formatDateTime(analysisSummary.last_created_at)}
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                                Data Analisis User Terbaru
                            </h3>
                            <span className="text-xs text-emerald-700/70">Menampilkan {analyses.length} data</span>
                        </div>
                        <div className="brand-card mt-3 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-emerald-100 text-sm">
                                    <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-700/85">
                                        <tr>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Produk</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Ringkasan</th>
                                            <th className="px-4 py-3">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-100 bg-white">
                                        {analyses.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-emerald-50/40">
                                                <td className="px-4 py-3 font-medium text-emerald-950">{entry.id}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{entry.user?.name ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{entry.product?.name ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{entry.status ?? entry.ai_analysis?.status ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">
                                                    {truncate(entry.summary ?? entry.ai_analysis?.summary ?? entry.recommendation ?? '-')}
                                                </td>
                                                <td className="px-4 py-3 text-emerald-700/75">{formatDateTime(entry.created_at)}</td>
                                            </tr>
                                        ))}
                                        {analyses.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-6 text-center text-emerald-700/75">
                                                    Belum ada data analisis user.
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
