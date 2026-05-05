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
import PageHero from "../../Components/common/PageHero";
import { FiDollarSign, FiPlus, FiTag, FiTrash2, FiEdit2 } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";

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
  const { hasPermission } = usePermissions();
  const canCreateExpense = hasPermission("expense_entries.create");
  const canUpdateExpense = hasPermission("expense_entries.update");
  const canDeleteExpense = hasPermission("expense_entries.delete");
  const canCreateCategory = hasPermission("expense_categories.create");
  const canDeleteCategory = hasPermission("expense_categories.delete");
  const canUseExpenseActions = canUpdateExpense || canDeleteExpense;

  const heroActionSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
  };
  const expenseActions =
    canCreateExpense || canCreateCategory ? (
      <>
        {canCreateExpense && (
          <Button
            variant="contained"
            startIcon={<FiPlus size={15} />}
            onClick={handleAddExpense}
            sx={heroActionSx}
          >
            Add Expense
          </Button>
        )}
        {canCreateCategory && (
          <Button
            variant="outlined"
            startIcon={<FiTag size={15} />}
            onClick={handleAddCategory}
            sx={heroActionSx}
          >
            Add Category
          </Button>
        )}
      </>
    ) : null;

  return (
    <>
      <PageHero
        icon={<FiDollarSign size={24} />}
        eyebrow="Spending"
        title="Expenses"
        subtitle={`${expenses?.length || 0} expense${expenses?.length !== 1 ? "s" : ""} recorded`}
        actions={expenseActions}
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >

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
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
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
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Total Expense
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ₹ {Number(totalExpense || 0).toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Category Filter Chips */}
      <Stack
        direction="row"
        spacing={1} useFlexGap

        sx={{ flexWrap: "wrap", alignItems: "center", mb: 2.5 }}
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
              onDelete={
                canDeleteCategory
                  ? () => handleDeleteCategory(cat.id, cat.name)
                  : undefined
              }
              deleteIcon={
                canDeleteCategory ? <FiTrash2 size={13} /> : undefined
              }
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
                {canUseExpenseActions && (
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Actions
                  </TableCell>
                )}
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
                  {canUseExpenseActions && (
                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
                        {canUpdateExpense && (
                          <IconButton
                            size="small"
                            onClick={() => handleEditExpense(expense)}
                            title="Edit Expense"
                          >
                            <FiEdit2 size={15} />
                          </IconButton>
                        )}
                        {canDeleteExpense && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteExpense(expense.id)}
                            title="Delete Expense"
                          >
                            <FiTrash2 size={15} />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  )}
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


                    spacing={1}
                    sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        #{index + 1}
                      </Typography>
                      <Typography
                        variant="subtitle1" noWrap
                       sx={{ fontWeight: 600 }}>
                        {expense.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {expense.category_name || expense.category}
                      </Typography>
                    </Box>
                    <Typography
                      variant="subtitle1"

                      color="text.primary"
                     sx={{ fontWeight: 700 }}>
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


                   sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      size="small"
                      label={expense.payment_mode}
                      color="primary"
                      variant="outlined"
                    />
                    {canUseExpenseActions && (
                      <Stack direction="row" spacing={0.5}>
                        {canUpdateExpense && (
                          <IconButton
                            size="small"
                            onClick={() => handleEditExpense(expense)}
                          >
                            <FiEdit2 size={15} />
                          </IconButton>
                        )}
                        {canDeleteExpense && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <FiTrash2 size={15} />
                          </IconButton>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      </Paper>
    </>
  );
}

export default ExpenseComponent;
