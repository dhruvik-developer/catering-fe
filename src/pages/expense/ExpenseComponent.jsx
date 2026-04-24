/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Loader from "../../Components/common/Loader";
import EmptyState from "../../Components/common/EmptyState";
import { FiDollarSign, FiPlus, FiTag, FiTrash2, FiEdit2 } from "react-icons/fi";

function ExpenseComponent({
  expenses,
  categories,
  loading,
  totalExpense,
  filterCategory,
  setFilterCategory,
  handleAddExpense,
  handleEditExpense,
  handleDeleteExpense,
  handleAddCategory,
  handleDeleteCategory,
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: (t) => t.palette.primary.light + "33",
              color: "primary.main",
              width: 44,
              height: 44,
            }}
          >
            <FiDollarSign size={20} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Expenses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {expenses?.length || 0} expense{expenses?.length !== 1 ? "s" : ""}{" "}
              recorded
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiPlus size={15} />}
            onClick={handleAddExpense}
          >
            Add Expense
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FiTag size={15} />}
            onClick={handleAddCategory}
          >
            Add Category
          </Button>
        </Stack>
      </Stack>

      {/* Total Expense Card */}
      <Card
        sx={{
          mb: 2.5,
          bgcolor: (t) => t.palette.primary.light + "26",
          border: 1,
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                width: 48,
                height: 48,
              }}
            >
              <FiDollarSign size={22} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Total Expense
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                ₹ {Number(totalExpense || 0).toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Category Filter Chips */}
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Chip
          label="All"
          onClick={() => setFilterCategory("")}
          color={filterCategory === "" ? "primary" : "default"}
          variant={filterCategory === "" ? "filled" : "outlined"}
          sx={{ fontWeight: 600 }}
        />
        {categories.map((cat) => {
          const isActive = String(filterCategory) === String(cat.id);
          return (
            <Chip
              key={cat.id}
              label={cat.name}
              onClick={() => setFilterCategory(cat.id)}
              onDelete={() => handleDeleteCategory(cat.id, cat.name)}
              deleteIcon={<FiTrash2 size={13} />}
              color={isActive ? "primary" : "default"}
              variant={isActive ? "filled" : "outlined"}
              sx={{ fontWeight: 600 }}
            />
          );
        })}
      </Stack>

      {loading ? (
        <Loader message="Loading Expenses..." />
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={<FiDollarSign size={24} />}
          title="No Expenses Available"
          message="Add your first expense to get started."
        />
      ) : isDesktop ? (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: (t) => t.palette.primary.light + "1a" }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Payment Mode</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow
                  key={expense.id}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{expense.title}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {expense.category_name || expense.category}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {expense.description}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    ₹{" "}
                    {parseFloat(expense.amount).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={expense.payment_mode}
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditExpense(expense)}
                        title="Edit Expense"
                      >
                        <FiEdit2 size={15} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteExpense(expense.id)}
                        title="Delete Expense"
                      >
                        <FiTrash2 size={15} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Mobile card layout
        <Grid container spacing={1.5}>
          {expenses.map((expense, index) => (
            <Grid key={expense.id} size={12}>
              <Card>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <Box minWidth={0}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        #{index + 1}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        noWrap
                      >
                        {expense.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {expense.category_name || expense.category}
                      </Typography>
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color="text.primary"
                    >
                      ₹ {parseFloat(expense.amount).toLocaleString("en-IN")}
                    </Typography>
                  </Stack>
                  {expense.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {expense.description}
                    </Typography>
                  )}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      size="small"
                      label={expense.payment_mode}
                      color="primary"
                      variant="outlined"
                    />
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditExpense(expense)}
                      >
                        <FiEdit2 size={15} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <FiTrash2 size={15} />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}

export default ExpenseComponent;
