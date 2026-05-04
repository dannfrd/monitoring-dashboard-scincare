import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="brand-page-wrap relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute -left-24 top-6 h-80 w-80 rounded-full bg-emerald-200 blur-3xl"></div>
                <div className="absolute -right-24 bottom-8 h-96 w-96 rounded-full bg-teal-200 blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-2xl backdrop-blur">
                <div className="grid min-h-[620px] lg:grid-cols-2">
                    <div className="hidden bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-3">
                                <ApplicationLogo className="h-10 w-10 fill-current text-white" />
                                <span className="text-xl font-semibold tracking-wide">SkinCare Admin</span>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">Admin Workspace</p>
                            <h1 className="text-3xl font-semibold leading-tight">
                                Monitoring cerdas untuk analisis skincare Anda.
                            </h1>
                            <p className="text-sm text-emerald-50/95">
                                Masuk sebagai admin untuk melihat ringkasan data, kesehatan backend, dan aktivitas analisis terbaru.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/35 bg-white/15 p-4 text-sm text-emerald-50">
                            Tetap terhubung dengan insight real-time dari pipeline OCR dan AI analyzer.
                        </div>
                    </div>

                    <div className="flex items-center p-6 sm:p-10 lg:p-12">
                        <div className="w-full">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
