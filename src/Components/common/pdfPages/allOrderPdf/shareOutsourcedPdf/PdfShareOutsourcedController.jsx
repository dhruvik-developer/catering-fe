import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { exportToPDF, shareToWhatsApp } from "../../../../../utils/pdfExport";
import toast from "react-hot-toast";
import PdfShareOutsourcedComponent from "./PdfShareOutsourcedComponent";
import { getAllBusinessProfiles } from "../../../../../api/BusinessProfile";
import { generatePdfFilename } from "../../../../../utils/generatePdfFilename";

function PdfShareOutsourcedController() {
  const location = useLocation();
  const navigate = useNavigate();
  const { statePayload } = location.state || {};

  const [businessProfile, setBusinessProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getAllBusinessProfiles();
      if (res?.status && res?.data?.length > 0) setBusinessProfile(res.data[0]);
    };
    fetchProfile();
  }, []);

  const eventAddress = statePayload?.eventAddress;
  const formattedDate = statePayload?.formattedDate;
  const deliveryTime = statePayload?.deliveryTime;
  const vendorGroups = statePayload?.vendorGroups || [];
  const locationLink = eventAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventAddress)}`
    : "";

  const buildWhatsAppMessage = () => {
    const lines = [
      `Hello,`,
      ``,
      `Caterers Name: ${businessProfile?.caters_name || "radha Sweet & Caterers"}`,
      `Please supply the following outsourced items:`,
      `Location Link: ${locationLink || "-"}`,
      `Delivery Address: ${eventAddress || "-"}`,
      `Delivery Date: ${formattedDate || "-"}`,
      `Delivery Time: ${deliveryTime || "-"}`,
      ``,
      `Items:`,
    ];

    vendorGroups.forEach((vg) => {
      lines.push(``, `Vendor: ${vg.vendor_name || "Unassigned"}`);
      (vg.items || []).forEach((item, idx) => {
        const qty = item.quantity ? `${item.quantity} ${item.unit || ""}`.trim() : "-";
        lines.push(`${idx + 1}. ${item.item_name} - ${qty}`);
      });
    });

    return lines.join("\n").trim();
  };

  const downloadPDF = () => {
    const fileName = generatePdfFilename({
      type: "outsourced-items",
      date: formattedDate,
    });
    exportToPDF("pdf-content", fileName, toast);
  };

  const shareOnWhatsApp = () =>
    shareToWhatsApp(
      "pdf-content",
      "Outsourced-Items.pdf",
      "",
      toast,
      {},
      buildWhatsAppMessage()
    );

  return (
    <PdfShareOutsourcedComponent
      eventAddress={eventAddress}
      formattedDate={formattedDate}
      deliveryTime={deliveryTime}
      vendorGroups={vendorGroups}
      downloadPDF={downloadPDF}
      shareOnWhatsApp={shareOnWhatsApp}
      navigate={navigate}
      businessProfile={businessProfile}
    />
  );
}

export default PdfShareOutsourcedController;
