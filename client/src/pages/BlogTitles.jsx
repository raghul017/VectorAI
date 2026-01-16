import { Hash, Copy, CheckCircle2, Lightbulb, Zap, History, AlertCircle, RefreshCw, X, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = "vectorai_blog_history";

const BlogTitles = () => {
  const blogCategories = ["General", "Technology", "Health", "Lifestyle", "Travel", "Food", "Education", "Business"];
  const examplePrompts = ["Artificial Intelligence trends", "Healthy meal prep ideas", "Remote work productivity tips"];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);
  const formRef = useRef(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (prompt, category, result) => {
    const entry = { id: Date.now(), prompt, category, result, timestamp: new Date().toISOString() };
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && input && !loading) formRef.current?.requestSubmit();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [input, loading]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      setProgress(0);
      const progressInterval = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 15, 90)), 500);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;
      const { data } = await axios.post("/api/ai/generate-blog-title", { prompt }, { headers: { Authorization: `Bearer ${await getToken()}` } });
      clearInterval(progressInterval);
      setProgress(100);
      if (data.success) { setContent(data.content); saveToHistory(input, selectedCategory, data.content); toast.success("Generated!"); }
      else { setError(data.message || "Failed"); toast.error(data.message); }
    } catch (err) { const errMsg = err.response?.data?.message || err.message || "Network error"; setError(errMsg); toast.error(errMsg); }
    setLoading(false);
    setTimeout(() => setProgress(0), 500);
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(content); setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000); };
  const useExample = (example) => { setInput(example); setError(null); };
  const useHistoryItem = (item) => { setInput(item.prompt); setSelectedCategory(item.category); setContent(item.result); setError(null); setShowHistory(false); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem(STORAGE_KEY); toast.success("Cleared"); };
  const clearError = () => setError(null);

  return (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-purple-950/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto p-6 lg:p-8 pt-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <span className="hover:text-neutral-400 cursor-pointer">Dashboard</span>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-300">Blog Titles</span>
        </div>

        {/* Header with enhanced styling */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Blog Title Generator</h1>
              <p className="text-neutral-500 text-sm">Generate catchy, SEO-friendly blog titles that grab attention.</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
              ${showHistory ? "border-purple-500/50 text-purple-400 bg-purple-500/10" : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800/50"}`}
          >
            <History className="w-4 h-4" />
            History {history.length > 0 && <span className="px-1.5 py-0.5 bg-neutral-700 rounded text-[10px]">{history.length}</span>}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          <form ref={formRef} onSubmit={onSubmitHandler} className="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/20 to-transparent h-20 pointer-events-none" />
            <div className="relative p-6 border-b border-neutral-800/70">
              <h2 className="text-base font-medium text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Configuration
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">Topic or Keyword</label>
                <input
                  onChange={(e) => { setInput(e.target.value); setError(null); }}
                  value={input}
                  type="text"
                  className="w-full p-4 outline-none text-sm rounded-xl border border-neutral-800 
                  focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 bg-neutral-900/80 text-white placeholder:text-neutral-600 transition-all"
                  placeholder="e.g., Artificial Intelligence..."
                  required
                  maxLength={5000}
                />
                <div className="flex justify-between mt-2 text-[11px] text-neutral-600">
                  <span>⌘/Ctrl + Enter to submit</span>
                  <span>{input.length}/5000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {blogCategories.map((item) => (
                    <button type="button" onClick={() => setSelectedCategory(item)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg transition-all border
                        ${selectedCategory === item ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "text-neutral-500 border-neutral-800 hover:border-neutral-700 hover:text-neutral-300"}`}
                      key={item}>{item}</button>
                  ))}
                </div>
              </div>

              <button disabled={loading} type="submit"
                className="w-full flex justify-center items-center gap-2 
                bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500
                text-white px-6 py-4 rounded-xl text-sm font-medium transition-all disabled:opacity-50 relative overflow-hidden shadow-lg shadow-purple-500/20">
                {loading && progress > 0 && <div className="absolute inset-0 bg-white/10 transition-all" style={{ width: `${progress}%` }} />}
                <span className="relative flex items-center gap-2">
                  {loading ? <><span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />Generating... {Math.round(progress)}%</> : <><Hash className="w-4 h-4" />Generate Titles</>}
                </span>
              </button>
            </div>
          </form>

          {/* Result Panel */}
          <div className={`rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden ${showHistory ? "" : "lg:col-span-2"}`}>
            <div className="p-6 border-b border-neutral-800/70 flex items-center justify-between bg-gradient-to-r from-neutral-800/30 to-transparent">
              <h2 className="text-base font-medium text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Generated Titles
              </h2>
              {content && !error && (
                <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium transition-all">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied!" : "Copy All"}
                </button>
              )}
            </div>

            <div className="p-6 min-h-[400px]">
              {error && (
                <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-5 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-400">Generation Failed</h3>
                      <p className="text-xs text-red-400/70 mt-1">{error}</p>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => formRef.current?.requestSubmit()} className="flex items-center gap-1.5 px-4 py-2 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10"><RefreshCw className="w-3 h-3" />Retry</button>
                        <button onClick={clearError} className="flex items-center gap-1.5 px-4 py-2 text-xs text-neutral-400 border border-neutral-800 rounded-lg hover:bg-neutral-800"><X className="w-3 h-3" />Dismiss</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="space-y-4">
                  <div className="h-5 bg-neutral-800/60 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-5 bg-neutral-800/60 rounded-lg w-full animate-pulse" />
                  <div className="h-5 bg-neutral-800/60 rounded-lg w-5/6 animate-pulse" />
                  <div className="h-5 bg-neutral-800/60 rounded-lg w-2/3 animate-pulse" />
                </div>
              ) : !content && !error ? (
                <div className="h-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-neutral-800 flex items-center justify-center mb-6">
                      <Lightbulb className="w-8 h-8 text-neutral-600" />
                    </div>
                    <p className="text-sm text-neutral-400 mb-6">Enter a keyword to generate creative titles</p>
                    <div className="space-y-2">
                      <p className="text-[11px] text-neutral-600 uppercase tracking-wider mb-3">Quick Examples</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {examplePrompts.map((ex, i) => (
                          <button key={i} onClick={() => useExample(ex)} className="flex items-center gap-1.5 px-4 py-2 text-xs text-neutral-400 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-purple-500/30 hover:text-purple-300 transition-all">
                            <Zap className="w-3 h-3" />{ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : content && !error ? (
                <div className="text-neutral-200 leading-relaxed [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-white [&_h1]:mb-4 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-white [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-white [&_strong]:text-white [&_p]:text-neutral-300 [&_p]:mb-3 [&_li]:text-neutral-300 [&_li]:mb-2 [&_ul]:space-y-2 [&_ol]:space-y-2">
                  <Markdown>{content}</Markdown>
                </div>
              ) : null}
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden h-fit">
              <div className="p-5 border-b border-neutral-800/70 flex justify-between items-center">
                <h2 className="text-sm font-medium text-white flex items-center gap-2"><History className="w-4 h-4 text-neutral-500" />History</h2>
                {history.length > 0 && <button onClick={clearHistory} className="text-[11px] text-neutral-500 hover:text-red-400 transition-colors">Clear all</button>}
              </div>
              <div className="max-h-[450px] overflow-y-auto">
                {history.length === 0 ? (
                  <div className="p-8 text-center"><p className="text-xs text-neutral-600">No history yet</p></div>
                ) : (
                  <div className="divide-y divide-neutral-800/50">
                    {history.map((item) => (
                      <button key={item.id} onClick={() => useHistoryItem(item)} className="w-full p-4 text-left hover:bg-neutral-800/30 transition-colors group">
                        <p className="text-sm text-neutral-300 truncate group-hover:text-white transition-colors">{item.prompt}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] px-2 py-0.5 bg-neutral-800 rounded text-neutral-500">{item.category}</span>
                          <span className="text-[10px] text-neutral-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
