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
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        bgcolor: "background.paper",
        mt: 5,
      }}
    >
      <Button
        variant="outlined"
        startIcon={<FiArrowLeft size={16} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        {t("common.back")}
      </Button>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "var(--color-primary-border)",
            color: "primary.main",
            width: 44,
            height: 44,
          }}
        >
          <FiFolder size={20} />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t("category.createTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("category.createSubtitle")}
          </Typography>
        </Box>
      </Stack>

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
  );
}

export default AddCategoryComponent;
