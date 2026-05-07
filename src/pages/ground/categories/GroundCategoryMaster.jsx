import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import Loader from "../../../Components/common/Loader";
import EmptyState from "../../../Components/common/EmptyState";
import PageHero from "../../../Components/common/PageHero";
import AddGroundCategory from "./AddGroundCategory";
import usePermissions from "../../../hooks/usePermissions";
import {
  GROUND_CATEGORIES_QUERY_KEY,
  useGroundCategories,
} from "../../../hooks/useGround";

const GroundCategoryMaster = () => {
  const { hasPermission } = usePermissions();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // React-Query backed: list re-fetches automatically after any successful
  // create/edit/delete (here or anywhere else in the app).
  const { data: categories = [], isLoading: loading } = useGroundCategories();

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    queryClient.invalidateQueries({ queryKey: GROUND_CATEGORIES_QUERY_KEY });
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
        icon={<HugeiconsIcon icon={MenuRestaurantIcon} size={24} />}
        eyebrow="Ground prep"
        title="Ground Categories"
        subtitle="Manage categories for ground items and equipment"
        actions={
          canCreateGround ? (
            <Button
              variant="contained"
              onClick={() => setIsAddModalOpen(true)}
              sx={heroActionSx}
            >
              + Add Category
            </Button>
          ) : null
        }
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >

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
    </>
  );
};

export default GroundCategoryMaster;
