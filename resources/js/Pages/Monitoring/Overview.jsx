import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const MetricCard = ({ title, value, hint }) => (
    <div className="brand-card p-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600/90">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-emerald-950">{value}</p>
        {hint && <p className="mt-1 text-xs text-emerald-700/65">{hint}</p>}
    </div>
);

const ServiceChip = ({ name, status, detail }) => {
    const colorClasses =
        status === 'up'
            ? 'bg-emerald-100 text-emerald-700'
            : status === 'degraded'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-rose-100 text-rose-700';

    return (
        <div className="brand-card p-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    {name}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colorClasses}`}>
                    {status}
                </span>
            </div>
            {detail ? <p className="mt-2 text-xs text-emerald-700/70">{detail}</p> : null}
        </div>
    );
};

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

export default function Overview() {
    const pageProps = usePage().props;

    const initialPayload = useMemo(
        () => ({
            health: pageProps.health ?? {},
            analysisSummary: pageProps.analysisSummary ?? {},
            ingredientSummary: pageProps.ingredientSummary ?? {},
            entitySummary: pageProps.entitySummary ?? {},
            recentAnalyses: pageProps.recentAnalyses ?? [],
            lastUpdated: pageProps.lastUpdated ?? null,
        }),
        [
            pageProps.health,
            pageProps.analysisSummary,
            pageProps.ingredientSummary,
            pageProps.entitySummary,
            pageProps.recentAnalyses,
            pageProps.lastUpdated,
        ],
    );

    const [dataset, setDataset] = useState(initialPayload);

    useEffect(() => {
        setDataset(initialPayload);
    }, [initialPayload]);

    const analysis = dataset.analysisSummary;
    const ingredient = dataset.ingredientSummary;
    const entities = dataset.entitySummary;
    const services = dataset.health?.services ?? {};

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-emerald-950">
                        Monitoring Backend
                    </h2>
                </div>
            }
        >
            <Head title="Monitoring" />

            <div className="py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-sm text-emerald-800/85">
                        Halaman ini menampilkan snapshot data saat halaman dibuka.
                    </p>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Status Layanan
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(services).map(([key, status]) => (
                                <ServiceChip
                                    key={key}
                                    name={key}
                                    status={status.status}
                                    detail={status.detail}
                                />
                            ))}
                            {Object.keys(services).length === 0 && (
                                <p className="text-sm text-emerald-700/75">Belum ada data status layanan.</p>
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Ringkasan Analisis
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                            <MetricCard title="Total Analisis" value={analysis.total ?? 0} />
                            <MetricCard
                                title="24 Jam Terakhir"
                                value={analysis.last_24h ?? 0}
                                hint="Jumlah request yang diproses"
                            />
                            <MetricCard
                                title="7 Hari Terakhir"
                                value={analysis.last_7d ?? 0}
                                hint="Total analisis mingguan"
                            />
                            <MetricCard
                                title="Rata-rata / Hari"
                                value={analysis.average_per_day ?? 0}
                                hint="Dihitung sejak analisis pertama"
                            />
                            <MetricCard
                                title="Pending"
                                value={analysis.pending ?? 0}
                            />
                            <MetricCard
                                title="Completed"
                                value={analysis.completed ?? 0}
                            />
                            <MetricCard
                                title="Failed"
                                value={analysis.failed ?? 0}
                            />
                        </div>
                        <p className="mt-2 text-xs text-emerald-700/65">
                            Analisis terakhir: {formatDateTime(analysis.last_created_at)}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Inventori Ingredient
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                            <MetricCard title="Total Ingredient" value={ingredient.total ?? 0} />
                            <MetricCard
                                title="Risiko Rendah"
                                value={ingredient.low_risk ?? 0}
                            />
                            <MetricCard
                                title="Risiko Sedang"
                                value={ingredient.medium_risk ?? 0}
                            />
                            <MetricCard
                                title="Risiko Tinggi"
                                value={ingredient.high_risk ?? ingredient.high_comedogenic ?? 0}
                            />
                            <MetricCard
                                title="Risiko Tidak Diketahui"
                                value={ingredient.unknown_risk ?? 0}
                            />
                        </div>
                        <div className="mt-2 grid gap-1 text-xs text-emerald-700/65 sm:grid-cols-2">
                            <p>Data ingredient diperbarui: {formatDateTime(ingredient.last_updated_at)}</p>
                            <p>
                                Legacy metric - Allergen: {ingredient.allergens ?? 0}, Tidak Aman Hamil: {ingredient.unsafe_for_pregnancy ?? 0}
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Ringkasan Entity Database
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                            <MetricCard title="Users" value={entities.users ?? 0} />
                            <MetricCard title="Products" value={entities.products ?? 0} />
                            <MetricCard title="Ingredients" value={entities.ingredients ?? 0} />
                            <MetricCard title="Scans" value={entities.scans ?? 0} />
                            <MetricCard title="Analyses" value={entities.analyses ?? 0} />
                            <MetricCard title="Analysis Details" value={entities.analysis_details ?? 0} />
                            <MetricCard title="Scan Ingredients" value={entities.scan_ingredients ?? 0} />
                            <MetricCard title="User Histories" value={entities.user_histories ?? 0} />
                            <MetricCard title="Total Records" value={entities.total_records ?? 0} />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                                Analisis Terbaru
                            </h3>
                            <span className="text-xs text-emerald-700/65">Menampilkan {dataset.recentAnalyses.length} entri terbaru</span>
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
                                            <th className="px-4 py-3">Input</th>
                                            <th className="px-4 py-3">Matched Ingredient</th>
                                            <th className="px-4 py-3">Ringkasan AI</th>
                                            <th className="px-4 py-3">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-100 bg-white">
                                        {dataset.recentAnalyses.map((entry) => {
                                            const payload = entry.ai_analysis ?? {};
                                            const matched = entry.matched_ingredients ?? payload.matched_ingredients ?? [];
                                            const insightRaw =
                                                entry.summary ??
                                                payload.summary ??
                                                entry.recommendation ??
                                                payload.recommendation ??
                                                payload.ai_analysis ??
                                                '-';
                                            const insight =
                                                typeof insightRaw === 'string'
                                                    ? insightRaw
                                                    : JSON.stringify(insightRaw);

                                            return (
                                                <tr key={entry.id} className="hover:bg-emerald-50/45">
                                                    <td className="px-4 py-3 font-medium text-emerald-950">{entry.id}</td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        {entry.user?.name ?? '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        {entry.product?.name ?? '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        {entry.status ?? payload.status ?? '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        {payload.input_text ?? entry.raw_text ?? '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        <span className="font-semibold">{entry.matched_ingredient_count ?? matched.length}</span>
                                                        <span className="text-xs text-emerald-700/65"> item cocok</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        {insight.slice(0, 120)}
                                                        {insight.length > 120 ? '…' : ''}
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-700/75">{formatDateTime(entry.created_at)}</td>
                                                </tr>
                                            );
                                        })}
                                        {dataset.recentAnalyses.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-6 text-center text-emerald-700/75">
                                                    Belum ada data analisis tersimpan.
                                                </td>
                                            </tr>
                                        )}
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
