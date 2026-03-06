"use server";

import { supabase, adminSupabase } from "@/lib/supabase";
import { type BookingFormData } from "@/lib/validations/booking";
import { revalidatePath } from "next/cache";

export async function submitBooking(data: BookingFormData) {
    try {
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
        const { error } = await adminSupabase
            .from("submissions")
            .update({ status })
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin-dashboard");
        return { success: true };
    } catch (error) {
        console.error("Update status error:", error);
        return { success: false, error: "Failed to update status" };
    }
}
