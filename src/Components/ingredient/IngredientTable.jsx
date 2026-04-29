/* eslint-disable react/prop-types */
import { useState } from "react";
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
import { FiGrid, FiTag, FiSearch } from "react-icons/fi";
import EmptyState from "../common/EmptyState";

const IngredientTable = ({
  categories = [],
  activeCategoryId,
  setActiveCategoryId,
  onSubCategoryDelete,
  onIngredientDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<FiGrid size={24} />}
        title="No Ingredients Available"
        message="Add an ingredient category to get started."
      />
    );
  }

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) || categories[0];
  const subcategories = activeCategory?.items || [];
  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      spacing={3}
      sx={{ alignItems: "flex-start" }}
    >
      {/* Left: Master Category List */}
      <Box sx={{ width: { xs: "100%", lg: "33.333%" } }}>
        <Typography
          variant="overline"
          color="text.secondary"

          sx={{ fontWeight: 700, display: "block", mb: 1, ml: 0.5, letterSpacing: 1 }}
        >
          Ingredient Categories
        </Typography>
        <Stack
          spacing={1.5}
          sx={{
            maxHeight: "calc(100vh - 260px)",
            overflowY: "auto",
            pr: 0.5,
          }}
        >
          {categories.map((category, index) => {
            const isActive = category.id === activeCategory?.id;
            const qty = category.items ? category.items.length : 0;
            return (
              <Paper
                key={category.id}
                variant="outlined"
                onClick={() => setActiveCategoryId(category.id)}
                sx={{
                  p: 1.75,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  ...(isActive
                    ? {
                        background: (t) =>
                          `linear-gradient(to right, ${t.palette.primary.light}26, transparent)`,
                        borderColor: "primary.main",
                        boxShadow: 2,
                      }
                    : {
                        "&:hover": {
                          borderColor: "primary.light",
                          boxShadow: 1,
                        },
                      }),
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
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
                        fontSize: "0.85rem",
                        bgcolor: isActive ? "primary.main" : "var(--color-primary-border)",
                        color: isActive
                          ? "primary.contrastText"
                          : "text.secondary",
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"

                        color={isActive ? "primary.main" : "text.primary"} noWrap
                        title={category.name}
                       sx={{ fontWeight: 700 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {qty} item{qty !== 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onIngredientDelete(category.id);
                    }}
                    title="Delete Category"
                    sx={{
                      color: "text.disabled",
                      "&:hover": { color: "error.main", bgcolor: "error.light" },
                    }}
                  >
                    <FaTrash size={13} />
                  </IconButton>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>

      {/* Right: Items Panel */}
      <Paper
        variant="outlined"
        sx={{
          width: { xs: "100%", lg: "66.666%" },
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          height: "calc(100vh - 240px)",
          minHeight: 500,
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
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" }
          }}
        >
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <FiGrid color="currentColor" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {activeCategory?.name}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subcategories.length} total ingredients in this category
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="Search ingredients..."
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
          {filteredSubcategories.length > 0 ? (
            <Grid container spacing={2}>
              {filteredSubcategories.map((sub) => (
                <Grid key={sub.id} size={{ xs: 12, sm: 6, xl: 4 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.75,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.light",
                        boxShadow: 1,
                        "& .delete-btn": { opacity: 1 },
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "center", minWidth: 0, pr: 1 }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "var(--color-primary-border)",
                          color: "primary.main",
                        }}
                      >
                        <FiTag size={14} />
                      </Avatar>
                      <Typography
                        variant="body2" noWrap
                       sx={{ fontWeight: 700 }}>
                        {sub.name}
                      </Typography>
                    </Stack>
                    <IconButton
                      size="small"
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubCategoryDelete(sub.id);
                      }}
                      title="Delete Ingredient"
                      sx={{
                        color: "text.disabled",
                        opacity: 0,
                        transition: "all 0.2s",
                        "&:hover": {
                          color: "error.main",
                          bgcolor: "error.light",
                        },
                      }}
                    >
                      <FaTrash size={13} />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack sx={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
              <Typography variant="body1" color="text.secondary">
                {searchQuery
                  ? "No ingredients match your search."
                  : "No ingredients found in this category."}
              </Typography>
            </Stack>
          )}
        </Box>
      </Paper>
    </Stack>
  );
};

export default IngredientTable;
