import { getSubmissions } from "@/app/actions/submissions";
import AdminSidebar from "@/components/AdminSidebar";
import BookingStatusManager from "@/components/BookingStatusManager";
import { Landmark, FileDown } from "lucide-react";
import Link from "next/link";

export default async function AdminBookingsPage() {
    const { data: submissions = [] } = await getSubmissions();

    return (
        <div className="flex min-h-screen bg-[#fcfcfc]">
            <AdminSidebar />
            <main className="flex-grow md:pl-[280px] py-8 px-4 md:px-8 mt-14 md:mt-0">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-black text-[#1a1a1a] tracking-tight mb-1 underline decoration-[#e91e63] decoration-4 underline-offset-4">
                                Submissions
                            </h1>
                            <p className="text-[#888] font-medium text-sm mt-2">
                                Manage all booking and rental requests.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href="/admin/settings/bank"
                                prefetch={false}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#eee] bg-white px-4 py-2.5 text-xs font-bold text-[#1a1a1a] hover:bg-[#fafafa] hover:border-[#e91e63]/20 transition-all shadow-sm"
                            >
                                <Landmark size={16} className="text-[#e91e63]" />
                                <span>Bank Settings</span>
                            </Link>
                            <button className="inline-flex items-center gap-2 rounded-xl border border-[#eee] bg-white px-4 py-2.5 text-xs font-bold text-[#1a1a1a] hover:bg-[#fafafa] transition-all shadow-sm">
                                <FileDown size={16} className="text-[#888]" />
                                <span>Export CSV</span>
                            </button>
                            <div className="rounded-xl bg-[#fee2e2] px-4 py-2.5 text-xs font-bold text-[#e91e63]">
                                Total: {submissions.length}
                            </div>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-2xl border border-[#eee] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                        <BookingStatusManager initialSubmissions={submissions} />
                    </div>
                </div>
            </main>
        </div>
    );
}
