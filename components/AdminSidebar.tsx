"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, CreditCard, LogOut } from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Submissions", href: "/admin/bookings", icon: LayoutDashboard },
        { name: "Clients", href: "/admin/clients", icon: Users },
        { name: "Bank Settings", href: "/admin/settings/bank", icon: CreditCard },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-[#f5f5f5] flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-10 mb-8">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl font-serif font-black text-[#1a1a1a] tracking-tight">TGC Hub</span>
                    <span className="bg-[#fee2e2] text-[#e91e63] text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest mt-1">ADMIN</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center px-6 py-4 rounded-2xl text-[14px] font-bold transition-all group",
                                isActive
                                    ? "bg-[#e91e63] text-white shadow-lg shadow-pink-100"
                                    : "text-[#666] hover:bg-gray-50 hover:text-[#1a1a1a]"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 mr-4 transition-colors",
                                isActive ? "text-white" : "text-[#aaa] group-hover:text-[#e91e63]"
                            )} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Exit Footer */}
            <div className="p-8 border-t border-[#f5f5f5]">
                <Link
                    href="/"
                    className="flex items-center px-6 py-4 text-[#666] hover:text-[#e91e63] transition-colors font-bold text-[14px]"
                >
                    <LogOut className="h-5 w-5 mr-4" />
                    Exit Admin
                </Link>
            </div>
        </aside>
    );
}
