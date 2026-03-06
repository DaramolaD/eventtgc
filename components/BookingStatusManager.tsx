"use client";

import { useState } from "react";
import { updateSubmissionStatus } from "@/app/actions/submissions";
import { cn } from "@/lib/utils";
import { Check, X, Clock, RefreshCw, MoreHorizontal, Eye } from "lucide-react";

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
            <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 rounded-b-[40px]">
                <div className="h-16 w-16 rounded-2xl bg-white border border-[#f5f5f5] flex items-center justify-center mb-6">
                    <Clock className="h-8 w-8 text-[#aaa]" />
                </div>
                <p className="text-xl font-black text-[#1a1a1a]">No submissions found.</p>
                <p className="text-sm text-[#888] mt-2 font-medium">New requests will appear here once submitted.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50/50 text-[11px] font-black uppercase tracking-widest text-[#aaa] border-b border-[#f5f5f5]">
                        <th className="px-10 py-6">ID</th>
                        <th className="px-8 py-6">Customer</th>
                        <th className="px-8 py-6">Type</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-10 py-6 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                    {submissions.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-10 py-6 font-mono text-[11px] font-bold text-[#666]">
                                #{s.id.slice(0, 8).toUpperCase()}
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#1a1a1a] text-[14px] leading-tight mb-1">{s.full_name}</span>
                                    <span className="text-[#888] text-[12px]">{s.email}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[11px] font-black border uppercase tracking-widest",
                                    s.service_type === 'rental' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                        s.service_type === 'service' ? "bg-pink-50 text-[#e91e63] border-pink-100" :
                                            "bg-purple-50 text-purple-600 border-purple-100"
                                )}>
                                    {s.service_type === 'both' ? 'Both' : s.service_type === 'service' ? 'Service' : 'Rental'}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <span className={cn(
                                    "inline-flex items-center px-4 py-1.5 rounded-xl text-[11px] font-black border uppercase tracking-widest",
                                    s.status === 'confirmed' ? "bg-green-50 text-green-600 border-green-100" :
                                        s.status === 'pending' ? "bg-pink-50 text-[#e91e63] border-pink-100" :
                                            s.status === 'cancelled' ? "bg-red-50 text-red-600 border-red-100" :
                                                "bg-gray-50 text-gray-500 border-gray-100"
                                )}>
                                    {s.status}
                                </span>
                            </td>
                            <td className="px-10 py-6 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    {s.status === 'pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(s.id, 'confirmed')}
                                            disabled={updatingId === s.id}
                                            className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all border border-green-100"
                                            title="Confirm Booking"
                                        >
                                            {updatingId === s.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleStatusUpdate(s.id, 'cancelled')}
                                        disabled={updatingId === s.id}
                                        className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100"
                                        title="Cancel Booking"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-white hover:text-[#e91e63] transition-all border border-transparent hover:border-[#f5f5f5] shadow-sm">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
