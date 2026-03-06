import { getSubmissions } from "@/app/actions/submissions";
import AdminSidebar from "@/components/AdminSidebar";
import BookingStatusManager from "@/components/BookingStatusManager";
import { Search, CreditCard, Download, Activity, Filter, CloudDownload } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminBookingsPage() {
    const { data: submissions = [] } = await getSubmissions();

    return (
        <div className="flex min-h-screen bg-[#fcfdfe]">
            <AdminSidebar />
            <main className="flex-grow pl-72 py-12 px-10">
                <div className="max-w-7xl mx-auto space-y-10">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-[12px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                                <Activity className="h-3 w-3" />
                                <span>Operational Ledger</span>
                            </div>
                            <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">
                                Submission <span className="text-slate-400 font-medium">Intelligence</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-[15px]">
                                Real-time oversight of all client requests and fulfillment cycles.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/settings/bank"
                                className="flex items-center space-x-3 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-[13px] font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm group"
                            >
                                <CreditCard className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                <span>Disbursement Config</span>
                            </Link>
                            <button className="flex items-center space-x-3 rounded-2xl bg-[#0f172a] px-6 py-3.5 text-[13px] font-black text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                                <CloudDownload className="h-4 w-4" />
                                <span>Export Intelligence</span>
                            </button>
                            <div className="rounded-2xl bg-indigo-50 px-6 py-3.5 text-[13px] font-black text-indigo-600 border border-indigo-100 shadow-sm">
                                Total Records: {submissions.length}
                            </div>
                        </div>
                    </header>

                    <div className="bg-white rounded-[32px] border border-slate-100/80 shadow-2xl shadow-slate-200/40 overflow-hidden">
                        <div className="px-10 py-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/30">
                            <div className="flex items-center space-x-2 rounded-2xl bg-slate-100/50 p-1.5 border border-slate-200/50">
                                {["All Requests", "Rentals", "Event Services", "Strategic Bundles"].map((tab, idx) => (
                                    <button
                                        key={tab}
                                        className={cn(
                                            "px-6 py-2.5 text-[12px] font-black rounded-xl transition-all duration-300 tracking-tight",
                                            idx === 0
                                                ? "bg-white text-[#0f172a] shadow-md border border-slate-100"
                                                : "text-slate-500 hover:text-indigo-600"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center space-x-4 w-full sm:w-auto">
                                <div className="relative flex-grow sm:w-80 group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search by ID, email, or stakeholder..."
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 pl-14 text-[13px] font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-400 placeholder:font-bold shadow-sm"
                                    />
                                </div>
                                <button className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
                                    <Filter className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-2">
                            <BookingStatusManager initialSubmissions={submissions} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
