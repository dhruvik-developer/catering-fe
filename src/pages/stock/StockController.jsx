import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StockComponent from "./StockComponent";
import { getStockCategory } from "../../api/FetchStockCategory";
import {
  addStockCategory,
  addStockItem,
  decreaseStockItem,
  increaseStockItem,
} from "../../api/PostStock";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";
import usePermissions from "../../hooks/usePermissions";

const unitLabels = {
  KG: "Kilogram",
  G: "Gram",
  L: "Litre",
  ML: "Millilitre",
  QTY: "Quantity",
};

function StockController() {
  const { hasPermission } = usePermissions();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchStockCategories = async () => {
    try {
      const response = await getStockCategory();
      const fetchedCategory = response.data.data;

      // Add pseudo-category for viewing all low stock
      const enhancedCategories = [
        { id: "all_items", name: "All Stock Items" },
        { id: "low_stock", name: "Low Stock Items (All)" },
        ...fetchedCategory,
      ];
      setCategories(enhancedCategories);

      if (fetchedCategory.length > 0 || enhancedCategories.length > 0) {
        // Preserve current category selection if it still exists
        setSelectedCategory((prev) => {
          if (prev === "low_stock" || prev === "all_items") return prev;
          const currentStillExists =
            prev && fetchedCategory.find((cat) => cat.id === prev);
          return currentStillExists ? prev : "all_items";
        });
      }
    } catch {
      toast.error("Error fetching stock categories:");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStockCategories();
  }, []);

  // Auto-select category when navigated from Low Stock dropdown
  useEffect(() => {
    if (location.state?.selectCategoryId) {
      setSelectedCategory(location.state.selectCategoryId);
    } else if (location.state?.view === "low_stock") {
      setSelectedCategory("low_stock");
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedCategory === "low_stock") {
      const allLowStock = categories.reduce((acc, cat) => {
        if (cat.id === "low_stock" || cat.id === "all_items") return acc;
        const items = cat.stokeitem || cat.stoke_item || cat.items || [];
        const low = items.filter((i) => {
          const qty = parseInt(i.quantity) || 0;
          const alert = parseInt(i.alert) || 0;
          return alert > 0 && qty <= alert;
        });
        return [...acc, ...low.map((x) => ({ ...x, categoryName: cat.name }))];
      }, []);
      setItems(allLowStock);
    } else if (selectedCategory === "all_items") {
      const allStock = categories.reduce((acc, cat) => {
        if (cat.id === "low_stock" || cat.id === "all_items") return acc;
        const items = cat.stokeitem || cat.stoke_item || cat.items || [];
        return [
          ...acc,
          ...items.map((x) => ({ ...x, categoryName: cat.name })),
        ];
      }, []);
      setItems(allStock);
    } else if (selectedCategory) {
      const category = categories.find((cat) => cat.id === selectedCategory);
      setItems(category ? category.stokeitem || [] : []);
    }
  }, [selectedCategory, categories]);

  const handleAddCategory = async () => {
    if (!hasPermission("stock.create")) {
      toast.error("You do not have permission to create stock categories.");
      return;
    }

    const { value: name } = await Swal.fire({
      title: "Add Category",
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
      const response = await addStockCategory(name);
      if (response) {
        fetchStockCategories();
        window.dispatchEvent(new Event("stockDataChanged"));
        Swal.close();
      }
    }
  };

  const handleAddItem = async () => {
    if (!hasPermission("stock.create")) {
      toast.error("You do not have permission to create stock items.");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Add Item",
      html:
        '<label class="custom-stock-label">Item Name</label>' +
        '<input id="item-name" class="swal2-input custom-stock-input" placeholder="Please Enter Item Name">' +
        '<label class="custom-stock-label">Type</label>' +
        '<select id="item-type" class="swal2-input custom-stock-input">' +
        '<option value="KG" selected>Kilogram</option>' +
        '<option value="G">Gram</option>' +
        '<option value="L">Litre</option>' +
        '<option value="ML">Millilitre</option>' +
        '<option value="QTY">Quantity</option>' +
        "</select>" +
        '<label id="item-quantity-label" class="custom-stock-label">Quantity Per</label>' +
        '<input id="item-quantity" class="swal2-input custom-stock-input" placeholder="Please Enter Quantity">' +
        '<label id= "item-alert-label" class="custom-stock-label">Alert Per</label>' +
        '<input id="item-alert" class="swal2-input custom-stock-input" placeholder="Please Enter Alert Quantity">' +
        '<label id="item-rate-label" class="custom-stock-label">Rate Per</label>' +
        '<input id="item-rate" class="swal2-input custom-stock-input" placeholder="Please Enter Rate Per Unit">' +
        '<label class="custom-stock-label">Total Amount</label>' +
        '<input id="item-total" class="swal2-input custom-stock-input" placeholder="Please Enter Total Price">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "var(--color-primary)",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-popup",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
      didOpen: () => {
        // Get elements
        const itemType = document.getElementById("item-type");
        const itemRate = document.getElementById("item-rate");
        const itemQuantity = document.getElementById("item-quantity");
        const itemTotal = document.getElementById("item-total");
        const itemAlertLabel = document.getElementById("item-alert-label");
        const itemQuantityLabel = document.getElementById(
          "item-quantity-label"
        );
        const itemRateLabel = document.getElementById("item-rate-label");

        // Function to sanitize input
        const numberInputs = [
          "item-quantity",
          "item-alert",
          "item-rate",
          "item-total",
        ];
        const enforceNumberInput = (input) => {
          input.addEventListener("input", (event) => {
            let sanitizedValue = event.target.value.replace(/[^0-9.]/g, "");
            event.target.value = sanitizedValue;
          });
        };
        numberInputs.forEach((id) =>
          enforceNumberInput(document.getElementById(id))
        );

        // Auto-calculate Total Amount = Quantity * Rate
        const calculateTotal = () => {
          const qty = parseFloat(itemQuantity.value) || 0;
          const rate = parseFloat(itemRate.value) || 0;
          if (qty > 0 && rate > 0) {
            itemTotal.value = (qty * rate).toFixed(2);
          }
        };
        itemQuantity.addEventListener("input", calculateTotal);
        itemRate.addEventListener("input", calculateTotal);

        // Update the labels
        const updateLabels = (selectedValue) => {
          itemRate.placeholder = `Please Enter Rate Per ${unitLabels[selectedValue]}`;
          itemAlertLabel.innerText = `Alert Per ${unitLabels[selectedValue]}`;
          itemQuantityLabel.innerText = `Quantity Per ${unitLabels[selectedValue]}`;
          itemRateLabel.innerText = `Rate Per ${unitLabels[selectedValue]}`;
        };

        updateLabels(itemType.value);

        // Event listener for dropdown change
        itemType.addEventListener("change", () => {
          updateLabels(itemType.value);
        });
      },
      preConfirm: () => {
        return {
          category: selectedCategory,
          name: document.getElementById("item-name").value,
          type: document.getElementById("item-type").value,
          quantity: document.getElementById("item-quantity").value,
          alert: document.getElementById("item-alert").value,
          nte_price: document.getElementById("item-rate").value,
          total_price: document.getElementById("item-total").value,
        };
      },
    });

    if (formValues) {
      const response = await addStockItem(formValues);
      if (response) {
        fetchStockCategories();
        window.dispatchEvent(new Event("stockDataChanged"));
      }
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = (id) => {
    if (!hasPermission("stock.delete")) {
      toast.error("You do not have permission to delete stock categories.");
      return;
    }

    DeleteConfirmation({
      id,
      apiEndpoint: "/stoke-categories",
      name: "stock category",
      successMessage: "Category deleted successfully!",
      onSuccess: () => {
        fetchStockCategories();
        window.dispatchEvent(new Event("stockDataChanged"));
      },
    });
  };

  // Handle Delete item
  const handleDeleteItem = (id) => {
    if (!hasPermission("stock.delete")) {
      toast.error("You do not have permission to delete stock items.");
      return;
    }

    DeleteConfirmation({
      id,
      apiEndpoint: "/stoke-items",
      name: "stock item",
      successMessage: "Item deleted successfully!",
      onSuccess: () => {
        fetchStockCategories();
        window.dispatchEvent(new Event("stockDataChanged"));
      },
    });
  };

  const handleIncreaseItem = async (item) => {
    if (!hasPermission("stock.update")) {
      toast.error("You do not have permission to update stock.");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: `Add Stock For: ${item.name}`,
      html:
        `<label id="item-quantity-label" class="custom-stock-label">Quantity Per ${unitLabels[item.type]}</label>` +
        `<input id="item-quantity" class="swal2-input custom-stock-input" placeholder="Please Enter To Add Stock">` +
        `<label id="item-rate-label" class="custom-stock-label">Rate Per ${unitLabels[item.type]}</label>` +
        `<input id="item-rate" class="swal2-input custom-stock-input" placeholder="Please Enter Rate Per Unit">` +
        `<label class="custom-stock-label">Total Amount</label>` +
        `<input id="item-total" class="swal2-input custom-stock-input" placeholder="Please Enter Total Price">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "var(--color-primary)",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-popup",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
      didOpen: () => {
        const itemQuantity = document.getElementById("item-quantity");
        const itemRate = document.getElementById("item-rate");
        const itemTotal = document.getElementById("item-total");

        // Function to sanitize input
        const numberInputs = ["item-quantity", "item-rate", "item-total"];
        const enforceNumberInput = (input) => {
          input.addEventListener("input", (event) => {
            event.target.value = event.target.value.replace(/[^0-9.]/g, "");
          });
        };
        numberInputs.forEach((id) =>
          enforceNumberInput(document.getElementById(id))
        );

        // Auto-calculate Total Amount = Quantity * Rate
        const calculateTotal = () => {
          const qty = parseFloat(itemQuantity.value) || 0;
          const rate = parseFloat(itemRate.value) || 0;
          if (qty > 0 && rate > 0) {
            itemTotal.value = (qty * rate).toFixed(2);
          }
        };
        itemQuantity.addEventListener("input", calculateTotal);
        itemRate.addEventListener("input", calculateTotal);
      },
      preConfirm: () => {
        return {
          id: item.id,
          name: item.name,
          quantity: document.getElementById("item-quantity").value,
          nte_price: document.getElementById("item-rate").value,
          total_price: document.getElementById("item-total").value,
        };
      },
    });

    if (formValues) {
      const response = await increaseStockItem(formValues);
      if (response) {
        fetchStockCategories();
        window.dispatchEvent(new Event("stockDataChanged"));
      }
    }
  };

  const handleDecreaseItem = async (item) => {
    if (!hasPermission("stock.update")) {
      toast.error("You do not have permission to update stock.");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: `Remove Stock For: ${item.name}`,
      html:
        `<label id="item-quantity-label" class="custom-stock-label">Quantity Per ${unitLabels[item.type]}</label>` +
        `<input id="item-quantity" class="swal2-input custom-stock-input" placeholder="Please Enter To Remove Stock">` +
        `<label id="item-rate-label" class="custom-stock-label">Rate Per ${unitLabels[item.type]}</label>` +
        `<input id="item-rate" class="swal2-input custom-stock-input text-black font-semibold" value="${item.nte_price}" readonly>` +
        `<label class="custom-stock-label">Total Amount</label>` +
        `<input id="item-total" class="swal2-input custom-stock-input" placeholder="Please Enter Total Price">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "var(--color-primary)",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-popup",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
      didOpen: () => {
        const itemQuantity = document.getElementById("item-quantity");
        const itemRate = document.getElementById("item-rate");
        const itemTotal = document.getElementById("item-total");

        // Function to sanitize input
        const numberInputs = ["item-quantity", "item-total"];
        const enforceNumberInput = (input) => {
          input.addEventListener("input", (event) => {
            event.target.value = event.target.value.replace(/[^0-9.]/g, "");
          });
        };
        numberInputs.forEach((id) =>
          enforceNumberInput(document.getElementById(id))
        );

        // Auto-calculate Total Amount = Quantity * Rate
        const calculateTotal = () => {
          const qty = parseFloat(itemQuantity.value) || 0;
          const rate = parseFloat(itemRate.value) || 0;
          if (qty > 0 && rate > 0) {
            itemTotal.value = (qty * rate).toFixed(2);
          }
        };
        itemQuantity.addEventListener("input", calculateTotal);
        itemRate.addEventListener("input", calculateTotal);
      },
      preConfirm: () => {
        return {
          id: item.id,
          name: item.name,
          quantity: document.getElementById("item-quantity").value,
          nte_price: document.getElementById("item-rate").value,
          total_price: document.getElementById("item-total").value,
        };
      },
    });

    if (formValues) {
      const response = await decreaseStockItem(formValues);
      if (response) {
        fetchStockCategories();
        window.dispatchEvent(new Event("stockDataChanged"));
      }
    }
  };

  return (
    <StockComponent
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      categories={categories}
      items={items}
      loading={loading}
      handleAddCategory={handleAddCategory}
      handleAddItem={handleAddItem}
      onCategoryDelete={handleDeleteCategory}
      onItemDelete={handleDeleteItem}
      handleIncreaseItem={handleIncreaseItem}
      handleDecreaseItem={handleDecreaseItem}
    />
  );
}

export default StockController;
