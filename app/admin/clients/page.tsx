import { getSubmissions } from "@/app/actions/submissions";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, UserCircle, Mail, Phone, Calendar, MoreHorizontal, Activity, Users } from "lucide-react";
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
        <div className="flex min-h-screen bg-[#fcfdfe]">
            <AdminSidebar />
            <main className="flex-grow pl-72 py-12 px-10">
                <div className="max-w-7xl mx-auto space-y-12">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-[12px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                                <Activity className="h-3 w-3" />
                                <span>Stakeholder Relations</span>
                            </div>
                            <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">
                                Client <span className="text-slate-400 font-medium">Base Intelligence</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-[15px]">
                                Holistic oversight of your event partners and customer loyalty metrics.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative group w-80">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Filter partners..."
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 pl-14 text-[13px] font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                                />
                            </div>
                            <div className="rounded-2xl bg-indigo-50 px-6 py-4 text-[13px] font-black text-indigo-600 border border-indigo-100 shadow-sm flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                <span>Total Reach: {clients.length}</span>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {clients.length === 0 ? (
                            <div className="col-span-full py-40 text-center bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/40">
                                <div className="h-24 w-24 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-8">
                                    <UserCircle className="h-12 w-12 text-slate-200" />
                                </div>
                                <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">No stakeholder data identified.</h3>
                                <p className="text-slate-400 text-sm mt-3 font-bold max-w-xs mx-auto leading-relaxed">Intelligence will populate dynamically as lifecycle activations occur.</p>
                            </div>
                        ) : (
                            clients.map((client) => (
                                <div key={client.email} className="bg-white p-10 rounded-[40px] border border-slate-100/80 shadow-2xl shadow-slate-200/40 transition-all hover:shadow-slate-200/60 group hover:-translate-y-1.5 duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <Users size={100} />
                                    </div>
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="h-16 w-16 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                            <UserCircle className="h-9 w-9" />
                                        </div>
                                        <button className="p-3.5 rounded-xl hover:bg-slate-50 transition-all text-slate-300 border border-transparent hover:border-slate-100">
                                            <MoreHorizontal className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="mb-10 relative z-10">
                                        <h3 className="text-2xl font-black text-[#0f172a] tracking-tight group-hover:text-indigo-600 transition-colors">{client.name}</h3>
                                        <p className="text-[14px] font-bold text-slate-400 mt-1.5 flex items-center tracking-tight">
                                            <Mail className="h-3 w-3 mr-2 opacity-50" />
                                            {client.email}
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-10 border-t border-slate-50">
                                        <div className="flex items-center text-[13px] font-bold text-slate-600">
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center mr-4 text-slate-400">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                            {client.phone}
                                        </div>
                                        <div className="flex items-center text-[13px] font-bold text-slate-600">
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center mr-4 text-slate-400">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <span className="text-slate-400 mr-2 uppercase text-[11px] font-black tracking-widest">Last Cycle</span>
                                            {client.lastBooking ? new Date(client.lastBooking).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-10 border-t border-slate-50 flex items-center justify-between">
                                        <span className="px-5 py-2.5 rounded-xl bg-slate-900 text-[11px] font-black text-white uppercase tracking-widest shadow-lg shadow-slate-200">
                                            {client.totalBookings} {client.totalBookings === 1 ? 'Booking' : 'Bookings'}
                                        </span>
                                        <button className="text-[13px] font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-8 decoration-2 tracking-tight transition-all">
                                            Analyze Profile
                                        </button>
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
