import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { exportToPDF, shareToWhatsApp } from "../../../../../utils/pdfExport";
import toast from "react-hot-toast";
import PdfShareFullIngredientComponent from "./PdfShareFullIngredientComponent";
import { getAllBusinessProfiles } from "../../../../../api/BusinessProfile";
import { generatePdfFilename } from "../../../../../utils/generatePdfFilename";

function PdfShareFullIngredientController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fullPayload } = location.state || {};

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

  const eventAddress = fullPayload.eventAddress;
  const eventDate = fullPayload.eventDate;
  const eventTime = fullPayload.eventTime;
  const estimatedPersons = fullPayload.estimatedPersons;
  const ingredients = fullPayload.ingridient_list_data || [];

  //Formate Data From Ingredients
  const transformedIngredients = ingredients.map((category) => ({
    category: category.name || "Other", // Category Name
    items: category.data.map((item) => ({
      name: item.item, // Item Name
      quantity: `${item.total_quantity} ${item.quantity_type || ""}`.trim(), // Total Quantity
      party_name:
        item.use_item.length > 0 ? item.use_item[0].party_name || "" : "", // First available vendor
      date:
        item.use_item.length > 0
          ? item.use_item[0].delivery_date || "N/A"
          : "N/A", // Delivery Date
      time:
        item.use_item.length > 0
          ? item.use_item[0].delivery_time || "N/A"
          : "N/A", // Delivery Time
    })),
  }));

  const downloadPDF = () => {
    const fileName = generatePdfFilename({
      customerName: fullPayload?.customerName,
      sessionName: eventTime,
      type: "full-ingredient",
      date: eventDate,
    });
    exportToPDF("pdf-content", fileName, toast);
  };

  const shareOnWhatsApp = () =>
    shareToWhatsApp(
      "pdf-content",
      "Full-Ingredient-List.pdf",
      fullPayload?.mobileNo || "",
      toast
    );

  return (
    <PdfShareFullIngredientComponent
      ingredients={transformedIngredients}
      eventAddress={eventAddress}
      eventDate={eventDate}
      eventTime={eventTime}
      estimatedPersons={estimatedPersons}
      navigate={navigate}
      downloadPDF={downloadPDF}
      shareOnWhatsApp={shareOnWhatsApp}
      businessProfile={businessProfile}
    />
  );
}

export default PdfShareFullIngredientController;
