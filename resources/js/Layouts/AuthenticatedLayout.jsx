import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, monitoringStatus } = usePage().props;
    const user = auth.user;

    const monitoringHealth = monitoringStatus?.status ?? 'unknown';
    const monitoringColor =
        monitoringHealth === 'up'
            ? 'bg-emerald-500'
            : monitoringHealth === 'degraded'
              ? 'bg-amber-500'
              : 'bg-rose-500';

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const navigation = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
        },
        {
            label: 'Monitoring',
            href: route('monitoring.index'),
            active: route().current('monitoring.*'),
            showStatus: true,
        },
        {
            label: 'Analisis User',
            href: route('analysis.index'),
            active: route().current('analysis.*'),
        },
        {
            label: 'Detail Analisis',
            href: route('analysis-details.index'),
            active: route().current('analysis-details.*'),
        },
        {
            label: 'Histori User',
            href: route('user-histories.index'),
            active: route().current('user-histories.*'),
        },
        {
            label: 'Data User',
            href: route('users.index'),
            active: route().current('users.*'),
        },
        {
            label: 'Produk',
            href: route('products.index'),
            active: route().current('products.*'),
        },
        {
            label: 'Rekomendasi',
            href: route('recommendations.index'),
            active: route().current('recommendations.*'),
        },
        {
            label: 'Data Bahan',
            href: route('ingredients.index'),
            active: route().current('ingredients.*'),
        },
    ];

    const userInitial = (user?.name ?? 'U').trim().charAt(0).toUpperCase();

    return (
        <div className="brand-page-wrap min-h-screen">
            <div className="flex min-h-screen">
                <aside className="hidden w-72 border-r border-emerald-100/80 bg-white/80 backdrop-blur lg:flex">
                    <div className="flex min-h-screen flex-1 flex-col">
                        <div className="px-6 pt-6">
                            <Link href={route('dashboard')} className="flex items-center gap-3">
                                <ApplicationLogo className="block h-10 w-auto fill-current text-emerald-600" />
                                <div>
                                    <p className="text-sm font-semibold tracking-wide text-emerald-900">SkinCare Admin</p>
                                    <p className="text-xs text-emerald-700/70">Monitoring Dashboard</p>
                                </div>
                            </Link>
                        </div>

                        <div className="mt-8 flex-1 px-4">
                            <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600/80">
                                Menu
                            </p>
                            <nav className="mt-3 flex flex-col gap-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                            item.active
                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                : 'text-emerald-900/80 hover:bg-emerald-50 hover:text-emerald-900'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {item.label}
                                            {item.showStatus ? (
                                                <span
                                                    className={`h-2 w-2 rounded-full ${monitoringColor}`}
                                                    aria-label={`Monitoring status: ${monitoringHealth}`}
                                                ></span>
                                            ) : null}
                                        </span>
                                        {item.active ? (
                                            <span className="text-xs font-semibold uppercase tracking-[0.2em]">aktif</span>
                                        ) : null}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="border-t border-emerald-100/70 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-semibold text-emerald-700">
                                    {userInitial}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-emerald-950">{user.name}</p>
                                    <p className="truncate text-xs text-emerald-700/70">{user.email}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex w-full rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex w-full items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-800 transition duration-150 ease-in-out hover:bg-emerald-100 hover:text-emerald-900 focus:outline-none"
                                            >
                                                Akun Admin
                                                <svg
                                                    className="h-4 w-4 text-emerald-700"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex min-h-screen flex-1 flex-col">
                    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-emerald-100/80 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown((previousState) => !previousState)
                            }
                            className="inline-flex items-center justify-center rounded-xl p-2 text-emerald-600 transition duration-150 ease-in-out hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <Link href={route('dashboard')} className="flex items-center gap-2">
                            <ApplicationLogo className="block h-8 w-auto fill-current text-emerald-600" />
                            <span className="text-sm font-semibold tracking-wide text-emerald-900">SkinCare Admin</span>
                        </Link>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition duration-150 ease-in-out hover:bg-emerald-100 hover:text-emerald-900 focus:outline-none"
                                >
                                    {userInitial}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' lg:hidden'}>
                        <div className="space-y-1 border-b border-emerald-100 bg-white px-4 pb-4 pt-3">
                            {navigation.map((item) => (
                                <ResponsiveNavLink key={item.href} href={item.href} active={item.active}>
                                    <span className="flex items-center gap-2">
                                        {item.label}
                                        {item.showStatus ? (
                                            <span
                                                className={`h-2 w-2 rounded-full ${monitoringColor}`}
                                                aria-hidden
                                            ></span>
                                        ) : null}
                                    </span>
                                </ResponsiveNavLink>
                            ))}
                        </div>
                        <div className="border-b border-emerald-100 bg-white px-4 py-4">
                            <p className="text-sm font-semibold text-emerald-950">{user.name}</p>
                            <p className="text-xs text-emerald-700/70">{user.email}</p>
                        </div>
                    </div>

                    {header && (
                        <header className="border-b border-emerald-100/60 bg-white/70 shadow-sm backdrop-blur">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}
