"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Utensils, Calendar, Instagram, Facebook, Twitter, Mail, Youtube, ExternalLink, Video, Play } from "lucide-react";
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

// Reels & shorts – clickable with preview (YouTube thumbnails from ytimg; IG/TikTok use placeholders – no public thumbnail API)
const followLinks = [
  { id: "yt1", platform: "YouTube Shorts", href: "https://youtube.com/shorts/Ixefqoz5wjo?si=ZerC1jJg-Wd2ikAB", thumbnail: "https://i.ytimg.com/vi/Ixefqoz5wjo/hqdefault.jpg", icon: Youtube },
  { id: "yt2", platform: "YouTube Shorts", href: "https://youtube.com/shorts/LCBdFN3TPkQ?si=xoJjgUsr87_gy5gm", thumbnail: "https://i.ytimg.com/vi/LCBdFN3TPkQ/hqdefault.jpg", icon: Youtube },
  { id: "ig1", platform: "Instagram Reel", href: "https://www.instagram.com/reel/DVB96FWjHf8/?igsh=ZGJmNWp5ZjVqMG5k", thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80", icon: Instagram },
  { id: "ig2", platform: "Instagram Reel", href: "https://www.instagram.com/reel/DU8LiJOjEMe/?igsh=MWpqZmg1dGM0cmZmdA==", thumbnail: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80", icon: Instagram },
  { id: "tt1", platform: "TikTok", href: "https://vt.tiktok.com/ZSud99v4G/", thumbnail: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80", icon: Video },
  { id: "tt2", platform: "TikTok", href: "https://vt.tiktok.com/ZSud9bBX2/", thumbnail: "https://images.unsplash.com/photo-1505232458567-cc966a066914?auto=format&fit=crop&w=600&q=80", icon: Video },
];

const instagramPosts = [
  { id: 1, url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
  { id: 2, url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80" },
  { id: 3, url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80" },
  { id: 4, url: "https://images.unsplash.com/photo-1505232458567-cc966a066914?auto=format&fit=crop&w=400&q=80" },
];

export default function Home() {
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/social-previews")
      .then((r) => r.json())
      .then((data) => data.images && setPreviewImages(data.images))
      .catch(() => {});
  }, []);

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

      {/* Follow Us – Reels & shorts: 1 large + 2 stacked, then 2 stacked + 1 large */}
      <section className="py-24 bg-gradient-to-b from-muted/50 to-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Follow Us</h2>
            <p className="text-muted-foreground text-lg">Watch our reels and shorts — tap any card to open</p>
          </div>

          {/* Taller grid – native img for real social preview, play overlay */}
          <div
            className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto mb-12 h-[580px] sm:h-[700px] md:h-[820px] p-3 sm:p-4 md:p-5 rounded-3xl bg-white/90 border border-border/60 shadow-xl"
            style={{ gridTemplateRows: "repeat(4, minmax(0, 1fr))" }}
          >
            {followLinks.map((item, index) => {
              const previewSrc = previewImages?.[index] ?? item.thumbnail;
              const gridClass =
                index === 0 ? "col-start-1 row-start-1 row-span-2" :
                index === 1 ? "col-start-2 row-start-1" :
                index === 2 ? "col-start-2 row-start-2" :
                index === 3 ? "col-start-1 row-start-3" :
                index === 4 ? "col-start-1 row-start-4" :
                "col-start-2 row-start-3 row-span-2";
              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className={cn(
                    "group rounded-2xl overflow-hidden bg-white flex flex-col min-h-0",
                    "border-2 border-border/80 shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:border-primary/40 transition-all duration-300",
                    "ring-2 ring-black/5 ring-inset",
                    gridClass
                  )}
                >
                  <div className="relative flex-1 min-h-[120px] overflow-hidden rounded-t-[calc(1rem-2px)] bg-muted">
                    <img
                      src={previewSrc}
                      alt={`${item.platform} preview`}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.classList.remove("invisible");
                      }}
                    />
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center invisible",
                        item.platform.includes("Instagram") ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" :
                        item.platform.includes("TikTok") ? "bg-neutral-900" : "bg-muted"
                      )}
                      aria-hidden="true"
                    >
                      {item.icon && <item.icon className="h-14 w-14 text-white/90" />}
                    </div>
                    {/* Play overlay – always visible so it’s clear it’s video */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
                      <div className="rounded-full bg-white/95 p-3 sm:p-4 shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 sm:h-8 sm:w-8 text-primary fill-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5 md:p-3 bg-white border-t-2 border-border/80 shrink-0">
                    <p className="text-xs md:text-sm font-bold text-foreground truncate">{item.platform}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">Click to watch</p>
                  </div>
                </motion.a>
              );
            })}
          </div>

          <div className="flex justify-center gap-6">
            <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white border border-border hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white border border-border hover:text-primary transition-colors" aria-label="Facebook">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white border border-border hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
