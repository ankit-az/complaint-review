"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  MessageSquareQuote,
  Sparkles,
  Shield,
  Clock,
  Check,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function BusinessNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/business/notifications");
      if (res?.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/business/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post("/business/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "NEW_REVIEW":
        return <MessageSquareQuote className="w-4 h-4 text-emerald-600" />;
      case "VERIFICATION_UPDATE":
        return <Shield className="w-4 h-4 text-amber-600" />;
      case "SYSTEM":
        return <Sparkles className="w-4 h-4 text-sky-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notification Center</h2>
          <p className="text-xs text-slate-500 mt-1">
            Stay informed about new customer reviews, invitation conversions, and verification updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="text-xs font-semibold gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-200 space-y-2">
          <Bell className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-slate-700 text-sm">No notifications right now</p>
          <p className="text-xs text-slate-500">
            You're all caught up! New alerts will appear here when customers interact with your profile.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 border transition-all ${
                notif.isRead
                  ? "border-slate-200/80 bg-white"
                  : "border-emerald-200 bg-emerald-50/40 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.isRead ? "bg-slate-100" : "bg-white shadow-xs"
                    }`}
                  >
                    {getIcon(notif.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 whitespace-nowrap cursor-pointer shrink-0"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
