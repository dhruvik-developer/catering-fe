import { lazy } from "react";

// Lazy load all pages
const Login = lazy(() => import("../pages/login/LoginController"));
const Dish = lazy(() => import("../pages/dish/DishContoller"));
const Category = lazy(() => import("../pages/category/CategoryController"));
const Quotation = lazy(() => import("../pages/quotation/QuotationController"));
const Invoice = lazy(() => import("../pages/invoice/InvoiceController"));
const AllOrder = lazy(() => import("../pages/allOrder/AllOrderController"));
const StockManagement = lazy(() => import("../pages/stock/StockController"));
const PaymentHistory = lazy(() => import("../pages/paymentHistory/PaymentHistoryController"));
const RecipeIngredient = lazy(() => import("../pages/recipeIngredient/RecipeIngredientController"));
const CreateIngredient = lazy(() => import("../pages/createIngredient/CreateIngredientController"));
const ViewIngredient = lazy(() => import("../pages/viewIngredient/ViewIngredientController"));
const ViewOrderDetails = lazy(() => import("../pages/viewOrderDetails/ViewOrderDetailsController"));
const ShareIngredient = lazy(() => import("../pages/shareIngredient/ShareIngredientController"));
const User = lazy(() => import("../pages/user/UserController"));
const Expense = lazy(() => import("../pages/expense/ExpenseController"));
const Calendar = lazy(() => import("../pages/calendar/CalendarController"));
const ViewItemRecipe = lazy(() => import("../pages/itemRecipe/ViewItemRecipeController"));
const Vendor = lazy(() => import("../pages/vendor/VendorController"));
const GstBillingModule = lazy(() => import("../pages/gstBilling/GstBillingModule"));
const SessionChecklistPreview = lazy(() => import("../pages/sessionChecklistPreview/SessionChecklistPreviewController"));
const PeoplePage = lazy(() => import("../pages/people/PeoplePage"));
const OrderManagementPage = lazy(() => import("../pages/orderManagement/OrderManagementPage"));
const PermissionsController = lazy(() => import("../pages/people/permissions/PermissionsController"));

const Rules = lazy(() => import("../Components/common/rules/RuleController"));

const EditDish = lazy(() => import("../pages/editOrder/editDish/EditDishController"));
const EditItem = lazy(() => import("../pages/editOrder/editItem/EditItemController"));

const AddItem = lazy(() => import("../Components/category/addItem/AddItemController"));
const AddCategory = lazy(() => import("../Components/category/addCategory/AddCategoryController"));
const AddIngredient = lazy(() => import("../Components/recipeIngredient/addRecipe/AddIngredientController"));
const EditIngredient = lazy(() => import("../Components/recipeIngredient/editRecipe/EditIngredientController"));
const AddIngredientItem = lazy(() => import("../Components/ingredient/addIngredient/AddIngredientItemController"));
const AddEditVendor = lazy(() => import("../Components/vendor/addEditVendor/AddEditVendorController"));

const PDFViewPage = lazy(() => import("../Components/common/pdfPages/dishPdf/PdfView"));
const PDFEditDish = lazy(() => import("../Components/common/pdfPages/editDishPdf/PdfEditDishController"));
const PDFAllOrder = lazy(() => import("../Components/common/pdfPages/allOrderPdf/viewOrderPdf/PdfAllOrderController"));
const PDFShareAllOrder = lazy(() => import("../Components/common/pdfPages/allOrderPdf/shareOrderPdf/PdfShareOrderCotroller"));
const PDFShareIngredient = lazy(() => import("../Components/common/pdfPages/allOrderPdf/shareIngredientPdf/PdfShareIngredientController"));
const PDFQuotation = lazy(() => import("../Components/common/pdfPages/quotationPdf/PdfQuotationController"));
const PDFInvoice = lazy(() => import("../Components/common/pdfPages/invoicePdf/invoiceOrder/PdfInvoiceController"));
const PDFBillInvoice = lazy(() => import("../Components/common/pdfPages/invoicePdf/invoiceBill/PdfBillController"));
const CompleteInvoice = lazy(() => import("../Components/completeInvoice/completeInvoiceController"));
const PDFShareFullIngredient = lazy(() => import("../Components/common/pdfPages/allOrderPdf/shareFullIngredientPdf/PdfShareFullIngredientController"));
const PdfShareOutsourcedController = lazy(() => import("../Components/common/pdfPages/allOrderPdf/shareOutsourcedPdf/PdfShareOutsourcedController"));
const ShareOutsourcedController = lazy(() => import("../pages/shareOutsourced/ShareOutsourcedController"));
const AddEditUser = lazy(() => import("../Components/user/addEditUser/AddEditUserController"));
const DishTagPdf = lazy(() => import("../Components/common/pdfPages/dishTagPdf/DishTagPdf"));

// Event Staff Module
const StaffController = lazy(() => import("../pages/eventStaff/staff/StaffController"));
const AddEditStaffController = lazy(() => import("../pages/eventStaff/staff/AddEditStaffController"));
const AssignmentController = lazy(() => import("../pages/eventStaff/assignment/AssignmentController"));
const AddEditAssignmentController = lazy(() => import("../pages/eventStaff/assignment/AddEditAssignmentController"));
const EventSummaryController = lazy(() => import("../pages/eventStaff/reports/EventSummaryController"));
const StaffDetailPage = lazy(() => import("../pages/eventStaff/reports/StaffDetailPage"));
const FixedStaffPaymentController = lazy(() => import("../pages/eventStaff/reports/FixedStaffPaymentController"));
const WaiterTypeManagement = lazy(() => import("../pages/eventStaff/WaiterTypeManagement"));
const SettingsController = lazy(() => import("../pages/settings/SettingsController"));

// Ground Management Module
const GroundCategoryMaster = lazy(() => import("../pages/ground/categories/GroundCategoryMaster"));
const GroundItemMaster = lazy(() => import("../pages/ground/items/GroundItemMaster"));
const EventGroundChecklist = lazy(() => import("../pages/ground/checklist/EventGroundChecklist"));

export {
  Login,
  Dish,
  Category,
  Quotation,
  Invoice,
  AllOrder,
  StockManagement,
  PaymentHistory,
  RecipeIngredient,
  CreateIngredient,
  ViewIngredient,
  ViewOrderDetails,
  ShareIngredient,
  User,
  Expense,
  Calendar,
  ViewItemRecipe,
  Vendor,
  GstBillingModule,
  SessionChecklistPreview,
  PeoplePage,
  OrderManagementPage,
  Rules,
  EditDish,
  EditItem,
  AddItem,
  AddCategory,
  AddIngredient,
  EditIngredient,
  AddIngredientItem,
  AddEditVendor,
  PDFViewPage,
  PDFEditDish,
  PDFAllOrder,
  PDFShareAllOrder,
  PDFShareIngredient,
  PDFQuotation,
  PDFInvoice,
  PDFBillInvoice,
  CompleteInvoice,
  PDFShareFullIngredient,
  PdfShareOutsourcedController,
  ShareOutsourcedController,
  AddEditUser,
  DishTagPdf,
  StaffController,
  AddEditStaffController,
  AssignmentController,
  AddEditAssignmentController,
  EventSummaryController,
  StaffDetailPage,
  FixedStaffPaymentController,
  WaiterTypeManagement,
  SettingsController,
  GroundCategoryMaster,
  GroundItemMaster,
  EventGroundChecklist,
  PermissionsController,
};
