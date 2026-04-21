import { getSingleOrder } from "../api/FetchAllOrder";
import { getAllBusinessProfiles } from "../api/BusinessProfile";
import { generateOrderMasterPDF as serviceGenOrderMaster, generateSessionChecklistPDF as serviceGenSessionChecklist } from "./pdf/pdfService";

export const generateOrderMasterPDF = async (orderId) => {
  try {
    const orderRes = await getSingleOrder(orderId);
    if (!orderRes?.data?.status) {
      throw new Error("Failed to fetch order details");
    }
    const orderData = orderRes.data.data;

    const profileRes = await getAllBusinessProfiles();
    const businessProfile = profileRes?.status && profileRes?.data?.length > 0 ? profileRes.data[0] : null;

    const doc = await serviceGenOrderMaster(orderData, businessProfile);
    doc.save(`OrderMaster_${orderId}.pdf`);
  } catch (error) {
    console.error("Error generating Order Master PDF:", error);
    throw error;
  }
};

export const generateSessionChecklistPDF = async (orderId, targetSessionId = null) => {
  try {
    const orderRes = await getSingleOrder(orderId);
    if (!orderRes?.data?.status) {
      throw new Error("Failed to fetch order details");
    }
    const orderData = orderRes.data.data;
    const profileRes = await getAllBusinessProfiles();
    const businessProfile = profileRes?.status && profileRes?.data?.length > 0 ? profileRes.data[0] : null;
    
    const allSessions = orderData.sessions?.length ? orderData.sessions : [orderData];

    let sessionData = null;
    let sessionIndex = 0;
    
    // We expect the PDF service to handle a single session checklist at a time now.
    if (targetSessionId !== null && targetSessionId !== undefined) {
      const matchIdx = allSessions.findIndex((s) => String(s?.id) === String(targetSessionId));
      if (matchIdx !== -1) {
        sessionData = allSessions[matchIdx];
        sessionIndex = matchIdx;
      } else {
        const idx = Number(targetSessionId);
        if (Number.isInteger(idx) && idx >= 0 && idx < allSessions.length) {
          sessionData = allSessions[idx];
          sessionIndex = idx;
        }
      }
    } else {
      sessionData = allSessions[0];
    }

    if (!sessionData) {
      throw new Error("No matching session found for checklist PDF");
    }

    const doc = await serviceGenSessionChecklist(orderData, sessionData, businessProfile, sessionIndex);
    const fileSuffix = targetSessionId !== null && targetSessionId !== undefined ? `_S${targetSessionId}` : "";
    doc.save(`SessionChecklist_${orderId}${fileSuffix}.pdf`);
  } catch (error) {
    console.error("Error generating Session Checklist PDF:", error);
    throw error;
  }
};

