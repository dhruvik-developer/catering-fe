/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { FiArrowLeft, FiBookOpen } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../../common/formDropDown/DropDown";
import PageHero from "../../common/PageHero";

function AddIngredientComponent({
  items,
  ingredientItems,
  selectedItem,
  setSelectedItem,
  personCount,
  setPersonCount,
  ingredients,
  handleIngredientChange,
  handleRemoveField,
  handleSubmit,
  navigate,
}) {
  const selectedItemName = items.find((item) => item.id === selectedItem)?.name;

  return (
    <>
      <PageHero
        icon={<FiBookOpen size={24} />}
        eyebrow="Recipes"
        title="Add Recipe Ingredient"
        subtitle="Tie ingredients (and quantities) to one of your menu items."
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
            type="number"
            label="Recipe For Person Count"
            placeholder="Enter Person Count (e.g., 100)"
            value={personCount}
            onChange={(e) => setPersonCount(parseInt(e.target.value) || 0)}
            slotProps={{ htmlInput: { min: 1 } }}
            required
          />

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              Select Item
            </Typography>
            <Dropdown
              options={items}
              placeholder="Select an item" selectedValue={selectedItem}
              onChange={(value) => setSelectedItem(value)}
              isSearchable
            />
          </Box>

          {selectedItem && (
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700 }}>
              {selectedItemName} ingredients
            </Typography>
          )}

          {selectedItem && (
            <Stack spacing={1}>
              <AnimatePresence>
                {ingredients.map((ingredient, index) => {
                  const isLastEmptyRow =
                    index === ingredients.length - 1 && !ingredient.ingredient;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Box sx={{ flex: 1 }}>
                          <Dropdown
                            options={ingredientItems}
                            placeholder="Select ingredient" selectedValue={ingredient.ingredient}
                            onChange={(value) =>
                              handleIngredientChange(
                                index,
                                "ingredient",
                                value
                              )
                            }
                            isSearchable
                          />
                        </Box>
                        <TextField
                          size="small"
                          type="number"
                          sx={{ width: 100 }}
                          placeholder="Qty"
                          value={ingredient.quantity}
                          onChange={(e) =>
                            handleIngredientChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                        <TextField
                          size="small"
                          sx={{ width: 90 }}
                          placeholder="Unit"
                          value={ingredient.unit}
                          onChange={(e) =>
                            handleIngredientChange(index, "unit", e.target.value)
                          }
                        />
                        {!isLastEmptyRow ? (
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveField(index)}
                            sx={{
                              bgcolor: "error.light",
                              color: "common.white",
                              "&:hover": { bgcolor: "error.main" },
                            }}
                          >
                            <FaTimes size={14} />
                          </IconButton>
                        ) : (
                          <Box sx={{ width: 40 }} />
                        )}
                      </Stack>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Stack>
          )}

          <Stack direction="row" sx={{ justifyContent: "center" }}>
            <Button type="submit" variant="contained" color="primary">
              Save Ingredient
            </Button>
          </Stack>
        </Stack>
      </Box>
      </Paper>
    </>
  );
}

export default AddIngredientComponent;
