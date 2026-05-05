import { useEffect, useState } from "react";
import ExpenseComponent from "./ExpenseComponent";
import { getExpenses, getExpenseCategories } from "../../api/FetchExpense";
import { logError } from "../../utils/logger";
import {
  createExpense,
  updateExpense,
  createExpenseCategory,
  deleteExpense,
} from "../../api/PostExpense";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";
import usePermissions from "../../hooks/usePermissions";

function ExpenseController() {
  const { hasPermission } = usePermissions();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      if (response?.data?.status) {
        setExpenses(response.data.data);
      } else {
        setExpenses([]);
      }
    } catch {
      toast.error("Error fetching expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getExpenseCategories();
      if (response?.data?.status) {
        setCategories(response.data.data);
      }
    } catch {
      toast.error("Error fetching expense categories");
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  // Client-side filtering
  const filteredExpenses = filterCategory
    ? expenses.filter((exp) => exp.category == filterCategory)
    : expenses;

  // Calculate total based on filtered expenses
  const totalExpense = filteredExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount || 0),
    0
  );
  const getCategoryOptionsHtml = (selectedId = "") => {
    let options = '<option value="">Select Category</option>';
    categories.forEach((cat) => {
      const selected = cat.id == selectedId ? "selected" : "";
      options += `<option value="${cat.id}" ${selected}>${cat.name}</option>`;
    });
    return options;
  };

  const handleAddExpense = async () => {
    if (!hasPermission("expense_entries.create")) {
      toast.error("You do not have permission to create expense entries.");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Add Expense",
      html:
        '<label class="custom-stock-label">Title</label>' +
        '<input id="expense-title" class="swal2-input custom-stock-input" placeholder="Please Enter Expense Name">' +
        '<label class="custom-stock-label">Category</label>' +
        `<select id="expense-category" class="swal2-input custom-stock-input">${getCategoryOptionsHtml()}</select>` +
        '<label class="custom-stock-label">Description</label>' +
        '<input id="expense-description" class="swal2-input custom-stock-input" placeholder="Please Enter Description">' +
        '<label class="custom-stock-label">Amount</label>' +
        '<input id="expense-amount" class="swal2-input custom-stock-input" placeholder="Please Enter Amount">' +
        '<label class="custom-stock-label">Payment Mode</label>' +
        '<select id="expense-payment-mode" class="swal2-input custom-stock-input">' +
        '<option value="CASH">Cash</option>' +
        '<option value="ONLINE">Online</option>' +
        "</select>",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "var(--color-primary)",
      cancelButtonText: "Cancel",
      didOpen: () => {
        // Enforce number-only input on amount
        const amountInput = document.getElementById("expense-amount");
        amountInput.addEventListener("input", (event) => {
          event.target.value = event.target.value.replace(/[^0-9.]/g, "");
        });
      },
      preConfirm: () => {
        const title = document.getElementById("expense-title").value;
        const category = document.getElementById("expense-category").value;
        const description = document.getElementById(
          "expense-description"
        ).value;
        const amount = document.getElementById("expense-amount").value;
        const payment_mode = document.getElementById(
          "expense-payment-mode"
        ).value;

        if (!title.trim()) {
          Swal.showValidationMessage("Title is required");
          return false;
        }
        if (!category) {
          Swal.showValidationMessage("Category is required");
          return false;
        }
        if (!description.trim()) {
          Swal.showValidationMessage("Description is required");
          return false;
        }
        if (!amount) {
          Swal.showValidationMessage("Amount is required");
          return false;
        }

        return { title, category, description, amount, payment_mode };
      },
    });

    if (formValues) {
      const response = await createExpense(formValues);
      if (response) {
        fetchExpenses();
      }
    }
  };

  const handleEditExpense = async (expense) => {
    if (!hasPermission("expense_entries.update")) {
      toast.error("You do not have permission to update expense entries.");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Edit Expense",
      html:
        '<label class="custom-stock-label">Title</label>' +
        `<input id="expense-title" class="swal2-input custom-stock-input" value="${expense.title || ""}" placeholder="Please Enter Expense Name">` +
        '<label class="custom-stock-label">Category</label>' +
        `<select id="expense-category" class="swal2-input custom-stock-input">${getCategoryOptionsHtml(expense.category)}</select>` +
        '<label class="custom-stock-label">Description</label>' +
        `<input id="expense-description" class="swal2-input custom-stock-input" value="${expense.description}" placeholder="Please Enter Description">` +
        '<label class="custom-stock-label">Amount</label>' +
        `<input id="expense-amount" class="swal2-input custom-stock-input" value="${expense.amount}" placeholder="Please Enter Amount">` +
        '<label class="custom-stock-label">Payment Mode</label>' +
        '<select id="expense-payment-mode" class="swal2-input custom-stock-input">' +
        `<option value="CASH" ${expense.payment_mode === "CASH" ? "selected" : ""}>Cash</option>` +
        `<option value="ONLINE" ${expense.payment_mode === "ONLINE" ? "selected" : ""}>Online</option>` +
        "</select>",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "var(--color-primary)",
      cancelButtonText: "Cancel",
      didOpen: () => {
        const amountInput = document.getElementById("expense-amount");
        amountInput.addEventListener("input", (event) => {
          event.target.value = event.target.value.replace(/[^0-9.]/g, "");
        });
      },
      preConfirm: () => {
        const title = document.getElementById("expense-title").value;
        const category = document.getElementById("expense-category").value;
        const description = document.getElementById(
          "expense-description"
        ).value;
        const amount = document.getElementById("expense-amount").value;
        const payment_mode = document.getElementById(
          "expense-payment-mode"
        ).value;

        if (!title.trim()) {
          Swal.showValidationMessage("Title is required");
          return false;
        }
        if (!category) {
          Swal.showValidationMessage("Category is required");
          return false;
        }
        if (!description.trim()) {
          Swal.showValidationMessage("Description is required");
          return false;
        }
        if (!amount) {
          Swal.showValidationMessage("Amount is required");
          return false;
        }

        return { title, category, description, amount, payment_mode };
      },
    });

    if (formValues) {
      const response = await updateExpense(expense.id, formValues);
      if (response) {
        fetchExpenses();
      }
    }
  };

  const handleDeleteExpense = (id) => {
    if (!hasPermission("expense_entries.delete")) {
      toast.error("You do not have permission to delete expense entries.");
      return;
    }

    DeleteConfirmation({
      id,
      apiEndpoint: "/expenses",
      name: "expense",
      successMessage: "Expense deleted successfully!",
      onSuccess: fetchExpenses,
    });
  };

  const handleAddCategory = async () => {
    if (!hasPermission("expense_categories.create")) {
      toast.error("You do not have permission to create expense categories.");
      return;
    }

    const { value: name } = await Swal.fire({
      title: "Add Expense Category",
      input: "text",
      inputLabel: "Category Name",
      inputPlaceholder: "Please Enter Category Name",
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "var(--color-primary)",
      cancelButtonText: "Cancel",
      customClass: {
        inputLabel: "custom-stock-input-label",
        input: "custom-stock-swal-input",
      },
      preConfirm: async (value) => {
        if (!value) {
          Swal.showValidationMessage("Category name is required");
        }
        return value;
      },
    });

    if (name) {
      const response = await createExpenseCategory(name);
      if (response) {
        fetchCategories();
        Swal.close();
      }
    }
  };

  const handleDeleteCategory = async (id, catName) => {
    if (!hasPermission("expense_categories.delete")) {
      toast.error("You do not have permission to delete expense categories.");
      return;
    }

    // Check if any expenses exist under this category
    const categoryExpenses = expenses.filter((exp) => exp.category == id);

    if (categoryExpenses.length > 0) {
      // Show warning about existing expenses
      const totalAmount = categoryExpenses.reduce(
        (sum, exp) => sum + parseFloat(exp.amount || 0),
        0
      );
      const result = await Swal.fire({
        title: "⚠️ Category Has Existing Data!",
        html: `
                    <div style="text-align: left; padding: 10px 0;">
                        <p style="margin-bottom: 8px;">The category <strong>"${catName}"</strong> has:</p>
                        <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px; margin: 10px 0;">
                            <p style="margin: 4px 0;">📋 <strong>${categoryExpenses.length}</strong> expense(s)</p>
                            <p style="margin: 4px 0;">💰 Total: <strong>₹ ${totalAmount.toLocaleString("en-IN")}</strong></p>
                        </div>
                        <p style="color: #dc3545; font-weight: 500; margin-top: 10px;">All associated expenses will be deleted first!</p>
                    </div>
                `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c2272d",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete anyway!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      // Delete all expenses under this category
      Swal.fire({
        title: "Deleting expenses...",
        html: `Removing <strong>0 / ${categoryExpenses.length}</strong> expenses`,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        for (let i = 0; i < categoryExpenses.length; i++) {
          await deleteExpense(categoryExpenses[i].id);
          Swal.update({
            html: `Removing <strong>${i + 1} / ${categoryExpenses.length}</strong> expenses`,
          });
        }
        await fetchExpenses();
        Swal.close();
        toast.success(
          `${categoryExpenses.length} expense(s) deleted successfully!`
        );
      } catch (error) {
        Swal.close();
        toast.error("Error deleting some expenses. Please try again.");
        logError("Error deleting expenses:", error);
        return;
      }
    }

    // Now delete the category
    DeleteConfirmation({
      id,
      apiEndpoint: "/expenses-categories",
      name: `expense category "${catName}"`,
      successMessage: "Expense category deleted successfully!",
      onSuccess: () => {
        fetchCategories();
        fetchExpenses();
      },
    });
  };

  return (
    <ExpenseComponent
      expenses={filteredExpenses}
      categories={categories}
      loading={loading}
      totalExpense={totalExpense}
      filterCategory={filterCategory}
      setFilterCategory={setFilterCategory}
      handleAddExpense={handleAddExpense}
      handleEditExpense={handleEditExpense}
      handleDeleteExpense={handleDeleteExpense}
      handleAddCategory={handleAddCategory}
      handleDeleteCategory={handleDeleteCategory}
    />
  );
}

export default ExpenseController;
