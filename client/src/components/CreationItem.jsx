import { useState } from "react";
import Markdown from "react-markdown";
import {
  Trash2,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  FileText,
  Lightbulb,
} from "lucide-react";

const CreationItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const getTypeColor = (type) => {
    switch (type) {
      case "image":
        return "bg-emerald-500/20 border-emerald-500/30 text-emerald-300";
      case "article":
      case "resume":
        return "bg-blue-500/20 border-blue-500/30 text-blue-300";
      case "blog":
        return "bg-purple-500/20 border-purple-500/30 text-purple-300";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-300";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "article":
      case "resume":
        return <FileText className="w-4 h-4" />;
      case "blog":
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item.id);
    }
  };

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all cursor-pointer overflow-hidden"
    >
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Expand Icon */}
          <div className="mt-1">
            {expanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-white mb-2 truncate">
              {item.prompt}
            </h2>
            <p className="text-sm text-gray-400">
              {new Date(item.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Type Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getTypeColor(
              item.type
            )} font-medium text-sm capitalize`}
          >
            {getTypeIcon(item.type)}
            {item.type}
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Delete creation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/10 pt-4 bg-black/20">
          {item.type === "image" ? (
            <div className="flex justify-center">
              <img
                src={item.content}
                alt="Generated content"
                className="max-w-md w-full rounded-xl shadow-md"
              />
            </div>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none text-gray-300">
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
