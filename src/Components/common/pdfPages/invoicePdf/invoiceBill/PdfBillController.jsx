/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PdfBillComponent from "./PdfBillComponent";
import { getInvoice } from "../../../../../api/FetchInvoice";
import { useParams } from "react-router-dom";
import { exportToPDF, shareToWhatsApp } from "../../../../../utils/pdfExport";
import { getAllBusinessProfiles } from "../../../../../api/BusinessProfile";
import { generatePdfFilename } from "../../../../../utils/generatePdfFilename";
function PdfBillController() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [pdfInvoice, setPdfInvoice] = useState([]);
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
  const fetchInvoicePdf = async () => {
    try {
      const response = await getInvoice();
      if (response.data.status) {
        const selectedInvoice = response.data.data
          .map((item) => {
            const billed = item.booking || {};
            return {
              ...billed,
              bill_no: item.bill_no,
              payment_mode: item.payment_mode,
              payment_status: item.payment_status,
              total_amount: item.total_amount,
              advance_amount: item.advance_amount,
              settlement_amount: item.settlement_amount,
              transactions: item.transactions,
            };
          })
          .find((invoice) => invoice.id === parseInt(id));
        if (selectedInvoice) {
          setPdfInvoice(selectedInvoice);
        } else {
          toast.error("Invoice not found");
        }
      } else {
        toast.error("Failed to fetch invoice");
      }
    } catch (error) {
      toast.error("Error fetching invoice");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoicePdf();
  }, [id]);

  const downloadPDF = () => {
    const fileName = generatePdfFilename({
      customerName: pdfInvoice?.name,
      type: "bill",
      number: pdfInvoice?.bill_no || id,
    });
    exportToPDF("pdf-content", fileName, toast);
  };

  const shareOnWhatsApp = () => {
    const fileName = generatePdfFilename({
      customerName: pdfInvoice?.name,
      type: "bill",
      number: pdfInvoice?.bill_no || id,
    });
    const mobileNo = pdfInvoice?.mobile_no;
    shareToWhatsApp("pdf-content", fileName, mobileNo, toast);
  };

  return (
    <div>
      <PdfBillComponent
        pdfInvoice={pdfInvoice}
        loading={loading}
        downloadPDF={downloadPDF}
        shareOnWhatsApp={shareOnWhatsApp}
        businessProfile={businessProfile}
      />
    </div>
  );
}

export default PdfBillController;
