import { getSubmissions } from "@/app/actions/submissions";
import ClientListManager from "@/components/ClientListManager";

export default async function AdminClientsPage() {
    const { data: submissions = [] } = await getSubmissions();

    const clientsMap = new Map();
    submissions.forEach((s) => {
        if (s.email && !clientsMap.has(s.email)) {
            clientsMap.set(s.email, {
                name: s.full_name,
                email: s.email,
                phone: s.phone,
                totalBookings: submissions.filter((sub) => sub.email === s.email).length,
                lastBooking: s.event_date || s.rental_date,
            });
        }
    });

    const clients = Array.from(clientsMap.values());

    return (
        <div className="max-w-6xl mx-auto">
            <ClientListManager initialClients={clients} submissions={submissions} />
        </div>
    );
}
