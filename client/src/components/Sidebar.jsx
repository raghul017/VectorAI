// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
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
} from "lucide-react";

const navItems = [
  {
    to: "/ai",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "text-blue-500",
  },
  {
    to: "/ai/write-article",
    label: "Write Article",
    icon: PenTool,
    color: "text-indigo-500",
  },
  {
    to: "/ai/blog-titles",
    label: "Blog Titles",
    icon: Hash,
    color: "text-purple-500",
  },
  {
    to: "/ai/generate-images",
    label: "Generate Images",
    icon: ImagePlus,
    color: "text-emerald-500",
  },
  {
    to: "/ai/remove-background",
    label: "Remove Background",
    icon: Eraser,
    color: "text-pink-500",
  },
  {
    to: "/ai/remove-object",
    label: "Remove Object",
    icon: Scissors,
    color: "text-orange-500",
  },
  {
    to: "/ai/review-resume",
    label: "Review Resume",
    icon: FileCheck,
    color: "text-cyan-500",
  },
  {
    to: "/ai/community",
    label: "Community",
    icon: Users2,
    color: "text-violet-500",
  },
];

export default function Sidebar({ sidebar, setSidebar }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`
        w-72 bg-gradient-to-b from-slate-50 to-white border-r border-gray-200 
        flex flex-col justify-between
        max-sm:absolute top-10 bottom-0 z-50
        transition-all duration-300 ease-in-out shadow-lg
        ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}
      `}
    >
      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto py-6">
        {/* User Profile Header */}
        <div className="px-6 mb-6">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <img
              src={user.imageUrl}
              alt="User Avatar"
              className="w-12 h-12 rounded-full ring-2 ring-blue-100"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">
                {user.fullName}
              </h2>
              <Protect
                plan="premium"
                fallback={
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    Free Plan
                  </span>
                }
              >
                <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </span>
              </Protect>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Tools
          </p>
          {/* eslint-disable-next-line no-unused-vars */}
          {navItems.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-xl 
                text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-gray-700 hover:bg-white hover:shadow-md"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isActive
                          ? "bg-white/20"
                          : "bg-gradient-to-br from-gray-100 to-gray-50"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-white" : color}`}
                      />
                    </div>
                    <span>{label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 bg-white">
        <div className="p-4">
          <div
            onClick={() => {
              openUserProfile();
              setSidebar(false);
            }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 
            cursor-pointer transition-all group"
          >
            <img
              src={user.imageUrl}
              alt={user.fullName}
              className="w-10 h-10 rounded-full ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
            <LogOut
              onClick={(e) => {
                e.stopPropagation();
                signOut();
              }}
              className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
