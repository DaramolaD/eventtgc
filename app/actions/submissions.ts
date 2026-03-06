"use server";

import { supabase, adminSupabase } from "@/lib/supabase";
import { type BookingFormData } from "@/lib/validations/booking";
import { revalidatePath } from "next/cache";

export async function submitBooking(data: BookingFormData) {
    try {
        if (!supabase) {
            return { success: false, error: "Database not configured" };
        }
        const { error } = await supabase
            .from("submissions")
            .insert([
                {
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    service_type: data.serviceType,
                    // Rental fields
                    items_needed: data.itemsNeeded,
                    rental_date: data.rentalDate || null,
                    rental_location: data.rentalLocation,
                    // Event fields
                    event_date: data.eventDate || null,
                    event_location: data.eventLocation,
                    guest_count: data.guestCount ? parseInt(data.guestCount) : null,
                    vendor_count: data.vendorCount ? parseInt(data.vendorCount) : null,
                    services_needed: data.servicesNeeded,
                    additional_items: data.additionalItems || "",
                    special_requests: data.specialRequests || "",
                    status: "pending",
                },
            ]);

        if (error) throw error;

        revalidatePath("/admin-dashboard");
        return { success: true };
    } catch (error) {
        console.error("Booking submission error:", error);
        return { success: false, error: "Failed to submit booking" };
    }
}

export async function getSubmissions() {
    try {
        if (!adminSupabase) {
            return { error: "Database not configured" };
        }
        const { data, error } = await adminSupabase
            .from("submissions")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return { data };
    } catch (error: any) {
        console.error("Fetch submissions error:", error.message || error);
        return { error: error.message || "Failed to fetch submissions" };
    }
}

export async function updateSubmissionStatus(id: string, status: string) {
    try {
        if (!adminSupabase) return { success: false, error: "Database not configured" };
        const { error } = await adminSupabase
            .from("submissions")
            .update({ status })
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin-dashboard");
        revalidatePath("/admin/bookings");
        return { success: true };
    } catch (error) {
        console.error("Update status error:", error);
        return { success: false, error: "Failed to update status" };
    }
}

/** Get bank details from settings. Returns null if not set or error. */
export async function getBankDetails(): Promise<{ bankName: string; accountName: string; accountNumber: string; instructions: string } | null> {
    try {
        if (!adminSupabase) return null;
        const { data, error } = await adminSupabase
            .from("settings")
            .select("value")
            .eq("key", "bank_details")
            .single();
        if (error || !data?.value) return null;
        const v = data.value as { bankName?: string; accountName?: string; accountNumber?: string; instructions?: string };
        return {
            bankName: v.bankName ?? "",
            accountName: v.accountName ?? "",
            accountNumber: v.accountNumber ?? "",
            instructions: v.instructions ?? "",
        };
    } catch {
        return null;
    }
}

/** Get all submissions that have an invoice (for admin invoices page). */
export async function getInvoices() {
    try {
        if (!adminSupabase) return { error: "Database not configured" };
        const { data, error } = await adminSupabase
            .from("submissions")
            .select("*")
            .not("invoice_generated_at", "is", null)
            .order("invoice_generated_at", { ascending: false });
        if (error) throw error;
        return { data: data ?? [] };
    } catch (err: any) {
        console.error("getInvoices error:", err);
        return { error: err.message ?? "Failed to fetch invoices" };
    }
}

/** User reports they have made the payment. Verifies email matches submission. */
export async function reportPayment(submissionId: string, email: string) {
    try {
        if (!adminSupabase) return { success: false, error: "Database not configured" };
        const { data: sub, error: fetchErr } = await adminSupabase
            .from("submissions")
            .select("id, email")
            .eq("id", submissionId)
            .single();
        if (fetchErr || !sub) return { success: false, error: "Booking not found" };
        if (sub.email?.toLowerCase() !== email?.toLowerCase()) return { success: false, error: "Email does not match this booking" };
        const { error } = await adminSupabase
            .from("submissions")
            .update({ payment_reported_at: new Date().toISOString() })
            .eq("id", submissionId);
        if (error) throw error;
        revalidatePath("/mybookings");
        return { success: true };
    } catch (err: any) {
        console.error("reportPayment error:", err);
        return { success: false, error: err.message ?? "Failed to report payment" };
    }
}

/** Admin confirms payment received. */
export async function confirmPayment(submissionId: string) {
    try {
        if (!adminSupabase) return { success: false, error: "Database not configured" };
        const { error } = await adminSupabase
            .from("submissions")
            .update({
                payment_confirmed_at: new Date().toISOString(),
                status: "confirmed",
            })
            .eq("id", submissionId);
        if (error) throw error;
        revalidatePath("/admin/invoices");
        revalidatePath("/admin/bookings");
        revalidatePath("/mybookings");
        return { success: true };
    } catch (err: any) {
        console.error("confirmPayment error:", err);
        return { success: false, error: err.message ?? "Failed to confirm payment" };
    }
}

/** Generate invoice for a submission: sets invoice_generated_at and invoice_number. Requires submissions table to have these columns. */
export async function generateInvoice(id: string) {
    try {
        if (!adminSupabase) return { success: false, error: "Database not configured" };
        const invoiceNumber = `INV-${Date.now()}-${id.slice(0, 6).toUpperCase()}`;
        const { error } = await adminSupabase
            .from("submissions")
            .update({
                invoice_generated_at: new Date().toISOString(),
                invoice_number: invoiceNumber,
            })
            .eq("id", id);

        if (error) {
            console.error("Generate invoice Supabase error:", error.message, error.details);
            return { success: false, error: error.message };
        }
        revalidatePath("/admin/bookings");
        revalidatePath("/admin/invoices");
        revalidatePath("/admin-dashboard");
        return { success: true, invoice_number: invoiceNumber };
    } catch (error: unknown) {
        const msg = (error as { message?: string }).message ?? "Failed to generate invoice";
        console.error("Generate invoice error:", msg, error);
        return { success: false, error: msg };
    }
}
