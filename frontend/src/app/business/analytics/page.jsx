"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  BarChart3,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function BusinessAnalyticsPage() {
  const [period, setPeriod] = useState("30d");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (selectedPeriod = period) => {
    setLoading(true);
    try {
      const res = await api.get(`/business/analytics?period=${selectedPeriod}`);
      if (res?.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const periods = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 90 Days", value: "90d" },
    { label: "Last 1 Year", value: "1y" },
    { label: "All Time", value: "all" },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Analytics</h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyze customer sentiment, volume trends, and feedback topics.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          {periods.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                period === p.value
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      ) : !analytics ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Unable to load analytics at this time.</p>
        </div>
      ) : (
        <>
          {/* Top 4 Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-slate-200 bg-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Period Reviews
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{analytics.totalReviews}</span>
                <span className="text-xs text-slate-400">in period</span>
              </div>
            </Card>

            <Card className="p-4 border-slate-200 bg-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Period Average Rating
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{analytics.averageRating}</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
            </Card>

            <Card className="p-4 border-slate-200 bg-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Response Coverage
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-600">{analytics.responseRate}%</span>
                <span className="text-xs text-slate-400">answered</span>
              </div>
            </Card>

            <Card className="p-4 border-slate-200 bg-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Verified Reviews
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{analytics.verifiedPercentage}%</span>
                <span className="text-xs text-slate-400">verified buyers</span>
              </div>
            </Card>
          </div>

          {/* Sentiment Distribution & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-slate-200 bg-white lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Sentiment Breakdown</h3>
                <span className="text-xs text-slate-400">Period Total</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-emerald-700">Positive (4-5 ★)</span>
                    <span className="text-slate-800">{analytics.distribution.positive} reviews</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${analytics.totalReviews > 0 ? (analytics.distribution.positive / analytics.totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-amber-700">Neutral (3 ★)</span>
                    <span className="text-slate-800">{analytics.distribution.neutral} reviews</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: `${analytics.totalReviews > 0 ? (analytics.distribution.neutral / analytics.totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-rose-700">Negative / Complaints (1-2 ★)</span>
                    <span className="text-slate-800">{analytics.distribution.negative} reviews</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{
                        width: `${analytics.totalReviews > 0 ? (analytics.distribution.negative / analytics.totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Time-Series Chart Box */}
            <Card className="p-6 border-slate-200 bg-white lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Review Growth & Volume</h3>
                  <p className="text-xs text-slate-500">Distribution over selected time window</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>

              {analytics.timeSeries.length === 0 ? (
                <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                  No time-series data available for this range.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="h-44 flex items-end gap-2 pt-4 border-b border-slate-100">
                    {analytics.timeSeries.map((item, idx) => {
                      const maxVal = Math.max(...analytics.timeSeries.map((t) => t.count), 1);
                      const heightPercent = Math.round((item.count / maxVal) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                          <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.count}
                          </span>
                          <div
                            className="w-full max-w-[28px] rounded-t-md bg-emerald-500 hover:bg-emerald-600 transition-colors"
                            style={{ height: `${Math.max(12, heightPercent)}%` }}
                          />
                          <span className="text-[9px] text-slate-400 truncate w-full text-center">
                            {item.date.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-400 text-right">Daily incoming review count</p>
                </div>
              )}
            </Card>
          </div>

          {/* Feedback & Sentiment Topics Analysis */}
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Feedback Topics & Customer Sentiment Analysis
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Natural text clustering identifies what customers talk about most and their satisfaction ratio.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.sentimentTopics.map((topic, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{topic.topic}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        topic.sentiment === "positive"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {topic.positiveRatio}% Positive
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Mentioned in <strong>{topic.mentions}</strong> customer reviews
                  </p>

                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        topic.positiveRatio >= 70
                          ? "bg-emerald-500"
                          : topic.positiveRatio >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${topic.positiveRatio}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
