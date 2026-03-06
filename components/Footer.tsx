import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1a1515] text-white py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Logo & Description */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                <span className="text-xs font-bold text-white tracking-tighter">TGC</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">TGC EVENTS</span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Creating unforgettable moments through exceptional catering, rentals, and event management.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/booking" className="hover:text-primary transition-colors">Book Now</Link></li>
                            <li><Link href="/#services" className="hover:text-primary transition-colors">Services</Link></li>
                            <li><Link href="/mybookings" className="hover:text-primary transition-colors">My Bookings</Link></li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact</h3>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>info@tgcevents.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>+234 XXX XXX XXXX</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>Lagos, Nigeria</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-center text-sm text-white/40">
                    <p className="flex items-center">
                        Made with <Heart className="h-4 w-4 text-primary mx-1.5 fill-primary" /> TGC Events © {currentYear}
                    </p>
                </div>
            </div>
        </footer>
    );
}
