/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PdfInvoiceComponent from "./PdfInvoiceComponent";
import { getInvoice } from "../../../../../api/FetchInvoice";
import { getSingleOrder } from "../../../../../api/FetchAllOrder";
import { useParams } from "react-router-dom";
import { exportToPDF, shareToWhatsApp } from "../../../../../utils/pdfExport";
import { getAllBusinessProfiles } from "../../../../../api/BusinessProfile";
import { generatePdfFilename } from "../../../../../utils/generatePdfFilename";
import { usePdfCategorizer } from "../../../../../hooks/usePdfCategorizer";

function PdfInvoiceController() {
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
            };
          })
          .find((invoice) => invoice.id === parseInt(id));
        if (selectedInvoice) {
          // Fetch complete order details to get `sessions` and `selected_items`
          try {
            const orderResponse = await getSingleOrder(selectedInvoice.id);
            if (orderResponse.data?.status && orderResponse.data?.data) {
              const fullOrderData = orderResponse.data.data;
              setPdfInvoice({
                ...selectedInvoice,
                sessions: fullOrderData.sessions,
                description: fullOrderData.description,
                rule: fullOrderData.rule,
                reference: fullOrderData.reference,
                mobile_no: fullOrderData.mobile_no || selectedInvoice.mobile_no,
                name: fullOrderData.name || selectedInvoice.name,
              });
            } else {
              setPdfInvoice(selectedInvoice);
            }
          } catch (error) {
            console.error(
              "Failed to fetch full order details for invoice PDF:",
              error
            );
            setPdfInvoice(selectedInvoice);
          }
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

  const downloadPDF = () => {
    const fileName = generatePdfFilename({
      customerName: pdfInvoice?.name,
      type: "invoice",
      number: pdfInvoice?.bill_no || id,
    });
    exportToPDF("pdf-content", fileName, toast);
  };

  const shareOnWhatsApp = () => {
    const fileName = generatePdfFilename({
      customerName: pdfInvoice?.name,
      type: "invoice",
      number: pdfInvoice?.bill_no || id,
    });
    const mobileNo = pdfInvoice?.mobile_no;
    shareToWhatsApp("pdf-content", fileName, mobileNo, toast);
  };

  const { categorizedData, isCategorizing } = usePdfCategorizer(
    pdfInvoice,
    !loading
  );

  return (
    <div>
      <PdfInvoiceComponent
        pdfInvoice={categorizedData}
        loading={loading || isCategorizing}
        generateUniqueKey={generateUniqueKey}
        downloadPDF={downloadPDF}
        shareOnWhatsApp={shareOnWhatsApp}
        businessProfile={businessProfile}
      />
    </div>
  );
}

export default PdfInvoiceController;
