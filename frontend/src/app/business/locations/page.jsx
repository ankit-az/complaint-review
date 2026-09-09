"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  MapPin,
  Plus,
  Phone,
  Mail,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function BusinessLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "United States",
    postalCode: "",
    phone: "",
    email: "",
    isPrimary: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/business/locations");
      if (res?.success && res.data?.locations) {
        setLocations(res.data.locations);
      }
    } catch (err) {
      console.error("Failed to load locations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "United States",
      postalCode: "",
      phone: "",
      email: "",
      isPrimary: locations.length === 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (loc) => {
    setIsEditing(true);
    setCurrentId(loc.id);
    setFormData({
      name: loc.name || "",
      address: loc.address || "",
      city: loc.city || "",
      state: loc.state || "",
      country: loc.country || "United States",
      postalCode: loc.postalCode || "",
      phone: loc.phone || "",
      email: loc.email || "",
      isPrimary: loc.isPrimary || false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this branch location?")) return;
    try {
      const res = await api.delete(`/business/locations/${id}`);
      if (res?.success) {
        setMessage({ type: "success", text: "Location removed." });
        setTimeout(() => setMessage(null), 3000);
        fetchLocations();
      }
    } catch (err) {
      alert(err.message || "Failed to remove location");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await api.put(`/business/locations/${currentId}`, formData);
        setMessage({ type: "success", text: "Location updated successfully." });
      } else {
        await api.post("/business/locations", formData);
        setMessage({ type: "success", text: "Branch location added successfully." });
      }
      setModalOpen(false);
      setTimeout(() => setMessage(null), 3000);
      fetchLocations();
    } catch (err) {
      alert(err.message || "Failed to save location");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Branch Locations</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your physical stores, branch offices, and regional fulfillment centers.
          </p>
        </div>

        <Button variant="emerald" size="sm" onClick={handleOpenAdd} className="font-bold gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add New Location
        </Button>
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

      {/* Locations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : locations.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-200 space-y-3">
          <MapPin className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No branch locations added yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Adding locations helps customers find and review specific branches or physical storefronts.
          </p>
          <Button size="sm" variant="emerald" onClick={handleOpenAdd} className="mt-2 font-bold">
            Add Your First Location
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {locations.map((loc) => (
            <Card key={loc.id} className="p-5 border-slate-200 bg-white flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{loc.name}</h4>
                      {loc.isPrimary && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          Primary Headquarters
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p className="font-medium text-slate-800">{loc.address}</p>
                  <p>{[loc.city, loc.state, loc.postalCode, loc.country].filter(Boolean).join(", ")}</p>
                  {loc.phone && (
                    <p className="flex items-center gap-1.5 text-slate-500 pt-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {loc.phone}
                    </p>
                  )}
                  {loc.email && (
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {loc.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(loc)}
                  className="text-xs py-1 px-2.5 gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(loc.id)}
                  className="text-xs py-1 px-2.5 text-rose-600 hover:bg-rose-50 gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Location Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Branch Location" : "Add New Branch Location"}
        description="Provide accurate location address and contact info for customers."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Location Name"
            placeholder="e.g. Downtown Flagship, Chicago Hub"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Street Address"
            placeholder="e.g. 500 Michigan Ave, Suite 400"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              placeholder="Chicago"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="State / Province"
              placeholder="IL"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Postal Code"
              placeholder="60611"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
            <Input
              label="Country"
              placeholder="United States"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Branch Phone"
              type="tel"
              placeholder="+1 (312) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Branch Email"
              type="email"
              placeholder="chicago@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.isPrimary}
              onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-semibold">Mark as Primary Headquarters</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              isLoading={isSubmitting}
              className="font-bold"
            >
              {isEditing ? "Save Changes" : "Create Location"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
