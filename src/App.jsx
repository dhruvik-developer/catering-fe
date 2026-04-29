import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";
import "./index.css";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./Components/layout/Layout";
import TenantsController from "./pages/tenancy/TenantsController";
import { UserProvider } from "./context/UserContext";
import { BASE_PATH } from "./utils/Config";
import { isPlatformAdminHost } from "./services/tenantRuntime";
import { getAllBusinessProfiles } from "./api/BusinessProfile";
import { setPrimaryColor, DEFAULT_PRIMARY_COLOR as DEFAULT_PRIMARY_FROM_STORE } from "./redux/themeSlice";
import usePermissions from "./hooks/usePermissions";
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

const DEFAULT_PRIMARY_COLOR = "#845cbd";

const PermissionRedirect = ({ options, fallback = "/login" }) => {
  const { hasPermission } = usePermissions();
  const target = options.find((option) =>
    hasPermission(option.permission)
  )?.to;

  return <Navigate to={target || fallback} replace />;
};

PermissionRedirect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      permission: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
    })
  ).isRequired,
  fallback: PropTypes.string,
};

const resolvePrimaryColor = (value) => {
  if (typeof value !== "string") return DEFAULT_PRIMARY_COLOR;

  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_PRIMARY_COLOR;

  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed;
  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) return `#${trimmed}`;

  return DEFAULT_PRIMARY_COLOR;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch the client's chosen primary color and hand it to Redux.
    // ThemeBridge then builds the MUI theme from it and also mirrors the value
    // to the --color-primary / --color-primary-contrast CSS custom properties
    // that Tailwind-based pages still depend on during the migration.
    const applyPrimaryColor = async () => {
      try {
        const response = await getAllBusinessProfiles();
        const profileList = Array.isArray(response?.data)
          ? response.data
          : response?.data
            ? [response.data]
            : [];

        const apiColorCode = profileList[0]?.color_code;
        const primaryColor = resolvePrimaryColor(apiColorCode);
        dispatch(setPrimaryColor(primaryColor));
      } catch {
        dispatch(setPrimaryColor(DEFAULT_PRIMARY_FROM_STORE));
      }
    };

    applyPrimaryColor();
  }, [dispatch]);

  return (
    <UserProvider>
      <Router basename={BASE_PATH}>
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '16px',
              background: 'var(--app-surface-strong)',
              color: '#1f2937',
              fontSize: '14px',
              fontWeight: '600',
              padding: '12px 20px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid var(--app-border)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-primary)',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            }
          }}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                {isPlatformAdminHost() ? (
                  <>
                    <Route path="/tenants" element={<TenantsController />} />
                    <Route path="/subscription-plans" element={<div>Subscription Plans Page</div>} />
                    <Route path="/" element={<Navigate to="/tenants" replace />} />
                  </>
                ) : (
                  <>
                    {/* All main routes */}
                    <Route path="/dish" element={<Dish />} />
                <Route path="/category" element={<Category />} />
                <Route path="/order-management" element={<OrderManagementPage />}>
                  <Route
                    index
                    element={
                      <PermissionRedirect
                        options={[
                          { to: "quotation", permission: "quotations.view" },
                          { to: "all-order", permission: "event_bookings.view" },
                          { to: "invoice", permission: "invoices.view" },
                          {
                            to: "event-summary",
                            permission: "event_summary.view",
                          },
                        ]}
                      />
                    }
                  />
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
                  <Route
                    index
                    element={
                      <PermissionRedirect
                        options={[
                          { to: "event-staff", permission: "eventstaff.view" },
                          { to: "vendor", permission: "vendors.view" },
                          { to: "waiter-types", permission: "eventstaff.view" },
                          { to: "permissions", permission: "*" },
                        ]}
                      />
                    }
                  />
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
                  </>
                )}
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Router>
    </UserProvider>
  );
};

export default App;
