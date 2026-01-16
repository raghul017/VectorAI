// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  PenTool,
  Hash,
  ImagePlus,
  Eraser,
  Scissors,
  FileCheck,
  Users2,
  LogOut,
  ChevronRight,
  Crown,
  Zap,
  ChevronsLeft,
} from "lucide-react";

const navItems = [
  { to: "/ai", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ai/write-article", label: "Write Article", icon: PenTool },
  { to: "/ai/blog-titles", label: "Blog Titles", icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", icon: ImagePlus },
  { to: "/ai/remove-background", label: "Remove Background", icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", icon: FileCheck },
  { to: "/ai/community", label: "Community", icon: Users2 },
];

export default function Sidebar({ sidebar, setSidebar, collapsed, setCollapsed }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navigate = useNavigate();

  return (
    <div
      className={`
        ${collapsed ? "w-20" : "w-60"} bg-[#050505] border-r border-neutral-800
        flex flex-col h-full
        max-sm:absolute top-0 bottom-0 z-50
        transition-all duration-300 ease-out
        ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}
      `}
    >
      {/* Header - Logo */}
      <div className={`${collapsed ? "px-4" : "px-5"} py-5 border-b border-neutral-800`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 8 L40 36 H8 Z" fill="url(#sidebarLogoGrad)" />
              <defs>
                <linearGradient id="sidebarLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            {!collapsed && (
              <div>
                <h1 className="text-sm font-semibold text-white tracking-tight">VectorAI</h1>
                <p className="text-[10px] text-neutral-600">AI Tools Suite</p>
              </div>
            )}
          </div>
          {!collapsed && setCollapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden sm:flex p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-600 hover:text-white transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      {!collapsed && (
        <div className="px-4 py-4">
          <div
            className="flex items-center gap-3 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all"
            onClick={openUserProfile}
          >
            <div className="relative flex-shrink-0">
              <img src={user.imageUrl} alt="" className="w-9 h-9 rounded-lg" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#050505]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <Protect
                plan="premium"
                fallback={
                  <span className="text-[10px] text-neutral-600 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    Free Plan
                  </span>
                }
              >
                <span className="text-[10px] text-purple-400 flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5" />
                  Premium
                </span>
              </Protect>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-700" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {!collapsed && (
          <p className="px-3 text-[10px] font-medium text-neutral-600 uppercase tracking-widest mb-3">
            Tools
          </p>
        )}
        <nav className="space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? "justify-center" : ""} gap-3 ${collapsed ? "px-3" : "px-3"} py-2.5 rounded-lg 
                text-[13px] font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:text-white hover:bg-neutral-800/50"
                }`
              }
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0`} />
                  {!collapsed && <span className="flex-1">{label}</span>}
                  {!collapsed && isActive && <ChevronRight className="w-4 h-4 text-neutral-600" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom - Account Section */}
      <div className="border-t border-neutral-800 p-3">
        <div
          onClick={openUserProfile}
          className={`flex items-center ${collapsed ? "justify-center" : ""} gap-3 p-2.5 rounded-lg hover:bg-neutral-800/50 cursor-pointer transition-all group`}
        >
          <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-lg flex-shrink-0" />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-300 truncate group-hover:text-white transition-colors">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-neutral-600 group-hover:text-neutral-500 transition-colors">
                  View Profile
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  signOut();
                }}
                className="p-2 rounded-lg hover:bg-neutral-700 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-neutral-600 hover:text-red-400 transition-colors" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
