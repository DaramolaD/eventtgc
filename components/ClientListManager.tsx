"use client";

import { useState, useMemo } from "react";
import { Search, UserCircle, Mail, Phone, Calendar, MoreHorizontal, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
    name: string;
    email: string;
    phone: string;
    totalBookings: number;
    lastBooking: string;
}

export default function ClientListManager({ initialClients, submissions = [] }: { initialClients: Client[]; submissions?: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const itemsPerPage = 5;

    const clientBookings = selectedClient
        ? submissions.filter((s) => s.email === selectedClient.email)
        : [];

    const filteredClients = useMemo(() => {
        return initialClients.filter(c =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [initialClients, searchQuery]);

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1); // Reset to first page on search
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-black text-[#1a1a1a] mb-1 tracking-tight underline decoration-[#e91e63] decoration-4 underline-offset-4">
                        Clients
                    </h1>
                    <p className="text-[#888] font-medium text-sm mt-2">Manage and view your customer database.</p>
                </div>
                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aaa] group-focus-within:text-[#e91e63] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-[#eee] bg-white px-5 py-3 pl-11 text-[13px] font-bold text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e91e63]/20 focus:border-[#e91e63] transition-all shadow-sm"
                    />
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-[#eee] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[11px] font-black uppercase tracking-widest text-[#aaa] border-b border-[#f5f5f5]">
                                <th className="px-10 py-6">Client ID</th>
                                <th className="px-8 py-6">Customer</th>
                                <th className="px-8 py-6">Phone</th>
                                <th className="px-8 py-6">Engagements</th>
                                <th className="px-10 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {paginatedClients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center text-[#888] font-medium">
                                        No clients found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedClients.map((client) => (
                                    <tr
                                        key={client.email}
                                        onClick={() => setSelectedClient(client)}
                                        className="hover:bg-gray-50/30 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-10 py-6 font-mono text-[11px] font-bold text-[#aaa]">
                                            #{client.email.split('@')[0].toUpperCase()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#1a1a1a] text-[14px] leading-tight mb-1 group-hover:text-[#e91e63] transition-colors">
                                                    {client.name}
                                                </span>
                                                <span className="text-[#aaa] text-[12px]">{client.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[#666] font-bold text-[13px]">
                                            {client.phone}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2">
                                                <span className="inline-flex items-center px-3 py-1 bg-gray-50 text-[12px] font-black text-[#1a1a1a] rounded-lg border border-gray-100">
                                                    {client.totalBookings}
                                                </span>
                                                <span className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Bookings</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }}
                                                className="p-2.5 rounded-xl bg-gray-50 text-[#aaa] hover:bg-white hover:text-[#e91e63] transition-all border border-transparent hover:border-[#f0f0f0] shadow-sm inline-flex items-center gap-1.5"
                                            >
                                                <Eye size={16} />
                                                <span className="text-xs font-bold">View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Client detail modal */}
            {selectedClient && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedClient(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-[#eee] flex items-center justify-between">
                            <h3 className="text-xl font-black text-[#1a1a1a]">Client Details</h3>
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <p className="text-[11px] font-black text-[#888] uppercase tracking-widest mb-1">Contact</p>
                                <p className="font-bold text-[#1a1a1a]">{selectedClient.name}</p>
                                <p className="text-sm text-[#666]">{selectedClient.email}</p>
                                <p className="text-sm text-[#666]">{selectedClient.phone || "—"}</p>
                                <p className="text-xs font-bold text-[#e91e63] mt-2">{selectedClient.totalBookings} booking(s)</p>
                            </div>
                            <p className="text-[11px] font-black text-[#888] uppercase tracking-widest mb-3">Bookings</p>
                            {clientBookings.length === 0 ? (
                                <p className="text-[#888] text-sm py-4">No bookings found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {clientBookings.map((s) => (
                                        <div key={s.id} className="p-4 rounded-xl border border-[#eee] bg-white">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                    s.status === "confirmed" ? "bg-green-100 text-green-700" :
                                                    s.status === "pending" ? "bg-amber-100 text-amber-700" :
                                                    "bg-gray-100 text-gray-600"
                                                )}>
                                                    {s.status}
                                                </span>
                                                <span className="font-mono text-[10px] text-[#888]">#{s.id?.slice(0, 8)}</span>
                                            </div>
                                            <p className="font-bold text-[#1a1a1a] capitalize">{s.service_type} Package</p>
                                            <p className="text-sm text-[#666]">{s.event_location || s.rental_location || "—"}</p>
                                            <p className="text-xs text-[#888] mt-1">
                                                {s.event_date ? new Date(s.event_date).toLocaleDateString() : s.rental_date ? new Date(s.rental_date).toLocaleDateString() : "—"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-10 py-6 border-t border-[#f5f5f5] flex items-center justify-between bg-gray-50/20">
                        <p className="text-[12px] font-bold text-[#aaa] uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-3 rounded-2xl border border-gray-100 bg-white text-[#1a1a1a] disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-3 rounded-2xl border border-gray-100 bg-white text-[#1a1a1a] disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
