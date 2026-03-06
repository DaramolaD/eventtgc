"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Utensils, ShoppingBag, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    id: "service",
    title: "Event Services",
    description: "Catering, coordination, DJ, photography, venue setup and more. Full-service event planning tailored to your vision.",
    icon: Utensils,
    color: "bg-pink-100 text-pink-600",
    href: "/booking?type=service",
  },
  {
    id: "rental",
    title: "Event Rentals",
    description: "Premium chairs, tables, decorations, and equipment for any occasion. Perfect for weddings, corporate events and parties.",
    icon: ShoppingBag,
    color: "bg-pink-100 text-pink-600",
    href: "/booking?type=rental",
  },
  {
    id: "both",
    title: "Full Package (Services + Rentals)",
    description: "Everything under one roof. Event management, catering, rentals, and coordination for a seamless experience.",
    icon: Calendar,
    color: "bg-pink-100 text-pink-600",
    href: "/booking?type=both",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Click a category below to book. We offer event services, rentals, or both.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Link key={service.id} href={service.href} prefetch={false}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group h-full glass p-8 rounded-[32px] border-2 border-border/50 hover:border-primary/30 transition-all duration-300",
                  "hover:shadow-2xl hover:shadow-primary/5 cursor-pointer"
                )}
              >
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
                  service.color
                )}>
                  <service.icon className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                <span className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                  Book now
                  <ArrowRight className="h-5 w-5" />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/booking"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all"
          >
            View all options
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
