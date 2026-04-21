import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ViewOrderDetailsComponent from "./ViewOrderDetailsComponent";
import { getSingleOrder } from "../../api/FetchAllOrder";
import { getAllBusinessProfiles } from "../../api/BusinessProfile";
import { updateEventBooking } from "../../api/PutEventBooking";
function ViewOrderDetailsController() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [tagSession, setTagSession] = useState(null); // Which session holds the tags Modal
  const [catererNameProfile, setCatererNameProfile] = useState(""); // Extracted from business profile
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // New Payment Modal state

  const fetchOrderDetails = async () => {
    try {
      const response = await getSingleOrder(id);
      if (response?.data?.status) {
        setOrderDetails(response.data.data);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Error fetching order details");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessProfile = async () => {
    try {
      const response = await getAllBusinessProfiles();
      if (response?.status && response?.data?.length > 0) {
        // Get the first / default business profile
        setCatererNameProfile(response.data[0].cater_name || "");
      }
    } catch (error) {
      console.error("Error fetching business profile:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      fetchBusinessProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleViewIngredientBySession = (orderId, sessionId, sessionTime) => {
    navigate(
      `/view-ingredient/${orderId}?session_id=${encodeURIComponent(sessionId)}&session=${encodeURIComponent(sessionTime)}`,
      {
        state: {
          from: "view-order-details",
          customParents: {
            "view-ingredient": "view-order-details",
            "view-order-details": "all-order",
          },
        },
      }
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditOrder = (orderId) => {
    navigate(`/edit-dish/${orderId}`, {
      state: {
        from: "view-order-details",
        customParents: { "edit-dish": "view-order-details" },
      },
    });
  };

  const handleEditSession = (orderId, sessionIndex) => {
    navigate(`/edit-dish/${orderId}?sessionIndex=${sessionIndex}`, {
      state: {
        from: "view-order-details",
        customParents: { "edit-dish": "view-order-details" },
      },
    });
  };

  const handleAssignStaff = (orderId, sessionId, sessionTime) => {
    // Find the matching session to extract waiter_service data
    const matchingSession = (orderDetails?.sessions || []).find(
      (s) => s.id === sessionId
    );
    const waiterService = matchingSession?.waiter_service || [];
    const waiterServiceAmount = matchingSession?.waiter_service_amount || 0;

    navigate(`/add-assignment`, {
      state: {
        mode: "add",
        eventId: orderId,
        sessionId: sessionId,
        sessionName: sessionTime,
        waiterService,
        waiterServiceAmount,
        eventName: orderDetails?.name || "",
      },
    });
  };

  const handleEditAssignment = (assignmentId) => {
    navigate(`/edit-assignment/${assignmentId}`);
  };

  const handleOpenSessionChecklistPreview = (orderId, targetSessionId) => {
    navigate(`/session-checklist-preview/${orderId}/${targetSessionId}`, {
      state: {
        from: "view-order-details",
        customParents: {
          "session-checklist-preview": "view-order-details",
          "view-order-details": "all-order",
        },
      },
    });
  };

  const handleSaveGroundManagement = async (sessionId, groundData) => {
    if (!orderDetails) return;
    try {
      const updatedSessions = (orderDetails.sessions || []).map((s) => {
        if (s.id === sessionId) {
          return { ...s, ground_management: groundData };
        }
        return s;
      });

      const payload = {
        ...orderDetails,
        sessions: updatedSessions,
      };

      const res = await updateEventBooking(id, payload);
      if (res) {
        await fetchOrderDetails(); // Refresh data
      }
    } catch (error) {
      console.error("Error saving ground management:", error);
      toast.error("Failed to save ground management");
    }
  };

  return (
    <ViewOrderDetailsComponent
      orderDetails={orderDetails}
      loading={loading}
      handleViewIngredientBySession={handleViewIngredientBySession}
      handleEditOrder={handleEditOrder}
      handleEditSession={handleEditSession}
      handleAssignStaff={handleAssignStaff}
      handleEditAssignment={handleEditAssignment}
      handleOpenSessionChecklistPreview={handleOpenSessionChecklistPreview}
      handleSaveGroundManagement={handleSaveGroundManagement}
      handleBack={handleBack}
      handleOpenTags={setTagSession}
      tagSession={tagSession}
      onCloseTag={() => setTagSession(null)}
      catererNameProfile={catererNameProfile}
      isPaymentModalOpen={isPaymentModalOpen}
      onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
      onClosePaymentModal={() => setIsPaymentModalOpen(false)}
      onPaymentSuccess={fetchOrderDetails} // Refresh data after payment
    />
  );
}

export default ViewOrderDetailsController;
