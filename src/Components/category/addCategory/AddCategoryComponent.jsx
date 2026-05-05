/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { FiArrowLeft, FiFolder } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import MultiLangInput from "../../common/MultiLangInput";
import PageHero from "../../common/PageHero";

function AddCategoryComponent({
  categoryName,
  setCategoryName,
  navigate,
  handleSubmit,
  submitting = false,
  disableSubmit = false,
}) {
  const { t } = useTranslation();

  return (
    <>
      <PageHero
        icon={<FiFolder size={24} />}
        eyebrow="Menu library"
        title={t("category.createTitle")}
        subtitle={t("category.createSubtitle")}
        actions={
          <Button
            variant="outlined"
            startIcon={<FiArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "rgba(255,255,255,0.18)",
              color: "var(--color-primary-contrast,white)",
              border: "1px solid rgba(255,255,255,0.35)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
            }}
          >
            {t("common.back")}
          </Button>
        }
      />
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <MultiLangInput
            label={t("category.nameLabel")}
            value={categoryName}
            onChange={setCategoryName}
            placeholder={t("category.namePlaceholder")}
            required
          />
          <Stack direction="row" sx={{ justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={disableSubmit || submitting}
              sx={{ px: 4 }}
            >
              {submitting ? t("common.saving") : t("category.saveButton")}
            </Button>
          </Stack>
        </Stack>
      </Box>
      </Paper>
    </>
  );
}

export default AddCategoryComponent;
