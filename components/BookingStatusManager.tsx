"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { updateSubmissionStatus, generateInvoice, getBankDetails } from "@/app/actions/submissions";
import { cn } from "@/lib/utils";
import { Check, X, Clock, RefreshCw, Eye, Search, ChevronLeft, ChevronRight, FileText, Loader2, AlertCircle, CreditCard } from "lucide-react";

export default function BookingStatusManager({ initialSubmissions }: { initialSubmissions: any[] }) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
    const [generatingInvoiceId, setGeneratingInvoiceId] = useState<string | null>(null);
    const [showBankRequiredModal, setShowBankRequiredModal] = useState(false);
    const [invoiceError, setInvoiceError] = useState<string | null>(null);

    const tabs = ["All", "Rentals", "Services", "Pkg (Both)"];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(s => {
            const matchesSearch =
                s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.id?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTab =
                activeTab === "All" ||
                (activeTab === "Rentals" && s.service_type === "rental") ||
                (activeTab === "Services" && s.service_type === "service") ||
                (activeTab === "Pkg (Both)" && s.service_type === "both");

            return matchesSearch && matchesTab;
        });
    }, [submissions, searchQuery, activeTab]);

    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const paginatedSubmissions = filteredSubmissions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        const result = await updateSubmissionStatus(id, newStatus);
        if (result.success) {
            setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus } : s));
        }
        setUpdatingId(null);
    };

    return (
        <div className="flex flex-col">
            {/* Toolbar: Tabs and Search */}
            <div className="px-6 py-6 border-b border-[#f0f0f0] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center p-1 bg-[#fafafa] rounded-xl border border-[#eee] w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={cn(
                                "px-4 py-2 text-[12px] font-bold rounded-lg transition-all",
                                activeTab === tab
                                    ? "bg-white text-[#1a1a1a] shadow-sm border border-[#eee]"
                                    : "text-[#888] hover:text-[#e91e63]"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative group w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aaa] group-focus-within:text-[#e91e63] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-[#eee] bg-white px-5 py-3 pl-11 text-[13px] font-bold text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e91e63]/20 focus:border-[#e91e63] transition-all placeholder:text-[#ccc]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#fafafa] text-[11px] font-black uppercase tracking-widest text-[#888] border-b border-[#eee]">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {paginatedSubmissions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-32 text-center text-[#888] font-medium">
                                    No submissions found.
                                </td>
                            </tr>
                        ) : (
                            paginatedSubmissions.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-[#888]">
                                        #{s.id.slice(0, 8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#1a1a1a] text-[13px] leading-tight mb-0.5">{s.full_name}</span>
                                            <span className="text-[#888] text-[12px]">{s.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[11px] font-black border uppercase tracking-widest bg-gray-50 text-[#888] border-gray-100",
                                            s.service_type === 'rental' && "bg-blue-50 text-blue-600 border-blue-100",
                                            s.service_type === 'service' && "bg-pink-50 text-[#e91e63] border-pink-100",
                                            s.service_type === 'both' && "bg-purple-50 text-purple-600 border-purple-100"
                                        )}>
                                            {s.service_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
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
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {s.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(s.id, 'confirmed')}
                                                    disabled={updatingId === s.id}
                                                    className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all border border-green-100"
                                                >
                                                    {updatingId === s.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check size={16} />}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { setSelectedSubmission(s); setInvoiceError(null); }}
                                                className="p-2.5 rounded-xl text-[#aaa] bg-white hover:text-[#e91e63] transition-all border border-[#f0f0f0] shadow-sm"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(s.id, 'cancelled')}
                                                disabled={updatingId === s.id}
                                                className="p-2.5 rounded-xl text-red-600 bg-red-100 transition-all border border-red-100"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-[#eee] flex items-center justify-between bg-[#fafafa]">
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

            {/* Bank required modal */}
            {showBankRequiredModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-6" onClick={() => setShowBankRequiredModal(false)}>
                    <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                                <AlertCircle className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1a1a1a]">Add bank details first</h3>
                                <p className="text-[13px] text-[#666] mt-0.5">Set up your bank info before generating invoices.</p>
                            </div>
                        </div>
                        <p className="text-[13px] text-[#666] mb-6">Invoices include payment details. Go to Bank Settings to add your bank name, account name, and account number.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowBankRequiredModal(false)}
                                className="flex-1 rounded-2xl border border-[#eee] px-4 py-3 text-[13px] font-bold text-[#666] hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <Link
                                href="/admin/settings/bank"
                                prefetch={false}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e91e63] text-white px-4 py-3 text-[13px] font-bold hover:bg-[#d81b60] transition-all"
                            >
                                <CreditCard className="h-4 w-4" />
                                Go to Bank Settings
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal Overlay */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6" onClick={() => { setSelectedSubmission(null); setInvoiceError(null); }}>
                    <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-serif font-black text-[#1a1a1a]">Details</h2>
                                    <p className="text-[#aaa] font-bold text-[13px] uppercase tracking-widest mt-1">Submission #{selectedSubmission.id.slice(0, 8)}</p>
                                </div>
                                <button onClick={() => { setSelectedSubmission(null); setInvoiceError(null); }} className="p-4 rounded-2xl bg-gray-50 text-[#aaa] hover:text-[#1a1a1a] transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto pr-2 space-y-8 max-h-[70vh] custom-scrollbar">
                                <section>
                                    <h3 className="text-[11px] font-black uppercase text-[#e91e63] tracking-[0.2em] mb-4">Customer Info</h3>
                                    <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                        <div>
                                            <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Name</p>
                                            <p className="font-bold text-[#1a1a1a]">{selectedSubmission.full_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Email</p>
                                            <p className="font-bold text-[#1a1a1a]">{selectedSubmission.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Phone</p>
                                            <p className="font-bold text-[#1a1a1a]">{selectedSubmission.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Type</p>
                                            <p className="font-bold text-[#1a1a1a] capitalize">{selectedSubmission.service_type}</p>
                                        </div>
                                    </div>
                                </section>

                                {selectedSubmission.service_type !== 'service' && (
                                    <section>
                                        <h3 className="text-[11px] font-black uppercase text-[#e91e63] tracking-[0.2em] mb-4">Rental Data</h3>
                                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Date</p>
                                                    <p className="font-bold text-[#1a1a1a]">{selectedSubmission.rental_date || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Location</p>
                                                    <p className="font-bold text-[#1a1a1a]">{selectedSubmission.rental_location || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Items Needed</p>
                                                <p className="font-bold text-[#1a1a1a]">{selectedSubmission.items_needed || 'None specified'}</p>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {selectedSubmission.service_type !== 'rental' && (
                                    <section>
                                        <h3 className="text-[11px] font-black uppercase text-[#e91e63] tracking-[0.2em] mb-4">Event Data</h3>
                                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Date</p>
                                                    <p className="font-bold text-[#1a1a1a]">{selectedSubmission.event_date || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Guests</p>
                                                    <p className="font-bold text-[#1a1a1a]">{selectedSubmission.guest_count || '0'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Services</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {Array.isArray(selectedSubmission.services_needed) && selectedSubmission.services_needed.length > 0 ? (
                                                        selectedSubmission.services_needed.map((svc: string) => (
                                                            <span key={svc} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#666]">
                                                                {svc}
                                                            </span>
                                                        ))
                                                    ) : <span className="text-[#888] italic">No services selected</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                <section>
                                    <h3 className="text-[11px] font-black uppercase text-[#e91e63] tracking-[0.2em] mb-4">Invoice</h3>
                                    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                        {selectedSubmission.invoice_generated_at ? (
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-[11px] font-black text-[#aaa] uppercase tracking-widest mb-1">Invoice number</p>
                                                    <p className="font-bold text-[#1a1a1a]">{selectedSubmission.invoice_number || '—'}</p>
                                                    <p className="text-[12px] text-[#888] mt-1">
                                                        Generated {new Date(selectedSubmission.invoice_generated_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-green-50 text-green-700 border border-green-100 text-[12px] font-bold">
                                                    Invoice generated — visible in My Bookings
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-4">
                                                {invoiceError && (
                                                    <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[13px] font-medium">
                                                        {invoiceError}
                                                    </div>
                                                )}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <p className="text-[13px] text-[#666] font-medium">No invoice generated yet. Generate one so the customer can see it in My Bookings.</p>
                                                    <button
                                                    type="button"
                                                    onClick={async () => {
                                                        if (!selectedSubmission?.id) return;
                                                        const bank = await getBankDetails();
                                                        const hasBank = bank && (bank.bankName?.trim() || bank.accountName?.trim() || bank.accountNumber?.trim());
                                                        if (!hasBank) {
                                                            setShowBankRequiredModal(true);
                                                            return;
                                                        }
                                                        setGeneratingInvoiceId(selectedSubmission.id);
                                                        setInvoiceError(null);
                                                        const result = await generateInvoice(selectedSubmission.id);
                                                        setGeneratingInvoiceId(null);
                                                        if (result.success) {
                                                            setSubmissions(submissions.map(s =>
                                                                s.id === selectedSubmission.id
                                                                    ? { ...s, invoice_generated_at: new Date().toISOString(), invoice_number: result.invoice_number }
                                                                    : s
                                                            ));
                                                            setSelectedSubmission((prev: any) => prev ? { ...prev, invoice_generated_at: new Date().toISOString(), invoice_number: result.invoice_number } : null);
                                                        } else {
                                                            setInvoiceError(result.error ?? "Failed to generate invoice");
                                                        }
                                                    }}
                                                    disabled={generatingInvoiceId === selectedSubmission.id}
                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e91e63] text-white px-5 py-3 text-[13px] font-bold hover:bg-[#c2185b] transition-all disabled:opacity-60 shrink-0"
                                                >
                                                    {generatingInvoiceId === selectedSubmission.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <FileText className="h-4 w-4" />
                                                    )}
                                                    {generatingInvoiceId === selectedSubmission.id ? 'Generating…' : 'Generate invoice'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
