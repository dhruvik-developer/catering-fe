/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiBookOpen,
  FiPlus,
  FiUsers,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";
import EmptyState from "../../Components/common/EmptyState";

function RecipeIngredientComponent({ loading, navigate, recipe }) {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  const getIngredientEntries = (ingredients) => {
    if (!ingredients) return [];
    if (typeof ingredients === "object" && !Array.isArray(ingredients)) {
      return Object.entries(ingredients);
    }
    if (Array.isArray(ingredients)) {
      return ingredients.map((name) => [name, null]);
    }
    return [];
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
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
            <FiBookOpen size={20} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Recipe Ingredient
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {recipe?.length || 0} recipe{recipe?.length !== 1 ? "s" : ""}{" "}
              available
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus size={15} />}
          onClick={() => navigate("/create-ingredient")}
        >
          Add Ingredient
        </Button>
      </Stack>

      {loading ? (
        <Loader message="Loading Recipes..." />
      ) : recipe.length === 0 ? (
        <EmptyState
          icon={<FiBookOpen size={24} />}
          title="No Recipe Ingredient Available"
          message="Create your first recipe ingredient to get started"
        />
      ) : (
        <Stack spacing={1.5}>
          {recipe.map((rec) => {
            const ingredientEntries = getIngredientEntries(rec.ingredients);
            const isOpen = expanded === rec.id;
            return (
              <Paper
                key={rec.id}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 2 },
                }}
              >
                <Stack
                  direction="row"


                  onClick={() => toggleExpand(rec.id)}
                  sx={{ justifyContent: "space-between", alignItems: "center",
                    px: 2.5,
                    py: 1.75,
                    bgcolor: (t) => t.palette.primary.light + "14",
                    cursor: "pointer",
                    "&:hover": { bgcolor: (t) => t.palette.primary.light + "26" },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                      }}
                    >
                      {rec.item?.name?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {rec.item.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    {rec.person_count && (
                      <Chip
                        size="small"
                        icon={<FiUsers size={12} />}
                        label={rec.person_count}
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                    <Chip
                      size="small"
                      label={`${ingredientEntries.length} items`}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-ingredient/${rec.id}`, { state: rec });
                      }}
                      title="Edit Ingredient"
                    >
                      <FiEdit2 size={15} />
                    </IconButton>
                    {isOpen ? (
                      <FiChevronUp size={18} />
                    ) : (
                      <FiChevronDown size={18} color="currentColor" />
                    )}
                  </Stack>
                </Stack>
                <Collapse in={isOpen}>
                  <Box
                    sx={{
                      px: 2.5,
                      py: 2,
                      bgcolor: (t) => t.palette.primary.light + "0d",
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                  >
                    {ingredientEntries.length > 0 ? (
                      <Grid container spacing={1}>
                        {ingredientEntries.map(([name, qty], index) => (
                          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper
                              variant="outlined"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 1.5,
                                py: 1,
                                borderRadius: 1.5,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  bgcolor: "var(--color-primary-border)",
                                  color: "primary.main",
                                }}
                              >
                                {index + 1}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
                                {name}
                              </Typography>
                              {qty && (
                                <Chip
                                  size="small"
                                  label={qty}
                                  sx={{
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    height: 20,
                                  }}
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"

                        sx={{ textAlign: "center", py: 3 }}
                      >
                        No Ingredients Available
                      </Typography>
                    )}
                  </Box>
                </Collapse>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}

export default RecipeIngredientComponent;
