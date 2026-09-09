"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Send,
  Mail,
  User,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

export default function BusinessInvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Invite Form
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchInvitations = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/business/invitations?page=${page}&limit=15`);
      if (res?.success && res.data) {
        setInvitations(res.data.invitations || []);
        setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error("Failed to load invitations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessage(null);

    try {
      const res = await api.post("/business/invitations", {
        customerEmail,
        customerName,
      });

      if (res?.success) {
        setMessage({ type: "success", text: `Invitation successfully sent to ${customerEmail}!` });
        setCustomerEmail("");
        setCustomerName("");
        fetchInvitations();
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to dispatch review invitation." });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/writereview`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Invitations</h2>
        <p className="text-xs text-slate-500 mt-1">
          Proactively invite your recent customers to share their verified feedback and boost your TrustScore.
        </p>
      </div>

      {/* Grid: Form on left, Fast Link on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Invitation Form */}
        <Card className="p-6 border-slate-200 bg-white lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Send className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Send Customer Review Invitation</h3>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSendInvite} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Customer Email Address"
                type="email"
                icon={Mail}
                required
                placeholder="customer@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />

              <Input
                label="Customer Name (Optional)"
                type="text"
                icon={User}
                placeholder="e.g. Jordan Smith"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Customers receive an authentic, anti-fraud review link. Reviews submitted through official invitations are automatically marked as <strong>Verified Buyer</strong>.
              </span>
            </div>

            <Button
              type="submit"
              variant="emerald"
              size="md"
              isLoading={isSending}
              className="font-bold gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Invitation Email
            </Button>
          </form>
        </Card>

        {/* Quick Link Card */}
        <Card className="p-6 border-slate-200 bg-white flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ExternalLink className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Direct Invitation Link</h3>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Include this link in order confirmation emails, receipts, or customer support follow-ups to invite reviews automatically.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 break-all select-all">
              {typeof window !== "undefined" ? `${window.location.origin}/writereview` : "/writereview"}
            </div>
          </div>

          <Button
            variant={copiedLink ? "primary" : "outline"}
            size="sm"
            onClick={handleCopyInviteLink}
            className="w-full font-bold gap-2 text-xs"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Shareable Link
              </>
            )}
          </Button>
        </Card>
      </div>

      {/* Invitation History Table */}
      <Card className="border-slate-200 bg-white overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Invitation History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track delivery and customer completion statuses.
            </p>
          </div>

          <span className="text-xs text-slate-500 font-semibold">
            {pagination.total} Total Invitations
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : invitations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <Mail className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700">No invitations dispatched yet</p>
            <p className="text-slate-500">
              Send your first customer invitation using the form above to start collecting verified reviews.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Customer Email</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900">{inv.customerEmail}</td>
                    <td className="px-6 py-3.5 text-slate-600">{inv.customerName || "—"}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === "REVIEWED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : inv.status === "OPENED"
                            ? "bg-sky-50 text-sky-700 border border-sky-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {inv.status === "REVIEWED" && <CheckCircle2 className="w-3 h-3" />}
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(inv.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
