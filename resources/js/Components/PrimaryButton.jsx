export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-2xl border border-transparent bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition duration-150 ease-in-out hover:bg-emerald-600 focus:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 active:bg-emerald-700 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
