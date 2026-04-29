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
import { FaTrash, FaTimes } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function EditIngredientComponent({
  navigate,
  recipe,
  ingredientsList,
  personCount,
  setPersonCount,
  handleSubmit,
  handleDeleteItem,
  handleIngredientChange,
  handleDeleteIngredient,
}) {
  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      <Button
        variant="outlined"
        startIcon={<FiArrowLeft size={16} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Edit Recipe Ingredient
      </Typography>

      <Stack spacing={2.5}>
        <TextField
          fullWidth
          type="number"
          label="Recipe For Person Count"
          value={personCount}
          onChange={(e) => setPersonCount(parseInt(e.target.value) || 0)}
          slotProps={{ htmlInput: { min: 1 } }}
          placeholder="Enter Person Count (e.g., 100)"
        />

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <TextField
            fullWidth
            label="Select Item"
            value={recipe.item.name}
            slotProps={{ input: { readOnly: true } }}
          />
          <IconButton
            size="large"
            color="error"
            onClick={() => handleDeleteItem(recipe.id)}
            title="Delete Ingredient Item"
            sx={{ border: 1, borderColor: "divider" }}
          >
            <FaTrash size={18} />
          </IconButton>
        </Stack>

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, mb: 1 }}
          >
            {recipe.item.name} ingredients
          </Typography>
          <Stack spacing={1}>
            <AnimatePresence>
              {ingredientsList.map((ingredient, index) => {
                const isLastEmptyRow =
                  index === ingredientsList.length - 1 &&
                  ingredient.name.trim() === "";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={ingredient.name}
                        onChange={(e) =>
                          handleIngredientChange(index, "name", e.target.value)
                        }
                        placeholder="Please Enter ingredient"
                      />
                      <TextField
                        size="small"
                        sx={{ width: 140 }}
                        value={ingredient.quantity}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        placeholder="Qty (e.g. 100g)"
                      />
                      {!isLastEmptyRow ? (
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteIngredient(index)}
                          sx={{
                            bgcolor: "error.light",
                            color: "common.white",
                            "&:hover": { bgcolor: "error.main" },
                          }}
                        >
                          <FaTimes size={16} />
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
        </Box>

        <Stack direction="row" sx={{ justifyContent: "center", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default EditIngredientComponent;
