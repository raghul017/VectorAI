// src/pages/DashBoard.jsx
import React, { useState, useEffect } from "react";
import {
  Gem,
  Sparkles,
  TrendingUp,
  Activity,
  Crown,
  Trash2,
} from "lucide-react";
import CreationItem from "../components/CreationItem.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, Protect } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export default function DashBoard() {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(`/api/user/get-user-creations`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success === true) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const deleteCreation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this creation?")) {
      return;
    }

    try {
      const { data } = await axios.delete(`/api/user/delete-creation/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(creations.filter((item) => item.id !== id));
        toast.success("Creation deleted successfully");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete creation");
    }
  };

  const clearAllHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all your creations? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const { data } = await axios.delete(`/api/user/clear-all-creations`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations([]);
        toast.success("All creations cleared successfully");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to clear creations");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full overflow-y-scroll bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Track your AI-powered creations and manage your content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Creations */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {creations.length}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Total Creations</p>
          </div>

          {/* Active Plan */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Protect
                  plan="premium"
                  fallback={<Gem className="w-6 h-6 text-white" />}
                >
                  <Crown className="w-6 h-6 text-white" />
                </Protect>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h3>
            <p className="text-sm text-white/90 font-medium">Active Plan</p>
          </div>

          {/* This Week */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {
                creations.filter((c) => {
                  const diff = Date.now() - new Date(c.created_at).getTime();
                  return diff < 7 * 24 * 60 * 60 * 1000;
                }).length
              }
            </h3>
            <p className="text-sm text-gray-600 font-medium">This Week</p>
          </div>

          {/* Clear History Button Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <button
                onClick={clearAllHistory}
                disabled={deleting || creations.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 
                hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium text-sm
                shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-105 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? "Clearing..." : "Clear All History"}
              </button>
              <p className="text-xs text-gray-500 text-center">
                Remove all your creations
              </p>
            </div>
          </div>
        </div>

        {/* Creations List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-600 font-medium">
                Loading your creations...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Creations
              </h2>
              {creations.length > 0 && (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {creations.length} {creations.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {creations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No creations yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start creating amazing content with our AI tools. Your
                  creations will appear here.
                </p>
              </div>
            ) : (
              creations.map((item) => (
                <CreationItem
                  key={item.id}
                  item={item}
                  onDelete={deleteCreation}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
