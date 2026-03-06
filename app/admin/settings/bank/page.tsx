"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import { CreditCard, Save, RefreshCw, AlertCircle, ArrowLeft, ShieldCheck, Activity } from "lucide-react";
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
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        async function fetchSettings() {
            const { data, error } = await supabase
                .from("settings")
                .select("value")
                .eq("key", "bank_details")
                .single();

            if (data) {
                setBankDetails(data.value);
            }
        }
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const { error } = await supabase
                .from("settings")
                .upsert({
                    key: "bank_details",
                    value: bankDetails
                }, { onConflict: "key" });

            if (error) throw error;
            setMessage({ type: "success", text: "Enterprise configuration synchronized successfully." });
        } catch (error) {
            console.error("Save settings error:", error);
            setMessage({ type: "error", text: "Critical: Failed to update disbursement parameters." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fcfdfe]">
            <AdminSidebar />
            <main className="flex-grow pl-72 py-12 px-10">
                <div className="max-w-4xl mx-auto space-y-12">
                    <header className="space-y-6">
                        <Link href="/admin-dashboard" className="inline-flex items-center text-[13px] font-black text-slate-400 hover:text-indigo-600 transition-all tracking-[0.1em] uppercase group">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Return to Hub
                        </Link>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-[12px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                                <Activity className="h-3 w-3" />
                                <span>Financial Infrastructure</span>
                            </div>
                            <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">
                                Disbursement <span className="text-slate-400 font-medium">Configuration</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-[15px]">
                                Establish the primary gateway for client settlements and financial routing.
                            </p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-12">
                        <form onSubmit={handleSave} className="bg-white p-16 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.02]">
                                <CreditCard size={150} />
                            </div>

                            <div className="flex items-center space-x-5 pb-10 border-b border-slate-50 relative z-10">
                                <div className="h-16 w-16 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                                    <CreditCard className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Settlement Parameters</h2>
                                    <p className="text-[13px] font-bold text-slate-400 mt-1">Configure your institutional destination</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Institutional Entity</label>
                                    <input
                                        type="text"
                                        value={bankDetails.bankName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-7 py-5 text-[14px] font-black text-[#0f172a] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300 shadow-sm"
                                        placeholder="e.g. Apex Global Bank"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Fiduciary Title</label>
                                    <input
                                        type="text"
                                        value={bankDetails.accountName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-7 py-5 text-[14px] font-black text-[#0f172a] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300 shadow-sm"
                                        placeholder="e.g. TGC Operations Group"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Routing Matrix (Acct Num)</label>
                                    <input
                                        type="text"
                                        value={bankDetails.accountNumber}
                                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-7 py-5 text-[14px] font-black text-[#0f172a] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300 shadow-sm"
                                        placeholder="0000 0000 0000"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Compliance Descriptor</label>
                                    <div className="flex items-center px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 space-x-3">
                                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                        <span className="text-[13px] font-bold">Standard SEC Verified</span>
                                    </div>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Operational Instructions</label>
                                    <textarea
                                        value={bankDetails.instructions}
                                        onChange={(e) => setBankDetails({ ...bankDetails, instructions: e.target.value })}
                                        rows={4}
                                        className="w-full rounded-[24px] border border-slate-200 bg-white px-7 py-6 text-[14px] font-black text-[#0f172a] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-300 shadow-sm leading-relaxed"
                                        placeholder="Specify disbursement windows or institutional requirements..."
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {message.text && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={cn(
                                            "p-7 rounded-[24px] flex items-center space-x-4 text-[13px] font-bold",
                                            message.type === "success"
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50 shadow-sm"
                                                : "bg-rose-50 text-rose-700 border border-rose-100/50 shadow-sm"
                                        )}
                                    >
                                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", message.type === "success" ? "bg-emerald-100" : "bg-rose-100")}>
                                            <AlertCircle className="h-4 w-4" />
                                        </div>
                                        <span>{message.text}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full rounded-[28px] bg-[#0f172a] py-7 font-black text-white shadow-2xl shadow-indigo-200 transition-all hover:bg-slate-800 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-4 tracking-[0.1em] uppercase relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/5 to-indigo-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                {isSaving ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                                <span className="text-[15px]">{isSaving ? "Synchronizing..." : "Update Infrastructure"}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
