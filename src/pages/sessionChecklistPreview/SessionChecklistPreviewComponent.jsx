/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/common/Loader";
import SessionChecklistLayout from "../../Components/common/sessionChecklist/SessionChecklistLayout";

const btnStyle = (bg, color, border) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 18px",
  backgroundColor: bg,
  color,
  border: border ? `1px solid ${border}` : "none",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "13px",
  cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
});

function SessionChecklistPreviewComponent({
  loading,
  orderData,
  sessionData,
  sessionIndex,
  onDownloadPDF,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-8">
        <Loader message="Loading Session Checklist..." />
      </div>
    );
  }

  if (!orderData || !sessionData) {
    return (
      <div className="p-8 text-center text-gray-500">
        Session checklist data not found.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "24px 16px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(180deg, #faf7ff 0%, #f3ecff 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "860px",
        }}
        className="no-print-button"
      >
        <button onClick={() => navigate(-1)} style={btnStyle("#ffffff", "#5B34A8", "#E7D9FF")}>
          Back
        </button>
        <button onClick={onDownloadPDF} style={btnStyle("#6F47B8", "#fff", "transparent")}>
          Download PDF
        </button>
      </div>

      <SessionChecklistLayout
        orderData={orderData}
        sessionData={sessionData}
        sessionIndex={sessionIndex}
        containerId="pdf-content"
      />
    </div>
  );
}

export default SessionChecklistPreviewComponent;
