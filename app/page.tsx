"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Utensils, Calendar, Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Catering Services",
    description: "Exquisite menus tailored to your event, from intimate dinners to grand receptions.",
    icon: Utensils,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Event Rentals",
    description: "Premium chairs, tables, decorations, and equipment for any occasion.",
    icon: ShoppingBag,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Event Management",
    description: "Full-service planning and coordination to make your event seamless and memorable.",
    icon: Calendar,
    color: "bg-pink-100 text-pink-600",
  },
];

const instagramPosts = [
  { id: 1, url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
  { id: 2, url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80" },
  { id: 3, url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80" },
  { id: 4, url: "https://images.unsplash.com/photo-1505232458567-cc966a066914?auto=format&fit=crop&w=400&q=80" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2000&q=80')",
            filter: "brightness(0.6)"
          }}
        />
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-md mb-6 border border-white/20">
              <span className="mr-2">✨</span> Catering • Rentals • Event Management
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Creating <span className="text-primary italic">Unforgettable</span> <br /> Moments
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
              From elegant weddings to corporate galas, we bring your vision to life with impeccable service and stunning execution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="w-full sm:w-auto rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-105"
              >
                Book Now
              </Link>
              <Link
                href="#services"
                className="w-full sm:w-auto rounded-xl bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md border border-white/30 transition-all hover:bg-white/20"
              >
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What We <span className="text-primary italic">Offer</span></h2>
            <p className="text-muted-foreground text-lg">Comprehensive event solutions under one roof</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass p-8 rounded-[32px] border border-border/50 text-center hover:shadow-2xl transition-all duration-500"
              >
                <div className={cn("mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", service.color)}>
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Feed Section */}
      <section className="py-24 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Follow Us</h2>
            <p className="text-muted-foreground">Stay connected for inspiration and updates</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10">
            {instagramPosts.map((post) => (
              <div key={post.id} className="aspect-square rounded-2xl overflow-hidden group relative">
                <img
                  src={post.url}
                  alt="TGC Events Work"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="text-white h-8 w-8" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6">
            <Link href="#" className="p-3 rounded-full bg-white border border-border hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="p-3 rounded-full bg-white border border-border hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="p-3 rounded-full bg-white border border-border hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
