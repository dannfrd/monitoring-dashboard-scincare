import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-semibold leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-emerald-500 text-emerald-800 focus:border-emerald-600'
                    : 'border-transparent text-emerald-700/80 hover:border-emerald-200 hover:text-emerald-800 focus:border-emerald-200 focus:text-emerald-800') +
                className
            }
        >
            {children}
        </Link>
    );
}
