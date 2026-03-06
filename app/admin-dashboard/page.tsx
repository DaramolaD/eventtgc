import { getSubmissions } from "@/app/actions/submissions";
import AdminSidebar from "@/components/AdminSidebar";
import BookingStatusManager from "@/components/BookingStatusManager";
import { ClipboardList, Users, CheckCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const { data: submissions = [] } = await getSubmissions();

    const stats = [
        {
            label: "Total Bookings",
            value: submissions.length,
            icon: Calendar,
            color: "text-[#e91e63]",
            bg: "bg-[#fee2e2]/60"
        },
        {
            label: "Clients",
            value: new Set(submissions.map(s => s.email)).size,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Confirmed",
            value: submissions.filter(s => s.status === 'confirmed').length,
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#fcfcfc]">
            <AdminSidebar />
            <main className="flex-grow md:pl-[280px] py-8 px-4 md:px-8 mt-14 md:mt-0">
                <div className="max-w-6xl mx-auto space-y-8">
                    <header>
                        <h1 className="text-3xl md:text-4xl font-serif font-black text-[#1a1a1a] mb-1 tracking-tight underline decoration-[#e91e63] decoration-4 underline-offset-4">Dashboard</h1>
                        <p className="text-[#888] font-medium text-sm mt-2">Overview of your recent activity and metrics.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#eee] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow group">
                                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105", stat.bg, stat.color)}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-[#888] text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                                <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-[#eee] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                        <div className="px-6 py-6 border-b border-[#f0f0f0] flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                    <ClipboardList className="h-5 w-5 text-[#aaa]" />
                                </div>
                                <h2 className="text-xl font-black text-[#1a1a1a] tracking-tight">Recent Submissions</h2>
                            </div>
                            <Link href="/admin/bookings" prefetch={false} className="text-[13px] font-bold text-[#e91e63] hover:underline">
                                View all
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <BookingStatusManager initialSubmissions={submissions.slice(0, 10)} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
