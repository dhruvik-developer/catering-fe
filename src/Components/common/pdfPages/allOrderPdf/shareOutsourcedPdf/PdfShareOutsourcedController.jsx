import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { exportToPDF } from "../../../../../utils/pdfExport";
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

  const downloadPDF = () => {
    const fileName = generatePdfFilename({
      type: "outsourced-items",
      date: formattedDate,
    });
    exportToPDF("pdf-content", fileName, toast);
  };

  return (
    <PdfShareOutsourcedComponent
      eventAddress={eventAddress}
      formattedDate={formattedDate}
      deliveryTime={deliveryTime}
      vendorGroups={vendorGroups}
      downloadPDF={downloadPDF}
      navigate={navigate}
      businessProfile={businessProfile}
    />
  );
}

export default PdfShareOutsourcedController;
