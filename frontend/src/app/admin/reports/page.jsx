"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Flag,
  Search,
  CheckCircle2,
  AlertTriangle,
  Filter,
  RefreshCw,
  XCircle,
  ExternalLink,
  Building2,
  Star,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [reasonFilter, setReasonFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchReports = async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage,
        limit: 15,
      });

      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (reasonFilter !== "ALL") params.append("reason", reasonFilter);

      const res = await api.get(`/admin/reports?${params.toString()}`);
      if (res?.success && res.data) {
        setReports(res.data.reports || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalCount(res.data.pagination?.total || 0);
      } else {
        setError(res?.message || "Failed to load reports");
      }
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError(err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1);
    setPage(1);
  }, [statusFilter, reasonFilter]);

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const res = await api.patch(`/admin/reports/${reportId}/status`, {
        status: newStatus,
      });
      if (res?.success) {
        setActionMessage(`Report marked as ${newStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
        fetchReports(page);
      }
    } catch (err) {
      alert("Failed to update report status: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Flag className="w-6 h-6 text-rose-400" />
            Abuse Reports &amp; Disputes Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Investigate reported reviews for fraud, offensive material, conflict of interest, and policy violations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            Total Reports: <strong className="text-white">{totalCount}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchReports(page)}
            className="border-slate-700 text-slate-300 text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {actionMessage}
          </span>
          <button onClick={() => setActionMessage(null)}>✕</button>
        </div>
      )}

      {/* Filter controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-semibold text-[11px]">Resolution Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Investigation</option>
              <option value="REVIEWED">Under Review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-[11px]">Reason:</span>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Reasons</option>
              <option value="SPAM">Spam</option>
              <option value="FAKE_REVIEW">Fake Review</option>
              <option value="CONFLICT_OF_INTEREST">Conflict of Interest</option>
              <option value="OFFENSIVE">Offensive Language</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
            Loading abuse queue...
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No reports filed matching this filter. Clean record!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors"
              >
                <div className="space-y-2 min-w-0 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <Badge variant="rose" size="sm">
                      {report.reason}
                    </Badge>

                    <Badge
                      variant={
                        report.status === "RESOLVED"
                          ? "emerald"
                          : report.status === "DISMISSED"
                          ? "outline"
                          : "amber"
                      }
                      size="sm"
                    >
                      {report.status}
                    </Badge>

                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">
                      Target: <strong className="text-purple-400">{report.review?.company?.name || "Company"}</strong>
                    </span>
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Review: "{report.review?.title || "Untitled Review"}"
                    </h2>
                    {report.details && (
                      <p className="text-xs text-slate-400 mt-1 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        Reporter note: "{report.details}"
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Reported by <strong className="text-slate-400">{report.reporter?.firstName} {report.reporter?.lastName}</strong> ({report.reporter?.email}) on{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {report.status !== "RESOLVED" && (
                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={() => handleUpdateStatus(report.id, "RESOLVED")}
                      className="text-xs font-semibold gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                    </Button>
                  )}

                  {report.status !== "DISMISSED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(report.id, "DISMISSED")}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                fetchReports(newPage);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
