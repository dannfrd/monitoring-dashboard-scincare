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

const normalizeText = (value, fallback = '-') => {
    if (!value) {
        return fallback;
    }

    return String(value);
};

const roleStyles = {
    admin: 'bg-emerald-100 text-emerald-700',
    system: 'bg-slate-100 text-slate-700',
    user: 'bg-sky-100 text-sky-700',
};

const providerStyles = {
    google: 'bg-amber-100 text-amber-700',
    manual: 'bg-emerald-100 text-emerald-700',
};

export default function UsersIndex() {
    const { users = [] } = usePage().props;

    const totalUsers = users.length;
    const activeUsers = users.filter((item) => (item.analysis_count ?? 0) > 0).length;
    const googleUsers = users.filter((item) => (item.provider ?? '').toLowerCase() === 'google').length;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin Flow</p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-emerald-950">
                        Data User
                    </h2>
                </div>
            }
        >
            <Head title="Data User" />

            <div className="py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                            Ringkasan User
                        </h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <MetricCard title="Total User" value={totalUsers} />
                            <MetricCard title="User Aktif" value={activeUsers} hint="Punya histori analisis" />
                            <MetricCard title="Login Google" value={googleUsers} />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/85">
                                Daftar User
                            </h3>
                            <span className="text-xs text-emerald-700/70">Menampilkan {totalUsers} user</span>
                        </div>
                        <div className="brand-card mt-3 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-emerald-100 text-sm">
                                    <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-700/85">
                                        <tr>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">Nama</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Role</th>
                                            <th className="px-4 py-3">Provider</th>
                                            <th className="px-4 py-3">Total Analisis</th>
                                            <th className="px-4 py-3">Analisis Terakhir</th>
                                            <th className="px-4 py-3">Terdaftar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-100 bg-white">
                                        {users.map((item) => {
                                            const role = normalizeText(item.role, 'user').toLowerCase();
                                            const provider = normalizeText(item.provider, 'manual').toLowerCase();
                                            const roleStyle = roleStyles[role] ?? 'bg-emerald-100 text-emerald-700';
                                            const providerStyle = providerStyles[provider] ?? 'bg-emerald-100 text-emerald-700';

                                            return (
                                                <tr key={item.id} className="hover:bg-emerald-50/45">
                                                    <td className="px-4 py-3 font-medium text-emerald-950">{item.id}</td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        {normalizeText(item.name)}
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        {normalizeText(item.email)}
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${roleStyle}`}>
                                                            {role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-800/90">
                                                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${providerStyle}`}>
                                                            {provider}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-800/90">{item.analysis_count ?? 0}</td>
                                                    <td className="px-4 py-3 text-emerald-700/75">
                                                        {formatDateTime(item.last_analysis_at)}
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-700/75">
                                                        {formatDateTime(item.created_at)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-6 text-center text-emerald-700/75">
                                                    Belum ada data user.
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
