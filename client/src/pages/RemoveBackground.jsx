import { Eraser, Zap } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const formRef = useRef(null);

  const { getToken } = useAuth();

  // Generate preview when file selected
  useEffect(() => {
    if (input) {
      const url = URL.createObjectURL(input);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [input]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", input);

      const { data } = await axios.post("/api/ai/remove-background", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success === true) {
        setContent(data.content);
        toast.success("Background removed!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const downloadImage = () => {
    if (content) {
      const link = document.createElement("a");
      link.href = content;
      link.download = `no-bg-${Date.now()}.png`;
      link.click();
      toast.success("Downloaded!");
    }
  };

  return (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      <div className="max-w-4xl mx-auto p-6 lg:p-8 pt-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-white">Remove Background</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Eraser className="w-6 h-6 text-neutral-400" />
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Background Removal
            </h1>
          </div>
          <p className="text-neutral-500 text-sm">
            Remove backgrounds from images instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left - Form */}
          <form
            ref={formRef}
            onSubmit={onSubmitHandler}
            className="rounded-xl border border-neutral-800 p-5 h-fit"
          >
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Upload Image
            </label>
            
            {/* Image Preview / Upload Area */}
            <div className="relative">
              {preview ? (
                <div className="relative rounded-lg overflow-hidden border border-neutral-800">
                  <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setInput(null); setPreview(""); }}
                    className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-neutral-800 rounded-lg cursor-pointer hover:border-neutral-700 transition-all">
                  <Eraser className="w-8 h-8 text-neutral-600 mb-2" />
                  <span className="text-sm text-neutral-500">Click to upload image</span>
                  <span className="text-[10px] text-neutral-600 mt-1">JPG, PNG supported</span>
                  <input
                    onChange={(e) => setInput(e.target.files[0])}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>

            <button
              disabled={loading || !input}
              type="submit"
              className="w-full flex justify-center items-center gap-2 
              border border-neutral-700 hover:border-neutral-600 text-white px-5 py-3 mt-5 rounded-lg text-sm font-medium
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-neutral-400 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Eraser className="w-4 h-4" />
                  Remove Background
                </>
              )}
            </button>
          </form>

          {/* Right - Result */}
          <div className="rounded-xl border border-neutral-800 p-5 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eraser className="w-4 h-4 text-neutral-500" />
                <h2 className="text-sm font-medium text-white">Processed Image</h2>
              </div>
              {content && (
                <button
                  onClick={downloadImage}
                  className="text-[10px] text-neutral-400 hover:text-white transition-colors"
                >
                  Download
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin mb-3" />
                  <p className="text-xs text-neutral-500">Removing background...</p>
                </div>
              </div>
            ) : !content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto border border-neutral-800 rounded-full flex items-center justify-center mb-3">
                    <Eraser className="w-5 h-5 text-neutral-600" />
                  </div>
                  <p className="text-xs text-neutral-500">
                    Upload image to remove background
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[repeating-conic-gradient(#1a1a1a_0%_25%,#0d0d0d_0%_50%)] bg-[length:20px_20px] rounded-lg p-4">
                <img src={content} alt="Processed" className="max-w-full max-h-[300px] rounded" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
