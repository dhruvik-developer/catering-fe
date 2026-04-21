import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "./index.css";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./Components/layout/Layout";
import { UserProvider } from "./context/UserContext";
import { BASE_PATH } from "./utils/Config";
import {
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
  SessionChecklistPreview,
  PeoplePage,
  OrderManagementPage,
  PermissionsController,
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
} from "./app/routes";

const App = () => (
  <UserProvider>
    <Router basename={BASE_PATH}>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              {/* All main routes */}
              <Route path="/dish" element={<Dish />} />
              <Route path="/category" element={<Category />} />
              <Route path="/order-management" element={<OrderManagementPage />}>
                <Route index element={<Navigate to="all-order" replace />} />
                <Route path="quotation" element={<Quotation />} />
                <Route path="all-order" element={<AllOrder />} />
                <Route path="invoice" element={<Invoice />} />
                <Route path="event-summary" element={<EventSummaryController />} />
              </Route>
              <Route path="/stock" element={<StockManagement />} />
              <Route path="/payment-history" element={<PaymentHistory />} />
              <Route path="/recipe-ingredient" element={<RecipeIngredient />} />
              <Route
                path="/create-recipe-ingredient"
                element={<CreateIngredient />}
              />
              <Route path="/view-ingredient/:id" element={<ViewIngredient />} />
              <Route
                path="/view-order-details/:id"
                element={<ViewOrderDetails />}
              />
              <Route
                path="/session-checklist-preview/:eventId/:sessionId"
                element={<SessionChecklistPreview />}
              />
              <Route path="/share-ingredient" element={<ShareIngredient />} />
              <Route path="/share-outsourced" element={<ShareOutsourcedController />} />
              <Route path="/user" element={<User />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/item-recipe/:itemId" element={<ViewItemRecipe />} />
              <Route path="/people" element={<PeoplePage />}>
                <Route index element={<Navigate to="event-staff" replace />} />
                <Route path="event-staff" element={<StaffController />} />
                <Route path="vendor" element={<Vendor />} />
                <Route
                  path="waiter-types"
                  element={<WaiterTypeManagement />}
                />
                <Route
                  path="permissions"
                  element={<PermissionsController />}
                />
              </Route>
              {/* End of all main routes */}

              {/* Add & edit user and rule route */}
              <Route path="/add-user" element={<AddEditUser />} />
              <Route path="/edit-user/:id" element={<AddEditUser />} />
              <Route path="/add-rule" element={<Rules />} />
              {/* End of add & edit user and rule route */}

              {/* Add & edit vendor route */}
              <Route path="/add-vendor" element={<AddEditVendor />} />
              <Route path="/edit-vendor/:id" element={<AddEditVendor />} />
              {/* End of add & edit vendor route */}

              {/* Legacy People entry routes */}
              <Route
                path="/event-staff"
                element={<Navigate to="/people/event-staff" replace />}
              />
              <Route
                path="/vendor"
                element={<Navigate to="/people/vendor" replace />}
              />
              <Route
                path="/waiter-types"
                element={<Navigate to="/people/waiter-types" replace />}
              />
              {/* End of legacy People entry routes */}

              {/* Legacy Order Management entry routes */}
              <Route
                path="/quotation"
                element={<Navigate to="/order-management/quotation" replace />}
              />
              <Route
                path="/all-order"
                element={<Navigate to="/order-management/all-order" replace />}
              />
              <Route
                path="/invoice"
                element={<Navigate to="/order-management/invoice" replace />}
              />
              <Route
                path="/event-summary"
                element={<Navigate to="/order-management/event-summary" replace />}
              />
              {/* End of legacy Order Management entry routes */}

              {/* Event Staff Routes */}
              <Route path="/add-staff" element={<AddEditStaffController />} />
              <Route
                path="/edit-staff/:id"
                element={<AddEditStaffController />}
              />
              <Route
                path="/event-assignments"
                element={<AssignmentController />}
              />
              <Route
                path="/add-assignment"
                element={<AddEditAssignmentController />}
              />
              <Route
                path="/edit-assignment/:id"
                element={<AddEditAssignmentController />}
              />
              <Route
                path="/staff-detail/:staffId"
                element={<StaffDetailPage />}
              />
              <Route
                path="/fixed-staff-payments/:staffId"
                element={<FixedStaffPaymentController />}
              />
              {/* End Event Staff Routes */}

              {/* Settings */}
              <Route path="/settings" element={<SettingsController />} />

              {/* Ground Management */}
              <Route path="/ground-categories" element={<GroundCategoryMaster />} />
              <Route path="/ground-items" element={<GroundItemMaster />} />
              <Route path="/ground-checklist" element={<EventGroundChecklist />} />

              {/* Edit order routes */}
              <Route path="/edit-dish/:id" element={<EditDish />} />
              <Route path="/edit-item" element={<EditItem />} />
              {/* End of edit order routes */}

              {/* Add categories & items routes */}
              <Route path="/create-category" element={<AddCategory />} />
              <Route path="/create-item" element={<AddItem />} />
              <Route path="/create-ingredient" element={<AddIngredient />} />
              <Route path="/edit-ingredient/:id" element={<EditIngredient />} />
              <Route
                path="/add-ingredient-item"
                element={<AddIngredientItem />}
              />
              {/* End of add categories & items routes */}

              {/* All PDF routes */}
              <Route path="/pdf" element={<PDFViewPage />} />
              <Route path="/edit-order-pdf" element={<PDFEditDish />} />
              <Route path="/order-pdf/:id" element={<PDFAllOrder />} />
              <Route path="/share-order-pdf/:id" element={<PDFShareAllOrder />} />
              <Route
                path="/share-ingredient-pdf"
                element={<PDFShareIngredient />}
              />
              <Route
                path="/share-outsourced-pdf"
                element={<PdfShareOutsourcedController />}
              />
              <Route
                path="/share-full-ingredient-pdf"
                element={<PDFShareFullIngredient />}
              />
              <Route path="/quotation-pdf/:id" element={<PDFQuotation />} />
              <Route path="/invoice-order-pdf/:id" element={<PDFInvoice />} />
              <Route path="/invoice-bill-pdf/:id" element={<PDFBillInvoice />} />
              <Route
                path="/complete-invoice-pdf/:id"
                element={<CompleteInvoice />}
              />
              <Route path="/dish-tags-pdf" element={<DishTagPdf />} />
              {/* End of all PDF routes */}
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  </UserProvider>
);

export default App;
