import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
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
import { MenuRestaurantIcon } from "@hugeicons/core-free-icons";
import toast from "react-hot-toast";
import Loader from "../../../Components/common/Loader";
import EmptyState from "../../../Components/common/EmptyState";
import { getGroundCategories } from "../../../api/GroundApis";
import AddGroundCategory from "./AddGroundCategory";
import usePermissions from "../../../hooks/usePermissions";

const GroundCategoryMaster = () => {
  const { hasPermission } = usePermissions();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getGroundCategories();
      if (res?.data?.status) {
        setCategories(res.data.data);
      } else {
        toast.error(res?.data?.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchCategories();
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
            <HugeiconsIcon icon={MenuRestaurantIcon} size={22} />
          </Avatar>
          <Box>
            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
              Ground Categories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage categories for ground items and equipment
            </Typography>
          </Box>
        </Stack>
        {canCreateGround && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add Category
          </Button>
        )}
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "action.hover",
          }}
        >
          <TextField
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            sx={{ width: { xs: "100%", sm: 320 } }}
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
        </Box>

        {loading ? (
          <Box sx={{ p: 4, minHeight: 240 }}>
            <Loader message="Loading Categories..." />
          </Box>
        ) : filteredCategories.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: (t) => t.palette.primary.light + "14" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Category Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.map((cat) => (
                  <TableRow
                    key={cat.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                    <TableCell
                      sx={{
                        color: "text.secondary",
                        maxWidth: 360,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cat.description || "—"}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={cat.is_active ? "Active" : "Inactive"}
                        color={cat.is_active ? "success" : "error"}
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
              icon={<HugeiconsIcon icon={MenuRestaurantIcon} size={24} />}
              title={
                searchTerm
                  ? "No categories match your search"
                  : "No categories yet"
              }
              message={
                searchTerm
                  ? "Try adjusting your search."
                  : "Add a category to get started."
              }
            />
          </Box>
        )}
      </Paper>

      <AddGroundCategory
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </Paper>
  );
};

export default GroundCategoryMaster;
