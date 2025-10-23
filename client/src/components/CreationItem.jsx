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
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "article":
      case "resume":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "blog":
        return "bg-purple-50 border-purple-200 text-purple-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
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
      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
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
            <h2 className="font-semibold text-gray-900 mb-2 truncate">
              {item.prompt}
            </h2>
            <p className="text-sm text-gray-500">
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
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Delete creation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 bg-gray-50/50">
          {item.type === "image" ? (
            <div className="flex justify-center">
              <img
                src={item.content}
                alt="Generated content"
                className="max-w-md w-full rounded-xl shadow-md"
              />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-gray-700">
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
