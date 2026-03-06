"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Calendar, ShoppingBag, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Book Now", href: "/booking", isButton: true },
    { name: "My Bookings", href: "/mybookings" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                scrolled
                    ? "glass border-b border-border/50 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <nav className="flex items-center justify-between">
                    <Link href="/" prefetch={false} className="group flex items-center space-x-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black shadow-lg transition-transform group-hover:scale-110">
                            <span className="text-sm font-bold text-white tracking-tighter">TGC</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-black dark:text-white">
                            TGC EVENTS
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                prefetch={false}
                                className={cn(
                                    "text-sm font-semibold transition-colors",
                                    item.isButton
                                        ? "rounded-lg bg-primary px-4 py-2.5 text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                                        : "text-foreground/80 hover:text-primary"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-lg p-2 text-foreground md:hidden hover:bg-muted"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="glass border-b border-border/50 md:hidden">
                    <div className="space-y-1 px-4 py-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                prefetch={false}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center space-x-3 rounded-xl px-4 py-3 text-base font-medium transition-all",
                                    item.isButton
                                        ? "bg-primary text-white"
                                        : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                                )}
                            >
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
