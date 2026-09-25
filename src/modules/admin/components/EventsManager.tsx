import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  fetchAdminEvents,
  fetchAdminEventById,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
  fetchEventRegistrations,
  updateRegistrationStatus,
  downloadEventRegistrationsCsv,
  submitEventRegistration,
  ApiEvent,
  ApiEventVenue,
  ApiEventRegistration,
} from "@/common/services/events.service";
import { uploadMediaFile } from "@/common/services/cms.service";
import { ToastType } from "@/common/components/Toast";
import { useAuth } from "@/common/components/AuthContext";

interface EventsManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

const CATEGORIES = [
  { value: "CONFERENCE", label: "Conferences" },
  { value: "SEMINAR", label: "Seminars" },
  { value: "WORKSHOP", label: "Workshops" },
  { value: "WEBINAR", label: "Webinars" },
  { value: "POLICY_DIALOGUE", label: "Policy Dialogues" },
  { value: "SYMPOSIUM", label: "Symposia" },
  { value: "LECTURE", label: "Lectures" },
];

const MODES = [
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONLINE", label: "Online" },
  { value: "CAMPUS", label: "Campus" },
];

const STATUSES = [
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

interface EventFormData {
  title: string;
  slug: string;
  shortSummary: string;
  description: string;
  category: string;
  mode: 'HYBRID' | 'ONLINE' | 'CAMPUS';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  seatsCapacity: number;
  isRegistrationOpen: boolean;
  imageUrl: string;
  status: string;
  sortOrder: number;
  isHighlighted: boolean;
  venues: ApiEventVenue[];
}

const initialFormData: EventFormData = {
  title: "",
  slug: "",
  shortSummary: "",
  description: "",
  category: "CONFERENCE",
  mode: "HYBRID",
  startDate: "",
  endDate: "",
  startTime: "09:00 AM",
  endTime: "05:00 PM EST",
  seatsCapacity: 100,
  isRegistrationOpen: true,
  imageUrl: "/images/events/default-event.jpg",
  status: "PUBLISHED",
  sortOrder: 0,
  isHighlighted: false,
  venues: [{ name: "Main Campus Auditorium", type: "campus", address: "Dhaka, Bangladesh", capacity: 100 }],
};

export function EventsManager({ token, onShowToast }: EventsManagerProps) {
  const { hasPermission } = useAuth();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMode, setSelectedMode] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Create / Edit Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [eventFormData, setEventFormData] = useState<EventFormData>(initialFormData);

  // View Details Modal State (Read)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<ApiEvent | null>(null);

  // Attendee Roster Modal State
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [selectedEventForRoster, setSelectedEventForRoster] = useState<ApiEvent | null>(null);
  const [registrations, setRegistrations] = useState<ApiEventRegistration[]>([]);
  const [rosterFilterStatus, setRosterFilterStatus] = useState("ALL");
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);

  // Manual Add Attendee in Roster
  const [isAddingAttendee, setIsAddingAttendee] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    fullName: "",
    email: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    organization: "",
    country: "",
  });
  const [isSubmittingAttendee, setIsSubmittingAttendee] = useState(false);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      onShowToast("Banner image must be less than 25MB", "error");
      return;
    }

    setIsUploadingBanner(true);
    try {
      const res = await uploadMediaFile(token, file, "events");
      setEventFormData((prev) => ({
        ...prev,
        imageUrl: res.url,
      }));
      onShowToast("Event banner uploaded to Object Storage!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload banner";
      onShowToast(msg, "error");
    } finally {
      setIsUploadingBanner(false);
      e.target.value = "";
    }
  };

  // Summary Metrics
  const publishedCount = events.filter((e) => e.status === "PUBLISHED").length;
  const draftCount = events.filter((e) => e.status === "DRAFT").length;
  const totalAttendeesSum = events.reduce((acc, e) => acc + (e.totalRegistrations ?? e.seatsReserved ?? 0), 0);

  const onShowToastRef = useRef(onShowToast);
  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

  // Load events
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminEvents(token, {
        category: selectedCategory,
        mode: selectedMode,
        status: selectedStatus,
        search: searchQuery,
        page,
        limit,
      });
      setEvents(data.items || []);
      setTotalCount(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: unknown) {
      onShowToastRef.current(err instanceof Error ? err.message : "Failed to load events", "error");
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedCategory, selectedMode, selectedStatus, searchQuery, page, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvents();
  }, [loadEvents]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingEventId(null);
    setEventFormData({
      ...initialFormData,
      startDate: new Date().toISOString().split("T")[0],
      venues: [{ name: "Main Campus Auditorium", type: "campus", address: "Dhaka, Bangladesh", capacity: 100 }],
    });
    setIsEventModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = async (item: ApiEvent) => {
    setEditingEventId(item.id);
    try {
      // Fetch full details
      const detail = await fetchAdminEventById(token, item.id);
      const rawMode = (detail.mode || "HYBRID").toUpperCase();
      const normalizedMode: 'HYBRID' | 'ONLINE' | 'CAMPUS' =
        rawMode === "ONLINE" ? "ONLINE" : rawMode === "CAMPUS" || rawMode === "ONSITE" ? "CAMPUS" : "HYBRID";
      const rawCat = (detail.category || "CONFERENCE").toUpperCase().replace(/S$/, '');

      setEventFormData({
        title: detail.title,
        slug: detail.slug,
        shortSummary: detail.shortSummary || "",
        description: detail.description,
        category: rawCat,
        mode: normalizedMode,
        startDate: detail.startDate ? detail.startDate.split("T")[0] : "",
        endDate: detail.endDate ? detail.endDate.split("T")[0] : "",
        startTime: detail.startTime || "",
        endTime: detail.endTime || "",
        seatsCapacity: detail.seatsCapacity || 0,
        isRegistrationOpen: detail.isRegistrationOpen ?? true,
        imageUrl: detail.imageUrl || detail.bannerImage || "/images/events/default-event.jpg",
        status: detail.status || "PUBLISHED",
        sortOrder: detail.sortOrder || 0,
        isHighlighted: Boolean(detail.isHighlighted),
        venues:
          detail.venues && detail.venues.length > 0
            ? detail.venues.map((v) => ({
                id: v.id,
                name: v.name,
                type: v.type,
                address: v.address || "",
                capacity: v.capacity || 0,
                onlineUrl: v.onlineUrl || "",
              }))
            : [{ name: "Main Auditorium", type: "campus", address: "", capacity: 50 }],
      });
      setIsEventModalOpen(true);
    } catch {
      onShowToast("Failed to fetch event details for editing", "error");
    }
  };

  // Open View Details Modal (Read)
  const handleOpenViewModal = (item: ApiEvent) => {
    setViewingEvent(item);
    setIsDetailModalOpen(true);
  };

  // Quick Highlight Toggle (Featured star directly from table)
  const handleToggleHighlight = async (item: ApiEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedValue = !item.isHighlighted;
      await updateAdminEvent(token, item.id, { isHighlighted: updatedValue } as any);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === item.id ? { ...ev, isHighlighted: updatedValue } : ev))
      );
      onShowToast(
        updatedValue ? `Event '${item.title}' marked as featured` : `Featured status removed`,
        "success"
      );
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to toggle highlight", "error");
    }
  };

  // Quick Status Change directly from table
  const handleQuickStatusChange = async (item: ApiEvent, newStatus: string) => {
    try {
      await updateAdminEvent(token, item.id, { status: newStatus } as any);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === item.id ? { ...ev, status: newStatus } : ev))
      );
      onShowToast(`Event status updated to ${newStatus}`, "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to update status", "error");
    }
  };

  // Quick Registration Open Toggle directly from table
  const handleQuickRegistrationToggle = async (item: ApiEvent) => {
    try {
      const nextVal = !item.isRegistrationOpen;
      await updateAdminEvent(token, item.id, { isRegistrationOpen: nextVal } as any);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === item.id ? { ...ev, isRegistrationOpen: nextVal } : ev))
      );
      onShowToast(
        nextVal ? `Registrations opened for '${item.title}'` : `Registrations closed for '${item.title}'`,
        "success"
      );
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to toggle registration", "error");
    }
  };

  // Handle Event Form Submit (Create or Update)
  const handleSubmitEventForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEvent(true);
    try {
      const payload = {
        ...eventFormData,
        bannerImage: eventFormData.imageUrl,
      };

      if (editingEventId) {
        await updateAdminEvent(token, editingEventId, payload as any);
        onShowToast("Event successfully updated", "success");
      } else {
        await createAdminEvent(token, payload as any);
        onShowToast("Event successfully created", "success");
      }
      setIsEventModalOpen(false);
      loadEvents();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to save event", "error");
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  // Delete Event Modal Open
  const handleOpenDeleteModal = (ev: ApiEvent) => {
    setEventToDelete({ id: ev.id, title: ev.title });
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeletingEvent(true);
    try {
      await deleteAdminEvent(token, eventToDelete.id);
      onShowToast(`Event "${eventToDelete.title}" deleted successfully`, "success");
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      loadEvents();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to delete event", "error");
    } finally {
      setIsDeletingEvent(false);
    }
  };

  // Venue management inside modal
  const handleAddVenue = () => {
    setEventFormData((prev) => ({
      ...prev,
      venues: [...prev.venues, { name: "", type: "campus", address: "", capacity: 50 }],
    }));
  };

  const handleRemoveVenue = (index: number) => {
    setEventFormData((prev) => ({
      ...prev,
      venues: prev.venues.filter((_, i) => i !== index),
    }));
  };

  const handleVenueChange = (index: number, field: keyof ApiEventVenue, value: any) => {
    setEventFormData((prev) => {
      const updated = [...prev.venues];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, venues: updated };
    });
  };

  // Open Attendee Roster Modal
  const handleOpenRoster = async (item: ApiEvent) => {
    setSelectedEventForRoster(item);
    setIsRosterModalOpen(true);
    setIsLoadingRoster(true);
    setRosterFilterStatus("ALL");
    setIsAddingAttendee(false);
    try {
      const data = await fetchEventRegistrations(token, item.id);
      const list = Array.isArray(data) ? data : (data as any)?.registrations || [];
      setRegistrations(list);
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to load attendees", "error");
    } finally {
      setIsLoadingRoster(false);
    }
  };

  // Update Status in Roster
  const handleStatusChange = async (
    registrationId: string,
    newStatus: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED'
  ) => {
    try {
      await updateRegistrationStatus(token, registrationId, newStatus);
      onShowToast(`Attendee status updated to ${newStatus}`, "success");
      if (selectedEventForRoster) {
        const refreshed = await fetchEventRegistrations(token, selectedEventForRoster.id, rosterFilterStatus);
        const list = Array.isArray(refreshed) ? refreshed : (refreshed as any)?.registrations || [];
        setRegistrations(list);
        loadEvents();
      }
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to update status", "error");
    }
  };

  // Manual Add Attendee Submission
  const handleManualAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForRoster) return;
    setIsSubmittingAttendee(true);
    try {
      const res = await submitEventRegistration(selectedEventForRoster.id, newAttendee as any);
      if (res.success) {
        onShowToast("Attendee successfully registered", "success");
        setNewAttendee({
          fullName: "",
          email: "",
          phoneCountryCode: "+1",
          phoneNumber: "",
          organization: "",
          country: "",
        });
        setIsAddingAttendee(false);
        const refreshed = await fetchEventRegistrations(token, selectedEventForRoster.id, rosterFilterStatus);
        const list = Array.isArray(refreshed) ? refreshed : (refreshed as any)?.registrations || [];
        setRegistrations(list);
        loadEvents();
      } else {
        onShowToast(res.message || "Registration failed", "error");
      }
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Error registering attendee", "error");
    } finally {
      setIsSubmittingAttendee(false);
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    if (!selectedEventForRoster) return;
    try {
      await downloadEventRegistrationsCsv(token, selectedEventForRoster.id, selectedEventForRoster.title);
      onShowToast("Attendee roster exported successfully", "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "CSV export failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header with Key Stats */}
      <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f9ff] border border-[#b0ebff] text-[#00698c] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00bfff] animate-pulse"></span>
            Institutional Events Management
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#000080]">
            Events &amp; Symposia Manager
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Create, manage, and publish academic conferences, seminars, and webinars. Configure multi-venues, track attendance quotas, and export rosters.
          </p>
        </div>

        {/* Action Button */}
        {hasPermission("event:create") && (
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#000080] hover:bg-[#00698c] text-white text-xs font-bold shadow-md shadow-sky-900/15 transition-all cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Event
          </button>
        )}
      </div>

      {/* Mini Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#b0ebff] p-4 rounded-xl shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-lg bg-[#e6f9ff] text-[#00698c] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Events</span>
            <div className="text-xl font-bold text-[#000080]">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white border border-[#b0ebff] p-4 rounded-xl shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Published</span>
            <div className="text-xl font-bold text-emerald-600">{publishedCount}</div>
          </div>
        </div>

        <div className="bg-white border border-[#b0ebff] p-4 rounded-xl shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Drafts</span>
            <div className="text-xl font-bold text-amber-600">{draftCount}</div>
          </div>
        </div>

        <div className="bg-white border border-[#b0ebff] p-4 rounded-xl shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-lg bg-sky-50 text-[#00bfff] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Attendees</span>
            <div className="text-xl font-bold text-[#00698c]">{totalAttendeesSum}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#b0ebff] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search event title or slug..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Mode Filter */}
          <select
            value={selectedMode}
            onChange={(e) => {
              setSelectedMode(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 cursor-pointer"
          >
            <option value="ALL">All Modes</option>
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {(searchQuery || selectedCategory !== "All" || selectedMode !== "ALL" || selectedStatus !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedMode("ALL");
                setSelectedStatus("ALL");
                setPage(1);
              }}
              className="px-3 py-2 text-xs text-red-600 hover:text-red-700 font-bold hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Events Table View */}
      <div className="bg-white border border-[#b0ebff] rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#00bfff] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500">Loading events directory...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
            <div className="size-16 rounded-full bg-[#e6f9ff] text-[#00698c] flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 text-base">No Events Found</h3>
            <p className="text-xs text-gray-500 max-w-md leading-relaxed">
              No events matched your current search filters. You can clear filters or click &apos;Create New Event&apos; to schedule a symposium or conference.
            </p>
            {hasPermission("event:create") && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-2 px-4 py-2 rounded-xl bg-[#000080] text-white text-xs font-bold hover:bg-[#00698c] transition-colors cursor-pointer"
              >
                Create New Event
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#e6f9ff]/50 border-b border-[#b0ebff] text-[#00698c] font-bold uppercase tracking-wider">
                  <th className="p-4">Event Details</th>
                  <th className="p-4">Category &amp; Mode</th>
                  <th className="p-4">Dates &amp; Schedule</th>
                  <th className="p-4">Assigned Venues</th>
                  <th className="p-4">Seat Quota</th>
                  <th className="p-4">Status &amp; Open</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((ev) => {
                  const registeredCount = ev.totalRegistrations ?? ev.seatsReserved ?? 0;
                  const seatsLeft = Math.max(0, (ev.seatsCapacity || 0) - registeredCount);
                  const percentReserved =
                    ev.seatsCapacity > 0 ? Math.min(100, Math.round((registeredCount / ev.seatsCapacity) * 100)) : 0;
                  const isFull = ev.seatsCapacity > 0 && registeredCount >= ev.seatsCapacity;

                  return (
                    <tr key={ev.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Event Details */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Banner Preview Thumbnail */}
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative">
                            {ev.imageUrl || ev.bannerImage ? (
                              <img
                                src={ev.imageUrl || ev.bannerImage || ""}
                                alt={ev.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              {/* Star Feature Toggle */}
                              <button
                                onClick={(e) => handleToggleHighlight(ev, e)}
                                title={ev.isHighlighted ? "Featured event (Click to unfeature)" : "Click to mark as featured"}
                                className={`text-base leading-none transition-transform hover:scale-125 cursor-pointer ${
                                  ev.isHighlighted ? "text-amber-400" : "text-gray-300 hover:text-amber-300"
                                }`}
                              >
                                ★
                              </button>

                              <span className="font-bold text-gray-900 text-sm truncate" title={ev.title}>
                                {ev.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-mono text-gray-400 truncate">
                                /{ev.slug}
                              </span>
                              <Link
                                href={`/events/${ev.slug || ev.id}`}
                                target="_blank"
                                className="text-[10px] text-sky-600 hover:underline flex items-center gap-0.5"
                                title="View public page"
                              >
                                <span>Preview</span>
                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Mode */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]">
                            {ev.category}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                ev.mode === "HYBRID" ? "bg-purple-500" : ev.mode === "ONLINE" ? "bg-sky-500" : "bg-emerald-500"
                              }`}
                            />
                            {ev.mode}
                          </span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="p-4">
                        <div className="flex flex-col text-xs text-gray-800">
                          <span className="font-bold">
                            {ev.startDate}
                            {ev.endDate && ev.endDate !== ev.startDate && ` · ${ev.endDate}`}
                          </span>
                          <span className="text-[11px] text-gray-500">{ev.startTime}</span>
                        </div>
                      </td>

                      {/* Venues */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 max-w-[170px]">
                          {ev.venues && ev.venues.length > 0 ? (
                            ev.venues.map((v, i) => (
                              <span
                                key={i}
                                className="text-[11px] text-gray-700 truncate flex items-center gap-1.5"
                                title={`${v.name} (${v.type})`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    v.type === "online" ? "bg-sky-400" : "bg-emerald-500"
                                  }`}
                                />
                                <span className="truncate">{v.name}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-gray-400 italic">No venues assigned</span>
                          )}
                        </div>
                      </td>

                      {/* Capacity & Registrations Progress */}
                      <td className="p-4">
                        <div
                          onClick={() => handleOpenRoster(ev)}
                          title="Click to view attendee roster"
                          className="flex flex-col gap-1.5 w-32 cursor-pointer group hover:opacity-85 transition-opacity"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-gray-900 group-hover:text-[#00698c] transition-colors">
                              {registeredCount} registered
                            </span>
                            <span className="text-gray-400">
                              / {ev.seatsCapacity > 0 ? ev.seatsCapacity : "∞"}
                            </span>
                          </div>

                          {ev.seatsCapacity > 0 && (
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isFull ? "bg-red-500" : percentReserved > 75 ? "bg-amber-500" : "bg-[#00bfff]"
                                }`}
                                style={{ width: `${percentReserved}%` }}
                              />
                            </div>
                          )}

                          <span
                            className={`text-[10px] font-semibold ${
                              isFull ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            {isFull ? "Sold Out" : ev.seatsCapacity > 0 ? `${seatsLeft} left` : "Open"}
                          </span>
                        </div>
                      </td>

                      {/* Status & Quick Toggle */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5">
                          {/* Quick Status Dropdown */}
                          <select
                            value={ev.status}
                            onChange={(e) => handleQuickStatusChange(ev, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${
                              ev.status === "PUBLISHED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : ev.status === "ARCHIVED"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="DRAFT">DRAFT</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                          </select>

                          {/* Quick Open/Close Toggle */}
                          <button
                            type="button"
                            onClick={() => handleQuickRegistrationToggle(ev)}
                            className={`text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${
                              ev.isRegistrationOpen ? "text-sky-600 hover:text-sky-800" : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${ev.isRegistrationOpen ? "bg-sky-500" : "bg-gray-300"}`} />
                            {ev.isRegistrationOpen ? "Reg Open" : "Reg Closed"}
                          </button>
                        </div>
                      </td>

                      {/* Table Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Event Detail Button (Read) */}
                          <button
                            onClick={() => handleOpenViewModal(ev)}
                            title="Preview event details"
                            className="p-1.5 rounded-lg bg-sky-50 text-[#00698c] hover:bg-[#b0ebff] transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Attendees Roster Button */}
                          <button
                            onClick={() => handleOpenRoster(ev)}
                            title="View attendee registrations"
                            className="px-2.5 py-1.5 rounded-lg bg-[#e6f9ff] text-[#00698c] hover:bg-[#b0ebff] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Attendees ({registeredCount})</span>
                          </button>

                          {/* Edit Button */}
                          {hasPermission("event:update") && (
                            <button
                              onClick={() => handleOpenEditModal(ev)}
                              title="Edit event details"
                              className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}

                          {/* Delete Button */}
                          {hasPermission("event:delete") && (
                            <button
                              onClick={() => handleOpenDeleteModal(ev)}
                              title="Delete event"
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Navigation Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#b0ebff] bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-gray-500 font-medium">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} events
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-gray-700 cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`size-8 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                    page === num
                      ? "bg-[#000080] text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-gray-700 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. VIEW EVENT DETAIL PREVIEW MODAL (READ)                                 */}
      {/* ========================================================================= */}
      {isDetailModalOpen && viewingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Image Area */}
            <div className="relative h-44 w-full bg-gradient-to-br from-[#000080] to-[#00698c] overflow-hidden">
              {viewingEvent.imageUrl || viewingEvent.bannerImage ? (
                <img
                  src={viewingEvent.imageUrl || viewingEvent.bannerImage || ""}
                  alt={viewingEvent.title}
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  No Image Available
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-white/20 text-white backdrop-blur-xs">
                      {viewingEvent.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-[#00bfff] text-white">
                      {viewingEvent.mode}
                    </span>
                    {viewingEvent.isHighlighted && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="size-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-serif font-bold text-2xl text-white line-clamp-2">
                  {viewingEvent.title}
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700 modal-scroll">
              {/* Short summary if available */}
              {viewingEvent.shortSummary && (
                <div className="p-3 bg-[#e6f9ff] border border-[#b0ebff] rounded-xl text-[#00698c] font-medium leading-relaxed">
                  {viewingEvent.shortSummary}
                </div>
              )}

              {/* Grid Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">Date</span>
                  <div className="font-bold text-gray-900 mt-0.5">{viewingEvent.startDate?.split("T")[0]}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">Time</span>
                  <div className="font-bold text-gray-900 mt-0.5">{viewingEvent.startTime}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">Capacity</span>
                  <div className="font-bold text-gray-900 mt-0.5">
                    {viewingEvent.totalRegistrations ?? viewingEvent.seatsReserved ?? 0} / {viewingEvent.seatsCapacity || "∞"} seats
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">Registration</span>
                  <div className={`font-bold mt-0.5 ${viewingEvent.isRegistrationOpen ? "text-emerald-600" : "text-gray-400"}`}>
                    {viewingEvent.isRegistrationOpen ? "Open" : "Closed"}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2">
                  Description &amp; Agenda
                </h4>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {viewingEvent.description}
                </p>
              </div>

              {/* Assigned Venues */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2">
                  Assigned Venues ({viewingEvent.venues?.length || 0})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {viewingEvent.venues?.map((v, i) => (
                    <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">{v.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white border border-gray-200 text-gray-600">
                          {v.type}
                        </span>
                      </div>
                      {v.address && <div className="text-[11px] text-gray-500">📍 {v.address}</div>}
                      {v.onlineUrl && (
                        <a
                          href={v.onlineUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#00bfff] hover:underline block truncate"
                        >
                          🔗 {v.onlineUrl}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <Link
                href={`/events/${viewingEvent.slug || viewingEvent.id}`}
                target="_blank"
                className="text-xs font-bold text-[#00698c] hover:underline flex items-center gap-1"
              >
                <span>View Public Page</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenRoster(viewingEvent);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#e6f9ff] text-[#00698c] hover:bg-[#b0ebff] text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>View Attendees ({viewingEvent.totalRegistrations ?? viewingEvent.seatsReserved ?? 0})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenEditModal(viewingEvent);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#000080] hover:bg-[#00698c] text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Edit Event
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATE / EDIT EVENT MODAL                                              */}
      {/* ========================================================================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            style={{ colorScheme: "light" }}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#fcfdff] shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#000080]">
                  {editingEventId ? "Edit Event" : "Create New Event"}
                </h3>
                <p className="text-xs text-gray-500">
                  Fill in all event details, schedule dates, quota, and configure multi-venues.
                </p>
              </div>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form Container */}
            <form
              onSubmit={handleSubmitEventForm}
              className="flex flex-col flex-1 min-h-0 overflow-hidden"
              style={{ colorScheme: "light" }}
            >
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs modal-scroll">
                {/* Basic Details Section */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#00698c] uppercase tracking-wider text-[11px] border-b border-gray-100 pb-1">
                    1. Basic Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">
                        Event Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Annual Symposium on International Law"
                        value={eventFormData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setEventFormData((prev) => ({
                            ...prev,
                            title,
                            slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                          }));
                        }}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">
                        Slug (URL Identifier) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="annual-symposium-2026"
                        value={eventFormData.slug}
                        onChange={(e) => setEventFormData({ ...eventFormData, slug: e.target.value })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">Category</label>
                      <select
                        value={eventFormData.category}
                        onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 cursor-pointer transition-all"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">Delivery Mode</label>
                      <select
                        value={eventFormData.mode}
                        onChange={(e) => setEventFormData({ ...eventFormData, mode: e.target.value as any })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 cursor-pointer transition-all"
                      >
                        {MODES.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">Status</label>
                      <select
                        value={eventFormData.status}
                        onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 cursor-pointer transition-all"
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Short Summary */}
                  <div>
                    <label className="block font-bold text-gray-800 mb-1.5">
                      Short Summary (1-2 sentences for preview cards)
                    </label>
                    <input
                      type="text"
                      maxLength={500}
                      placeholder="Brief 1-2 sentence overview for cards..."
                      value={eventFormData.shortSummary}
                      onChange={(e) => setEventFormData({ ...eventFormData, shortSummary: e.target.value })}
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block font-bold text-gray-800 mb-1.5">
                      Full Description / Agenda <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Provide full details of the event, keynotes, topics, and objectives..."
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 resize-y transition-all"
                    />
                  </div>

                  {/* Media Image URL + Live Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block font-bold text-gray-800">Banner Image</label>
                        {eventFormData.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setEventFormData({ ...eventFormData, imageUrl: "" })}
                            className="text-[11px] font-medium text-red-500 hover:text-red-700"
                          >
                            Clear image
                          </button>
                        )}
                      </div>
                      <div className="mb-2">
                        <label
                          className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-dashed text-xs font-medium cursor-pointer transition-all ${
                            isUploadingBanner
                              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                              : "bg-white border-[#00bfff] text-[#008cb3] hover:bg-[#f0f9ff]"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                          <span>
                            {isUploadingBanner
                              ? "Uploading to MinIO / S3..."
                              : "Upload Banner Image (MinIO / S3)"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingBanner}
                            onChange={handleBannerUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="http://localhost:9000/iilp-media/... or /images/..."
                        value={eventFormData.imageUrl}
                        onChange={(e) => setEventFormData({ ...eventFormData, imageUrl: e.target.value })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                      />

                      <div className="flex items-center gap-6 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={eventFormData.isHighlighted}
                            onChange={(e) => setEventFormData({ ...eventFormData, isHighlighted: e.target.checked })}
                            className="size-4 rounded accent-[#00bfff] cursor-pointer"
                          />
                          <span className="font-bold text-gray-800">Featured / Popular</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={eventFormData.isRegistrationOpen}
                            onChange={(e) => setEventFormData({ ...eventFormData, isRegistrationOpen: e.target.checked })}
                            className="size-4 rounded accent-[#00bfff] cursor-pointer"
                          />
                          <span className="font-bold text-gray-800">Registration Open</span>
                        </label>
                      </div>
                    </div>

                    {/* Thumbnail Image Live Preview Box */}
                    <div className="p-3 bg-[#f8fafc] border border-gray-200 rounded-xl flex items-center gap-3">
                      <div className="size-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative border border-gray-300">
                        {eventFormData.imageUrl ? (
                          <img
                            src={eventFormData.imageUrl}
                            alt="Banner Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        <span className="font-bold text-gray-800 block mb-0.5">Image Preview</span>
                        Displays on public calendar and single event hero banner.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule & Capacity Section */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#00698c] uppercase tracking-wider text-[11px] border-b border-gray-100 pb-1">
                    2. Schedule &amp; Capacity
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={eventFormData.startDate}
                        onChange={(e) => setEventFormData({ ...eventFormData, startDate: e.target.value })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 cursor-pointer transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">End Date (Optional)</label>
                      <input
                        type="date"
                        value={eventFormData.endDate}
                        onChange={(e) => setEventFormData({ ...eventFormData, endDate: e.target.value })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 cursor-pointer transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="09:00 AM"
                        value={eventFormData.startTime}
                        onChange={(e) => setEventFormData({ ...eventFormData, startTime: e.target.value })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">End Time</label>
                      <input
                        type="text"
                        placeholder="05:00 PM EST"
                        value={eventFormData.endTime}
                        onChange={(e) => setEventFormData({ ...eventFormData, endTime: e.target.value })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">
                        Total Seat Quota (0 = Unlimited)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={eventFormData.seatsCapacity}
                        onChange={(e) => setEventFormData({ ...eventFormData, seatsCapacity: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Multi-Venue Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                    <h4 className="font-bold text-[#00698c] uppercase tracking-wider text-[11px]">
                      3. Venues Configuration ({eventFormData.venues.length})
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddVenue}
                      className="text-[#00698c] hover:text-[#000080] font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:underline"
                    >
                      <span>+ Add Another Venue</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {eventFormData.venues.map((venue, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-[#f8fafc] border border-gray-200 rounded-2xl space-y-3 relative shadow-xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                          <span className="font-bold text-gray-800 text-xs flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#00bfff]"></span>
                            Venue #{idx + 1}
                          </span>
                          {eventFormData.venues.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVenue(idx)}
                              className="text-red-500 hover:text-red-700 text-xs cursor-pointer font-bold flex items-center gap-1 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove Venue
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Venue Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Main Auditorium / Zoom Hall"
                              value={venue.name}
                              onChange={(e) => handleVenueChange(idx, "name", e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3 py-2 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Venue Type
                            </label>
                            <select
                              value={venue.type}
                              onChange={(e) => handleVenueChange(idx, "type", e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 cursor-pointer transition-all"
                            >
                              <option value="campus">On-Campus / Physical</option>
                              <option value="online">Online / Virtual</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Room Capacity (Optional)
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 150"
                              value={venue.capacity || ""}
                              onChange={(e) => handleVenueChange(idx, "capacity", parseInt(e.target.value) || 0)}
                              className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3 py-2 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Physical Address / Room Location
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Level 4, Academic Building, Dhaka"
                              value={venue.address || ""}
                              onChange={(e) => handleVenueChange(idx, "address", e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3 py-2 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Virtual Meeting Link / Stream URL
                            </label>
                            <input
                              type="text"
                              placeholder="https://zoom.us/j/... or Microsoft Teams link"
                              value={venue.onlineUrl || ""}
                              onChange={(e) => handleVenueChange(idx, "onlineUrl", e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-3 py-2 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-[#fcfdff] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-5 py-2.5 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingEvent}
                  className="px-6 py-2.5 text-xs text-white bg-[#000080] hover:bg-[#00698c] disabled:opacity-50 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
                >
                  {isSubmittingEvent && (
                    <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {editingEventId ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ATTENDEE ROSTER MODAL (WITH ATTENDEE CRUD & MANUAL REGISTRATION)       */}
      {/* ========================================================================= */}
      {isRosterModalOpen && selectedEventForRoster && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            style={{ colorScheme: "light" }}
          >
            {/* Roster Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#fcfdff]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-[#000080]">
                    Attendee Roster
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]">
                    {(Array.isArray(registrations) ? registrations.length : 0)} registered
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedEventForRoster.title}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Manual Add Attendee Toggle */}
                {hasPermission("event:create") && (
                  <button
                    onClick={() => setIsAddingAttendee(!isAddingAttendee)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#000080] hover:bg-[#00698c] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {isAddingAttendee ? "Hide Form" : "Add Attendee"}
                  </button>
                )}

                {/* Export CSV */}
                {hasPermission("event:export") && (
                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                )}

                <button
                  onClick={() => setIsRosterModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Manual Add Attendee Form (In-Modal) */}
            {isAddingAttendee && (
              <form
                onSubmit={handleManualAddAttendee}
                className="p-4 bg-sky-50/50 border-b border-[#b0ebff] text-xs space-y-3"
              >
                <div className="font-bold text-[#00698c] flex items-center justify-between">
                  <span>Register Attendee Manually</span>
                  <span className="text-[11px] font-normal text-gray-500">Walk-in, VIP, or offline registration</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={newAttendee.fullName}
                    onChange={(e) => setNewAttendee({ ...newAttendee, fullName: e.target.value })}
                    className="px-3 py-1.5 bg-white text-gray-900 border border-gray-300 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={newAttendee.email}
                    onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                    className="px-3 py-1.5 bg-white text-gray-900 border border-gray-300 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff]"
                  />
                  <input
                    type="text"
                    placeholder="Organization / University"
                    value={newAttendee.organization}
                    onChange={(e) => setNewAttendee({ ...newAttendee, organization: e.target.value })}
                    className="px-3 py-1.5 bg-white text-gray-900 border border-gray-300 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="+1"
                      value={newAttendee.phoneCountryCode}
                      onChange={(e) => setNewAttendee({ ...newAttendee, phoneCountryCode: e.target.value })}
                      className="w-16 px-2 py-1.5 bg-white text-gray-900 border border-gray-300 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff]"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={newAttendee.phoneNumber}
                      onChange={(e) => setNewAttendee({ ...newAttendee, phoneNumber: e.target.value })}
                      className="flex-1 px-3 py-1.5 bg-white text-gray-900 border border-gray-300 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff]"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Country"
                    value={newAttendee.country}
                    onChange={(e) => setNewAttendee({ ...newAttendee, country: e.target.value })}
                    className="px-3 py-1.5 bg-white text-gray-900 border border-gray-300 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#00bfff]"
                  />

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAttendee(false)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingAttendee}
                      className="px-4 py-1.5 bg-[#000080] hover:bg-[#00698c] disabled:opacity-50 text-white rounded-lg font-bold cursor-pointer"
                    >
                      {isSubmittingAttendee ? "Saving..." : "Save Attendee"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Roster Filter Bar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">
                Capacity: <strong>{selectedEventForRoster.totalRegistrations ?? selectedEventForRoster.seatsReserved ?? 0}</strong> of{" "}
                <strong>{selectedEventForRoster.seatsCapacity || "Unlimited"}</strong> seats reserved
              </span>

              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-bold">Filter Status:</label>
                <select
                  value={rosterFilterStatus}
                  onChange={async (e) => {
                    const status = e.target.value;
                    setRosterFilterStatus(status);
                    setIsLoadingRoster(true);
                    try {
                      const data = await fetchEventRegistrations(token, selectedEventForRoster.id, status);
                      const list = Array.isArray(data) ? data : (data as any)?.registrations || [];
                      setRegistrations(list);
                    } catch (err: unknown) {
                      onShowToast(err instanceof Error ? err.message : "Filter failed", "error");
                    } finally {
                      setIsLoadingRoster(false);
                    }
                  }}
                  className="px-2.5 py-1 bg-white text-gray-900 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="WAITLISTED">Waitlisted</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Attendees Table */}
            {(() => {
              const attendeeList = Array.isArray(registrations) ? registrations : [];
              return (
                <div className="overflow-y-auto flex-1 modal-scroll">
                  {isLoadingRoster ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-2">
                      <div className="size-6 border-2 border-[#00bfff] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-gray-500">Loading attendee roster...</span>
                    </div>
                  ) : attendeeList.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 text-xs">
                      No registrations found for this event under the selected filter.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                          <th className="p-3.5">Attendee Name</th>
                          <th className="p-3.5">Contact Email &amp; Phone</th>
                          <th className="p-3.5">Organization</th>
                          <th className="p-3.5">Country</th>
                          <th className="p-3.5">Registered At</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {attendeeList.map((reg) => (
                          <tr key={reg.id} className="hover:bg-gray-50/70">
                        <td className="p-3.5 font-bold text-gray-900">
                          {reg.fullName}
                        </td>
                        <td className="p-3.5">
                          <div className="text-gray-800">{reg.email}</div>
                          {reg.phoneNumber && (
                            <div className="text-[11px] text-gray-400">
                              {reg.phoneCountryCode} {reg.phoneNumber}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-gray-600">
                          {reg.organization || "—"}
                        </td>
                        <td className="p-3.5 text-gray-600">
                          {reg.country || "—"}
                        </td>
                        <td className="p-3.5 text-gray-500 text-[11px]">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              reg.registrationStatus === "CONFIRMED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : reg.registrationStatus === "WAITLISTED"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {reg.registrationStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <select
                            value={reg.registrationStatus}
                            onChange={(e) =>
                              handleStatusChange(reg.id, e.target.value as any)
                            }
                            className="text-[11px] font-semibold border border-gray-300 rounded px-2 py-1 bg-white text-gray-900 cursor-pointer"
                          >
                            <option value="CONFIRMED">Set Confirmed</option>
                            <option value="WAITLISTED">Set Waitlisted</option>
                            <option value="CANCELLED">Set Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                    </table>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CUSTOM DELETE CONFIRMATION MODAL                                       */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div
            className="bg-white border border-red-200 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center animate-in zoom-in-95 duration-150"
            style={{ colorScheme: "light" }}
          >
            {/* Trash Icon Badge */}
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            {/* Modal Heading & Description */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-[#0a0d12]">
                Delete Event
              </h3>
              <p className="text-xs text-[#4a5565] leading-relaxed">
                Are you sure you want to delete{" "}
                <strong className="text-gray-900 font-bold">&quot;{eventToDelete.title}&quot;</strong>?
              </p>
              <div className="mt-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 text-left flex items-start gap-2">
                <span className="text-amber-600 text-xs">ℹ️</span>
                <span>This event will be soft-deleted. Existing registrations and historical data remain preserved in the system.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingEvent}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setEventToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeletingEvent}
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isDeletingEvent && (
                  <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{isDeletingEvent ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
