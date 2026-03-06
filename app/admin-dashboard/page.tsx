import { getSubmissions } from "@/app/actions/submissions";
import AdminSidebar from "@/components/AdminSidebar";
import BookingStatusManager from "@/components/BookingStatusManager";
import {
    Users,
    ClipboardList,
    TrendingUp,
    CheckCircle,
    Search,
    Plus,
    Activity,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
    const { data: submissions = [] } = await getSubmissions();

    const stats = [
        {
            label: "Revenue Pipeline",
            value: submissions.length,
            icon: ClipboardList,
            trend: "+12.5%",
            description: "Active booking volume",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            label: "Partner Reach",
            value: new Set(submissions.map(s => s.email)).size,
            icon: Users,
            trend: "+4.2%",
            description: "Registered unique clients",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            label: "Fulfillment Rate",
            value: "94%",
            icon: CheckCircle,
            trend: "Optimal",
            description: "Project completion health",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
    ];

    const pendingCount = submissions.filter(s => s.status === 'pending').length;

    return (
        <div className="flex min-h-screen bg-[#fcfdfe]">
            <AdminSidebar />
            <main className="flex-grow pl-72 py-12 px-10">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* SaaS Command Header */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-[12px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                                <Activity className="h-3 w-3" />
                                <span>Command Center</span>
                            </div>
                            <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">
                                Business <span className="text-slate-400 font-medium">Overview</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-[15px] flex items-center">
                                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" />
                                Systems operational. You have <span className="text-indigo-600 mx-1.5 underline underline-offset-4 decoration-2">{pendingCount} priority items</span> for review.
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search ledger..."
                                    className="bg-white border border-slate-200 rounded-2xl pl-11 pr-6 py-3.5 text-[13px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all w-64 shadow-sm"
                                />
                            </div>
                            <button className="px-6 py-3.5 rounded-2xl bg-[#0f172a] text-[13px] font-black text-white shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center space-x-2 items-center">
                                <Plus className="h-4 w-4" />
                                <span>Create Entry</span>
                            </button>
                        </div>
                    </header>

                    {/* Insight Cards Ledger */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-[32px] border border-slate-100/80 shadow-2xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-500">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <stat.icon size={130} />
                                </div>
                                <div className="flex items-center justify-between mb-10">
                                    <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center border border-transparent shadow-inner group-hover:scale-110 transition-transform duration-500", stat.bg, stat.color)}>
                                        <stat.icon className="h-8 w-8" />
                                    </div>
                                    <span className={cn("text-[11px] font-black px-4 py-2 rounded-xl border border-transparent shadow-sm uppercase tracking-widest", stat.bg, stat.color)}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-5xl font-black text-[#0f172a] mb-2 tracking-tighter">{stat.value}</h3>
                                    <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                                    <p className="text-[14px] font-bold text-slate-400 mt-6 leading-relaxed opacity-80">{stat.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Operational Ledger */}
                    <div className="grid grid-cols-1 gap-12">
                        <section className="bg-white rounded-[40px] border border-slate-100/80 shadow-2xl shadow-slate-200/60 overflow-hidden">
                            <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center space-x-5">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        <ClipboardList className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Fulfillment Pipeline</h2>
                                        <p className="text-[13px] font-bold text-slate-400 mt-0.5">Managing latest client submissions and lifecycle</p>
                                    </div>
                                </div>
                                <button className="text-[14px] font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-8 decoration-2 tracking-tight transition-all">
                                    Export Ledger
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <BookingStatusManager initialSubmissions={submissions.slice(0, 10)} />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
