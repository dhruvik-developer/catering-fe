import { useState, useEffect } from "react";
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
import toast from "react-hot-toast";
import Loader from "../../../Components/common/Loader";
import EmptyState from "../../../Components/common/EmptyState";
import { getGroundItems, getGroundCategories } from "../../../api/GroundApis";
import AddGroundItem from "./AddGroundItem";
import usePermissions from "../../../hooks/usePermissions";

const GroundItemMaster = () => {
  const { hasPermission } = usePermissions();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [itemsRes, catRes] = await Promise.all([
        getGroundItems(),
        getGroundCategories(),
      ]);

      if (itemsRes?.data?.status) {
        setItems(itemsRes.data.data);
      } else {
        toast.error(itemsRes?.data?.message || "Failed to fetch items");
      }

      if (catRes?.data?.status) {
        setCategories(catRes.data.data.filter((c) => c.is_active));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getGroundItems();
      if (res?.data?.status) {
        setItems(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

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
    fetchItems();
  };
  const canCreateGround = hasPermission("ground.create");

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}


        sx={{ alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", mb: 3 }}
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
            <HugeiconsIcon icon={StickyNote02Icon} size={22} />
          </Avatar>
          <Box>
            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
              Ground Items
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage inventory items and equipment used on the ground
            </Typography>
          </Box>
        </Stack>
        {canCreateGround && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add Item
          </Button>
        )}
      </Stack>

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
  );
};

export default GroundItemMaster;
