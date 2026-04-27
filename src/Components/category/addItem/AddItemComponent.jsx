/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FiArrowLeft, FiTag, FiDollarSign } from "react-icons/fi";
import Dropdown from "../../common/formDropDown/DropDown";

function AddItemComponent({
  itemName,
  category,
  setItemName,
  setCategory,
  baseCost,
  setBaseCost,
  selectionRate,
  setSelectionRate,
  categories,
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

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "var(--color-primary-border)",
            color: "primary.main",
            width: 44,
            height: 44,
          }}
        >
          <FiTag size={20} />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Create Item
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add a new item with pricing details
          </Typography>
        </Box>
      </Stack>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Item Name *"
            placeholder="Please Enter Item Name"
            name="name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />

          <Box>
            <Typography
              variant="body2"
              fontWeight={500}
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Category *
            </Typography>
            <Dropdown
              options={categories}
              selectedValue={category}
              onChange={(value) => setCategory(value)}
              placeholder="Select a category"
              isSearchable
            />
          </Box>

          <Divider />

          <Stack direction="row" spacing={1} alignItems="center">
            <FiDollarSign color="currentColor" size={18} />
            <Typography variant="subtitle1" fontWeight={600}>
              Pricing
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Base Cost (₹)"
                placeholder="e.g. 100"
                value={baseCost}
                onChange={(e) =>
                  setBaseCost(e.target.value.replace(/[^0-9.]/g, ""))
                }
                helperText="The raw cost of this item"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Selection Rate (₹)"
                placeholder="e.g. 150"
                value={selectionRate}
                onChange={(e) =>
                  setSelectionRate(e.target.value.replace(/[^0-9.]/g, ""))
                }
                helperText="The rate when item is selected for an event"
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4 }}
            >
              Save Item
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

export default AddItemComponent;
