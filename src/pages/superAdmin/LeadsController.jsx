import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiInbox,
  FiSearch,
  FiTrash2,
  FiEye,
  FiX,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiClock,
  FiUser,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiTrendingUp,
  FiUserCheck,
  FiArchive,
} from "react-icons/fi";

import {
  fetchLeads,
  fetchLeadStats,
  fetchLeadById,
  updateLead,
  deleteLead,
} from "../../api/leads";
import { getApiMessage } from "../../utils/apiResponse";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

const STATUS_STYLES = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Leads",
    icon: FiInbox,
    accent: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  {
    key: "new",
    label: "New",
    icon: FiTrendingUp,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    key: "contacted",
    label: "Contacted",
    icon: FiUserCheck,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    key: "converted",
    label: "Converted",
    icon: FiCheckCircle,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "closed",
    label: "Closed",
    icon: FiArchive,
    accent: "bg-slate-100 text-slate-600",
  },
];

const PAGE_SIZE = 20;

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const useDebounced = (value, delay = 300) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const StatusBadge = ({ status }) => {
  const opt = STATUS_OPTIONS.find((o) => o.value === status);
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {opt?.label || status}
    </span>
  );
};

const LeadsTableSkeleton = () => (
  <div className="divide-y divide-[var(--app-border)]">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-3 w-1/4 rounded bg-gray-100" />
        </div>
        <div className="h-6 w-20 rounded-full bg-gray-100" />
        <div className="h-3 w-24 rounded bg-gray-100" />
      </div>
    ))}
  </div>
);

const LeadDetailModal = ({ lead, onClose, onSaved }) => {
  const [status, setStatus] = useState(lead?.status || "new");
  const [notes, setNotes] = useState(lead?.notes || "");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [current, setCurrent] = useState(lead);

  useEffect(() => {
    if (!lead?.id) return;
    setRefreshing(true);
    fetchLeadById(lead.id)
      .then((res) => {
        if (res?.data) {
          setCurrent(res.data);
          setStatus(res.data.status);
          setNotes(res.data.notes || "");
        }
      })
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }, [lead?.id]);

  if (!lead) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateLead(lead.id, { status, notes });
      if (res?.status) {
        toast.success("Lead updated.");
        onSaved?.(res.data);
        onClose();
      } else {
        toast.error(res?.message || "Could not update lead.");
      }
    } catch (err) {
      toast.error(getApiMessage(err, "Could not update lead."));
    } finally {
      setSaving(false);
    }
  };

  const view = current || lead;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-[var(--app-border)] shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 py-5 border-b border-[var(--app-border)] bg-white/95 backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {view.full_name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
              <FiClock size={12} />
              Received {formatDate(view.created_at)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {refreshing && (
            <div className="text-xs text-gray-400">Refreshing…</div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <DetailRow icon={FiMail} label="Email" value={view.email} />
            <DetailRow icon={FiPhone} label="Phone" value={view.phone || "—"} />
            <DetailRow
              icon={FiBriefcase}
              label="Company"
              value={view.company || "—"}
            />
            <DetailRow icon={FiUser} label="Source" value={view.source || "—"} />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Message
            </p>
            <div className="rounded-lg border border-[var(--app-border)] bg-[var(--color-primary-tint)]/40 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {view.message}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--app-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Internal Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Track follow-ups, calls, decisions…"
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--app-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-none"
            />
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 border-t border-[var(--app-border)] bg-white/95 backdrop-blur flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-[var(--color-primary)] text-white hover:brightness-95 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
      <Icon size={16} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ hasFilters, onClear }) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-20">
    <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-soft)] flex items-center justify-center mb-4">
      <FiInbox size={28} className="text-[var(--color-primary)]" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
      {hasFilters ? "No leads match your filters" : "No leads yet"}
    </h3>
    <p className="text-sm text-gray-500 max-w-sm">
      {hasFilters
        ? "Try changing the search or status filter."
        : "Once visitors submit the contact form on your marketing site, they'll appear here."}
    </p>
    {hasFilters && (
      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        Clear filters
      </button>
    )}
  </div>
);

