import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

const MetricCard = ({ title, value, hint }) => (
    <div className="brand-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700/90">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-emerald-950">{value}</p>
        {hint ? <p className="mt-1 text-xs text-emerald-700/70">{hint}</p> : null}
    </div>
);

const truncate = (value, maxLength = 160) => {
    if (!value) {
        return '-';
    }

    const text = String(value);
    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength)}...`;
};

export default function AnalysisDetailsIndex() {
    const { analysisDetails = [] } = usePage().props;

    const totalDetails = analysisDetails.length;
    const highRisk = analysisDetails.filter((item) => (item.ingredient_risk_level ?? '').toLowerCase() === 'high').length;
    const withBenefit = analysisDetails.filter((item) => item.benefit && String(item.benefit).trim() !== '').length;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin Data</p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-emerald-950">
                        Detail Analisis
                    </h2>
                </div>
            }
        >
            <Head title="Detail Analisis" />

            <div className="py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Ringkasan Detail
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <MetricCard title="Total Detail" value={totalDetails} />
                            <MetricCard title="Risiko Tinggi" value={highRisk} />
                            <MetricCard title="Ada Benefit" value={withBenefit} />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                                Daftar Detail Analisis
                            </h3>
                            <span className="text-xs text-emerald-700/70">Menampilkan {totalDetails} detail</span>
                        </div>
                        <div className="brand-card mt-3 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-emerald-100 text-sm">
                                    <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-700/85">
                                        <tr>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">Analisis</th>
                                            <th className="px-4 py-3">Ingredient</th>
                                            <th className="px-4 py-3">Risk</th>
                                            <th className="px-4 py-3">Fungsi</th>
                                            <th className="px-4 py-3">Benefit</th>
                                            <th className="px-4 py-3">Risk Notes</th>
                                            <th className="px-4 py-3">Status Analisis</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-100 bg-white">
                                        {analysisDetails.map((item) => (
                                            <tr key={item.id} className="hover:bg-emerald-50/45">
                                                <td className="px-4 py-3 font-medium text-emerald-950">{item.id}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.analysis_id ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">
                                                    {item.ingredient_name ?? '-'}
                                                </td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.ingredient_risk_level ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.function ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{truncate(item.benefit)}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{truncate(item.risk)}</td>
                                                <td className="px-4 py-3 text-emerald-700/75">{item.analysis_status ?? '-'}</td>
                                            </tr>
                                        ))}
                                        {analysisDetails.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-6 text-center text-emerald-700/75">
                                                    Belum ada detail analisis.
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
