"use client";

import { motion } from "framer-motion";
import BookingForm from "@/components/BookingForm";
import { Sparkles } from "lucide-react";

export default function BookingPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">Start Your Journey</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Book Your Next Experience
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Tell us about your event and we'll help you make it extraordinary.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass rounded-[32px] p-8 md:p-12 shadow-2xl border-border/50"
                >
                    <BookingForm />
                </motion.div>
            </div>
        </div>
    );
}
