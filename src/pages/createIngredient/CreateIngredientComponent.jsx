/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { FiGrid, FiPlus } from "react-icons/fi";
import IngredientTable from "../../Components/ingredient/IngredientTable";
import Loader from "../../Components/common/Loader";
import { AddIngredientItemModal } from "../../Components/ingredient/IngredientModals";

function CreateIngredientComponent({
  categories,
  items,
  onAddCategory,
  onSubCategoryDelete,
  onIngredientDelete,
  loading,
  navigate,
  onRefresh,
}) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const totalItems =
    categories?.reduce((sum, c) => sum + (c.items?.length || 0), 0) || 0;

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "var(--color-primary-border)",
              color: "primary.main",
              width: 44,
              height: 44,
            }}
          >
            <FiGrid size={20} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Create Ingredient Item
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {categories?.length || 0} categories • {totalItems} items
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiPlus size={15} />}
            onClick={onAddCategory}
          >
            Add Category
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FiPlus size={15} />}
            onClick={() => setShowAddItem(true)}
          >
            Add Item
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Loader message="Loading ingredient categories & subcategories..." />
      ) : (
        <IngredientTable
          categories={categories || []}
          items={items || []}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
          onSubCategoryDelete={onSubCategoryDelete}
          onIngredientDelete={onIngredientDelete}
        />
      )}

      <AddIngredientItemModal
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        onSuccess={onRefresh}
        initialCategory={
          activeCategoryId || (categories?.length > 0 ? categories[0].id : null)
        }
      />
    </Paper>
  );
}

export default CreateIngredientComponent;
