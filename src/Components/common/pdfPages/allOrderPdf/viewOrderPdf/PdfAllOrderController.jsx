/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSingleOrder } from "../../../../../api/FetchAllOrder";
import PdfAllOrderComponent from "./PdfAllOrderComponent";
import { useParams } from "react-router-dom";
import { getAllBusinessProfiles } from "../../../../../api/BusinessProfile";
import { usePdfCategorizer } from "../../../../../hooks/usePdfCategorizer";
import { exportToPDF, shareToWhatsApp } from "../../../../../utils/pdfExport";

function PdfAllOrderController() {
  const pdfMargin = 16;

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [pdfAllOrder, setPdfAllOrder] = useState([]);
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
  const fetchAllOrderPdf = async () => {
    try {
      const response = await getSingleOrder(id);
      if (response.data.status) {
        setPdfAllOrder(response.data.data);
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
      fetchAllOrderPdf();
    }
  }, [id]);

  //Generate  Unique Key
  const generateUniqueKey = (amount) => {
    if (!amount && amount !== 0) return "Invalid Amount";
    const amountStr = amount.toString();
    if (amountStr.length === 1) {
      return `A${amountStr}`;
    } else if (amountStr.length === 2) {
      return `A${amountStr[0]}1A2${amountStr[1]}`;
    } else if (amountStr.length === 3) {
      return `A${amountStr[0]}1A2${amountStr[1]}3B4${amountStr[2]}`;
    } else if (amountStr.length === 4) {
      return `A${amountStr[0]}1A2${amountStr[1]}3B4${amountStr[2]}5C6${amountStr[3]}`;
    }
    return "Invalid Amount";
  };

  const downloadPDF = async () => {
    try {
      await exportToPDF("pdf-content", `OrderMaster_${id}.pdf`, toast, {
        margin: pdfMargin,
        html2canvas: {
          scale: 3,
          useCORS: true,
          logging: false,
          letterRendering: true,
          windowWidth: 794,
          scrollY: 0,
        },
        jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] ,avoid: ["tr", "td"],},
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };


  const shareOnWhatsApp = async () => {
    try {
      const fileName = `OrderMaster_${pdfAllOrder?.booking_no || id}.pdf`;
      await shareToWhatsApp("pdf-content", fileName, pdfAllOrder?.mobile_no, toast, {
        margin: pdfMargin,
        html2canvas: {
          scale: 3,
          useCORS: true,
          logging: false,
          letterRendering: true,
          windowWidth: 794,
          scrollY: 0,
        },
        jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate shareable PDF");
    }
  };

  const { categorizedData, isCategorizing } = usePdfCategorizer(
    pdfAllOrder,
    !loading
  );

  return (
    <div>
      <PdfAllOrderComponent
        pdfAllOrder={categorizedData}
        loading={loading || isCategorizing}
        generateUniqueKey={generateUniqueKey}
        downloadPDF={downloadPDF}
        shareOnWhatsApp={shareOnWhatsApp}
        businessProfile={businessProfile}
      />
    </div>
  );
}

export default PdfAllOrderController;
