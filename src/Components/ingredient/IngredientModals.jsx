/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import FormModal from "../common/FormModal";
import Dropdown from "../common/formDropDown/DropDown";
import { useCreateIngredientItemMutation } from "../../hooks/useVendorMutations";
import { useIngredientCategories } from "../../hooks/useIngredientCategories";

// ==================== ADD INGREDIENT ITEM MODAL ====================
export const AddIngredientItemModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialCategory,
}) => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const createIngredientItemMutation = useCreateIngredientItemMutation();
  const { data: categories = [] } = useIngredientCategories(
    {},
    { enabled: isOpen }
  );

  useEffect(() => {
    if (isOpen) {
      setItemName("");
      setCategory(initialCategory || "");
    }
  }, [initialCategory, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    if (!category) {
      toast.error("Please select an ingredient category");
      return;
    }

    const formattedName = itemName
      .trim()
      .split(" ")
      .map((word) =>
        word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
      )
      .join(" ");

    const isDuplicate = categories.some(
      (cat) =>
        cat.items &&
        cat.items.some(
          (item) =>
            item.name && item.name.toLowerCase() === formattedName.toLowerCase()
        )
    );

    if (isDuplicate) {
      toast.error("Ingredient item name already exists");
      return;
    }

    setSaving(true);
    const response = await createIngredientItemMutation.mutateAsync({
      itemName: formattedName,
      category,
    });
    setSaving(false);
    if (response) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Ingredient Item"
      subtitle="Add a new ingredient item to a category"
      widthClass="max-w-md"
      closeDisabled={saving}
      footer={
        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Item"}
          </Button>
        </Stack>
      }
    >
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
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              Category *
            </Typography>
            <Dropdown
              options={categories} selectedValue={category}
              onChange={(value) => setCategory(value)}
              placeholder="Select a category"
              isSearchable
            />
          </Box>
        </Stack>
      </Box>
    </FormModal>
  );
};
