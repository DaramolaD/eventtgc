"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormData } from "@/lib/validations/booking";
import { submitBooking } from "@/app/actions/submissions";
import { cn } from "@/lib/utils";
import {
    ShoppingBag,
    Calendar,
    Package,
    Send,
    CheckCircle2,
    User,
    MapPin,
    ClipboardList,
    Sparkles,
    RefreshCw,
    Users,
    Briefcase
} from "lucide-react";

const serviceTags = [
    "Decorations", "Catering", "Drop-off Menu Order", "Event Coordination", "DJ / Music", "Photography", "Venue Setup", "Other (Please specify)"
];

export default function BookingForm({ initialServiceType }: { initialServiceType?: "rental" | "service" | "both" }) {
    const [activeType, setActiveType] = useState<"rental" | "service" | "both">(initialServiceType || "rental");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            serviceType: "rental",
            servicesNeeded: [],
        }
    });

    useEffect(() => {
        if (initialServiceType) setActiveType(initialServiceType);
    }, [initialServiceType]);

    useEffect(() => {
        setValue("serviceType", activeType);
    }, [activeType, setValue]);

    const toggleService = (tag: string) => {
        const newServices = selectedServices.includes(tag)
            ? selectedServices.filter(s => s !== tag)
            : [...selectedServices, tag];
        setSelectedServices(newServices);
        setValue("servicesNeeded", newServices);
    };

    const onSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true);
        try {
            const result = await submitBooking(data);
            if (result.success) {
                setIsSuccess(true);
                reset();
                setSelectedServices([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-4 glass rounded-[40px] border-2 border-primary/20 shadow-2xl"
            >
                <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-bold mb-4">Request Sent!</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
                    Thank you for choosing TGC Events. We've received your inquiry and will get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="rounded-full bg-primary px-10 py-4 font-bold text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    Make Another Booking
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 pb-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Book <span className="text-primary italic">With Us</span></h1>
                <p className="text-muted-foreground text-lg">Select a category to get started</p>
            </div>

            {/* Service Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                    { id: "rental", title: "Rentals Only", desc: "Rent items for your event", icon: ShoppingBag },
                    { id: "service", title: "Event Services", desc: "Book our event management services", icon: Calendar },
                    { id: "both", title: "Both", desc: "Rentals + Event services", icon: Package },
                ].map((type) => (
                    <button
                        key={type.id}
                        type="button"
                        onClick={() => setActiveType(type.id as any)}
                        className={cn(
                            "relative p-8 rounded-[32px] border-2 text-left transition-all duration-300",
                            activeType === type.id
                                ? "border-primary bg-white shadow-xl shadow-primary/5 ring-1 ring-primary/20"
                                : "border-border bg-white hover:border-primary/20 hover:shadow-lg"
                        )}
                    >
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center mb-6",
                            activeType === type.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                            <type.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{type.desc}</p>
                        {activeType === type.id && (
                            <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="glass p-10 rounded-[40px] border border-border/50 shadow-2xl space-y-12 bg-white">

                <div className="flex items-center space-x-3 pb-2">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        {activeType === 'rental' && <><ShoppingBag className="text-primary h-6 w-6" /> Rental Details</>}
                        {activeType === 'service' && <><Calendar className="text-primary h-6 w-6" /> Event Service Details</>}
                        {activeType === 'both' && <><Package className="text-primary h-6 w-6" /> Full Package Details</>}
                    </h2>
                </div>

                {/* Contact info section */}
                <section className="space-y-8">
                    <div className="flex items-center space-x-3 pb-4 border-b border-border/50">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold">Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Full Name</label>
                            <input
                                {...register("fullName")}
                                className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                placeholder="Your full name"
                            />
                            {errors.fullName && <p className="text-xs text-red-500 ml-1">{errors.fullName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Email Address</label>
                            <input
                                {...register("email")}
                                className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Phone Number</label>
                            <input
                                {...register("phone")}
                                className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                placeholder="+234..."
                            />
                            {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Address</label>
                            <input
                                {...register("address")}
                                className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                placeholder="Your current address"
                            />
                            {errors.address && <p className="text-xs text-red-500 ml-1">{errors.address.message}</p>}
                        </div>
                    </div>
                </section>

                {/* Conditional Rental Section */}
                {(activeType === 'rental' || activeType === 'both') && (
                    <section className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center space-x-3 pb-4 border-b border-border/50">
                            <ClipboardList className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold">Rental Requirements</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Items Needed</label>
                                <textarea
                                    {...register("itemsNeeded")}
                                    rows={4}
                                    className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                                    placeholder="List items, additions, or special requests (e.g., 50 chairs, 10 tables...)"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Date Item(s) Needed</label>
                                    <input
                                        type="date"
                                        {...register("rentalDate")}
                                        className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Location Items Will Be Used</label>
                                    <input
                                        {...register("rentalLocation")}
                                        className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                        placeholder="Rental drop-off location"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Conditional Event Service Section */}
                {(activeType === 'service' || activeType === 'both') && (
                    <section className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center space-x-3 pb-4 border-b border-border/50">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold">Event Services</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Event Date</label>
                                <input
                                    type="date"
                                    {...register("eventDate")}
                                    className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Number of Guests</label>
                                <input
                                    type="number"
                                    {...register("guestCount")}
                                    className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    placeholder="e.g. 100"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Number of Vendors</label>
                                <input
                                    type="number"
                                    {...register("vendorCount")}
                                    className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    placeholder="e.g. 5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Event Location</label>
                                <input
                                    {...register("eventLocation")}
                                    className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    placeholder="Venue name or address"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-semibold ml-1">Services Needed</label>
                            <div className="flex flex-wrap gap-3">
                                {serviceTags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleService(tag)}
                                        className={cn(
                                            "px-4 py-2.5 rounded-full text-sm font-medium border transition-all",
                                            selectedServices.includes(tag)
                                                ? "bg-primary text-white border-primary"
                                                : "bg-muted/30 border-border hover:border-primary/50"
                                        )}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Additional Event Items / Additions (Optional)</label>
                            <textarea
                                {...register("additionalItems")}
                                rows={3}
                                className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                                placeholder="Any specific items, equipment, or additions needed for the event..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Additional Information / Special Requests (Optional)</label>
                            <textarea
                                {...register("specialRequests")}
                                rows={3}
                                className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                                placeholder="Theme, color scheme, special requests, or any other details..."
                            />
                        </div>
                    </section>
                )}

                {/* Terms section */}
                <div className="p-8 rounded-[32px] bg-red-50/30 border border-primary/10">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        Rental Terms & Conditions
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-3 mb-8">
                        <li className="flex items-start"><span className="text-primary mr-2">•</span> A refundable caution fee will be charged and paid alongside the original rental fee.</li>
                        <li className="flex items-start"><span className="text-primary mr-2">•</span> Delays after the expected return day attract extra charges and risk forfeiture of the refundable caution fee.</li>
                        <li className="flex items-start"><span className="text-primary mr-2">•</span> Items damaged upon return will attract a fee or forfeiture of caution fee.</li>
                    </ul>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" required className="h-6 w-6 rounded-full border-primary text-primary focus:ring-primary cursor-pointer" />
                        <span className="text-sm font-bold text-black/80 group-hover:text-primary transition-colors">I have read and agreed to the terms and conditions</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-primary py-5 font-bold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
                >
                    {isSubmitting ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                    <span className="text-lg">
                        {activeType === 'rental' && "Submit Rental Request"}
                        {activeType === 'service' && "Submit Event Booking"}
                        {activeType === 'both' && "Submit Full Package Request"}
                    </span>
                </button>
            </form>
        </div>
    );
}
