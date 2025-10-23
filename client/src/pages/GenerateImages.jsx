import React, { useState, useEffect } from "react";
import { Sparkles, Image, Download, Zap, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Cartoon style",
    "Anime style",
    "Fantasy style",
    "3D style",
    "Portrait style",
    "Oil painting",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [usage, setUsage] = useState({ limit: 15, used: 0, remaining: 15 });

  const { getToken } = useAuth();

  useEffect(() => {
    fetchUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsage = async () => {
    try {
      const { data } = await axios.get("/api/ai/image-usage", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setUsage(data);
      }
    } catch (error) {
      console.error("Error fetching usage:", error);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const prompt = `Generate an image for ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        "/api/ai/generate-images",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success === true) {
        setContent(data.content);
        fetchUsage(); // Refresh usage after successful generation
        toast.success("Image generated successfully!");
      } else {
        toast.error(data?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate image");
    }
    setLoading(false);
  };

  const downloadImage = () => {
    if (content) {
      const link = document.createElement("a");
      link.href = content;
      link.download = `ai-generated-${Date.now()}.png`;
      link.click();
      toast.success("Image downloaded!");
    }
  };

  return (
    <div className="h-full overflow-y-scroll bg-[#0A0A0F]">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              AI Image Generator
            </h1>
          </div>
          <p className="text-gray-400 text-sm lg:text-base">
            Create stunning images with advanced AI technology. Choose your
            style and let our AI bring your imagination to life.
          </p>
        </div>

        {/* Usage Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-300">
            {usage.remaining} of {usage.limit} generations remaining today
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left column - Input Form */}
          <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Image className="w-5 h-5" />
                Create Your Image
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe Your Vision
                </label>
                <textarea
                  rows={5}
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  className="w-full p-4 outline-none text-sm rounded-xl border-2 border-gray-200 
                  focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all
                  resize-none bg-gray-50 focus:bg-white"
                  placeholder="A serene landscape with mountains at sunset, birds flying in the sky, vibrant colors..."
                  required
                  maxLength={1000}
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {input.length}/1000 characters
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Style
                </label>
                <div className="flex gap-2 flex-wrap">
                  {imageStyle.map((item) => (
                    <button
                      type="button"
                      onClick={() => setSelectedStyle(item)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
                        ${
                          selectedStyle === item
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                        }`}
                      key={item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Share with community
                  </span>
                </div>
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publish}
                    onChange={(e) => setPublish(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5 shadow-sm"></span>
                </label>
              </div>

              {/* Generate Button */}
              <button
                disabled={loading || usage.remaining === 0}
                type="submit"
                className="w-full flex justify-center items-center gap-3 
                bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600
                text-white px-6 py-4 rounded-xl font-semibold text-sm
                shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-3 border-t-transparent border-white animate-spin"></span>
                    Generating your masterpiece...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right column - Result */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Your Creation
                </h2>
                {content && (
                  <button
                    onClick={downloadImage}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 
                    text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 min-h-[500px] flex items-center justify-center">
              {!content ? (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                    <Image className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Ready to create?
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      Describe your vision, choose a style, and let our AI
                      transform your words into stunning visuals
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <img
                    src={content}
                    alt="AI Generated"
                    className="w-full h-auto rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
