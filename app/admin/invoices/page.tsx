import { getInvoices, getBankDetails } from "@/app/actions/submissions";
import AdminSidebar from "@/components/AdminSidebar";
import InvoiceListManager from "@/components/InvoiceListManager";
import { FileText } from "lucide-react";

export default async function AdminInvoicesPage() {
    const { data: invoices = [] } = await getInvoices();

    return (
        <div className="flex min-h-screen bg-[#fcfcfc]">
            <AdminSidebar />
            <main className="flex-grow md:pl-[280px] py-8 px-4 md:px-8 mt-14 md:mt-0">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-black text-[#1a1a1a] tracking-tight mb-1 underline decoration-[#e91e63] decoration-4 underline-offset-4">
                                Invoices
                            </h1>
                            <p className="text-[#888] font-medium text-sm mt-2">
                                View all invoices, payment status, and confirm payments.
                            </p>
                        </div>
                        <div className="rounded-xl bg-[#fee2e2] px-4 py-2.5 text-xs font-bold text-[#e91e63] flex items-center gap-2">
                            <FileText size={16} />
                            Total: {invoices.length}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#eee] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                        <InvoiceListManager initialInvoices={invoices} />
                    </div>
                </div>
            </main>
        </div>
    );
}
