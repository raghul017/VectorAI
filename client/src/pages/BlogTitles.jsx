import { Hash, Sparkles, Copy, CheckCircle2, Lightbulb } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Health",
    "Lifestyle",
    "Travel",
    "Food",
    "Education",
    "Business",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success === true) {
        setContent(data.content);
        toast.success("Titles generated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Titles copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-scroll bg-[#0A0A0F]">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Blog Title Generator
            </h1>
          </div>
          <p className="text-gray-400 text-sm lg:text-base">
            Generate catchy, SEO-friendly blog titles that grab attention and
            drive clicks. Perfect for content creators and marketers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left column - Input Form */}
          <form
            onSubmit={onSubmitHandler}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden h-fit"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Title Configuration
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Keyword Input */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Enter Your Keyword or Topic
                </label>
                <input
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  type="text"
                  className="w-full p-4 outline-none text-sm rounded-xl border-2 border-white/10 
                  focus:border-purple-400/50 focus:ring-4 focus:ring-purple-500/20 transition-all
                  bg-white/5 focus:bg-white/10 text-white placeholder:text-gray-500"
                  placeholder="e.g., Artificial Intelligence, Healthy Eating, Travel Tips..."
                  required
                  maxLength={5000}
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Select Category
                </label>
                <div className="flex gap-2 flex-wrap">
                  {blogCategories.map((item) => (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(item)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
                        ${
                          selectedCategory === item
                            ? "bg-white/10 text-white border-2 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                        }`}
                      key={item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                disabled={loading}
                type="submit"
                className="w-full flex justify-center items-center gap-3 
                bg-white/10 hover:bg-white/15 border border-white/20
                text-white px-6 py-4 rounded-xl font-semibold text-sm
                hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all transform hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-3 border-t-transparent border-white animate-spin"></span>
                    Generating titles...
                  </>
                ) : (
                  <>
                    <Hash className="w-5 h-5" />
                    Generate Titles
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right column - Result */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Hash className="w-5 h-5 text-purple-400" />
                  Your Titles
                </h2>
                {content && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 
                    text-white rounded-lg text-sm font-medium transition-all border border-white/10"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 min-h-[500px]">
              {!content ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-purple-500/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-500/20">
                      <Lightbulb className="w-10 h-10 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Need title ideas?
                      </h3>
                      <p className="text-sm text-gray-400 max-w-sm mx-auto">
                        Enter your keyword and category to get creative,
                        engaging titles for your blog posts
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm prose-invert max-w-none">
                  <Markdown>{content}</Markdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
