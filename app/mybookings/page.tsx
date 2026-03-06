"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getBankDetails, reportPayment } from "@/app/actions/submissions";
import { cn } from "@/lib/utils";
import { ShoppingBag, Clock, CheckCircle2, Search, ArrowRight, FileText, X, Landmark, User, Mail, Phone, MapPin, Calendar, Users, Package, MessageSquare, Banknote, Loader2 } from "lucide-react";

type BankDetails = { bankName: string; accountName: string; accountNumber: string; instructions: string } | null;

export default function MyBookingsPage() {
    const [searchValue, setSearchValue] = useState("");
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [invoiceModalSubmission, setInvoiceModalSubmission] = useState<any | null>(null);
    const [bankDetails, setBankDetails] = useState<BankDetails>(null);
    const [reportingId, setReportingId] = useState<string | null>(null);

    useEffect(() => {
        if (invoiceModalSubmission) {
            getBankDetails().then(setBankDetails);
        } else {
            setBankDetails(null);
        }
    }, [invoiceModalSubmission]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            console.error("Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local");
            return;
        }
        const val = searchValue.trim();
        if (!val) return;
        setLoading(true);
        setSearched(true);
        try {
            let data: any[] | null = null;
                if (val.includes("@")) {
                    const res = await supabase
                        .from("submissions")
                        .select("*")
                        .ilike("email", val)
                        .order("created_at", { ascending: false });
                    if (res.error) console.error("My Bookings search error:", res.error);
                    data = res.data;
                } else {
                    const res = await supabase
                        .from("submissions")
                        .select("*")
                        .or(`id.eq.${val},id.ilike.${val}%`)
                        .order("created_at", { ascending: false });
                    if (res.error) console.error("My Bookings search error:", res.error);
                    data = res.data;
                    if (!data?.length) {
                        const res2 = await supabase
                            .from("submissions")
                            .select("*")
                            .ilike("email", val)
                            .order("created_at", { ascending: false });
                        if (res2.error) console.error("My Bookings search fallback error:", res2.error);
                        data = res2.data;
                    }
                }
                if (data) setSubmissions(data);
        } catch (error) {
            console.error(error);
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReportPayment = async (s: { id: string; email: string }) => {
        setReportingId(s.id);
        const result = await reportPayment(s.id, s.email);
        if (result.success) {
            setSubmissions((prev) =>
                prev.map((sub) =>
                    sub.id === s.id ? { ...sub, payment_reported_at: new Date().toISOString() } : sub
                )
            );
            if (invoiceModalSubmission?.id === s.id) {
                setInvoiceModalSubmission((prev: any) =>
                    prev ? { ...prev, payment_reported_at: new Date().toISOString() } : prev
                );
            }
        }
        setReportingId(null);
    };

    if (!supabase) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-muted/30 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <h1 className="text-2xl font-bold mb-2">Configuration needed</h1>
                    <p className="text-muted-foreground mb-4">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-14">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">My Bookings</h1>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto">Search with your email or booking ID to view your booking status and details.</p>
                    </header>

                    <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-16 px-4">
                        <div className="relative flex items-center">
                            <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Email or booking ID"
                                className="w-full rounded-2xl border border-border bg-white px-5 py-5 pl-14 text-lg shadow-xl shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-3 px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "..." : <ArrowRight className="h-5 w-5" />}
                            </button>
                        </div>
                    </form>

                    {searched && (
                        <div className="space-y-6">
                            {submissions.length === 0 ? (
                                <div className="text-center py-20 px-8 rounded-3xl border border-dashed border-border bg-white/50">
                                    <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-5">
                                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-lg font-semibold text-foreground">No bookings found</p>
                                    <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                                        Double-check your email or booking ID, or create a new booking to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-8">
                                    {submissions.map((s) => (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-3xl border border-border/50 shadow-lg overflow-hidden"
                                        >
                                            {/* Header */}
                                            <div className="px-6 md:px-8 pt-6 md:pt-8 pb-5">
                                                <div className="flex flex-wrap items-start justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={cn(
                                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                                                                s.status === "confirmed" && "bg-emerald-50 text-emerald-700",
                                                                s.status === "pending" && "bg-amber-50 text-amber-700",
                                                                s.status !== "confirmed" && s.status !== "pending" && "bg-muted text-muted-foreground"
                                                            )}>
                                                                {s.status === "confirmed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                                                                {s.status}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                Booked {new Date(s.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl md:text-2xl font-semibold text-foreground capitalize mt-2">
                                                            {s.service_type} package
                                                        </h3>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {s.invoice_generated_at && (
                                                            <>
                                                                {s.payment_confirmed_at ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold">
                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                        Payment confirmed — you&apos;re all set!
                                                                    </span>
                                                                ) : s.payment_reported_at ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-semibold">
                                                                        <Clock className="h-4 w-4" />
                                                                        Payment reported — awaiting confirmation
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleReportPayment(s)}
                                                                        disabled={reportingId === s.id}
                                                                        className="inline-flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
                                                                    >
                                                                        {reportingId === s.id ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <Banknote className="h-4 w-4" />
                                                                        )}
                                                                        I&apos;ve made the payment
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setInvoiceModalSubmission(s)}
                                                                    className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2.5 text-sm font-semibold transition-colors"
                                                                >
                                                                    <FileText className="h-4 w-4" />
                                                                    View invoice
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content sections */}
                                            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6">
                                                {/* Contact */}
                                                <section>
                                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contact</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="flex gap-3">
                                                            <div className="shrink-0 w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-muted-foreground">Name</p>
                                                                <p className="text-sm font-medium text-foreground">{s.full_name || "—"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="shrink-0 w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-muted-foreground">Email</p>
                                                                <p className="text-sm font-medium text-foreground break-all">{s.email || "—"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="shrink-0 w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-muted-foreground">Phone</p>
                                                                <p className="text-sm font-medium text-foreground">{s.phone || "—"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 sm:col-span-2">
                                                            <div className="shrink-0 w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-muted-foreground">Address</p>
                                                                <p className="text-sm font-medium text-foreground">{s.address || "—"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                {/* Event & rental */}
                                                <section className="pt-4 border-t border-border/50">
                                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Event & rental</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        <div className="flex gap-3">
                                                            <div className="shrink-0 w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-muted-foreground">Rental date</p>
                                                                <p className="text-sm font-medium text-foreground">{s.rental_date ? new Date(s.rental_date).toLocaleDateString() : "—"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="shrink-0 w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-muted-foreground">Event date</p>
                                                                <p className="text-sm font-medium text-foreground">{s.event_date ? new Date(s.event_date).toLocaleDateString() : "—"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="shrink-0 w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-muted-foreground">Guests · vendors</p>
                                                                <p className="text-sm font-medium text-foreground">{[s.guest_count, s.vendor_count].filter(Boolean).join(" · ") || "—"}</p>
                                                            </div>
                                                        </div>
                                                        {s.rental_location && (
                                                            <div className="flex gap-3 sm:col-span-2">
                                                                <div className="shrink-0 w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs text-muted-foreground">Rental location</p>
                                                                    <p className="text-sm font-medium text-foreground">{s.rental_location}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {s.event_location && (
                                                            <div className="flex gap-3 sm:col-span-2">
                                                                <div className="shrink-0 w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
                                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs text-muted-foreground">Event location</p>
                                                                    <p className="text-sm font-medium text-foreground">{s.event_location}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </section>

                                                {/* Items & services */}
                                                {(s.items_needed || (Array.isArray(s.services_needed) && s.services_needed.length > 0)) && (
                                                    <section className="pt-4 border-t border-border/50">
                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Items & services</h4>
                                                        <div className="space-y-4">
                                                            {s.items_needed && (
                                                                <div className="flex gap-3">
                                                                    <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                                                        <Package className="h-4 w-4 text-primary" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs text-muted-foreground mb-1">Items needed</p>
                                                                        <p className="text-sm text-foreground">{s.items_needed}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {Array.isArray(s.services_needed) && s.services_needed.length > 0 && (
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground mb-2">Services</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {s.services_needed.map((svc: string) => (
                                                                            <span key={svc} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">{svc}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </section>
                                                )}

                                                {/* Additional items & special requests */}
                                                {(s.additional_items || s.special_requests) && (
                                                    <section className="pt-4 border-t border-border/50">
                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                            Notes
                                                        </h4>
                                                        <div className="space-y-4">
                                                            {s.additional_items && (
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground mb-1">Additional items</p>
                                                                    <p className="text-sm text-foreground bg-muted/40 rounded-xl px-4 py-3">{s.additional_items}</p>
                                                                </div>
                                                            )}
                                                            {s.special_requests && (
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground mb-1">Special requests</p>
                                                                    <p className="text-sm text-foreground bg-muted/40 rounded-xl px-4 py-3">{s.special_requests}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </section>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="px-6 md:px-8 py-3 bg-muted/30 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                                                <p className="font-mono text-[11px] text-muted-foreground">
                                                    Booking ID <span className="text-foreground/80">{s.id}</span>
                                                </p>
                                                {s.invoice_generated_at && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setInvoiceModalSubmission(s)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/15 text-primary px-3 py-2 text-xs font-semibold transition-colors"
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        View invoice
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {invoiceModalSubmission && (
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setInvoiceModalSubmission(null)}
                        >
                            <div
                                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">Invoice</h3>
                                            {invoiceModalSubmission.service_type && (
                                            <p className="text-xs text-muted-foreground capitalize">{invoiceModalSubmission.service_type} package</p>
                                        )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setInvoiceModalSubmission(null)}
                                        className="p-2.5 rounded-xl hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                                        aria-label="Close"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Invoice number</p>
                                        <p className="font-mono font-semibold text-lg text-foreground">{invoiceModalSubmission.invoice_number || "—"}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Issued {invoiceModalSubmission.invoice_generated_at
                                                ? new Date(invoiceModalSubmission.invoice_generated_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
                                                : "—"}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-border/50">
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customer</p>
                                            <p className="text-sm font-medium text-foreground">{invoiceModalSubmission.full_name}</p>
                                            <p className="text-sm text-muted-foreground">{invoiceModalSubmission.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Booking</p>
                                            <p className="text-sm font-medium text-foreground capitalize">{invoiceModalSubmission.service_type} package</p>
                                            <p className="text-sm text-muted-foreground">{invoiceModalSubmission.event_location || invoiceModalSubmission.rental_location || "—"}</p>
                                        </div>
                                    </div>
                                    {bankDetails && (bankDetails.bankName || bankDetails.accountName || bankDetails.accountNumber) && (
                                        <div className="pt-5 border-t border-border/50">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <Landmark className="h-4 w-4" />
                                                Payment details
                                            </p>
                                            <div className="rounded-xl bg-muted/50 border border-border/50 p-4 text-sm space-y-2">
                                                {bankDetails.bankName && <p><span className="text-muted-foreground">Bank:</span> <span className="font-medium text-foreground">{bankDetails.bankName}</span></p>}
                                                {bankDetails.accountName && <p><span className="text-muted-foreground">Account name:</span> <span className="font-medium text-foreground">{bankDetails.accountName}</span></p>}
                                                {bankDetails.accountNumber && <p><span className="text-muted-foreground">Account number:</span> <span className="font-mono font-medium text-foreground">{bankDetails.accountNumber}</span></p>}
                                                {bankDetails.instructions && <p className="pt-2 text-muted-foreground text-[13px] leading-relaxed">{bankDetails.instructions}</p>}
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                                        Please keep this invoice for your records. Contact us if you have any questions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
