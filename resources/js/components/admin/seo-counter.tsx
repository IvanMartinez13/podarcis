type SeoCounterProps = {
    value: string;
    max: number;
};

export function SeoCounter({ value, max }: SeoCounterProps) {
    const length = value.length;
    const isOver = length > max;

    return (
        <span
            className={
                isOver
                    ? 'text-xs font-medium text-red-600 dark:text-red-400'
                    : 'text-xs text-slate-500 dark:text-slate-400'
            }
        >
            {length}/{max}
        </span>
    );
}
