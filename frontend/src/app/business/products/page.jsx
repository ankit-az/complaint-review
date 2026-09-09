"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Tag,
  DollarSign,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function BusinessProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    category: "",
    imageUrl: "",
    status: "ACTIVE",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/business/products");
      if (res?.success && res.data?.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "USD",
      category: "",
      imageUrl: "",
      status: "ACTIVE",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setIsEditing(true);
    setCurrentId(prod.id);
    setFormData({
      name: prod.name || "",
      description: prod.description || "",
      price: prod.price?.toString() || "",
      currency: prod.currency || "USD",
      category: prod.category || "",
      imageUrl: prod.imageUrl || "",
      status: prod.status || "ACTIVE",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product or service?")) return;
    try {
      const res = await api.delete(`/business/products/${id}`);
      if (res?.success) {
        setMessage({ type: "success", text: "Product removed." });
        setTimeout(() => setMessage(null), 3000);
        fetchProducts();
      }
    } catch (err) {
      alert(err.message || "Failed to remove product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
    };

    try {
      if (isEditing) {
        await api.put(`/business/products/${currentId}`, payload);
        setMessage({ type: "success", text: "Product updated." });
      } else {
        await api.post("/business/products", payload);
        setMessage({ type: "success", text: "Product created." });
      }
      setModalOpen(false);
      setTimeout(() => setMessage(null), 3000);
      fetchProducts();
    } catch (err) {
      alert(err.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Products & Services</h2>
          <p className="text-xs text-slate-500 mt-1">
            Showcase your core offerings, packages, and software tiers that customers review.
          </p>
        </div>

        <Button variant="emerald" size="sm" onClick={handleOpenAdd} className="font-bold gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Product / Service
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
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-200 space-y-3">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No products or services listed</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Adding products allows your customers to specify which item they are reviewing.
          </p>
          <Button size="sm" variant="emerald" onClick={handleOpenAdd} className="mt-2 font-bold">
            Add Your First Product
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod) => (
            <Card key={prod.id} className="border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                {/* Image */}
                {prod.imageUrl ? (
                  <div className="h-36 bg-slate-100 overflow-hidden">
                    <img src={prod.imageUrl} alt={prod.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-28 bg-slate-100 flex items-center justify-center text-slate-400">
                    <Package className="w-8 h-8" />
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{prod.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prod.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {prod.status}
                    </span>
                  </div>

                  {prod.price != null && (
                    <p className="text-xs font-bold text-slate-900">
                      ${prod.price.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">{prod.currency}</span>
                    </p>
                  )}

                  {prod.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-end gap-2 text-xs border-t border-slate-100 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(prod)}
                  className="text-xs py-1 px-2.5 gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(prod.id)}
                  className="text-xs py-1 px-2.5 text-rose-600 hover:bg-rose-50 gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Product / Service" : "Add Product / Service"}
        description="Provide details for this product or subscription tier."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product or Service Name"
            placeholder="e.g. Cloud Hosting Pro Plan, Annual Retainer"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price (Optional)"
              type="number"
              step="0.01"
              placeholder="99.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>

          <Input
            label="Image URL"
            type="url"
            placeholder="https://example.com/product.jpg"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Short summary of what this product includes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
            >
              <option value="ACTIVE">Active (Available for review)</option>
              <option value="INACTIVE">Inactive (Hidden)</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

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
              {isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
