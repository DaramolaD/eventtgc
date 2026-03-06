"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] px-4">
            <div className="max-w-md w-full text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fee2e2] text-[#e91e63] mb-6">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                    Something went wrong
                </h1>
                <p className="text-[#666] text-sm mb-8">
                    A client-side error occurred. Try refreshing or going back home.
                    Check the browser console for details.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e91e63] bg-white px-5 py-3 text-sm font-bold text-[#e91e63] hover:bg-[#fee2e2] transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try again
                    </button>
                    <Link
                        href="/"
                        prefetch={false}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e91e63] px-5 py-3 text-sm font-bold text-white hover:bg-[#d81b60] transition-colors shadow-lg shadow-pink-100"
                    >
                        <Home className="w-4 h-4" />
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
