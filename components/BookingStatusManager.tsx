"use client";

import { useState } from "react";
import { updateSubmissionStatus } from "@/app/actions/submissions";
import { cn } from "@/lib/utils";
import { Check, X, Clock, RefreshCw, MoreHorizontal, ShieldCheck, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingStatusManager({ initialSubmissions }: { initialSubmissions: any[] }) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        const result = await updateSubmissionStatus(id, newStatus);
        if (result.success) {
            setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus } : s));
        }
        setUpdatingId(null);
    };

    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-slate-50/20 rounded-[32px]">
                <div className="h-20 w-20 rounded-[24px] bg-slate-100 flex items-center justify-center mb-6">
                    <Clock className="h-10 w-10 text-slate-300" />
                </div>
                <p className="text-xl font-black text-[#0f172a]">No records found.</p>
                <p className="text-sm text-slate-500 mt-2 font-bold tracking-tight">The operational ledger is currently empty.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                        <th className="px-10 py-7">Transactional ID</th>
                        <th className="px-8 py-7">Stakeholder</th>
                        <th className="px-8 py-7">Classification</th>
                        <th className="px-8 py-7">Lifecycle Status</th>
                        <th className="px-10 py-7 text-right">Operations</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                    {submissions.map((s) => (
                        <motion.tr
                            layout
                            key={s.id}
                            className="hover:bg-slate-50/50 transition-colors group"
                        >
                            <td className="px-10 py-7">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <span className="font-mono text-[11px] font-black text-[#0f172a] opacity-80">
                                        TXN-{s.id.slice(0, 6).toUpperCase()}
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-7">
                                <div className="flex flex-col">
                                    <span className="font-black text-[#0f172a] text-[14px] leading-tight mb-0.5 tracking-tight">{s.full_name}</span>
                                    <span className="text-slate-400 text-[12px] font-bold tracking-tight">{s.email}</span>
                                </div>
                            </td>
                            <td className="px-8 py-7">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                    s.service_type === 'rental' ? "bg-indigo-50 text-indigo-600 border-indigo-100/50" :
                                        s.service_type === 'service' ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" :
                                            "bg-amber-50 text-amber-600 border-amber-100/50"
                                )}>
                                    {s.service_type === 'both' ? 'Strategic Package' : s.service_type === 'service' ? 'Event Services' : 'Global Rentals'}
                                </span>
                            </td>
                            <td className="px-8 py-7">
                                <div className="flex items-center space-x-2">
                                    <span className={cn(
                                        "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                        s.status === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            s.status === 'pending' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                s.status === 'cancelled' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                    "bg-slate-50 text-slate-400 border-slate-100"
                                    )}>
                                        {s.status === 'pending' && <Clock className="h-3 w-3 mr-2 animate-pulse" />}
                                        {s.status}
                                    </span>
                                </div>
                            </td>
                            <td className="px-10 py-7 text-right">
                                <div className="flex items-center justify-end space-x-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {s.status === 'pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(s.id, 'confirmed')}
                                            disabled={updatingId === s.id}
                                            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-100/50 shadow-sm"
                                            title="Verify & Confirm"
                                        >
                                            {updatingId === s.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleStatusUpdate(s.id, 'cancelled')}
                                        disabled={updatingId === s.id}
                                        className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all border border-rose-100/50 shadow-sm"
                                        title="Cancel Cycle"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
