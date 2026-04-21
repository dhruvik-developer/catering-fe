import ApiInstance from "../services/ApiInstance";

// ----------------------------------------------------------------------
// ROLES
// ----------------------------------------------------------------------

export const getRoles = async () => {
  return await ApiInstance.get("/roles/");
};

export const createRole = async (data) => {
  return await ApiInstance.post("/roles/", data);
};

export const updateRole = async (id, data) => {
  return await ApiInstance.patch(`/roles/${id}/`, data);
};

// ----------------------------------------------------------------------
// STAFF
// ----------------------------------------------------------------------

export const getAllStaff = async (params = {}) => {
  return await ApiInstance.get("/staff/", { params });
};

export const getSingleStaff = async (id) => {
  return await ApiInstance.get(`/staff/${id}/`);
};

export const getWaiterTypes = async (params = {}) => {
  return await ApiInstance.get("/waiter-types/", { params });
};

export const getWaitersList = async (params = {}) => {
  return await ApiInstance.get("/staff/waiters/", { params });
};

export const createStaff = async (data) => {
  return await ApiInstance.post("/staff/", data);
};

export const updateStaff = async (id, data) => {
  return await ApiInstance.patch(`/staff/${id}/`, data);
};

export const deleteStaff = async (id) => {
  return await ApiInstance.delete(`/staff/${id}/`);
};

// ----------------------------------------------------------------------
// EVENT ASSIGNMENTS APIs
// ----------------------------------------------------------------------

export const getAllAssignments = async (params = {}) => {
  return await ApiInstance.get("/event-assignments/", { params });
};

export const getSingleAssignment = async (id) => {
  return await ApiInstance.get(`/event-assignments/${id}/`);
};

export const createAssignment = async (data) => {
  return await ApiInstance.post("/event-assignments/", data);
};

export const updateAssignment = async (id, data) => {
  return await ApiInstance.patch(`/event-assignments/${id}/`, data);
};

export const deleteAssignment = async (id) => {
  return await ApiInstance.delete(`/event-assignments/${id}/`);
};

// ----------------------------------------------------------------------
// REPORTS APIs
// ----------------------------------------------------------------------

export const getEventSummary = async (params = {}) => {
  return await ApiInstance.get("/event-assignments/event-summary/", {
    params,
  });
};

export const getAgencySummary = async (params = {}) => {
  return await ApiInstance.get(
    "/event-assignments/agency-summary/",
    {
      params,
    }
  );
};

// Waiter Type management
export const createWaiterType = async (data) => {
  return await ApiInstance.post("/waiter-types/", data);
};

export const updateWaiterType = async (id, data) => {
  return await ApiInstance.patch(`/waiter-types/${id}/`, data);
};

export const deleteWaiterType = async (id) => {
  return await ApiInstance.delete(`/waiter-types/${id}/`);
};

// ----------------------------------------------------------------------
// FIXED SALARY PAYMENTS APIs
// ----------------------------------------------------------------------

export const getFixedSalaryPayments = async (params = {}) => {
  return await ApiInstance.get("/fixed-salary-payments/", {
    params,
  });
};

export const createFixedSalaryPayment = async (data) => {
  return await ApiInstance.post("/fixed-salary-payments/", data);
};

export const updateFixedSalaryPayment = async (id, data) => {
  return await ApiInstance.patch(
    `/fixed-salary-payments/${id}/`,
    data
  );
};

export const deleteFixedSalaryPayment = async (id) => {
  return await ApiInstance.delete(`/fixed-salary-payments/${id}/`);
};

export const getFixedStaffPaymentSummary = async (staffId) => {
  return await ApiInstance.get(`/staff/${staffId}/fixed-payment-summary/`);
};

// ----------------------------------------------------------------------
// STAFF WITHDRAWALS APIs
// ----------------------------------------------------------------------

export const getStaffWithdrawals = async (params = {}) => {
  return await ApiInstance.get("/staff-withdrawals/", { params });
};

export const createStaffWithdrawal = async (data) => {
  return await ApiInstance.post("/staff-withdrawals/", data);
};

export const updateStaffWithdrawal = async (id, data) => {
  return await ApiInstance.patch(`/staff-withdrawals/${id}/`, data);
};

export const deleteStaffWithdrawal = async (id) => {
  return await ApiInstance.delete(`/staff-withdrawals/${id}/`);
};
