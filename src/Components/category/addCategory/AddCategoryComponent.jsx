/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FiArrowLeft, FiFolder } from "react-icons/fi";

function AddCategoryComponent({
  categoryName,
  setCategoryName,
  navigate,
  handleSubmit,
}) {
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
        Back
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
            Create Category
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add a new category to organize your items
          </Typography>
        </Box>
      </Stack>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Category Name *"
            placeholder="Please Enter Category Name"
            name="name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Stack direction="row" sx={{ justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4 }}
            >
              Save Category
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

export default AddCategoryComponent;
