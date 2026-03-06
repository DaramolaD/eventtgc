import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <AdminSidebar />
            <main className="flex-1 min-w-0 pl-0 md:pl-[260px] pt-16 md:pt-0 overflow-auto">
                <div className="p-6 md:p-8 lg:p-10 min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
