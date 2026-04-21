import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { exportToPDF, shareToWhatsApp } from "../../../../../utils/pdfExport";
import toast from "react-hot-toast";
import PdfShareIngredientComponent from "./PdfShareIngredientComponent";
import { getAllBusinessProfiles } from "../../../../../api/BusinessProfile";
import { generatePdfFilename } from "../../../../../utils/generatePdfFilename";

function PdfShareIngredientController() {
  const location = useLocation();
  const navigate = useNavigate();
  const { statePayload } = location.state || {};

  // Fetch Business Profile
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

  const eventAddress = statePayload?.eventAddress;
  const formattedDate = statePayload?.formattedDate;
  const deliveryTime = statePayload?.deliveryTime;
  const selectedItems = statePayload?.selectedItems || [];
  const locationLink = eventAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventAddress)}`
    : "";

  const buildVendorWhatsAppMessage = () => {
    const lines = [
      `Hello ${statePayload?.vendorName || "Vendor"},`,
      "",
      `Caterers Name: ${businessProfile?.caters_name || "radha Sweet & Caterers"}`,
      "Please deliver the following items:",
      `Location Link: ${locationLink || "-"}`,
      `Delivery Address: ${eventAddress || "-"}`,
      `Delivery Date: ${formattedDate || "-"}`,
      `Delivery Time: ${deliveryTime || "-"}`,
      "",
      "Items:",
      ...selectedItems.map(
        (item, index) =>
          `${index + 1}. ${item.itemName || "Item"} - ${item.totalQuantity || "-"}`
      ),
    ];

    return lines.join("\n").trim();
  };

  const downloadPDF = () => {
    const fileName = generatePdfFilename({
      customerName: statePayload?.customerName,
      sessionName: deliveryTime,
      type: "ingredient",
      date: formattedDate,
    });
    exportToPDF("pdf-content", fileName, toast);
  };

  const shareOnWhatsApp = () =>
    shareToWhatsApp(
      "pdf-content",
      "Ingredient-List.pdf",
      statePayload?.mobileNo || "",
      toast,
      {},
      buildVendorWhatsAppMessage()
    );

  return (
    <PdfShareIngredientComponent
      eventAddress={eventAddress}
      formattedDate={formattedDate}
      deliveryTime={deliveryTime}
      selectedItems={selectedItems}
      downloadPDF={downloadPDF}
      shareOnWhatsApp={shareOnWhatsApp}
      navigate={navigate}
      businessProfile={businessProfile}
    />
  );
}

export default PdfShareIngredientController;
