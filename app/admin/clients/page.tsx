import { getSubmissions } from "@/app/actions/submissions";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, UserCircle, Mail, Phone, Calendar, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminClientsPage() {
    const { data: submissions = [] } = await getSubmissions();

    // Extract unique clients
    const clientsMap = new Map();
    submissions.forEach(s => {
        if (!clientsMap.has(s.email)) {
            clientsMap.set(s.email, {
                name: s.full_name,
                email: s.email,
                phone: s.phone,
                totalBookings: submissions.filter(sub => sub.email === s.email).length,
                lastBooking: s.event_date
            });
        }
    });

    const clients = Array.from(clientsMap.values());

    return (
        <div className="flex min-h-screen bg-[#fcfcfc]">
            <AdminSidebar />
            <main className="flex-grow pl-72 py-10 px-10">
                <div className="max-w-7xl mx-auto space-y-10">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-[#1a1a1a] mb-2 tracking-tight">Clients</h1>
                            <p className="text-[#888] font-medium text-[15px]">Manage and view your customer database.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative group w-80">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aaa] group-focus-within:text-[#e91e63] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search clients..."
                                    className="w-full rounded-2xl border border-[#f0f0f0] bg-white px-6 py-4 pl-14 text-[13px] font-bold text-[#1a1a1a] focus:outline-none focus:ring-4 focus:ring-pink-500/5 focus:border-[#e91e63] transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.length === 0 ? (
                            <div className="col-span-full py-40 text-center bg-white rounded-[40px] border border-[#f5f5f5] shadow-sm">
                                <UserCircle className="h-16 w-16 text-[#eee] mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-[#1a1a1a]">No clients found.</h3>
                                <p className="text-[#888] text-sm mt-2 font-medium">New clients will appear here automatically.</p>
                            </div>
                        ) : (
                            clients.map((client) => (
                                <div key={client.email} className="bg-white p-8 rounded-[32px] border border-[#f5f5f5] shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="h-14 w-14 rounded-2xl bg-pink-50 flex items-center justify-center text-[#e91e63]">
                                            <UserCircle size={32} />
                                        </div>
                                        <button className="p-2 rounded-xl hover:bg-gray-50 text-[#ccc] hover:text-[#1a1a1a] transition-all">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-black text-[#1a1a1a] tracking-tight">{client.name}</h3>
                                        <p className="text-[#aaa] text-[11px] font-black uppercase tracking-widest mt-1">Client ID: {client.email.split('@')[0].toUpperCase()}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center text-[13px] font-bold text-[#666]">
                                            <Mail className="h-4 w-4 mr-3 text-[#aaa]" />
                                            {client.email}
                                        </div>
                                        <div className="flex items-center text-[13px] font-bold text-[#666]">
                                            <Phone className="h-4 w-4 mr-3 text-[#aaa]" />
                                            {client.phone}
                                        </div>
                                        <div className="flex items-center text-[13px] font-bold text-[#666]">
                                            <Calendar className="h-4 w-4 mr-3 text-[#aaa]" />
                                            Engagement: {client.totalBookings} Bookings
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-[#e91e63]">Verified</span>
                                        <button className="text-[13px] font-bold text-[#1a1a1a] hover:text-[#e91e63] transition-colors">Details</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
