import { z } from "zod";

export const bookingSchema = z.object({
    // Common Fields
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.string().min(5, "Contact address is required"),
    serviceType: z.enum(["rental", "service", "both"]),

    // Rental Specific (required if type is rental or both)
    itemsNeeded: z.string().optional(),
    rentalDate: z.string().optional(),
    rentalLocation: z.string().optional(),

    // Event Service Specific (required if type is service or both)
    eventDate: z.string().optional(),
    eventLocation: z.string().optional(),
    guestCount: z.string().optional(),
    vendorCount: z.string().optional(),
    servicesNeeded: z.array(z.string()).optional(),
    additionalItems: z.string().optional(),
    specialRequests: z.string().optional(),
}).refine((data) => {
    if (data.serviceType === "rental" || data.serviceType === "both") {
        return !!data.itemsNeeded && !!data.rentalDate && !!data.rentalLocation;
    }
    return true;
}, {
    message: "Rental details are required for this service type",
    path: ["itemsNeeded"]
}).refine((data) => {
    if (data.serviceType === "service" || data.serviceType === "both") {
        return !!data.eventDate && !!data.eventLocation && !!data.guestCount;
    }
    return true;
}, {
    message: "Event details are required for this service type",
    path: ["eventDate"]
});

export type BookingFormData = z.infer<typeof bookingSchema>;
