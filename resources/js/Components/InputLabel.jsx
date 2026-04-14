export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-semibold text-emerald-900 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
