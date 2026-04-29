/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  FiCode,
  FiEye,
  FiFileText,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

const getJsonError = (value) => {
  if (!String(value || "").trim()) return "";

  try {
    const parsed = JSON.parse(value);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      return "Sample data must be a JSON object.";
    }
    return "";
  } catch {
    return "Sample data JSON is invalid.";
  }
};

function PdfFormatterSettings({ manager }) {
  const {
    formatters,
    filters,
    form,
    selectedId,
    loading,
    saving,
    deletingId,
    previewHtml,
    previewLoading,
    onFilterChange,
    onSelect,
    onFormChange,
    onNew,
    onSave,
    onDelete,
    onPreview,
    onOpenHtml,
    onRefresh,
  } = manager;

  const sampleJsonError = useMemo(
    () => getJsonError(form.sample_data_text),
    [form.sample_data_text]
  );
  const isEditing = Boolean(form.id);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiFileText className="text-[var(--color-primary-text)]" size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">PDF Formats</h2>
            <p className="text-sm text-gray-400">
              Saved HTML templates for generated PDFs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all disabled:opacity-60"
          >
            <FiRefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={onNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)] hover:brightness-95 rounded-xl transition-all"
          >
            <FiPlus size={15} />
            New Format
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-5">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 space-y-3 bg-[var(--color-primary-soft)]/10 border-b border-gray-100">
            <div className="relative">
              <FiSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={onFilterChange}
                placeholder="Search"
                autoComplete="off"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-2">
              <input
                type="text"
                name="code"
                value={filters.code}
                onChange={onFilterChange}
                placeholder="Code"
                autoComplete="off"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
              <select
                name="is_active"
                value={filters.is_active}
                onChange={onFilterChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <select
                name="is_default"
                value={filters.is_default}
                onChange={onFilterChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">All Types</option>
                <option value="true">Default</option>
                <option value="false">Custom</option>
              </select>
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto p-2">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-400">
                Loading formats...
              </div>
            ) : formatters.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                No PDF formats found
              </div>
            ) : (
              formatters.map((formatter) => {
                const active = selectedId === formatter.id;
                return (
                  <button
                    type="button"
                    key={formatter.id}
                    onClick={() => onSelect(formatter)}
                    className={`w-full text-left p-3 rounded-xl border transition-all mb-2 ${
                      active
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]/35"
                        : "border-gray-100 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {formatter.name || "Untitled Format"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {formatter.code || "auto-code"}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        {formatter.is_default && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase">
                            Default
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            formatter.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {formatter.is_active ? "Active" : "Off"}
                        </span>
                      </div>
                    </div>
                    {formatter.description && (
                      <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                        {formatter.description}
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_420px] gap-5">
          <form
            onSubmit={onSave}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-100 bg-[var(--color-primary-soft)]/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FiCode className="text-[var(--color-primary)]" size={18} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                  {isEditing ? "Edit Format" : "Create Format"}
                </h3>
              </div>
              {isEditing && (
                <span className="text-xs font-semibold text-gray-400">
                  ID: {form.id}
                </span>
              )}
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onFormChange}
                    placeholder="Invoice Format"
                    autoComplete="off"
                    className="w-full p-3 border-2 border-[var(--color-primary-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] text-gray-800 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={onFormChange}
                    placeholder="invoice-format"
                    autoComplete="off"
                    className="w-full p-3 border-2 border-[var(--color-primary-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] text-gray-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={onFormChange}
                  placeholder="Default invoice PDF HTML format"
                  autoComplete="off"
                  className="w-full p-3 border-2 border-[var(--color-primary-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] text-gray-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">
                    Active
                  </span>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={onFormChange}
                    className="h-5 w-5 accent-[var(--color-primary)]"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">
                    Default
                  </span>
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={form.is_default}
                    onChange={onFormChange}
                    className="h-5 w-5 accent-[var(--color-primary)]"
                  />
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  HTML Content <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="html_content"
                  value={form.html_content}
                  onChange={onFormChange}
                  rows={13}
                  spellCheck={false}
                  placeholder="<html><body><h1>Invoice {{ invoice_number }}</h1></body></html>"
                  className="w-full p-3 border-2 border-[var(--color-primary-border)] rounded-xl bg-slate-950 focus:outline-none focus:border-[var(--color-primary)] text-slate-100 font-mono text-xs resize-y leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sample Data
                </label>
                <textarea
                  name="sample_data_text"
                  value={form.sample_data_text}
                  onChange={onFormChange}
                  rows={7}
                  spellCheck={false}
                  placeholder='{"invoice_number":"INV-001"}'
                  className={`w-full p-3 border-2 rounded-xl bg-white focus:outline-none font-mono text-xs resize-y leading-relaxed ${
                    sampleJsonError
                      ? "border-red-300 focus:border-red-400"
                      : "border-[var(--color-primary-border)] focus:border-[var(--color-primary)]"
                  }`}
                />
                {sampleJsonError && (
                  <p className="text-xs font-medium text-red-500">
                    {sampleJsonError}
                  </p>
                )}
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => onDelete(form.id)}
                    disabled={deletingId === form.id || saving}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-white hover:bg-red-50 rounded-xl border border-red-100 transition-all disabled:opacity-60"
                  >
                    <FiTrash2 size={15} />
                    {deletingId === form.id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPreview}
                  disabled={previewLoading || !form.html_content.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] bg-white hover:bg-[var(--color-primary-soft)]/40 rounded-xl border border-[var(--color-primary-border)] transition-all disabled:opacity-60"
                >
                  <FiEye size={15} />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={onOpenHtml}
                  disabled={previewLoading || !form.html_content.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all disabled:opacity-60"
                >
                  Open HTML
                </button>
                <button
                  type="submit"
                  disabled={saving || Boolean(sampleJsonError)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)] hover:brightness-95 rounded-xl transition-all disabled:opacity-60"
                >
                  <FiSave size={15} />
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden min-h-[520px]">
            <div className="px-5 py-4 border-b border-gray-100 bg-[var(--color-primary-soft)]/10 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Preview
              </h3>
              {previewLoading && (
                <span className="text-xs font-semibold text-gray-400">
                  Loading...
                </span>
              )}
            </div>
            <div className="h-[620px] bg-gray-100">
              {previewHtml ? (
                <iframe
                  title="PDF format preview"
                  srcDoc={previewHtml}
                  className="w-full h-full bg-white"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                  <FiFileText size={30} className="mb-2 opacity-50" />
                  Preview not loaded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PdfFormatterSettings;