function LeadsController() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: PAGE_SIZE,
    total: 0,
    total_pages: 0,
  });

  const [selectedLead, setSelectedLead] = useState(null);

  const debouncedSearch = useDebounced(search, 350);

  const loadStats = useCallback(() => {
    fetchLeadStats()
      .then((res) => {
        if (res?.status) setStats(res.data);
      })
      .catch(() => setStats(null));
  }, []);

  const loadLeads = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);
      try {
        const res = await fetchLeads({
          search: debouncedSearch,
          status: statusFilter,
          page,
          page_size: PAGE_SIZE,
        });
        if (res?.status) {
          setLeads(res.data?.results || []);
          setPagination(
            res.data?.pagination || {
              page,
              page_size: PAGE_SIZE,
              total: 0,
              total_pages: 0,
            }
          );
        } else {
          setError(res?.message || "Failed to load leads.");
        }
      } catch (err) {
        setError(getApiMessage(err, "Failed to load leads."));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debouncedSearch, statusFilter, page]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleDelete = async (lead) => {
    const result = await Swal.fire({
      title: `Delete lead from ${lead.full_name}?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete lead",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteLead(lead.id);
      toast.success("Lead deleted.");
      loadStats();
      loadLeads({ silent: true });
    } catch (err) {
      toast.error(getApiMessage(err, "Could not delete lead."));
    }
  };

  const handleQuickStatusChange = async (lead, nextStatus) => {
    if (lead.status === nextStatus) return;
    try {
      const res = await updateLead(lead.id, { status: nextStatus });
      if (res?.status) {
        toast.success("Status updated.");
        setLeads((prev) =>
          prev.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l))
        );
        loadStats();
      } else {
        toast.error(res?.message || "Could not update status.");
      }
    } catch (err) {
      toast.error(getApiMessage(err, "Could not update status."));
    }
  };

  const handleSaved = (updated) => {
    if (!updated) return;
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    loadStats();
  };

  const totalPages = pagination.total_pages || 1;
  const hasFilters = !!debouncedSearch || statusFilter !== "all";

  const startIdx = useMemo(
    () => (pagination.total ? (pagination.page - 1) * pagination.page_size + 1 : 0),
    [pagination]
  );
  const endIdx = useMemo(
    () =>
      Math.min(
        pagination.page * pagination.page_size,
        pagination.total || 0
      ),
    [pagination]
  );

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
              <FiInbox size={18} />
            </span>
            Leads
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Inquiries submitted from the public marketing site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            loadStats();
            loadLeads({ silent: true });
          }}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--app-border)] bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <FiRefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {STAT_CARDS.map(({ key, label, icon: Icon, accent }) => (
          <div
            key={key}
            className="rounded-xl bg-white border border-[var(--app-border)] p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {label}
              </p>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>
                <Icon size={15} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {stats ? stats[key] ?? 0 : "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white border border-[var(--app-border)] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[var(--app-border)]">
          <div className="relative flex-1 min-w-[220px]">
            <FiSearch
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, or company"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--app-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-[var(--app-border)] bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Table / states */}
        {loading ? (
          <LeadsTableSkeleton />
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-rose-600">{error}</div>
        ) : leads.length === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            onClear={() => {
              setSearch("");
              setStatusFilter("all");
            }}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/70">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Phone</th>
                    <th className="px-5 py-3 font-semibold">Company</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold text-sm flex items-center justify-center">
                            {(lead.full_name || "?").trim().charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium text-gray-900">
                            {lead.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-[var(--color-primary)]"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="hover:text-[var(--color-primary)]"
                          >
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">
                        {lead.company || (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleQuickStatusChange(lead, e.target.value)
                          }
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 ${
                            STATUS_STYLES[lead.status] ||
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                          title="View"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(lead)}
                          className="ml-1 inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[var(--app-border)]">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold flex items-center justify-center shrink-0">
                      {(lead.full_name || "?").trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {lead.full_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {lead.email}
                      </p>
                      {lead.company && (
                        <p className="text-xs text-gray-500 truncate">
                          {lead.company}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(lead.created_at)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(lead)}
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3.5 border-t border-[var(--app-border)] bg-gray-50/50">
                <p className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-gray-700">{startIdx}</span>
                  –<span className="font-semibold text-gray-700">{endIdx}</span> of{" "}
                  <span className="font-semibold text-gray-700">{pagination.total}</span>{" "}
                  leads
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[var(--app-border)] bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <FiChevronLeft size={15} />
                  </button>
                  <span className="px-3 text-xs font-medium text-gray-700">
                    Page {pagination.page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={pagination.page >= totalPages}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[var(--app-border)] bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <FiChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default LeadsController;
