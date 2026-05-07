import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { HugeiconsIcon } from "@hugeicons/react";
import { StickyNote02Icon } from "@hugeicons/core-free-icons";
import Loader from "../../../Components/common/Loader";
import EmptyState from "../../../Components/common/EmptyState";
import PageHero from "../../../Components/common/PageHero";
import AddGroundItem from "./AddGroundItem";
import usePermissions from "../../../hooks/usePermissions";
import {
  GROUND_ITEMS_QUERY_KEY,
  useGroundCategories,
  useGroundItems,
} from "../../../hooks/useGround";

const GroundItemMaster = () => {
  const { hasPermission } = usePermissions();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // React-Query backed: items + categories auto-refresh after every
  // successful create/update/delete (here or anywhere else in the app).
  const { data: items = [], isLoading: loadingItems } = useGroundItems();
  const { data: rawCategories = [], isLoading: loadingCategories } =
    useGroundCategories();
  const categories = useMemo(
    () => rawCategories.filter((c) => c.is_active),
    [rawCategories]
  );
  const loading = loadingItems || loadingCategories;

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? String(item.category) === String(selectedCategory)
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    queryClient.invalidateQueries({ queryKey: GROUND_ITEMS_QUERY_KEY });
  };
  const canCreateGround = hasPermission("ground.create");

  const heroActionSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
  };

  return (
    <>
      <PageHero
        icon={<HugeiconsIcon icon={StickyNote02Icon} size={24} />}
        eyebrow="Inventory"
        title="Ground Items"
        subtitle="Manage inventory items and equipment used on the ground"
        actions={
          canCreateGround ? (
            <Button
              variant="contained"
              onClick={() => setIsAddModalOpen(true)}
              sx={heroActionSx}
            >
              + Add Item
            </Button>
          ) : null
        }
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "action.hover",
          }}
        >
          <TextField
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            sx={{ flex: 1, minWidth: 220 }}
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
          <Select
            size="small"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {loading ? (
          <Box sx={{ p: 4, minHeight: 240 }}>
            <Loader message="Loading Items..." />
          </Box>
        ) : filteredItems.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: (t) => t.palette.primary.light + "14" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>{item.name}</TableCell>
                    <TableCell sx={{ color: "primary.main", fontWeight: 500 }}>
                      {item.category_name || "—"}
                    </TableCell>
                    <TableCell>{item.unit || "—"}</TableCell>
                    <TableCell
                      sx={{
                        color: "text.secondary",
                        maxWidth: 320,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.description || "—"}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={item.is_active ? "Active" : "Inactive"}
                        color={item.is_active ? "success" : "error"}
                        variant="outlined"
                        sx={{
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 3 }}>
            <EmptyState
              icon={<HugeiconsIcon icon={StickyNote02Icon} size={24} />}
              title="No ground items found"
              message="Try adjusting your filters or adding a new item."
            />
          </Box>
        )}
      </Paper>

      <AddGroundItem
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        categories={categories}
      />
      </Paper>
    </>
  );
};

export default GroundItemMaster;
