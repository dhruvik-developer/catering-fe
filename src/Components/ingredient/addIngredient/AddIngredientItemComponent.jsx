/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FiArrowLeft, FiGrid } from "react-icons/fi";
import Dropdown from "../../common/formDropDown/DropDown";
import PageHero from "../../common/PageHero";

function AddIngredientItemComponent({
  itemName,
  category,
  setItemName,
  setCategory,
  categories,
  navigate,
  handleSubmit,
}) {
  return (
    <>
      <PageHero
        icon={<FiGrid size={24} />}
        eyebrow="Pantry"
        title="Add Ingredient Item"
        subtitle="Add a new ingredient to your pantry under a category."
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
            Back
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
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Item Name"
            placeholder="Please Enter Item Name"
            name="name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              Category
            </Typography>
            <Dropdown
              options={categories} selectedValue={category}
              onChange={(value) => setCategory(value)}
              placeholder="Select a category"
              isSearchable
            />
          </Box>
          <Stack direction="row" sx={{ justifyContent: "center" }}>
            <Button type="submit" variant="contained" color="primary">
              Add Item
            </Button>
          </Stack>
        </Stack>
      </Box>
      </Paper>
    </>
  );
}

export default AddIngredientItemComponent;
