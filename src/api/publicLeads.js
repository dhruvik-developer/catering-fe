import axios from "axios";

import { getApiBaseUrl } from "../services/tenantRuntime";

// Public website calls a public endpoint that does NOT require auth. We use a
// bare axios instance instead of ApiInstance so the request never carries a
// stale Bearer token and never triggers the 401 -> /login redirect.
const publicHttp = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

export const submitContactLead = async (payload) => {
  const response = await publicHttp.post("/public/contact/", payload);
  return response.data;
};
