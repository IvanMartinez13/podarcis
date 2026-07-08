import type { ReactNode } from 'react';

type AdminTableProps = {
    columns: string[];
    children: ReactNode;
    empty?: ReactNode;
    isEmpty?: boolean;
};

export function AdminTable({
    columns,
    children,
    empty,
    isEmpty = false,
}: AdminTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-slate-950">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-[0.08em] text-slate-500 uppercase dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                        <tr>
                            {columns.map((column) => (
                                <th key={column} className="px-5 py-3">
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {!isEmpty && (
                        <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                            {children}
                        </tbody>
                    )}
                </table>
            </div>
            {isEmpty && (
                <div className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    {empty}
                </div>
            )}
        </div>
    );
}
