/* eslint-disable react/prop-types */
import { Box, Button, Stack, Typography } from "@mui/material";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/common/Loader";
import SessionChecklistLayout from "../../Components/common/sessionChecklist/SessionChecklistLayout";

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
      <Box sx={{ p: 4 }}>
        <Loader message="Loading Session Checklist..." />
      </Box>
    );
  }

  if (!orderData || !sessionData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Session checklist data not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        p: { xs: 2, sm: 3 },
        background: (t) =>
          `linear-gradient(180deg, ${t.palette.primary.light}1a 0%, ${t.palette.primary.light}33 100%)`,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        className="no-print-button"
        sx={{ justifyContent: "space-between", width: "100%", maxWidth: 860, mb: 2.5 }}
      >
        <Button
          variant="outlined"
          startIcon={<FiArrowLeft size={14} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          startIcon={<FiDownload size={14} />}
          sx={{ opacity: 0.8, cursor: "default" }}
          title="Download Disabled"
        >
          Download PDF
        </Button>
      </Stack>

      <SessionChecklistLayout
        orderData={orderData}
        sessionData={sessionData}
        sessionIndex={sessionIndex}
        containerId="pdf-content"
      />
    </Box>
  );
}

export default SessionChecklistPreviewComponent;
