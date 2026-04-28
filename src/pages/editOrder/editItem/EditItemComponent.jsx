/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FiList,
  FiPlus,
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";
import Loader from "../../../Components/common/Loader";
import EmptyState from "../../../Components/common/EmptyState";

function EditItemComponent({
  categories,
  selectedItemsState,
  loading,
  navigate,
  generatePDF,
  handleItemSelect,
}) {
  const [collapsedIds, setCollapsedIds] = useState([]);

  const toggleCollapse = (id) => {
    setCollapsedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const totalSelected = Object.values(selectedItemsState).reduce(
    (sum, cat) => sum + (cat?.items?.length || 0),
    0
  );

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}


        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "var(--color-primary-border)",
              color: "primary.main",
              width: 44,
              height: 44,
            }}
          >
            <FiList size={20} />
          </Avatar>
          <Box>
            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
              Items
            </Typography>
            <Typography
              variant="body2"
              color={totalSelected > 0 ? "primary.main" : "text.secondary"}

             sx={{ fontWeight: totalSelected > 0 ? 600 : 400 }}>
              {totalSelected > 0
                ? `${totalSelected} item${totalSelected !== 1 ? "s" : ""} selected`
                : "Select items for your order"}
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus size={15} />}
          onClick={() => navigate("/create-item")}
        >
          Add Item
        </Button>
      </Stack>

      {loading ? (
        <Loader message="Loading Items..." />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<FiList size={24} />}
          title="No Items Available"
          message="Please add an item to get started."
        />
      ) : (
        <>
          <Stack spacing={2}>
            {[...categories]
              .sort((a, b) => a.positions - b.positions)
              .map((category) => {
                const isCollapsed = collapsedIds.includes(category.id);
                const selectedCount =
                  selectedItemsState[category.id]?.items?.length || 0;

                return (
                  <Paper
                    key={category.positions}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: 2 },
                    }}
                  >
                    {/* Category Header */}
                    <Stack
                      direction="row"


                      spacing={1}
                      onClick={() => toggleCollapse(category.id)}
                      sx={{ alignItems: "center", justifyContent: "space-between",
                        px: 2.5,
                        py: 1.75,
                        cursor: "pointer",
                        userSelect: "none",
                        background: (t) =>
                          `linear-gradient(to right, ${t.palette.primary.light}22, transparent)`,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5} useFlexGap
                       sx={{ alignItems: "center", flexWrap: "wrap" }}>
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {category.positions || "—"}
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {category.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${category.items?.length || 0} items`}
                          variant="outlined"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        />
                        {selectedCount > 0 && (
                          <Chip
                            size="small"
                            icon={<FiCheck size={10} />}
                            label={`${selectedCount} selected`}
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Stack>
                      <Box
                        sx={{
                          color: "text.disabled",
                          transform: isCollapsed
                            ? "rotate(0deg)"
                            : "rotate(180deg)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <FiChevronDown size={18} />
                      </Box>
                    </Stack>

                    {/* Category Items */}
                    <Collapse in={!isCollapsed}>
                      <Box
                        sx={{
                          borderTop: 1,
                          borderColor: "divider",
                          px: 2.5,
                          py: 2,
                        }}
                      >
                        {category.items && category.items.length > 0 ? (
                          <Grid container spacing={1}>
                            {category.items.map((item) => {
                              const isSelected =
                                selectedItemsState[
                                  category.id
                                ]?.items?.some(
                                  (selectedItem) => selectedItem.id === item.id
                                ) || false;

                              return (
                                <Grid
                                  key={item.id}
                                  size={{ xs: 12, sm: 6, md: 4 }}
                                >
                                  <Box
                                    onClick={() =>
                                      handleItemSelect(
                                        category.id,
                                        item.id,
                                        item.name,
                                        category.name,
                                        category.positions
                                      )
                                    }
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                      px: 1.75,
                                      py: 1.25,
                                      borderRadius: 1.5,
                                      cursor: "pointer",
                                      border: 1,
                                      transition: "all 0.15s",
                                      borderColor: isSelected
                                        ? "primary.main"
                                        : "divider",
                                      bgcolor: isSelected
                                        ? (t) =>
                                            t.palette.primary.light + "1f"
                                        : "background.paper",
                                      boxShadow: isSelected ? 1 : 0,
                                      "&:hover": {
                                        bgcolor: isSelected
                                          ? (t) =>
                                              t.palette.primary.light + "33"
                                          : "action.hover",
                                      },
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 0.75,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: 2,
                                        flexShrink: 0,
                                        transition: "all 0.15s",
                                        borderColor: isSelected
                                          ? "primary.main"
                                          : "divider",
                                        bgcolor: isSelected
                                          ? "primary.main"
                                          : "transparent",
                                        color: "primary.contrastText",
                                      }}
                                    >
                                      {isSelected && <FiCheck size={12} />}
                                    </Box>
                                    <Typography
                                      variant="body2"

                                      color={
                                        isSelected
                                          ? "primary.main"
                                          : "text.secondary"
                                      }
                                     sx={{ fontWeight: isSelected ? 600 : 400 }}>
                                      {item.name}
                                    </Typography>
                                  </Box>
                                </Grid>
                              );
                            })}
                          </Grid>
                        ) : (
                          <Stack
                            direction="row"
                            spacing={1}


                            sx={{ alignItems: "center", justifyContent: "center",
                              py: 3,
                              bgcolor: (t) =>
                                t.palette.primary.light + "14",
                              borderRadius: 2,
                              color: "primary.main",
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              No items available in this category
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                    </Collapse>
                  </Paper>
                );
              })}
          </Stack>

          {/* Bottom actions */}
          <Stack
            direction="row"


            sx={{ justifyContent: "space-between", alignItems: "center",
              mt: 3,
              pt: 2.5,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<FiArrowLeft size={15} />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FiCheck size={15} />}
              onClick={generatePDF}
            >
              Submit
            </Button>
          </Stack>
        </>
      )}
    </Paper>
  );
}

export default EditItemComponent;
