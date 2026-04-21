import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getSingleOrder } from "../../api/FetchAllOrder";
import SessionChecklistPreviewComponent from "./SessionChecklistPreviewComponent";
import { exportToPDF } from "../../utils/pdfExport";

function SessionChecklistPreviewController() {
  const { eventId, sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getSingleOrder(eventId);
        if (response?.data?.status) {
          setOrderData(response.data.data);
        } else {
          toast.error("Failed to fetch checklist data");
        }
      } catch (error) {
        toast.error("Error fetching checklist data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchOrder();
    }
  }, [eventId]);

  const sessions = orderData?.sessions?.length ? orderData.sessions : [];
  const matchedSessionIndex = sessions.findIndex(
    (session) => String(session?.id) === String(sessionId)
  );
  const parsedIndex = Number(sessionId);
  const sessionIndex =
    matchedSessionIndex >= 0
      ? matchedSessionIndex
      : Number.isInteger(parsedIndex) && parsedIndex >= 0
        ? parsedIndex
        : -1;
  const sessionData = sessionIndex >= 0 ? sessions[sessionIndex] : null;

  const onDownloadPDF = async () => {
    try {
      const fileName = `SessionChecklist_${eventId}_S${sessionId}.pdf`;
      await exportToPDF("pdf-content", fileName, toast, {
        margin: [24, 0, 24, 0],
        html2canvas: {
          scale: 2,
          useCORS: true,
          windowWidth: 794,
          scrollY: 0,
        },
        jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], avoid: ["tr", "td"] },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <SessionChecklistPreviewComponent
      loading={loading}
      orderData={orderData}
      sessionData={sessionData}
      sessionIndex={sessionIndex >= 0 ? sessionIndex : 0}
      onDownloadPDF={onDownloadPDF}
    />
  );
}

export default SessionChecklistPreviewController;
