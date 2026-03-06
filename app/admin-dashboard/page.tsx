import { getSubmissions } from "@/app/actions/submissions";
import AdminSidebar from "@/components/AdminSidebar";
import BookingStatusManager from "@/components/BookingStatusManager";
import { ClipboardList, Users, CheckCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

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
            <main className="flex-grow pl-72 py-10 px-10">
                <div className="max-w-7xl mx-auto space-y-10">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-[#1a1a1a] mb-2 tracking-tight">Dashboard</h1>
                            <p className="text-[#888] font-medium">Overview of your recent activity and metrics.</p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[32px] border border-[#f5f5f5] shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-8">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                        <stat.icon className="h-7 w-7" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[#888] text-[13px] font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                                    <p className="text-4xl font-black text-[#1a1a1a] tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-[40px] border border-[#f5f5f5] shadow-sm overflow-hidden">
                        <div className="px-10 py-8 border-b border-[#f5f5f5] flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                    <ClipboardList className="h-5 w-5 text-[#aaa]" />
                                </div>
                                <h2 className="text-xl font-black text-[#1a1a1a] tracking-tight">Recent Submissions</h2>
                            </div>
                            <button className="text-[13px] font-bold text-[#e91e63] hover:underline">
                                View all
                            </button>
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
