import React from 'react';

export function BarChart({ data, dataKey, label, color = '#7c3aed' }) {
    const maxVal = Math.max(...data.map(d => d[dataKey]), 1);
    return (
        <div className="w-full">
            <div className="flex items-end gap-2 h-40">
                {data.map((d, i) => {
                    const h = (d[dataKey] / maxVal) * 100;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <span className="text-[10px] font-semibold text-gray-600 absolute -top-5 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 shadow-sm rounded z-10">{d[dataKey]}</span>
                            <div
                                className="w-full rounded-t-md transition-all duration-500"
                                style={{ height: `${Math.max(h, 4)}%`, backgroundColor: color, minHeight: '4px' }}
                            />
                            <span className="text-[9px] text-gray-400 truncate w-full text-center">{d.month?.split(' ')[0]}</span>
                        </div>
                    );
                })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-2 font-medium">{label}</p>
        </div>
    );
}

export function DonutChart({ accepted, rejected, pending }) {
    const total = accepted + rejected + pending || 1;
    const r = 50, cx = 60, cy = 60, stroke = 14;
    const circumference = 2 * Math.PI * r;
    const segments = [
        { value: accepted, color: '#10b981', label: 'Diterima' },
        { value: pending, color: '#f59e0b', label: 'Menunggu' },
        { value: rejected, color: '#ef4444', label: 'Ditolak' },
    ];
    let offset = 0;

    return (
        <div className="flex flex-col items-center gap-3">
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
                {segments.map((seg, i) => {
                    const dashLen = (seg.value / total) * circumference;
                    const el = (
                        <circle
                            key={i}
                            cx={cx} cy={cy} r={r}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={stroke}
                            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                            strokeDashoffset={-offset}
                            transform={`rotate(-90 ${cx} ${cy})`}
                            className="transition-all duration-700"
                        />
                    );
                    offset += dashLen;
                    return el;
                })}
                <text x={cx} y={cy - 4} textAnchor="middle" className="fill-gray-800 text-lg font-bold">{total}</text>
                <text x={cx} y={cy + 12} textAnchor="middle" className="fill-gray-400 text-[10px]">Total</text>
            </svg>
            <div className="flex gap-4">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }}></div>
                        <span className="text-[11px] text-gray-500">{seg.label} ({seg.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function StatCard({ icon, label, value, color, subtext }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-sm text-gray-400 font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
                {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
            </div>
        </div>
    );
}
