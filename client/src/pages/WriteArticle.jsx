import { Sparkles, FileText, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Edit } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short", desc: "500-800 words" },
    { length: 1200, text: "Medium", desc: "800-1200 words" },
    { length: 1600, text: "Long", desc: "1200+ words" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article ${input} in ${selectedLength.text} (${selectedLength.desc})`;
      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success === true) {
        setContent(data.content);
        toast.success("Article generated successfully!");
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
    toast.success("Article copied to clipboard!");
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Article Writer
            </h1>
          </div>
          <p className="text-gray-400 text-sm lg:text-base">
            Generate high-quality, SEO-optimized articles in seconds. Perfect
            for blogs, websites, and content marketing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left column - Input Form */}
          <form
            onSubmit={onSubmitHandler}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden h-fit"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Article Configuration
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Article Topic
                </label>
                <input
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  type="text"
                  className="w-full p-4 outline-none text-sm rounded-xl border-2 border-white/10 
                  focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all
                  bg-white/5 focus:bg-white/10 text-white placeholder:text-gray-500"
                  placeholder="e.g., The Impact of AI on Modern Healthcare"
                  required
                  maxLength={5000}
                />
              </div>

              {/* Length Selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Article Length
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {articleLength.map((item, index) => (
                    <button
                      type="button"
                      onClick={() => setSelectedLength(item)}
                      className={`p-4 text-center rounded-xl border-2 transition-all ${
                        selectedLength.text === item.text
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105"
                          : "bg-white/5 text-gray-300 border-white/10 hover:border-purple-500/30 hover:bg-white/10"
                      }`}
                      key={index}
                    >
                      <div className="font-semibold text-sm">{item.text}</div>
                      <div
                        className={`text-xs mt-1 ${
                          selectedLength.text === item.text
                            ? "text-purple-100"
                            : "text-gray-500"
                        }`}
                      >
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                disabled={loading}
                type="submit"
                className="w-full flex justify-center items-center gap-3 
                bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
                text-white px-6 py-4 rounded-xl font-semibold text-sm
                shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all transform hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-3 border-t-transparent border-white animate-spin"></span>
                    Crafting your article...
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5" />
                    Generate Article
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right column - Result */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Article
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

            <div className="p-6 min-h-[500px] max-h-[600px] overflow-y-auto">
              {!content ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Ready to write?
                      </h3>
                      <p className="text-sm text-gray-400 max-w-sm mx-auto">
                        Enter your topic, choose length, and let AI create
                        engaging content for you
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

export default WriteArticle;
