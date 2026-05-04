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

export default function UserHistoriesIndex() {
    const { userHistories = [] } = usePage().props;

    const totalHistories = userHistories.length;
    const uniqueUsers = new Set(userHistories.map((item) => item.user_id).filter(Boolean)).size;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin Data</p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-emerald-950">
                        Histori User
                    </h2>
                </div>
            }
        >
            <Head title="Histori User" />

            <div className="py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Ringkasan Histori
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <MetricCard title="Total Histori" value={totalHistories} />
                            <MetricCard title="User Aktif" value={uniqueUsers} />
                            <MetricCard title="Histori Terbaru" value={totalHistories > 0 ? 'Ada' : 'Belum Ada'} />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                                Daftar Histori User
                            </h3>
                            <span className="text-xs text-emerald-700/70">Menampilkan {totalHistories} histori</span>
                        </div>
                        <div className="brand-card mt-3 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-emerald-100 text-sm">
                                    <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-700/85">
                                        <tr>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Analisis</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Waktu Analisis</th>
                                            <th className="px-4 py-3">Terlihat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-100 bg-white">
                                        {userHistories.map((item) => (
                                            <tr key={item.id} className="hover:bg-emerald-50/45">
                                                <td className="px-4 py-3 font-medium text-emerald-950">{item.id}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.user_name ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.user_email ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.analysis_id ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-800/90">{item.analysis_status ?? '-'}</td>
                                                <td className="px-4 py-3 text-emerald-700/75">{formatDateTime(item.analysis_created_at)}</td>
                                                <td className="px-4 py-3 text-emerald-700/75">{formatDateTime(item.viewed_at)}</td>
                                            </tr>
                                        ))}
                                        {userHistories.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-6 text-center text-emerald-700/75">
                                                    Belum ada histori user.
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
