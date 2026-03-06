"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, CreditCard, FileText, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: "Submissions", href: "/admin/bookings", icon: LayoutDashboard },
        { name: "Invoices", href: "/admin/invoices", icon: FileText },
        { name: "Clients", href: "/admin/clients", icon: Users },
        { name: "Bank Settings", href: "/admin/settings/bank", icon: CreditCard },
    ];

    return (
        <>
            {/* Mobile Toggle Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 left-6 z-[60] p-3 bg-white border border-gray-100 rounded-2xl shadow-lg md:hidden text-[#1a1a1a]"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[45] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[#eee] flex flex-col z-50 transition-transform duration-300 md:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.04)]",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="p-8 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#e91e63] flex items-center justify-center shadow-lg shadow-pink-200">
                            <span className="text-sm font-black text-white tracking-tighter">TGC</span>
                        </div>
                        <div>
                            <span className="block text-lg font-serif font-black text-[#1a1a1a] tracking-tight">TGC Hub</span>
                            <span className="bg-[#fee2e2] text-[#e91e63] text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">ADMIN</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                prefetch={false}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all duration-200 group",
                                    isActive
                                        ? "bg-[#e91e63] text-white shadow-md shadow-pink-200/50"
                                        : "text-[#555] hover:bg-[#fafafa] hover:text-[#1a1a1a]"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-white" : "text-[#aaa] group-hover:text-[#e91e63]"
                                )} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Exit Footer */}
                <div className="p-4 border-t border-[#f0f0f0] bg-[#fafafa]/50">
                    <Link
                        href="/"
                        prefetch={false}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666] hover:bg-white hover:text-[#e91e63] transition-all font-bold text-[13px] group border border-transparent hover:border-[#fee2e2]"
                    >
                        <LogOut className="h-5 w-5 shrink-0 text-[#aaa] group-hover:text-[#e91e63]" />
                        Exit Admin
                    </Link>
                </div>
            </aside>
        </>
    );
}
