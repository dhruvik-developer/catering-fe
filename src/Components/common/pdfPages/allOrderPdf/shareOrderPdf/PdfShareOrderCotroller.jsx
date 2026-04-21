/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSingleOrder } from "../../../../../api/FetchAllOrder";
import PdfShareOrderComponent from "./PdfShareOrderComponent";
import { useParams } from "react-router-dom";
import { getAllBusinessProfiles } from "../../../../../api/BusinessProfile";
import { generatePdfFilename } from "../../../../../utils/generatePdfFilename";
import { usePdfCategorizer } from "../../../../../hooks/usePdfCategorizer";
import { exportToPDF, shareToWhatsApp } from "../../../../../utils/pdfExport";

function PdfShareOrderCotroller() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [pdfShareOrder, setPdfShareOrder] = useState([]);
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
  const fetchShareOrderPdf = async () => {
    try {
      const response = await getSingleOrder(id);
      if (response.data.status) {
        setPdfShareOrder(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchShareOrderPdf();
    }
  }, [id]);

  const downloadPDF = async () => {
    try {
      await exportToPDF("pdf-content", `SharedOrder_${id}.pdf`, toast);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  const shareOnWhatsApp = async () => {
    try {
      const fileName = `SharedOrder_${pdfShareOrder?.booking_no || id}.pdf`;
      await shareToWhatsApp("pdf-content", fileName, pdfShareOrder?.mobile_no, toast);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate shareable PDF");
    }
  };

  const { categorizedData, isCategorizing } = usePdfCategorizer(
    pdfShareOrder,
    !loading
  );

  return (
    <div>
      <PdfShareOrderComponent
        pdfShareOrder={categorizedData}
        loading={loading || isCategorizing}
        downloadPDF={downloadPDF}
        shareOnWhatsApp={shareOnWhatsApp}
        businessProfile={businessProfile}
      />
    </div>
  );
}

export default PdfShareOrderCotroller;
