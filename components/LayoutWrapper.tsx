"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/admin-dashboard");

    if (isAdminPage) {
        return <main className="min-h-screen bg-[#fcfcfc]">{children}</main>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
