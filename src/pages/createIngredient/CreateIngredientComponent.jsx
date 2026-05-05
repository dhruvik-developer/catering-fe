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
import PageHero from "../../Components/common/PageHero";
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

  const heroActionSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
  };

  return (
    <>
      <PageHero
        icon={<FiGrid size={24} />}
        eyebrow="Pantry"
        title="Create Ingredient Item"
        subtitle={`${categories?.length || 0} categories • ${totalItems} items`}
        actions={
          <>
            <Button
              variant="contained"
              startIcon={<FiPlus size={15} />}
              onClick={onAddCategory}
              sx={heroActionSx}
            >
              Add Ingredient Category
            </Button>
            <Button
              variant="outlined"
              startIcon={<FiPlus size={15} />}
              onClick={() => setShowAddItem(true)}
              sx={heroActionSx}
            >
              Add Ingredient Item
            </Button>
          </>
        }
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >

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
    </>
  );
}

export default CreateIngredientComponent;
