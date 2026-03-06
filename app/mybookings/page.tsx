"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Search, ShoppingBag, Clock, CheckCircle2, XCircle, Mail, ArrowRight } from "lucide-react";

export default function MyBookingsPage() {
    const [email, setEmail] = useState("");
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("submissions")
                .select("*")
                .eq("email", email)
                .order("created_at", { ascending: false });

            if (data) setSubmissions(data);
            setSearched(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">My Bookings</h1>
                        <p className="text-muted-foreground text-lg">Enter your email to track your event and rental requests.</p>
                    </header>

                    <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-16 px-4">
                        <div className="relative flex items-center">
                            <Mail className="absolute left-5 h-5 w-5 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
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
                                <div className="text-center py-20 glass rounded-[40px] border border-border/50">
                                    <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-30" />
                                    <p className="text-xl font-bold text-muted-foreground">No bookings found for this email.</p>
                                    <p className="text-sm text-muted-foreground mt-2">Check your email spelling or make a new booking.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {submissions.map((s) => (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white p-8 rounded-[40px] border border-border/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest",
                                                        s.status === 'confirmed' ? "bg-green-50 text-green-700 border-green-200" :
                                                            s.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                                "bg-muted text-muted-foreground border-border"
                                                    )}>
                                                        {s.status}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        {new Date(s.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-black capitalize">{s.service_type} Package</h3>
                                                    <p className="text-muted-foreground mt-1 font-medium">{s.event_location}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-sm font-bold text-black">Event Date</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(s.event_date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                                    {s.status === 'confirmed' ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
