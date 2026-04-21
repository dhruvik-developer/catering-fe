/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSingleQuotation } from "../../../../api/FetchQuotation";
import PdfQuotationComponent from "./PdfQuotationComponent";
import { useParams } from "react-router-dom";
import { getAllBusinessProfiles } from "../../../../api/BusinessProfile";

import { generatePdfFilename } from "../../../../utils/generatePdfFilename";
import { usePdfCategorizer } from "../../../../hooks/usePdfCategorizer";
import {
  exportToPDF,
  shareToWhatsApp,
} from "../../../../utils/pdfExport";

function PdfQuotationController() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [pdfQuotation, setPdfQuotation] = useState([]);
  const pdfDownloadOptions = {
    margin: [6, 0, 6, 0],
  };
  const pdfShareOptions = {
    margin: [6, 2, 6, 2],
  };

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

  const fetchQuotationPdf = async () => {
    try {
      const response = await getSingleQuotation(id);
      if (response.data.status) {
        setPdfQuotation(response.data.data);
      } else {
        toast.error("Failed to fetch quotation");
      }
    } catch (error) {
      toast.error("Error fetching quotation");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuotationPdf();
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
      const fileName = generatePdfFilename({
        customerName: pdfQuotation?.name,
        type: "quotation",
        number: pdfQuotation?.booking_no || id,
      });
      await exportToPDF("pdf-content", fileName, toast, pdfDownloadOptions);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  const shareOnWhatsApp = async () => {
    try {
      const fileName = generatePdfFilename({
        customerName: pdfQuotation?.name,
        type: "quotation",
        number: pdfQuotation?.booking_no || id,
      });
      const mobileNo = pdfQuotation?.mobile_no;
      await shareToWhatsApp(
        "pdf-content",
        fileName,
        mobileNo,
        toast,
        pdfShareOptions
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate shareable PDF");
    }
  };

  const { categorizedData, isCategorizing } = usePdfCategorizer(
    pdfQuotation,
    !loading
  );

  return (
    <div>
      <PdfQuotationComponent
        pdfQuotation={categorizedData}
        loading={loading || isCategorizing}
        generateUniqueKey={generateUniqueKey}
        downloadPDF={downloadPDF}
        shareOnWhatsApp={shareOnWhatsApp}
        businessProfile={businessProfile}
      />
    </div>
  );
}

export default PdfQuotationController;
