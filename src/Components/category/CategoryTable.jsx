/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FaTrash } from "react-icons/fa";
import { LuArrowDownUp } from "react-icons/lu";
import { FiFolder, FiTag, FiSearch, FiEdit2 } from "react-icons/fi";
import ViewItemRecipeController from "../../pages/itemRecipe/ViewItemRecipeController";
import EmptyState from "../common/EmptyState";
import TText from "../common/TText";

const CategoryTable = ({
  categories = [],
  activeCategoryId,
  setActiveCategoryId,
  onCategoryDelete,
  onItemDelete,
  onSwappingCategory,
  onEditCategory,
  onRefresh,
  canUpdateCategory = false,
  canDeleteCategory = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemForRecipe, setSelectedItemForRecipe] = useState(null);
  const [viewingSubCategoryId, setViewingSubCategoryId] = useState(null);

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.positions === undefined) return 1;
    if (b.positions === undefined) return -1;
    return a.positions - b.positions;
  });

  const activeCategory =
    sortedCategories.find((c) => c.id === activeCategoryId) ||
    sortedCategories[0];

  // If active category changes, reset viewing subcategory
  useEffect(() => {
    setViewingSubCategoryId(null);
  }, [activeCategoryId]);

  const subcategories = activeCategory?.subcategories || [];
  const itemsOfActiveCategory = activeCategory?.items || [];

  const getTotalItems = (category) => {
    let count = category?.items?.length || 0;
    if (category?.subcategories) {
      category.subcategories.forEach((sub) => {
        count += getTotalItems(sub);
      });
    }
    return count;
  };

  const currentViewingSubCategory = viewingSubCategoryId
    ? activeCategory?.subcategories?.find((s) => s.id === viewingSubCategoryId)
    : null;

  const displayData = viewingSubCategoryId
    ? currentViewingSubCategory?.items || []
    : [...subcategories, ...itemsOfActiveCategory];

  const filteredData = displayData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isViewingItems = !!viewingSubCategoryId;

  return (
    <>
      <Grid container spacing={2} sx={{ alignItems: "flex-start" }}>
        {/* Left: Category list */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              display: "block",
              mb: 1.5,
              ml: 0.5,
            }}
          >
            Categories List
          </Typography>
          <Stack
            spacing={1.5}
            sx={{
              maxHeight: { xs: 400, lg: "calc(100vh - 240px)" },
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {sortedCategories.map((category) => {
              const isActive = category.id === activeCategory?.id;
              return (
                <Paper
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  variant="outlined"
                  sx={{
                    p: 1.75,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    borderColor: isActive ? "primary.main" : "divider",
                    borderWidth: isActive ? 2 : 1,
                    background: isActive
                      ? (t) =>
                          `linear-gradient(90deg, ${
                            t.palette.primary.light + "26"
                          }, ${t.palette.background.paper})`
                      : "background.paper",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    "&:hover": {
                      borderColor: "primary.light",
                      boxShadow: 1,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center", minWidth: 0, flex: 1 }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 40,
                        height: 40,
                        fontWeight: 700,
                        fontSize: 14,
                        bgcolor: isActive ? "primary.main" : "var(--color-primary-border)",
                        color: isActive
                          ? "primary.contrastText"
                          : "text.secondary",
                      }}
                    >
                      {category.positions || "—"}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="subtitle2" noWrap
                        color={isActive ? "primary.main" : "text.primary"}
                        title={category.name}
                       sx={{ fontWeight: 700 }}>
                        <TText>{category.name}</TText>
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                       sx={{ fontWeight: 500 }}>
                        {getTotalItems(category)} item{getTotalItems(category) !== 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  </Stack>
                  {(canUpdateCategory || canDeleteCategory) && (
                    <Stack
                      direction="row"
                      spacing={0}
                      sx={{ alignItems: "center", flexShrink: 0 }}
                    >
                      {canUpdateCategory && (
                        <>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditCategory(category.id, category.name);
                            }}
                            title="Edit Name"
                          >
                            <FiEdit2 size={14} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSwappingCategory(category.id, category.name);
                            }}
                            title="Change Position"
                          >
                            <LuArrowDownUp size={14} />
                          </IconButton>
                        </>
                      )}
                      {canDeleteCategory && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCategoryDelete(category.id);
                          }}
                          title="Delete Category"
                        >
                          <FaTrash size={12} />
                        </IconButton>
                      )}
                    </Stack>
                  )}
                </Paper>
              );
            })}
          </Stack>
        </Grid>

        {/* Right: Subcategory / item detail */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              height: {
                xs: "auto",
                lg: "calc(100vh - 240px)",
              },
              minHeight: 400,
              overflow: "hidden",
              borderRadius: 3,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "action.hover",
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}
                >
                  {viewingSubCategoryId && (
                    <IconButton 
                      size="small" 
                      onClick={() => setViewingSubCategoryId(null)}
                      sx={{ mr: 1, bgcolor: 'action.selected' }}
                    >
                      <FiFolder size={16} />
                    </IconButton>
                  )}
                  <TText>{activeCategory?.name || ""}</TText>
                  {viewingSubCategoryId && (
                    <>
                      <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
                      <TText>{currentViewingSubCategory?.name || ""}</TText>
                    </>
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredData.length} {isViewingItems ? 'items' : 'subcategories'} in this {viewingSubCategoryId ? 'subcategory' : 'category'}
                </Typography>
              </Box>
              <TextField
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: { xs: "100%", sm: 260 } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiSearch size={14} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>

            <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
              {filteredData.length > 0 ? (
                <Grid container spacing={1.5}>
                  {filteredData.map((item) => {
                    const isItem = Object.prototype.hasOwnProperty.call(
                      item,
                      "category"
                    );
                    return (
                      <Grid key={item.id} size={{ xs: 12, sm: 6, xl: 4 }}>
                        <Paper
                          variant="outlined"
                          onClick={() => {
                            if (!isItem) {
                              setViewingSubCategoryId(item.id);
                            } else {
                              setSelectedItemForRecipe(item);
                            }
                          }}
                          sx={{
                            p: 1.75,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: "primary.light",
                              boxShadow: 1,
                            },
                            "&:hover .delete-btn": { opacity: 1 },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{ alignItems: "center", minWidth: 0, flex: 1 }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor:
                                  isItem && item.has_recipe === false
                                    ? "error.light"
                                    : "var(--color-primary-border)",
                                color:
                                  isItem && item.has_recipe === false
                                    ? "error.main"
                                    : "primary.main",
                              }}
                            >
                              {isItem ? <FiTag size={14} /> : <FiFolder size={14} />}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="body2" noWrap
                                color={
                                  isItem && item.has_recipe === false
                                    ? "error.main"
                                    : "text.primary"
                                }
                               sx={{ fontWeight: 700 }}>
                                <TText>{item.name}</TText>
                              </Typography>
                              {!isItem && (
                                <Typography variant="caption" color="text.secondary">
                                  {getTotalItems(item)} items
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={0.5} className="delete-btn" sx={{ opacity: { xs: 1, sm: 0 }, transition: "opacity 0.2s" }}>
                            {!isItem && canUpdateCategory && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditCategory(item.id, item.name);
                                }}
                                title="Edit Subcategory"
                              >
                                <FiEdit2 size={12} />
                              </IconButton>
                            )}
                            {canDeleteCategory && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isItem) {
                                    onItemDelete(item.id);
                                  } else {
                                    onCategoryDelete(item.id);
                                  }
                                }}
                                title={isItem ? "Delete Item" : "Delete Subcategory"}
                              >
                                <FaTrash size={12} />
                              </IconButton>
                            )}
                          </Stack>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <EmptyState
                  icon={<FiFolder size={24} />}
                  title={
                    searchQuery
                      ? "No items match your search"
                      : "No items in this category"
                  }
                  message={
                    searchQuery
                      ? "Try adjusting your search query."
                      : "Add items to this category to see them here."
                  }
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {selectedItemForRecipe && (
        <ViewItemRecipeController
          itemId={selectedItemForRecipe.id}
          itemName={selectedItemForRecipe.name}
          baseCost={selectedItemForRecipe.base_cost} selectionRate={selectedItemForRecipe.selection_rate}
          disableItemDetailsFetch={true}
          onClose={() => {
            setSelectedItemForRecipe(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </>
  );
};

export default CategoryTable;
