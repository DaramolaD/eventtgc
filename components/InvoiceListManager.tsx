"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, FileText, Landmark, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { confirmPayment, getBankDetails } from "@/app/actions/submissions";
import Link from "next/link";

type Invoice = any;

export default function InvoiceListManager({ initialInvoices }: { initialInvoices: Invoice[] }) {
    const [invoices, setInvoices] = useState(initialInvoices);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [bankDetails, setBankDetails] = useState<{ bankName: string; accountName: string; accountNumber: string; instructions: string } | null>(null);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    useEffect(() => {
        getBankDetails().then(setBankDetails);
    }, []);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(
            (inv) =>
                inv.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [invoices, searchQuery]);

    const paymentStatus = (inv: Invoice) => {
        if (inv.payment_confirmed_at) return { label: "Confirmed", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 };
        if (inv.payment_reported_at) return { label: "Awaiting confirmation", color: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle };
        return { label: "Awaiting payment", color: "bg-gray-50 text-gray-600 border-gray-200", icon: Clock };
    };

    const handleConfirmPayment = async (id: string) => {
        setConfirmingId(id);
        const result = await confirmPayment(id);
        if (result.success) {
            setInvoices((prev) =>
                prev.map((inv) =>
                    inv.id === id ? { ...inv, payment_confirmed_at: new Date().toISOString(), status: "confirmed" } : inv
                )
            );
            setSelectedInvoice((prev) =>
                prev?.id === id ? { ...prev, payment_confirmed_at: new Date().toISOString(), status: "confirmed" } : prev
            );
        }
        setConfirmingId(null);
    };

    return (
        <div className="flex flex-col">
            <div className="px-6 py-5 border-b border-[#f0f0f0]">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aaa] group-focus-within:text-[#e91e63] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by invoice #, email, or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-[#eee] bg-white px-5 py-3 pl-11 text-[13px] font-bold text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e91e63]/20 focus:border-[#e91e63] transition-all placeholder:text-[#ccc]"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-[11px] font-black uppercase tracking-widest text-[#aaa] border-b border-[#f5f5f5]">
                            <th className="px-10 py-5">Invoice</th>
                            <th className="px-8 py-5">Date</th>
                            <th className="px-8 py-5">Customer</th>
                            <th className="px-8 py-5">Package</th>
                            <th className="px-8 py-5">Payment</th>
                            <th className="px-10 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {filteredInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-[#888] font-medium">
                                    No invoices found.
                                </td>
                            </tr>
                        ) : (
                            filteredInvoices.map((inv) => {
                                const status = paymentStatus(inv);
                                const StatusIcon = status.icon;
                                return (
                                    <tr
                                        key={inv.id}
                                        onClick={() => setSelectedInvoice(inv)}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-10 py-5 font-mono text-[12px] font-bold text-[#1a1a1a]">
                                            {inv.invoice_number || "—"}
                                        </td>
                                        <td className="px-8 py-5 text-[#666] font-medium">
                                            {inv.invoice_generated_at
                                                ? new Date(inv.invoice_generated_at).toLocaleDateString(undefined, {
                                                      month: "short",
                                                      day: "numeric",
                                                      year: "numeric",
                                                  })
                                                : "—"}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="font-bold text-[#1a1a1a]">{inv.full_name || "—"}</span>
                                            <span className="block text-[12px] text-[#aaa]">{inv.email}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="capitalize font-medium text-[#666]">{inv.service_type} package</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border",
                                                    status.color
                                                )}
                                            >
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-10 py-5 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedInvoice(inv);
                                                }}
                                                className="p-2.5 rounded-xl bg-gray-50 text-[#aaa] hover:bg-[#fee2e2] hover:text-[#e91e63] transition-all border border-transparent hover:border-[#e91e63]/20"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {selectedInvoice && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedInvoice(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-[#eee] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#fee2e2] flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-[#e91e63]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#1a1a1a]">Invoice details</h3>
                                    <p className="font-mono text-xs text-[#888]">{selectedInvoice.invoice_number}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-[#888]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-5 flex-1">
                            <div>
                                <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider mb-2">Customer</p>
                                <p className="font-bold text-[#1a1a1a]">{selectedInvoice.full_name}</p>
                                <p className="text-sm text-[#666]">{selectedInvoice.email}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider mb-2">Booking</p>
                                <p className="font-medium text-[#1a1a1a] capitalize">{selectedInvoice.service_type} package</p>
                                <p className="text-sm text-[#666]">
                                    {selectedInvoice.event_location || selectedInvoice.rental_location || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider mb-2">Payment status</p>
                                {selectedInvoice.payment_confirmed_at ? (
                                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Confirmed on {new Date(selectedInvoice.payment_confirmed_at).toLocaleDateString()}
                                    </div>
                                ) : selectedInvoice.payment_reported_at ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-amber-700 font-medium">
                                            <AlertCircle className="h-5 w-5" />
                                            Client reported payment on{" "}
                                            {new Date(selectedInvoice.payment_reported_at).toLocaleDateString()}
                                        </div>
                                        <button
                                            onClick={() => handleConfirmPayment(selectedInvoice.id)}
                                            disabled={confirmingId === selectedInvoice.id}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#e91e63] text-white px-4 py-2.5 text-sm font-bold hover:bg-[#e91e63]/90 transition-all disabled:opacity-50"
                                        >
                                            {confirmingId === selectedInvoice.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4" />
                                            )}
                                            Confirm payment received
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-[#888] font-medium">
                                        <Clock className="h-5 w-5" />
                                        Awaiting payment
                                    </div>
                                )}
                            </div>
                            {bankDetails && (bankDetails.bankName || bankDetails.accountNumber) && (
                                <div className="pt-4 border-t border-[#eee]">
                                    <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Landmark className="h-4 w-4" />
                                        Bank details
                                    </p>
                                    <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
                                        {bankDetails.bankName && <p><span className="text-[#888]">Bank:</span> {bankDetails.bankName}</p>}
                                        {bankDetails.accountName && <p><span className="text-[#888]">Account:</span> {bankDetails.accountName}</p>}
                                        {bankDetails.accountNumber && <p><span className="text-[#888]">Number:</span> <span className="font-mono">{bankDetails.accountNumber}</span></p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
