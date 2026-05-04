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

export default function IngredientIndex() {
    const { ingredientSummary = {}, ingredients = [] } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin Flow</p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-emerald-950">
                        Kelola Data Bahan
                    </h2>
                </div>
            }
        >
            <Head title="Kelola Data Bahan" />

            <div className="py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Ringkasan Data Bahan
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                            <MetricCard title="Total Ingredient" value={ingredientSummary.total ?? 0} />
                            <MetricCard title="Risiko Rendah" value={ingredientSummary.low_risk ?? 0} />
                            <MetricCard title="Risiko Sedang" value={ingredientSummary.medium_risk ?? 0} />
                            <MetricCard title="Risiko Tinggi" value={ingredientSummary.high_risk ?? ingredientSummary.high_comedogenic ?? 0} />
                            <MetricCard title="Risiko Tidak Diketahui" value={ingredientSummary.unknown_risk ?? 0} />
                        </div>
                        <div className="mt-2 grid gap-1 text-xs text-emerald-700/65 sm:grid-cols-2">
                            <p>Data ingredient diperbarui: {formatDateTime(ingredientSummary.last_updated_at)}</p>
                            <p>
                                Legacy metric - Allergen: {ingredientSummary.allergens ?? 0}, Tidak Aman Hamil: {ingredientSummary.unsafe_for_pregnancy ?? 0}
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                                Daftar Bahan
                            </h3>
                            <span className="text-xs text-emerald-700/70">Menampilkan {ingredients.length} bahan</span>
                        </div>
                        <div className="brand-card mt-3 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-emerald-100 text-sm">
                                    <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-700/85">
                                        <tr>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">Nama Bahan</th>
                                            <th className="px-4 py-3">Fungsi</th>
                                            <th className="px-4 py-3">Risk Level</th>
                                            <th className="px-4 py-3">Dipakai di Analisis</th>
                                            <th className="px-4 py-3">Terdaftar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-100 bg-white">
                                        {ingredients.map((item) => (
                                            <tr key={item.id} className="hover:bg-emerald-50/45">
                                                <td className="px-4 py-3 font-medium text-emerald-950">{item.id}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.name ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.function ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.risk_level ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.usage_count ?? 0} kali</td>
                                                <td className="px-4 py-3 text-emerald-700/75">{formatDateTime(item.created_at)}</td>
                                            </tr>
                                        ))}
                                        {ingredients.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-6 text-center text-emerald-700/75">
                                                    Belum ada data bahan.
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
