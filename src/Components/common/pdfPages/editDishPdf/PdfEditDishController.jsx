import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateEventBooking } from "../../../../api/PutEventBooking";
import PdfEditDishComponenet from "./PdfEditDishComponenet";
import toast from "react-hot-toast";
import { exportToPDF, shareToWhatsApp } from "../../../../utils/pdfExport";
import { getAllBusinessProfiles } from "../../../../api/BusinessProfile";
import { generatePdfFilename } from "../../../../utils/generatePdfFilename";

const PDFViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiPayload, id, fromNavigation } = location.state || {};
  const [businessProfile, setBusinessProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getAllBusinessProfiles();
      if (res?.status && res?.data?.length > 0) {
        setBusinessProfile(res.data[0]);
      }
    };
    fetchProfile();
  }, []);

  if (!apiPayload) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 font-medium text-lg">
          No data available. Please go back and select items.
        </p>
      </div>
    );
  }

  const handleUpdateBooking = async () => {
    try {
      const response = await updateEventBooking(id, apiPayload);
      if (response) {
        toast.success("Booking updated successfully!");
        if (fromNavigation?.from === "all-order") {
          navigate("/all-order");
        } else if (fromNavigation?.from === "view-order-details") {
          navigate(`/view-order-details/${id}`);
        } else if (fromNavigation?.from === "invoice") {
          navigate("/invoice");
        } else if (fromNavigation?.from === "quotation") {
          navigate("/quotation");
        } else {
          // Default fallback to all-order to be safe
          navigate("/all-order");
        }
      }
    } catch (error) {
      console.error("Error updating event booking:", error);
    }
  };

  const downloadPDF = () => {
    const fileName = generatePdfFilename({
      customerName: apiPayload?.name,
      type: "order",
      number: apiPayload?.booking_no || id,
    });
    exportToPDF("pdf-content", fileName, toast);
  };

  const shareOnWhatsApp = () => {
    const fileName = generatePdfFilename({
      customerName: apiPayload?.name,
      type: "order",
      number: apiPayload?.booking_no || id,
    });
    const mobileNo = apiPayload?.mobile_no;
    shareToWhatsApp("pdf-content", fileName, mobileNo, toast);
  };

  return (
    <PdfEditDishComponenet
      itemData={apiPayload}
      handleUpdateBooking={handleUpdateBooking}
      downloadPDF={downloadPDF}
      shareOnWhatsApp={shareOnWhatsApp}
      businessProfile={businessProfile}
    />
  );
};

export default PDFViewPage;
