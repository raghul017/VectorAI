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
    <div className="h-full overflow-y-scroll bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Blog Title Generator
            </h1>
          </div>
          <p className="text-gray-600 text-sm lg:text-base">
            Generate catchy, SEO-friendly blog titles that grab attention and
            drive clicks. Perfect for content creators and marketers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left column - Input Form */}
          <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-fit"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Title Configuration
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Keyword Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Your Keyword or Topic
                </label>
                <input
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  type="text"
                  className="w-full p-4 outline-none text-sm rounded-xl border-2 border-gray-200 
                  focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all
                  bg-gray-50 focus:bg-white"
                  placeholder="e.g., Artificial Intelligence, Healthy Eating, Travel Tips..."
                  required
                  maxLength={5000}
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
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
                bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                text-white px-6 py-4 rounded-xl font-semibold text-sm
                shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Your Titles
                </h2>
                {content && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 
                    text-white rounded-lg text-sm font-medium transition-all"
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
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-10 h-10 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Need title ideas?
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        Enter your keyword and category to get creative,
                        engaging titles for your blog posts
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700">
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
