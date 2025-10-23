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
    <div className="h-full overflow-y-scroll bg-[#0A0A0F]">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Track your AI-powered creations and manage your content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Creations */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-purple-400/30 transition-all transform hover:scale-105 animate-fadeIn animation-delay-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {creations.length}
            </h3>
            <p className="text-sm text-gray-400 font-medium">Total Creations</p>
          </div>

          {/* Active Plan */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-400/50 p-6 hover:bg-white/10 transition-all text-white shadow-[0_0_20px_rgba(168,85,247,0.15)] transform hover:scale-105 animate-fadeIn animation-delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:scale-110 transition-transform">
                <Protect
                  plan="premium"
                  fallback={<Gem className="w-6 h-6 text-purple-400" />}
                >
                  <Crown className="w-6 h-6 text-purple-400" />
                </Protect>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h3>
            <p className="text-sm text-gray-400 font-medium">Active Plan</p>
          </div>

          {/* This Week */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-emerald-400/30 transition-all transform hover:scale-105 animate-fadeIn animation-delay-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {
                creations.filter((c) => {
                  const diff = Date.now() - new Date(c.created_at).getTime();
                  return diff < 7 * 24 * 60 * 60 * 1000;
                }).length
              }
            </h3>
            <p className="text-sm text-gray-400 font-medium">This Week</p>
          </div>

          {/* Clear History Button Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-red-400/30 transition-all transform hover:scale-105 animate-fadeIn animation-delay-400">
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <button
                onClick={clearAllHistory}
                disabled={deleting || creations.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 
                hover:bg-white/15 text-white rounded-xl font-medium text-sm border border-white/20
                hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-105 active:scale-95 disabled:hover:scale-100 group"
              >
                <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                {deleting ? "Clearing..." : "Clear All History"}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Remove all your creations
              </p>
            </div>
          </div>
        </div>

        {/* Creations List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="text-gray-400 font-medium">
                Loading your creations...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Recent Creations
              </h2>
              {creations.length > 0 && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                  {creations.length} {creations.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {creations.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No creations yet
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
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
