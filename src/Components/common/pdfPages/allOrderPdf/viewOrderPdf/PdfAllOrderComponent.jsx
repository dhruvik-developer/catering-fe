/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Loader";
import OrderMasterReport from "../../../orderMaster/OrderMasterReport";

function PdfAllOrderComponent({
  pdfAllOrder,
  loading,
  downloadPDF,
  businessProfile,
}) {
  const navigate = useNavigate();

  const THEME = {
    primary: "var(--color-primary)",
    primaryDark: "var(--color-primary-dark)",
    primaryBorder: "var(--color-primary-border)",
    primaryText: "var(--color-primary-text)",
  };

  const btnStyle = (bg, color, border) => ({
    padding: "8px 18px",
    backgroundColor: bg,
    color: color,
    border: border ? `1px solid ${border}` : "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // ✅ CENTER FIX
        minHeight: "100vh",
        padding: "24px 16px",
        background: "linear-gradient(180deg, var(--color-primary-tint) 0%, var(--color-primary-soft) 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {loading ? (
        <Loader message="Loading..." />
      ) : (
        <>
          {/* 🔥 ACTION BAR FIX */}
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={btnStyle("#fff", THEME.primaryText, THEME.primaryBorder)}
            >
              ← Back
            </button>

            <button
              onClick={downloadPDF}
              style={btnStyle(THEME.primaryDark, "#fff")}
            >
              ↓ Download PDF
            </button>
          </div>

          <div
            id="pdf-content"
            data-pdf-padding-bottom="0px"
            style={{
              width: "100%",
              maxWidth: "900px",
              padding: "18px",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "center",
              // background: "#f6f1ff",
              // borderRadius: "18px",
            }}
          >
            <OrderMasterReport
              order={pdfAllOrder}
              businessProfile={businessProfile}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PdfAllOrderComponent;
