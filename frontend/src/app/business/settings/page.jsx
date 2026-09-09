"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Settings,
  Shield,
  User,
  Bell,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Key,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function BusinessSettingsPage() {
  const [activeTab, setActiveTab] = useState("verification");
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verification Form
  const [verificationForm, setVerificationForm] = useState({
    registrationNumber: "",
    taxId: "",
    documentUrl: "",
    notes: "",
  });
  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false);

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Notification toggles
  const [notifPreferences, setNotifPreferences] = useState({
    emailOnNewReview: true,
    emailOnResponse: true,
    weeklyDigest: false,
  });

  const [message, setMessage] = useState(null);

  const fetchContext = async () => {
    setLoading(true);
    try {
      const res = await api.get("/business/me");
      if (res?.success && res.data) {
        setBusinessData(res.data);
      }
    } catch (err) {
      console.error("Failed to load business context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContext();
  }, []);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingVerify(true);
    setMessage(null);

    try {
      const res = await api.post("/business/verify", verificationForm);
      if (res?.success) {
        setMessage({
          type: "success",
          text: "Verification documents submitted successfully! Platform moderators will review within 24-48h.",
        });
        fetchContext();
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to submit verification request." });
    } finally {
      setIsSubmittingVerify(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await api.put("/business/settings/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res?.success) {
        setMessage({ type: "success", text: "Password changed successfully." });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl">
        <div className="h-10 bg-slate-200 rounded-xl w-64 animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const company = businessData?.company;
  const user = businessData?.user;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Business Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage account security, business credentials verification, and notification preferences.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium ${
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

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: "verification", label: "Business Verification", icon: Shield },
          { id: "account", label: "Account Profile", icon: User },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "security", label: "Password & Security", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setMessage(null);
              }}
              className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Business Verification */}
      {activeTab === "verification" && (
        <Card className="p-6 border-slate-200 bg-white space-y-6">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Verification Status</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified businesses earn a green trust badge on all public search and company directory pages.
              </p>
            </div>

            {company?.isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Business
              </span>
            ) : company?.verificationStatus === "PENDING" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" /> Verification Pending Review
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                Unverified
              </span>
            )}
          </div>

          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Registration / Incorporating Number"
                placeholder="e.g. US-DE-78945612"
                value={verificationForm.registrationNumber}
                onChange={(e) =>
                  setVerificationForm({ ...verificationForm, registrationNumber: e.target.value })
                }
                required
              />

              <Input
                label="Corporate Tax ID / VAT Number"
                placeholder="e.g. 12-3456789"
                value={verificationForm.taxId}
                onChange={(e) =>
                  setVerificationForm({ ...verificationForm, taxId: e.target.value })
                }
              />
            </div>

            <Input
              label="Verification Document Proof URL"
              type="url"
              placeholder="https://drive.google.com/... or cloud storage URL to utility bill / tax certificate"
              value={verificationForm.documentUrl}
              onChange={(e) =>
                setVerificationForm({ ...verificationForm, documentUrl: e.target.value })
              }
              helperText="Upload official certificate of incorporation, utility bill, or corporate registry document"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Notes for Verification Auditors
              </label>
              <textarea
                rows={3}
                placeholder="Add any clarifying details regarding your business registry..."
                value={verificationForm.notes}
                onChange={(e) =>
                  setVerificationForm({ ...verificationForm, notes: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              variant="emerald"
              size="md"
              isLoading={isSubmittingVerify}
              className="font-bold gap-2"
            >
              <Shield className="w-4 h-4" /> Submit Documents for Verification
            </Button>
          </form>
        </Card>
      )}

      {/* TAB 2: Account Details */}
      {activeTab === "account" && (
        <Card className="p-6 border-slate-200 bg-white space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Account Holder Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                First Name
              </p>
              <p className="font-bold text-slate-800 mt-1 text-sm">{user?.firstName}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Last Name
              </p>
              <p className="font-bold text-slate-800 mt-1 text-sm">{user?.lastName}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Corporate Email
              </p>
              <p className="font-bold text-slate-800 mt-1 text-sm">{user?.email}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Role</p>
              <p className="font-bold text-slate-800 mt-1 text-sm">{user?.role}</p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: Notifications Preferences */}
      {activeTab === "notifications" && (
        <Card className="p-6 border-slate-200 bg-white space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Email & In-App Alert Preferences
          </h3>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">New Review Notifications</p>
                <p className="text-slate-500 mt-0.5">
                  Receive an immediate email alert when a verified buyer rates your company.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifPreferences.emailOnNewReview}
                onChange={(e) =>
                  setNotifPreferences({ ...notifPreferences, emailOnNewReview: e.target.checked })
                }
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Review Invitation Conversions</p>
                <p className="text-slate-500 mt-0.5">
                  Notify when a customer completes an invitation review.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifPreferences.emailOnResponse}
                onChange={(e) =>
                  setNotifPreferences({ ...notifPreferences, emailOnResponse: e.target.checked })
                }
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Weekly Reputation Digest</p>
                <p className="text-slate-500 mt-0.5">
                  Receive a weekly executive summary of TrustScore change and sentiment topics.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifPreferences.weeklyDigest}
                onChange={(e) =>
                  setNotifPreferences({ ...notifPreferences, weeklyDigest: e.target.checked })
                }
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
            </label>
          </div>
        </Card>
      )}

      {/* TAB 4: Password & Security */}
      {activeTab === "security" && (
        <Card className="p-6 border-slate-200 bg-white space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Change Business Password
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              icon={Key}
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              required
            />

            <Input
              label="New Password"
              type="password"
              icon={Lock}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              helperText="At least 8 characters with letters & numbers"
            />

            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              variant="emerald"
              size="md"
              isLoading={isSubmittingPassword}
              className="font-bold"
            >
              Update Password
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
