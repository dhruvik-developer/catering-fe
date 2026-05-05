import { useCallback, useState, useEffect } from "react";
import { logError } from "../../../utils/logger";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FiFolder,
  FiTag,
  FiSearch,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { TaskAdd01Icon } from "@hugeicons/core-free-icons";
import Loader from "../../../Components/common/Loader";
import EmptyState from "../../../Components/common/EmptyState";
import PageHero from "../../../Components/common/PageHero";
import {
  getGroundCategories,
  deleteGroundCategory,
  deleteGroundItem,
} from "../../../api/GroundApis";
import AddGroundCategory from "../categories/AddGroundCategory";
import AddGroundItem from "../items/AddGroundItem";
import usePermissions from "../../../hooks/usePermissions";

const EventGroundChecklist = () => {
  const { hasPermission } = usePermissions();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [editItemData, setEditItemData] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getGroundCategories();
      if (res?.data?.status) {
        const data = res.data.data || [];
        setCategories(data);
        setActiveCategoryId((currentActiveCategoryId) =>
          data.length > 0 && !currentActiveCategoryId
            ? data[0].id
            : currentActiveCategoryId
        );
      }
    } catch (error) {
      logError(error);
      toast.error("Failed to load ground categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) || categories[0] || null;
  const groundItems = activeCategory?.ground_items || [];
  const filteredItems = groundItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalItems = categories.reduce(
    (sum, c) => sum + (c.ground_items?.length || 0),
    0
  );
  const canCreateGround = hasPermission("ground.create");
  const canUpdateGround = hasPermission("ground.update");
  const canDeleteGround = hasPermission("ground.delete");

  const handleEditCategory = (category) => {
    if (!canUpdateGround) {
      toast.error("You do not have permission to update ground categories.");
      return;
    }
    setEditCategoryData(category);
    setShowAddCategory(true);
  };

  const handleDeleteCategory = (category) => {
    if (!canDeleteGround) {
      toast.error("You do not have permission to delete ground categories.");
      return;
    }
    import("sweetalert2").then(({ default: Swal }) => {
      Swal.fire({
        title: "Delete Category?",
        text: `Are you sure you want to delete "${category.name}"? This will also remove all items in this category.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "var(--color-primary)",
        confirmButtonText: "Yes, delete it",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteGroundCategory(category.id);
            toast.success("Category deleted successfully");
            if (activeCategoryId === category.id) {
              setActiveCategoryId(null);
            }
            fetchCategories();
          } catch (error) {
            logError(error);
          }
        }
      });
    });
  };

  const handleEditItem = (item) => {
    if (!canUpdateGround) {
      toast.error("You do not have permission to update ground items.");
      return;
    }
    setEditItemData({
      ...item,
      category: activeCategory?.id || item.category,
    });
    setShowAddItem(true);
  };

  const handleDeleteItem = (item) => {
    if (!canDeleteGround) {
      toast.error("You do not have permission to delete ground items.");
      return;
    }
    import("sweetalert2").then(({ default: Swal }) => {
      Swal.fire({
        title: "Delete Item?",
        text: `Are you sure you want to delete "${item.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "var(--color-primary)",
        confirmButtonText: "Yes, delete it",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteGroundItem(item.id);
            toast.success("Item deleted successfully");
            fetchCategories();
          } catch (error) {
            logError(error);
          }
        }
      });
    });
  };

  return (
    <>
      <PageHero
        icon={<HugeiconsIcon icon={TaskAdd01Icon} size={24} />}
        eyebrow="Ground prep"
        title="Ground Checklist"
        subtitle={`${categories.length} categories • ${totalItems} items`}
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ alignItems: { xs: "stretch", md: "center" }, justifyContent: "flex-end", mb: 3 }}
        >
        {canCreateGround && (
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setEditCategoryData(null);
                setShowAddCategory(true);
              }}
            >
              + Add Category
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setEditItemData(null);
                setShowAddItem(true);
              }}
            >
              + Add Item
            </Button>
          </Stack>
        )}
      </Stack>

      {loading ? (
        <Loader message="Loading ground categories..." />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<FiFolder size={24} />}
          title="No Categories Available"
          message="Add a ground category to get started."
        />
      ) : (
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
              {categories.map((category, index) => {
                const isActive = category.id === activeCategory?.id;
                const qty = category.ground_items
                  ? category.ground_items.length
                  : 0;
                return (
                  <Paper
                    key={category.id}
                    variant="outlined"
                    sx={{
                      p: 1.75,
                      cursor: "pointer",
                      borderColor: isActive ? "primary.main" : "divider",
                      borderWidth: isActive ? 2 : 1,
                      background: isActive
                        ? (t) =>
                            `linear-gradient(90deg, ${t.palette.primary.light + "26"}, ${t.palette.background.paper})`
                        : "background.paper",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      "&:hover .actions": { opacity: 1 },
                      "&:hover": {
                        borderColor: "primary.light",
                        boxShadow: 1,
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}



                      onClick={() => {
                        setActiveCategoryId(category.id);
                        setSearchQuery("");
                      }}
                     sx={{ alignItems: "center", minWidth: 0, flex: 1 }}>
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
                        {index + 1}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle2" noWrap
                          color={isActive ? "primary.main" : "text.primary"}
                         sx={{ fontWeight: 700 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {qty} item{qty !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                    </Stack>
                    {(canUpdateGround || canDeleteGround) && (
                      <Stack
                        className="actions"
                        direction="row"
                        spacing={0}
                        sx={{ flexShrink: 0,
                          opacity: { xs: 1, sm: 0 },
                          transition: "opacity 0.2s",
                        }}
                      >
                        {canUpdateGround && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(category);
                            }}
                            title="Edit Category"
                          >
                            <FiEdit2 size={14} />
                          </IconButton>
                        )}
                        {canDeleteGround && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category);
                            }}
                            title="Delete Category"
                          >
                            <FiTrash2 size={14} />
                          </IconButton>
                        )}
                      </Stack>
                    )}
                  </Paper>
                );
              })}
            </Stack>
          </Grid>

          {/* Right: Items */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                height: { xs: "auto", lg: "calc(100vh - 240px)" },
                minHeight: 400,
                overflow: "hidden",
                borderRadius: 3,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}


                sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between",
                  px: 3,
                  py: 2.5,
                  borderBottom: 1,
                  borderColor: "divider",
                  bgcolor: "action.hover",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"

                    sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <FiFolder />
                    {activeCategory?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {groundItems.length} total items in this category
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
                {filteredItems.length > 0 ? (
                  <Grid container spacing={1.5}>
                    {filteredItems.map((item) => (
                      <Grid key={item.id} size={{ xs: 12, sm: 6, xl: 4 }}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1.75,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            "&:hover .item-actions": { opacity: 1 },
                            "&:hover": {
                              borderColor: "primary.light",
                              boxShadow: 1,
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}



                           sx={{ alignItems: "center", minWidth: 0, flex: 1 }}>
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
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="body2" noWrap
                               sx={{ fontWeight: 700 }}>
                                {item.name}
                              </Typography>
                              {item.unit && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Unit: {item.unit}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                          {(canUpdateGround || canDeleteGround) && (
                            <Stack
                              className="item-actions"
                              direction="row"
                              spacing={0}
                              sx={{ flexShrink: 0,
                                opacity: { xs: 1, sm: 0 },
                                transition: "opacity 0.2s",
                              }}
                            >
                              {canUpdateGround && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditItem(item)}
                                  title="Edit Item"
                                >
                                  <FiEdit2 size={14} />
                                </IconButton>
                              )}
                              {canDeleteGround && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteItem(item)}
                                  title="Delete Item"
                                >
                                  <FiTrash2 size={14} />
                                </IconButton>
                              )}
                            </Stack>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <EmptyState
                    icon={<FiTag size={24} />}
                    title={
                      searchQuery
                        ? "No items match your search"
                        : "No items in this category"
                    }
                    message={
                      searchQuery
                        ? "Try adjusting your search."
                        : "Add items to this category to see them here."
                    }
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <AddGroundCategory
        isOpen={showAddCategory}
        onClose={() => {
          setShowAddCategory(false);
          setEditCategoryData(null);
        }}
        onSuccess={() => {
          setShowAddCategory(false);
          setEditCategoryData(null);
          fetchCategories();
        }}
        editData={editCategoryData}
      />
      <AddGroundItem
        isOpen={showAddItem}
        onClose={() => {
          setShowAddItem(false);
          setEditItemData(null);
        }}
        onSuccess={() => {
          setShowAddItem(false);
          setEditItemData(null);
          fetchCategories();
        }}
        categories={categories.filter((c) => c.is_active)}
        editData={editItemData}
      />
      </Paper>
    </>
  );
};

export default EventGroundChecklist;
