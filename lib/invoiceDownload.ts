export type BankDetailsLike = {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    instructions?: string;
} | null;

export type SubmissionLike = {
    id?: string;
    invoice_number?: string | null;
    invoice_generated_at?: string | null;
    full_name?: string | null;
    email?: string | null;
    service_type?: string | null;
    event_location?: string | null;
    rental_location?: string | null;
    payment_reported_at?: string | null;
    payment_confirmed_at?: string | null;
};

function paymentLine(sub: SubmissionLike): string {
    if (sub.payment_confirmed_at) {
        return `Payment status: Confirmed (${new Date(sub.payment_confirmed_at).toLocaleDateString()})`;
    }
    if (sub.payment_reported_at) {
        return `Payment status: Client reported (${new Date(sub.payment_reported_at).toLocaleDateString()}) — awaiting admin confirmation`;
    }
    return "Payment status: Awaiting payment";
}

export function buildInvoiceText(submission: SubmissionLike, bank: BankDetailsLike): string {
    const lines = [
        "TGC EVENTS HUB — INVOICE",
        "========================",
        `Invoice number: ${submission.invoice_number || "N/A"}`,
        `Issued: ${submission.invoice_generated_at ? new Date(submission.invoice_generated_at).toLocaleDateString() : "N/A"}`,
        "",
        "CUSTOMER",
        `Name: ${submission.full_name || "N/A"}`,
        `Email: ${submission.email || "N/A"}`,
        "",
        "BOOKING",
        `Booking ID: ${submission.id || "N/A"}`,
        `Package: ${submission.service_type || "N/A"}`,
        `Location: ${submission.event_location || submission.rental_location || "N/A"}`,
        "",
        paymentLine(submission),
        "",
        "PAYMENT DETAILS",
        `Bank: ${bank?.bankName || "N/A"}`,
        `Account name: ${bank?.accountName || "N/A"}`,
        `Account number: ${bank?.accountNumber || "N/A"}`,
        bank?.instructions ? `Instructions: ${bank.instructions}` : "",
        "",
        "Thank you for choosing TGC Events Hub.",
    ];
    return lines.filter(Boolean).join("\n");
}

export function downloadInvoiceFile(submission: SubmissionLike, bank: BankDetailsLike) {
    const text = buildInvoiceText(submission, bank);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${submission.invoice_number || `invoice-${submission.id || "booking"}`}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
}
