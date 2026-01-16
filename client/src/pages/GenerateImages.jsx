import React, { useState, useEffect, useRef } from "react";
import { Image, Download, Zap, Wand2, Share2, History, X, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = "vectorai_image_history";

const GenerateImages = () => {
  const imageStyle = [
    { name: "Realistic", icon: "📷" },
    { name: "Ghibli style", icon: "🏯" },
    { name: "Cartoon style", icon: "🎨" },
    { name: "Anime style", icon: "⚡" },
    { name: "Fantasy style", icon: "🐉" },
    { name: "3D style", icon: "🎮" },
    { name: "Portrait style", icon: "👤" },
    { name: "Oil painting", icon: "🖼️" },
  ];
  const examplePrompts = ["A serene mountain landscape at sunset", "Futuristic city with flying cars", "Cute cat wearing a wizard hat"];

  const [selectedStyle, setSelectedStyle] = useState(imageStyle[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState({ limit: 15, used: 0, remaining: 15 });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState("");
  const formRef = useRef(null);
  const { getToken } = useAuth();

  const progressSteps = ["Analyzing prompt...", "Selecting style...", "Generating composition...", "Adding details...", "Applying effects...", "Finalizing..."];

  useEffect(() => { fetchUsage(); const saved = localStorage.getItem(STORAGE_KEY); if (saved) setHistory(JSON.parse(saved)); }, []);

  const saveToHistory = (prompt, style, imageUrl) => {
    const entry = { id: Date.now(), prompt, style: style.name, image: imageUrl, timestamp: new Date().toISOString() };
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    const handleKeyDown = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && input && !loading) formRef.current?.requestSubmit(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [input, loading]);

  const fetchUsage = async () => {
    try { const { data } = await axios.get("/api/ai/image-usage", { headers: { Authorization: `Bearer ${await getToken()}` } }); if (data.success) setUsage(data); } catch (e) { console.error(e); }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true); setProgress(0); setProgressStep(progressSteps[0]);
      let stepIndex = 0;
      const progressInterval = setInterval(() => {
        setProgress((p) => { const np = Math.min(p + Math.random() * 10, 90); const ns = Math.floor(np / 15); if (ns !== stepIndex && ns < progressSteps.length) { stepIndex = ns; setProgressStep(progressSteps[ns]); } return np; });
      }, 1500);
      const prompt = `Generate an image for ${input} in the style ${selectedStyle.name}`;
      const { data } = await axios.post("/api/ai/generate-images", { prompt, publish }, { headers: { Authorization: `Bearer ${await getToken()}` } });
      clearInterval(progressInterval); setProgress(100); setProgressStep("Complete!");
      if (data.success) { setContent(data.content); saveToHistory(input, selectedStyle, data.content); fetchUsage(); toast.success("Generated!"); }
      else { setError(data?.message || "Failed"); toast.error(data?.message); }
    } catch (err) { const errMsg = err.response?.data?.message || err.message || "Network error"; setError(errMsg); toast.error(errMsg); }
    setLoading(false); setTimeout(() => { setProgress(0); setProgressStep(""); }, 1000);
  };

  const downloadImage = () => { if (content) { const link = document.createElement("a"); link.href = content; link.download = `ai-generated-${Date.now()}.png`; link.click(); toast.success("Downloaded!"); } };
  const useExample = (ex) => { setInput(ex); setError(null); };
  const useHistoryItem = (item) => { setInput(item.prompt); setSelectedStyle(imageStyle.find((s) => s.name === item.style) || imageStyle[0]); setContent(item.image); setError(null); setShowHistory(false); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem(STORAGE_KEY); toast.success("Cleared"); };

  return (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-emerald-950/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto p-6 lg:p-8 pt-20">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <span className="hover:text-neutral-400 cursor-pointer">Dashboard</span>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-300">Generate Images</span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Image Generator</h1>
              <p className="text-neutral-500 text-sm">Transform your imagination into stunning visuals.</p>
            </div>
          </div>
          <button onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
              ${showHistory ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" : "border-neutral-800 text-neutral-400 hover:border-neutral-700"}`}>
            <History className="w-4 h-4" />History {history.length > 0 && <span className="px-1.5 py-0.5 bg-neutral-700 rounded text-[10px]">{history.length}</span>}
          </button>
        </div>

        {/* Usage Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-4 px-5 py-3 rounded-xl border border-neutral-800 bg-neutral-900/50">
            <Zap className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="flex items-baseline gap-1"><span className="text-lg font-semibold text-white">{usage.remaining}</span><span className="text-sm text-neutral-500">/ {usage.limit}</span></div>
              <p className="text-[10px] text-neutral-600">images remaining</p>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all" style={{ width: `${(usage.remaining / usage.limit) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <form ref={formRef} onSubmit={onSubmitHandler} className="lg:col-span-2 relative rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/20 to-transparent h-20 pointer-events-none" />
            <div className="relative p-6 border-b border-neutral-800/70">
              <h2 className="text-base font-medium text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" />Create Image</h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">Describe Your Vision</label>
                <textarea rows={3} onChange={(e) => { setInput(e.target.value); setError(null); }} value={input}
                  className="w-full p-4 outline-none text-sm rounded-xl border border-neutral-800 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 resize-none bg-neutral-900/80 text-white placeholder:text-neutral-600 transition-all"
                  placeholder="A serene landscape..." required maxLength={1000} />
                <div className="flex justify-between mt-2 text-[11px] text-neutral-600"><span>⌘/Ctrl + Enter</span><span>{input.length}/1000</span></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">Art Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {imageStyle.map((item) => (
                    <button type="button" onClick={() => setSelectedStyle(item)} key={item.name}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all
                        ${selectedStyle.name === item.name ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "border-neutral-800 text-neutral-400 hover:border-neutral-700"}`}>
                      <span className="text-lg">{item.icon}</span><span className="text-xs">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
                <div className="flex items-center gap-3"><Share2 className="w-5 h-5 text-neutral-500" /><div><span className="text-sm text-neutral-300">Share to Community</span><p className="text-[10px] text-neutral-600">Others can see your creation</p></div></div>
                <label className="relative cursor-pointer">
                  <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-800 rounded-full peer-checked:bg-emerald-600 transition-all border border-neutral-700" />
                  <span className="absolute left-1 top-1 w-4 h-4 bg-neutral-400 rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-white" />
                </label>
              </div>

              <button disabled={loading || usage.remaining === 0} type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500
                text-white px-6 py-4 rounded-xl text-sm font-medium transition-all disabled:opacity-50 relative overflow-hidden shadow-lg shadow-emerald-500/20">
                {loading && progress > 0 && <div className="absolute inset-0 bg-white/10" style={{ width: `${progress}%` }} />}
                <span className="relative flex items-center gap-2">
                  {loading ? <><span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />{Math.round(progress)}%</> : <><Wand2 className="w-4 h-4" />Generate</>}
                </span>
              </button>
              {loading && progressStep && <p className="text-center text-xs text-neutral-500 mt-2">{progressStep}</p>}
            </div>
          </form>

          <div className={`rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden ${showHistory ? "lg:col-span-2" : "lg:col-span-3"}`}>
            <div className="p-6 border-b border-neutral-800/70 flex justify-between items-center bg-gradient-to-r from-neutral-800/30 to-transparent">
              <h2 className="text-base font-medium text-white flex items-center gap-2"><Image className="w-4 h-4 text-emerald-400" />Your Creation</h2>
              {content && !error && <button onClick={downloadImage} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium"><Download className="w-3.5 h-3.5" />Download</button>}
            </div>

            <div className="p-6 min-h-[400px] flex items-center justify-center">
              {error && !loading && (
                <div className="w-full">
                  <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><AlertCircle className="w-5 h-5 text-red-400" /></div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-400">Generation Failed</h3>
                        <p className="text-xs text-red-400/70 mt-1">{error}</p>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => formRef.current?.requestSubmit()} className="flex items-center gap-1.5 px-4 py-2 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10"><RefreshCw className="w-3 h-3" />Retry</button>
                          <button onClick={() => setError(null)} className="flex items-center gap-1.5 px-4 py-2 text-xs text-neutral-400 border border-neutral-800 rounded-lg hover:bg-neutral-800"><X className="w-3 h-3" />Dismiss</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {loading ? (
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-neutral-800 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-emerald-400 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center"><Wand2 className="w-8 h-8 text-emerald-400" /></div>
                  </div>
                  <p className="text-sm text-neutral-300 font-medium">{progressStep}</p>
                  <p className="text-xs text-neutral-600 mt-1">~15-30 seconds</p>
                </div>
              ) : !content && !error ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-neutral-800 flex items-center justify-center mb-6"><Image className="w-10 h-10 text-neutral-600" /></div>
                  <p className="text-sm text-neutral-400 mb-6">Describe your vision to create art</p>
                  <div className="space-y-2">
                    <p className="text-[11px] text-neutral-600 uppercase tracking-wider mb-3">Quick Examples</p>
                    <div className="flex flex-col gap-2">{examplePrompts.map((ex, i) => <button key={i} onClick={() => useExample(ex)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-neutral-400 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-emerald-500/30 hover:text-emerald-300"><Zap className="w-3 h-3" />{ex}</button>)}</div>
                  </div>
                </div>
              ) : content && !error ? <img src={content} alt="AI Generated" className="w-full h-auto rounded-xl shadow-2xl" /> : null}
            </div>
          </div>

          {showHistory && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden h-fit">
              <div className="p-5 border-b border-neutral-800/70 flex justify-between items-center">
                <h2 className="text-sm font-medium text-white flex items-center gap-2"><History className="w-4 h-4 text-neutral-500" />History</h2>
                {history.length > 0 && <button onClick={clearHistory} className="text-[11px] text-neutral-500 hover:text-red-400">Clear</button>}
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {history.length === 0 ? <p className="p-6 text-center text-xs text-neutral-600">No history yet</p> : (
                  <div className="grid grid-cols-2 gap-2">{history.map((item) => (
                    <button key={item.id} onClick={() => useHistoryItem(item)} className="rounded-xl overflow-hidden border border-neutral-800 hover:border-emerald-500/30 group">
                      <img src={item.image} alt="" className="w-full aspect-square object-cover" />
                      <div className="p-2 bg-neutral-900"><p className="text-[10px] text-neutral-400 truncate group-hover:text-white">{item.prompt}</p></div>
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

export default GenerateImages;
