"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Filter,
  RefreshCw,
  Ban,
  UserCheck,
  Shield,
  Building2,
  Mail,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchUsers = async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage,
        limit: 15,
      });

      if (search.trim()) params.append("search", search.trim());
      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (statusFilter === "SUSPENDED") params.append("isSuspended", "true");
      if (statusFilter === "ACTIVE") params.append("isSuspended", "false");

      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res?.success && res.data) {
        setUsers(res.data.users || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalCount(res.data.pagination?.total || 0);
      } else {
        setError(res?.message || "Failed to load users");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    setPage(1);
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
    setPage(1);
  };

  const handleToggleSuspension = async (userId, currentSuspended, email) => {
    const action = currentSuspended ? "reinstate" : "suspend";
    if (!window.confirm(`Are you sure you want to ${action} user ${email}?`)) return;
    try {
      const res = await api.patch(`/admin/users/${userId}`, {
        isSuspended: !currentSuspended,
      });
      if (res?.success) {
        setActionMessage(`Account for ${email} ${currentSuspended ? "reinstated" : "suspended"}`);
        setTimeout(() => setActionMessage(null), 3000);
        fetchUsers(page);
      }
    } catch (err) {
      alert("Failed to update user: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-purple-400" />
            Users &amp; Accounts Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit registered reviewer profiles, business owners, and system security privileges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            Total Accounts: <strong className="text-white">{totalCount}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchUsers(page)}
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

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-semibold text-[11px]">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Consumer (USER)</option>
              <option value="BUSINESS">Business (BUSINESS)</option>
              <option value="ADMIN">Administrator (ADMIN)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400 font-semibold text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
            Loading accounts directory...
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No users matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Linked Enterprise</th>
                  <th className="py-3.5 px-4">Activity</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {u.firstName?.[0] || "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">
                            {u.firstName} {u.lastName}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          u.role === "ADMIN"
                            ? "purple"
                            : u.role === "BUSINESS"
                            ? "emerald"
                            : "outline"
                        }
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {u.businessProfile?.company ? (
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate">{u.businessProfile.company.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 font-medium">
                        {u._count?.reviews || 0} reviews
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {u.isSuspended ? (
                        <Badge variant="rose" size="sm">
                          Suspended
                        </Badge>
                      ) : (
                        <Badge variant="emerald" size="sm">
                          Active
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {u.role !== "ADMIN" && (
                        <button
                          type="button"
                          onClick={() => handleToggleSuspension(u.id, u.isSuspended, u.email)}
                          title={u.isSuspended ? "Reinstate Account" : "Suspend Account"}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                            u.isSuspended
                              ? "bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900"
                              : "bg-rose-950/40 border-rose-900/60 text-rose-300 hover:bg-rose-900"
                          }`}
                        >
                          {u.isSuspended ? "Reinstate" : "Suspend"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                fetchUsers(newPage);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
