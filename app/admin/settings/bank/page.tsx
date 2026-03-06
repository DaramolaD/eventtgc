"use client";

import { useState, useEffect } from "react";
import { CreditCard, Save, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BankSettingsPage() {
    const [bankDetails, setBankDetails] = useState({
        bankName: "",
        accountName: "",
        accountNumber: "",
        instructions: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: string; text: string }>({ type: "", text: "" });

    useEffect(() => {
        if (!supabase) return;
        const db = supabase;
        async function fetchSettings() {
            const { data } = await db
                .from("settings")
                .select("value")
                .eq("key", "bank_details")
                .single();

            if (data?.value) {
                setBankDetails(data.value as { bankName: string; accountName: string; accountNumber: string; instructions: string });
            }
        }
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: "", text: "" });

        try {
            if (!supabase) {
                setMessage({ type: "error", text: "Database not configured." });
                return;
            }
            const { error } = await supabase
                .from("settings")
                .upsert({
                    key: "bank_details",
                    value: bankDetails
                }, { onConflict: "key" });

            if (error) {
                const msg = (error as { message?: string }).message ?? "Failed to save settings.";
                console.error("Save settings error:", msg, error);
                setMessage({ type: "error", text: msg });
                return;
            }
            setMessage({ type: "success", text: "Settings saved successfully." });
        } catch (error: unknown) {
            const err = error as { message?: string };
            const msg = err?.message ?? "Failed to save settings. Please try again.";
            console.error("Save settings error:", msg, error);
            setMessage({ type: "error", text: msg });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
                    <header className="space-y-4">
                        <Link href="/admin/bookings" prefetch={false} className="inline-flex items-center text-xs font-bold text-[#888] hover:text-[#e91e63] transition-colors group">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Submissions
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-black text-[#1a1a1a] mb-1 tracking-tight underline decoration-[#e91e63] decoration-4 underline-offset-4">
                                Bank Settings
                            </h1>
                            <p className="text-[#888] font-medium text-sm mt-2">
                                Configure your payment receiving details.
                            </p>
                        </div>
                    </header>

                    <div className="bg-white p-6 md:p-10 rounded-2xl border border-[#eee] shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden">
                        <form onSubmit={handleSave} className="space-y-10 relative z-10">
                            <div className="flex items-center space-x-5 pb-8 border-b border-gray-50">
                                <div className="h-14 w-14 rounded-2xl bg-pink-50 flex items-center justify-center text-[#e91e63]">
                                    <CreditCard size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#1a1a1a]">Payment Details</h2>
                                    <p className="text-[13px] font-medium text-[#aaa]">Where your payments will be sent</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-[#666] uppercase tracking-widest ml-1">Bank Name</label>
                                    <input
                                        type="text"
                                        value={bankDetails.bankName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-[14px] font-bold text-[#1a1a1a] focus:outline-none focus:ring-4 focus:ring-pink-500/5 focus:border-[#e91e63] transition-all placeholder:text-[#ccc]"
                                        placeholder="e.g. GTBank"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-[#666] uppercase tracking-widest ml-1">Account Name</label>
                                    <input
                                        type="text"
                                        value={bankDetails.accountName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-[14px] font-bold text-[#1a1a1a] focus:outline-none focus:ring-4 focus:ring-pink-500/5 focus:border-[#e91e63] transition-all placeholder:text-[#ccc]"
                                        placeholder="e.g. TGC Events Hub"
                                    />
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[11px] font-black text-[#666] uppercase tracking-widest ml-1">Account Number</label>
                                    <input
                                        type="text"
                                        value={bankDetails.accountNumber}
                                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-[14px] font-bold text-[#1a1a1a] focus:outline-none focus:ring-4 focus:ring-pink-500/5 focus:border-[#e91e63] transition-all placeholder:text-[#ccc]"
                                        placeholder="0000000000"
                                    />
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[11px] font-black text-[#666] uppercase tracking-widest ml-1">Special Instructions (Optional)</label>
                                    <textarea
                                        value={bankDetails.instructions}
                                        onChange={(e) => setBankDetails({ ...bankDetails, instructions: e.target.value })}
                                        rows={3}
                                        className="w-full rounded-[24px] border border-gray-200 bg-white px-6 py-5 text-[14px] font-bold text-[#1a1a1a] focus:outline-none focus:ring-4 focus:ring-pink-500/5 focus:border-[#e91e63] transition-all resize-none placeholder:text-[#ccc] leading-relaxed"
                                        placeholder="Any additional info for payments..."
                                    />
                                </div>
                            </div>

                            {message.text && (
                                <div className={cn(
                                    "p-6 rounded-2xl flex items-center space-x-3 text-[13px] font-bold animate-in fade-in slide-in-from-top-1",
                                    message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                                )}>
                                    <AlertCircle size={18} />
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full rounded-3xl bg-[#e91e63] py-6 font-black text-white shadow-xl shadow-pink-100 transition-all hover:bg-[#d81b60] hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {isSaving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                <span className="text-[15px]">{isSaving ? "Saving..." : "Save Changes"}</span>
                            </button>
                        </form>
                    </div>
                </div>
    );
}
