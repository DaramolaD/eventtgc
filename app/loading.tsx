export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#e91e63]/10 border-2 border-[#e91e63]/30 animate-pulse" />
                <p className="text-[13px] font-bold text-[#888]">Loading…</p>
            </div>
        </div>
    );
}
