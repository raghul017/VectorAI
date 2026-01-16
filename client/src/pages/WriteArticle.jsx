import { FileText, Copy, CheckCircle2, Edit, Zap, History, AlertCircle, RefreshCw, X, Sparkles, BookOpen } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = "vectorai_article_history";

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short", desc: "500-800 words", icon: "📝" },
    { length: 1200, text: "Medium", desc: "800-1200 words", icon: "📄" },
    { length: 1600, text: "Long", desc: "1200+ words", icon: "📚" },
  ];
  const examplePrompts = ["The Impact of AI on Healthcare", "Tips for Sustainable Living", "Future of Remote Work"];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);
  const articleRef = useRef(null);
  const formRef = useRef(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (prompt, length, result) => {
    const entry = { id: Date.now(), prompt, length: length.text, result, timestamp: new Date().toISOString() };
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  useEffect(() => { if (content && articleRef.current) articleRef.current.scrollTop = 0; }, [content]);

  useEffect(() => {
    const handleKeyDown = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && input && !loading) formRef.current?.requestSubmit(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [input, loading]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      setProgress(0);
      const progressInterval = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 8, 90)), 800);
      const prompt = `Write an article ${input} in ${selectedLength.text} (${selectedLength.desc})`;
      const { data } = await axios.post("/api/ai/generate-article", { prompt, length: selectedLength.length }, { headers: { Authorization: `Bearer ${await getToken()}` } });
      clearInterval(progressInterval);
      setProgress(100);
      if (data.success) { setContent(data.content); saveToHistory(input, selectedLength, data.content); toast.success("Generated!"); }
      else { setError(data.message || "Failed"); toast.error(data.message); }
    } catch (err) { const errMsg = err.response?.data?.message || err.message || "Network error"; setError(errMsg); toast.error(errMsg); }
    setLoading(false);
    setTimeout(() => setProgress(0), 500);
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(content); setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000); };
  const useExample = (ex) => { setInput(ex); setError(null); };
  const useHistoryItem = (item) => { setInput(item.prompt); setSelectedLength(articleLength.find((a) => a.text === item.length) || articleLength[0]); setContent(item.result); setError(null); setShowHistory(false); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem(STORAGE_KEY); toast.success("Cleared"); };
  const wordCount = content ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto p-6 lg:p-8 pt-20">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <span className="hover:text-neutral-400 cursor-pointer">Dashboard</span>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-300">Write Article</span>
        </div>

        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Article Writer</h1>
              <p className="text-neutral-500 text-sm">Generate high-quality, SEO-optimized articles in seconds.</p>
            </div>
          </div>
          <button onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
              ${showHistory ? "border-blue-500/50 text-blue-400 bg-blue-500/10" : "border-neutral-800 text-neutral-400 hover:border-neutral-700"}`}>
            <History className="w-4 h-4" />History {history.length > 0 && <span className="px-1.5 py-0.5 bg-neutral-700 rounded text-[10px]">{history.length}</span>}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <form ref={formRef} onSubmit={onSubmitHandler} className="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/20 to-transparent h-20 pointer-events-none" />
            <div className="relative p-6 border-b border-neutral-800/70">
              <h2 className="text-base font-medium text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-400" />Configuration</h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">Article Topic</label>
                <input onChange={(e) => { setInput(e.target.value); setError(null); }} value={input} type="text"
                  className="w-full p-4 outline-none text-sm rounded-xl border border-neutral-800 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 bg-neutral-900/80 text-white placeholder:text-neutral-600 transition-all"
                  placeholder="e.g., The Impact of AI on Healthcare" required maxLength={5000} />
                <div className="flex justify-between mt-2 text-[11px] text-neutral-600"><span>⌘/Ctrl + Enter</span><span>{input.length}/5000</span></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">Article Length</label>
                <div className="grid grid-cols-3 gap-3">
                  {articleLength.map((item, i) => (
                    <button type="button" onClick={() => setSelectedLength(item)} key={i}
                      className={`p-4 text-center rounded-xl border transition-all ${selectedLength.text === item.text 
                        ? "bg-blue-500/20 border-blue-500/30 text-blue-300" 
                        : "border-neutral-800 text-neutral-400 hover:border-neutral-700"}`}>
                      <div className="text-lg mb-1">{item.icon}</div>
                      <div className="text-xs font-medium">{item.text}</div>
                      <div className="text-[10px] text-neutral-500 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button disabled={loading} type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500
                text-white px-6 py-4 rounded-xl text-sm font-medium transition-all disabled:opacity-50 relative overflow-hidden shadow-lg shadow-blue-500/20">
                {loading && progress > 0 && <div className="absolute inset-0 bg-white/10" style={{ width: `${progress}%` }} />}
                <span className="relative flex items-center gap-2">
                  {loading ? <><span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />Writing... {Math.round(progress)}%</> : <><Edit className="w-4 h-4" />Generate Article</>}
                </span>
              </button>
            </div>
          </form>

          <div className={`rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden ${showHistory ? "" : "lg:col-span-2"}`}>
            <div className="p-6 border-b border-neutral-800/70 flex items-center justify-between bg-gradient-to-r from-neutral-800/30 to-transparent">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-medium text-white flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-400" />Your Article</h2>
                {content && !error && <span className="text-[11px] text-neutral-500 px-2.5 py-1 bg-neutral-800 rounded-lg">{wordCount} words</span>}
              </div>
              {content && !error && <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied!" : "Copy"}</button>}
            </div>

            <div ref={articleRef} className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
              {error && (
                <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-5 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><AlertCircle className="w-5 h-5 text-red-400" /></div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-400">Error</h3>
                      <p className="text-xs text-red-400/70 mt-1">{error}</p>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => formRef.current?.requestSubmit()} className="flex items-center gap-1.5 px-4 py-2 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10"><RefreshCw className="w-3 h-3" />Retry</button>
                        <button onClick={() => setError(null)} className="flex items-center gap-1.5 px-4 py-2 text-xs text-neutral-400 border border-neutral-800 rounded-lg hover:bg-neutral-800"><X className="w-3 h-3" />Dismiss</button>
                      </div>
                    </div>
                  </div>
                </div>)}

              {loading ? (
                <div className="space-y-4"><div className="h-7 bg-neutral-800/60 rounded-lg w-2/3 animate-pulse" /><div className="space-y-3"><div className="h-4 bg-neutral-800/60 rounded w-full animate-pulse" /><div className="h-4 bg-neutral-800/60 rounded w-full animate-pulse" /><div className="h-4 bg-neutral-800/60 rounded w-4/5 animate-pulse" /></div></div>
              ) : !content && !error ? (
                <div className="h-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-neutral-800 flex items-center justify-center mb-6"><FileText className="w-8 h-8 text-neutral-600" /></div>
                    <p className="text-sm text-neutral-400 mb-6">Enter a topic to generate your article</p>
                    <div className="space-y-2">
                      <p className="text-[11px] text-neutral-600 uppercase tracking-wider mb-3">Quick Examples</p>
                      <div className="flex flex-col gap-2">{examplePrompts.map((ex, i) => <button key={i} onClick={() => useExample(ex)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-neutral-400 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-blue-500/30 hover:text-blue-300"><Zap className="w-3 h-3" />{ex}</button>)}</div>
                    </div>
                  </div>
                </div>
              ) : content && !error ? (
                <div className="text-neutral-200 leading-relaxed [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-white [&_h1]:mb-4 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-white [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-white [&_strong]:text-white [&_p]:text-neutral-300 [&_p]:mb-3 [&_li]:text-neutral-300 [&_li]:mb-2"><Markdown>{content}</Markdown></div>
              ) : null}
            </div>
          </div>

          {showHistory && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden h-fit">
              <div className="p-5 border-b border-neutral-800/70 flex justify-between items-center">
                <h2 className="text-sm font-medium text-white flex items-center gap-2"><History className="w-4 h-4 text-neutral-500" />History</h2>
                {history.length > 0 && <button onClick={clearHistory} className="text-[11px] text-neutral-500 hover:text-red-400">Clear</button>}
              </div>
              <div className="max-h-[450px] overflow-y-auto">
                {history.length === 0 ? <p className="p-8 text-center text-xs text-neutral-600">No history yet</p> : (
                  <div className="divide-y divide-neutral-800/50">{history.map((item) => (
                    <button key={item.id} onClick={() => useHistoryItem(item)} className="w-full p-4 text-left hover:bg-neutral-800/30 group">
                      <p className="text-sm text-neutral-300 truncate group-hover:text-white">{item.prompt}</p>
                      <div className="flex items-center gap-2 mt-2"><span className="text-[10px] px-2 py-0.5 bg-neutral-800 rounded">{item.length}</span><span className="text-[10px] text-neutral-600">{new Date(item.timestamp).toLocaleDateString()}</span></div>
                    </button>
                  ))}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
