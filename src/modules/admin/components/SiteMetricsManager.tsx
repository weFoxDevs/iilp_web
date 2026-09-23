import React, { useState, useEffect, useCallback } from "react";
import {
  fetchAdminMetrics,
  createAdminMetric,
  updateAdminMetric,
  deleteAdminMetric,
  SiteMetricItem,
} from "@/common/services/cms.service";
import { ToastType } from "@/common/components/Toast";
import ConfirmationModal from "./ConfirmationModal";

interface SiteMetricsManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

export function SiteMetricsManager({ token, onShowToast }: SiteMetricsManagerProps) {
  const [metrics, setMetrics] = useState<SiteMetricItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SiteMetricItem>>({
    label: "",
    value: "",
    suffix: "",
    sortOrder: 0,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [metricToDelete, setMetricToDelete] = useState<{ id: string; label: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminMetrics(token);
      setMetrics(data);
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to load metrics", "error");
    } finally {
      setIsLoading(false);
    }
  }, [token, onShowToast]);

  useEffect(() => {
    let active = true;
    fetchAdminMetrics(token)
      .then((data) => {
        if (active) setMetrics(data);
      })
      .catch((err: unknown) => {
        if (active) {
          onShowToast(err instanceof Error ? err.message : "Failed to load metrics", "error");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, onShowToast]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      label: "",
      value: "",
      suffix: "+",
      sortOrder: metrics.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: SiteMetricItem) => {
    setEditingId(m.id);
    setFormData({
      label: m.label,
      value: m.value,
      suffix: m.suffix || "",
      sortOrder: m.sortOrder,
      isActive: m.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label?.trim() || !formData.value?.trim()) {
      onShowToast("Label and Value are required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAdminMetric(token, editingId, formData);
        onShowToast("Impact metric updated successfully!", "success");
      } else {
        await createAdminMetric(token, formData);
        onShowToast("New impact metric created!", "success");
      }
      setIsModalOpen(false);
      loadMetrics();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to save metric", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!metricToDelete) return;

    setIsDeleting(true);
    try {
      await deleteAdminMetric(token, metricToDelete.id);
      onShowToast(`Metric '${metricToDelete.label}' deleted.`, "info");
      setMetricToDelete(null);
      loadMetrics();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to delete metric", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#101828]">Site Impact Metrics &amp; Counters</h2>
          <p className="text-xs text-[#4a5565] mt-1">
            Dynamic impact numbers powering animated counters on Home, About, and Fellowships pages.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#00bfff] hover:bg-[#00a6e0] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Metric
        </button>
      </div>

      {/* Metrics Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#00bfff] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium text-[#4a5565]">Loading site metrics...</p>
          </div>
        ) : metrics.length === 0 ? (
          <div className="p-12 text-center text-[#4a5565] text-xs">
            No metrics defined. Click &lsquo;Add New Metric&rsquo; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[11px] font-bold text-[#4a5565] uppercase tracking-wider">
                  <th className="px-6 py-3.5">Metric Label</th>
                  <th className="px-6 py-3.5">Display Value</th>
                  <th className="px-6 py-3.5">Suffix</th>
                  <th className="px-6 py-3.5">Sequence</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f7] text-xs text-[#101828]">
                {metrics.map((m) => (
                  <tr key={m.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#101828]">
                      {m.label}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#00698c] text-sm">
                      {m.value}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-[#4a5565]">
                      {m.suffix || "—"}
                    </td>
                    <td className="px-6 py-4 text-[#4a5565]">
                      {m.sortOrder}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          m.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {m.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="text-xs font-bold text-[#00698c] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setMetricToDelete({ id: m.id, label: m.label })}
                        className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-[#e5e7eb] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-[#101828]">
                  {editingId ? "Edit Impact Metric" : "Add New Metric"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Configure metric value, label, and display settings.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#98a2b3] hover:text-[#101828] text-lg font-bold cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto modal-scroll p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Metric Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.label || ""}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Global Scholars"
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.value || ""}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g. 120"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs font-mono text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Suffix Symbol
                  </label>
                  <input
                    type="text"
                    value={formData.suffix || ""}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    placeholder="e.g. + or %"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs font-mono text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder ?? 0}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828]"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#00bfff] rounded-sm focus:ring-[#00bfff]"
                  />
                  <span className="text-xs font-bold text-[#344054]">Active &amp; Visible</span>
                </label>
              </div>

              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e7eb] bg-[#fcfdff] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#4a5565] hover:bg-[#f3f4f6] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#00bfff] hover:bg-[#00a6e0] rounded-xl shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Metric"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!metricToDelete}
        title="Delete Metric"
        message={
          <>
            Are you sure you want to delete metric <strong className="text-gray-900 font-semibold">{metricToDelete?.label}</strong>? This action cannot be undone.
          </>
        }
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setMetricToDelete(null)}
      />
    </div>
  );
}
