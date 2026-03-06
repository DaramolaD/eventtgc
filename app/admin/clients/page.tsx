import { getSubmissions } from "@/app/actions/submissions";
import AdminSidebar from "@/components/AdminSidebar";
import ClientListManager from "@/components/ClientListManager";

export default async function AdminClientsPage() {
    const { data: submissions = [] } = await getSubmissions();

    // Extract unique clients
    const clientsMap = new Map();
    submissions.forEach(s => {
        if (s.email && !clientsMap.has(s.email)) {
            clientsMap.set(s.email, {
                name: s.full_name,
                email: s.email,
                phone: s.phone,
                totalBookings: submissions.filter(sub => sub.email === s.email).length,
                lastBooking: s.event_date || s.rental_date
            });
        }
    });

    const clients = Array.from(clientsMap.values());

    return (
        <div className="flex min-h-screen bg-[#fcfcfc]">
            <AdminSidebar />
            <main className="flex-grow md:pl-[280px] py-8 px-4 md:px-8 mt-14 md:mt-0">
                <div className="max-w-6xl mx-auto">
                    <ClientListManager initialClients={clients} submissions={submissions} />
                </div>
            </main>
        </div>
    );
}
