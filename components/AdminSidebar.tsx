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
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-5 left-5 z-[60] p-3 bg-white rounded-xl shadow-lg border border-gray-100 md:hidden text-[#1a1a1a] hover:bg-gray-50 transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[45] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen w-[260px] flex flex-col z-50 transition-all duration-300 ease-out md:translate-x-0",
                    "bg-white border-r border-gray-200/80",
                    "shadow-[4px_0_32px_rgba(0,0,0,0.06)] md:shadow-[2px_0_24px_rgba(0,0,0,0.04)]",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className="p-6 pb-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-[#e91e63] flex items-center justify-center shadow-lg shadow-pink-200/60">
                            <span className="text-sm font-black text-white tracking-tighter">TGC</span>
                        </div>
                        <div>
                            <span className="block text-base font-serif font-black text-[#1a1a1a] tracking-tight">
                                TGC Hub
                            </span>
                            <span className="inline-block mt-0.5 text-[9px] font-black uppercase tracking-widest text-[#e91e63] bg-pink-50 px-2 py-0.5 rounded">
                                Admin
                            </span>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-2 overflow-y-auto min-h-0">
                    <div className="space-y-0.5">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    prefetch={false}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200",
                                        isActive
                                            ? "bg-[#e91e63] text-white shadow-md shadow-pink-200/40"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-[#1a1a1a]"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "h-5 w-5 shrink-0",
                                            isActive ? "text-white" : "text-gray-400"
                                        )}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 shrink-0">
                    <Link
                        href="/"
                        prefetch={false}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#e91e63] transition-all font-semibold text-[13px]"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        Exit Admin
                    </Link>
                </div>
            </aside>
        </>
    );
}
