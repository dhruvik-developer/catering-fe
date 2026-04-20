// Re-export updateEventBooking as updateQuotation for backward compatibility
// Both use the same PUT /event-bookings/:id/ endpoint
import { updateEventBooking } from "./PutEventBooking";

export const updateQuotation = updateEventBooking;
