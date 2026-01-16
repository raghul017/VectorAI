import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gem, Sparkles, TrendingUp, Activity, Crown, Trash2, PenTool, Hash, ImagePlus, Eraser, Scissors, FileCheck, Clock, AlertCircle, RefreshCw, ArrowUpRight } from "lucide-react";
import CreationItem from "../components/CreationItem.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, Protect } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const quickActions = [
  { label: "Write Article", desc: "AI-powered articles", icon: PenTool, path: "/ai/write-article", gradient: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20", iconColor: "text-blue-400" },
  { label: "Blog Titles", desc: "Catchy headlines", icon: Hash, path: "/ai/blog-titles", gradient: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/20", iconColor: "text-purple-400" },
  { label: "Generate Image", desc: "Create stunning art", icon: ImagePlus, path: "/ai/generate-images", gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20", iconColor: "text-emerald-400" },
  { label: "Remove BG", desc: "Background removal", icon: Eraser, path: "/ai/remove-background", gradient: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/20", iconColor: "text-pink-400" },
  { label: "Remove Object", desc: "Object eraser", icon: Scissors, path: "/ai/remove-object", gradient: "from-orange-500/20 to-amber-500/20", border: "border-orange-500/20", iconColor: "text-orange-400" },
  { label: "Review Resume", desc: "AI feedback", icon: FileCheck, path: "/ai/review-resume", gradient: "from-cyan-500/20 to-sky-500/20", border: "border-cyan-500/20", iconColor: "text-cyan-400" },
];

export default function DashBoard() {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      setLoading(true); setError(null);
      const { data } = await axios.get(`/api/user/get-user-creations`, { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (data.success) setCreations(data.creations);
      else setError(data.message || "Failed to load");
    } catch (err) { setError(err.response?.data?.message || err.message || "Failed to connect"); }
    setLoading(false);
  };

  const deleteCreation = async (id) => {
    if (!window.confirm("Delete this creation?")) return;
    try {
      const { data } = await axios.delete(`/api/user/delete-creation/${id}`, { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (data.success) { setCreations(creations.filter((item) => item.id !== id)); toast.success("Deleted"); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to delete"); }
  };

  const clearAllHistory = async () => {
    if (!window.confirm("Clear all creations?")) return;
    try {
      setDeleting(true);
      const { data } = await axios.delete(`/api/user/clear-all-creations`, { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (data.success) { setCreations([]); toast.success("Cleared"); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setDeleting(false); }
  };

  useEffect(() => { getDashboardData(); }, []);

  const thisWeekCount = creations.filter((c) => Date.now() - new Date(c.created_at).getTime() < 7 * 24 * 60 * 60 * 1000).length;
  const getActivityData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) { const date = new Date(); date.setDate(date.getDate() - i); const dayStr = date.toLocaleDateString("en-US", { weekday: "short" }); const count = creations.filter((c) => new Date(c.created_at).toDateString() === date.toDateString()).length; days.push({ day: dayStr, count }); }
    return days;
  };
  const activityData = getActivityData();
  const maxActivity = Math.max(...activityData.map((d) => d.count), 1);
  const timeAgo = (date) => { const diff = Date.now() - new Date(date).getTime(); const mins = Math.floor(diff / 60000); if (mins < 60) return `${mins}m ago`; const hours = Math.floor(mins / 60); if (hours < 24) return `${hours}h ago`; return `${Math.floor(hours / 24)}d ago`; };

  return (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-violet-950/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto p-6 lg:p-8 pt-20">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Dashboard</h1>
          <p className="text-neutral-500 text-sm">Track your AI-powered creations and manage your content</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium text-neutral-400">Quick Actions</h2>
            <span className="text-[11px] text-neutral-600">6 tools available</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}
                className={`group p-5 rounded-2xl bg-gradient-to-br ${action.gradient} border ${action.border} hover:scale-[1.02] transition-all duration-300`}>
                <div className="flex items-center justify-between mb-3">
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  <ArrowUpRight className="w-4 h-4 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">{action.label}</h3>
                <p className="text-[10px] text-neutral-500">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center"><Sparkles className="w-5 h-5 text-violet-400" /></div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-3xl font-semibold text-white">{creations.length}</h3>
            <p className="text-xs text-neutral-500 mt-1">Total Creations</p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <Protect plan="premium" fallback={<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-700/50 to-neutral-800/50 flex items-center justify-center"><Gem className="w-5 h-5 text-neutral-500" /></div>}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center"><Crown className="w-5 h-5 text-amber-400" /></div>
              </Protect>
            </div>
            <h3 className="text-2xl font-semibold text-white"><Protect plan="premium" fallback="Free">Premium</Protect></h3>
            <p className="text-xs text-neutral-500 mt-1">Active Plan</p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center"><Activity className="w-5 h-5 text-emerald-400" /></div>
            </div>
            <h3 className="text-3xl font-semibold text-white">{thisWeekCount}</h3>
            <p className="text-xs text-neutral-500 mt-1">This Week</p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-center">
            <button onClick={clearAllHistory} disabled={deleting || creations.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-700 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 rounded-xl text-xs font-medium transition-all disabled:opacity-40">
              <Trash2 className="w-4 h-4" />{deleting ? "Clearing..." : "Clear History"}
            </button>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-neutral-300">Activity Overview</h2>
            <span className="text-[11px] text-neutral-600">Last 7 days</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-28">
            {activityData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-[50px] bg-gradient-to-t from-violet-600/80 to-purple-500/80 rounded-t-lg transition-all hover:from-violet-500 hover:to-purple-400"
                    style={{ height: `${Math.max((day.count / maxActivity) * 90, 6)}px` }} />
                </div>
                <span className="text-[11px] text-neutral-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {error && (
              <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-400" /></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-400 mb-1">Error loading data</h3>
                    <p className="text-xs text-red-400/70">{error}</p>
                    <button onClick={getDashboardData} className="mt-3 flex items-center gap-2 px-4 py-2 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10"><RefreshCw className="w-3 h-3" />Retry</button>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-neutral-800/50 rounded-2xl animate-pulse" />)}</div>
            ) : !error ? (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-medium text-neutral-300">Recent Creations</h2>
                  {creations.length > 0 && <span className="text-[11px] text-neutral-600">{creations.length} items</span>}
                </div>
                {creations.length === 0 ? (
                  <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-neutral-800 flex items-center justify-center mb-4"><Sparkles className="w-8 h-8 text-neutral-600" /></div>
                    <p className="text-sm text-neutral-500">No creations yet</p>
                    <p className="text-xs text-neutral-600 mt-1">Use the quick actions above to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {creations.slice(0, 5).map((item) => <CreationItem key={item.id} item={item} onDelete={deleteCreation} />)}
                    {creations.length > 5 && <p className="text-center text-xs text-neutral-500 py-3">+{creations.length - 5} more creations</p>}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 h-fit">
            <h2 className="text-sm font-medium text-neutral-300 mb-5">Recent Activity</h2>
            {creations.length === 0 ? <p className="text-xs text-neutral-600">No recent activity</p> : (
              <div className="space-y-5">
                {creations.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0"><Sparkles className="w-3.5 h-3.5 text-neutral-500" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-300 truncate">{item.prompt?.slice(0, 40)}...</p>
                      <div className="flex items-center gap-1.5 mt-1"><Clock className="w-3 h-3 text-neutral-600" /><span className="text-[10px] text-neutral-600">{timeAgo(item.created_at)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
