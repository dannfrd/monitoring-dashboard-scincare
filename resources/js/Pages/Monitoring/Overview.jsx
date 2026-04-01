import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const REFRESH_INTERVAL_MS = 30000;

const MetricCard = ({ title, value, hint }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
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
        <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                    {name}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colorClasses}`}>
                    {status}
                </span>
            </div>
            {detail ? <p className="mt-2 text-xs text-gray-500">{detail}</p> : null}
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
            recentAnalyses: pageProps.recentAnalyses ?? [],
            lastUpdated: pageProps.lastUpdated ?? null,
        }),
        [
            pageProps.health,
            pageProps.analysisSummary,
            pageProps.ingredientSummary,
            pageProps.recentAnalyses,
            pageProps.lastUpdated,
        ],
    );

    const [dataset, setDataset] = useState(initialPayload);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setDataset(initialPayload);
    }, [initialPayload]);

    const refreshData = useCallback(async () => {
        setIsRefreshing(true);
        setErrorMessage('');

        try {
            const response = await window.axios.get(route('monitoring.data'), {
                params: {
                    limit: Math.max(dataset.recentAnalyses.length || 0, 15),
                },
            });

            setDataset(response.data);
        } catch (error) {
            setErrorMessage('Gagal memuat data monitoring');
        } finally {
            setIsRefreshing(false);
        }
    }, [dataset.recentAnalyses.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, REFRESH_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [refreshData]);

    const analysis = dataset.analysisSummary;
    const ingredient = dataset.ingredientSummary;
    const services = dataset.health?.services ?? {};

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Monitoring Backend
                    </h2>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-500">
                            Terakhir diperbarui: {formatDateTime(dataset.lastUpdated)}
                        </p>
                        <button
                            type="button"
                            onClick={refreshData}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? 'Menyegarkan...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Monitoring" />

            <div className="py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    {errorMessage && (
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                            {errorMessage}
                        </div>
                    )}

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
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
                                <p className="text-sm text-gray-500">Belum ada data status layanan.</p>
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Ringkasan Analisis
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                        </div>
                        <p className="mt-2 text-xs text-gray-400">
                            Analisis terakhir: {formatDateTime(analysis.last_created_at)}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Inventori Ingredient
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <MetricCard title="Total Ingredient" value={ingredient.total ?? 0} />
                            <MetricCard title="Allergen" value={ingredient.allergens ?? 0} />
                            <MetricCard title="Tidak Aman Hamil" value={ingredient.unsafe_for_pregnancy ?? 0} />
                            <MetricCard
                                title="Komedo Genik Tinggi"
                                value={ingredient.high_comedogenic ?? 0}
                                hint={`Rata-rata rating: ${ingredient.average_comedogenic_rating ?? '-'}`}
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-400">
                            Data ingredient diperbarui: {formatDateTime(ingredient.last_updated_at)}
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Analisis Terbaru
                            </h3>
                            <span className="text-xs text-gray-400">Menampilkan {dataset.recentAnalyses.length} entri terbaru</span>
                        </div>
                        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">Input</th>
                                            <th className="px-4 py-3">Matched Ingredient</th>
                                            <th className="px-4 py-3">AI Insight</th>
                                            <th className="px-4 py-3">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {dataset.recentAnalyses.map((entry) => {
                                            const payload = entry.ai_analysis ?? {};
                                            const matched = payload.matched_ingredients ?? [];
                                            const insightRaw = payload.ai_analysis ?? '-';
                                            const insight =
                                                typeof insightRaw === 'string'
                                                    ? insightRaw
                                                    : JSON.stringify(insightRaw);

                                            return (
                                                <tr key={entry.id}>
                                                    <td className="px-4 py-3 font-medium text-gray-900">{entry.id}</td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {payload.input_text ?? entry.raw_text ?? '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        <span className="font-semibold">{matched.length}</span>
                                                        <span className="text-xs text-gray-400"> item cocok</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {insight.slice(0, 120)}
                                                        {insight.length > 120 ? '…' : ''}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">{formatDateTime(entry.created_at)}</td>
                                                </tr>
                                            );
                                        })}
                                        {dataset.recentAnalyses.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
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
