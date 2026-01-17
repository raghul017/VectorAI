import { ShoppingBag, Copy, CheckCircle2, Zap, History, AlertCircle, RefreshCw, X, Sparkles, Tag, Star, Award, TrendingUp, Package, Gem, Leaf, Cpu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = "vectorai_product_history";

const ProductDescription = () => {
  const styles = [
    { id: "professional", name: "Professional", icon: Award, desc: "Corporate & B2B", color: "text-blue-400" },
    { id: "casual", name: "Friendly", icon: Star, desc: "Approachable & warm", color: "text-yellow-400" },
    { id: "luxury", name: "Luxury", icon: Gem, desc: "Premium & exclusive", color: "text-purple-400" },
    { id: "technical", name: "Technical", icon: Cpu, desc: "Specs-focused", color: "text-cyan-400" },
    { id: "eco", name: "Eco-Friendly", icon: Leaf, desc: "Sustainability focus", color: "text-emerald-400" },
    { id: "minimalist", name: "Minimalist", icon: Package, desc: "Clean & simple", color: "text-neutral-300" },
  ];
  
  const platforms = [
    { id: "amazon", name: "Amazon", tips: "Bullet points are key. Front-load keywords." },
    { id: "shopify", name: "Shopify", tips: "Story-driven. Beautiful formatting." },
    { id: "ebay", name: "eBay", tips: "Competitive pricing mention. Trust builders." },
    { id: "etsy", name: "Etsy", tips: "Handmade/unique angle. Personal touch." },
    { id: "general", name: "General", tips: "Versatile for any platform." },
  ];

  const lengths = [
    { id: "short", name: "Short", desc: "50-100 words" },
    { id: "medium", name: "Medium", desc: "150-250 words" },
    { id: "long", name: "Detailed", desc: "300-500 words" },
  ];

  const examplePrompts = [
    "Wireless noise-cancelling headphones with 40-hour battery",
    "Organic vitamin C serum for face with hyaluronic acid",
    "Ergonomic mesh office chair with lumbar support",
    "Handmade leather wallet with RFID protection"
  ];

  const [selectedStyle, setSelectedStyle] = useState("professional");
  const [selectedPlatform, setSelectedPlatform] = useState("shopify");
  const [selectedLength, setSelectedLength] = useState("medium");
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [price, setPrice] = useState("");
  const [includeBullets, setIncludeBullets] = useState(true);
  const [includeSEO, setIncludeSEO] = useState(true);
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

  const saveToHistory = (name, style, platform, result) => {
    const entry = { id: Date.now(), name, style, platform, result, timestamp: new Date().toISOString() };
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && productName && !loading) formRef.current?.requestSubmit();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [productName, loading]);

  const getStylePrompt = (style) => {
    const prompts = {
      professional: "Write in a confident, authoritative voice that builds trust. Focus on ROI and business value. Use industry terminology appropriately.",
      casual: "Write in a warm, conversational tone like talking to a friend. Use relatable language and light humor where appropriate.",
      luxury: "Write with sophistication and exclusivity. Emphasize craftsmanship, premium materials, and status. Make the reader feel special.",
      technical: "Lead with specifications and performance data. Include technical details, measurements, and comparisons. Appeal to informed buyers.",
      eco: "Emphasize sustainability, ethical sourcing, and environmental impact. Use words like 'sustainable', 'renewable', 'eco-conscious'.",
      minimalist: "Keep it clean and simple. Focus on essential benefits only. White space and brevity are key. Less is more."
    };
    return prompts[style];
  };

  const getPlatformPrompt = (platform) => {
    const prompts = {
      amazon: `FORMAT FOR AMAZON:
- Start with a compelling title (include main keyword, brand, key feature)
- Provide 5 bullet points (start each with CAPS keyword, then benefit)
- Short paragraph for "About this item" section
- Focus on searchable keywords naturally`,

      shopify: `FORMAT FOR SHOPIFY:
- Create an engaging headline
- Write 2-3 paragraphs that tell a story
- Include a "Features" or "What's Included" section
- Add a "Perfect For" section mentioning use cases
- End with sizing/specs if relevant`,

      ebay: `FORMAT FOR EBAY:
- Clear, keyword-rich title
- Condition and authenticity mentions
- Competitive advantages
- Shipping/return policy friendly language
- Trust builders (warranty, guarantee mentions)`,

      etsy: `FORMAT FOR ETSY:
- Personal story/maker connection
- Handmade/unique selling points
- Materials and process details
- Size/customization options
- Gift-ready messaging if applicable`,

      general: `FORMAT (VERSATILE):
- Compelling headline
- Problem-solution opening
- Key benefits as bullet points
- Feature details
- Call-to-action`
    };
    return prompts[platform];
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      setProgress(0);
      const progressInterval = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 15, 90)), 500);
      
      const styleInfo = styles.find(s => s.id === selectedStyle);
      const platformInfo = platforms.find(p => p.id === selectedPlatform);
      const lengthInfo = lengths.find(l => l.id === selectedLength);
      
      const prompt = `You are an expert e-commerce copywriter who creates product descriptions that convert browsers into buyers.

PRODUCT: ${productName}
PLATFORM: ${platformInfo.name}
STYLE: ${styleInfo.name}
LENGTH: ${lengthInfo.desc}
${targetAudience ? `TARGET AUDIENCE: ${targetAudience}` : ""}
${price ? `PRICE POINT: ${price}` : ""}
${features ? `KEY FEATURES TO HIGHLIGHT:\n${features}` : ""}

STYLE GUIDELINES:
${getStylePrompt(selectedStyle)}

${getPlatformPrompt(selectedPlatform)}

WRITING REQUIREMENTS:
${includeBullets ? "- Include bullet points for key features/benefits" : "- Use paragraph format, no bullet points"}
${includeSEO ? "- Naturally incorporate SEO keywords throughout" : "- Focus on readability over SEO"}
- Use power words that drive emotion and action
- Address the customer's pain points and desires
- Include sensory language where appropriate
- End with urgency or clear next step

FORMAT THE OUTPUT BEAUTIFULLY:
Use clear headers (##) to separate sections.
Make it scannable and easy to read.
Bold **key phrases** that should stand out.`;
      
      const { data } = await axios.post("/api/ai/generate-article", { prompt }, { headers: { Authorization: `Bearer ${await getToken()}` } });
      clearInterval(progressInterval);
      setProgress(100);
      if (data.success) { setContent(data.content); saveToHistory(productName, selectedStyle, selectedPlatform, data.content); toast.success("Generated!"); }
      else { setError(data.message || "Failed"); toast.error(data.message); }
    } catch (err) { const errMsg = err.response?.data?.message || err.message || "Network error"; setError(errMsg); toast.error(errMsg); }
    setLoading(false);
    setTimeout(() => setProgress(0), 500);
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(content); setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000); };
  const useExample = (example) => { setProductName(example); setError(null); };
  const useHistoryItem = (item) => { setProductName(item.name); setSelectedStyle(item.style); setSelectedPlatform(item.platform); setContent(item.result); setError(null); setShowHistory(false); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem(STORAGE_KEY); toast.success("Cleared"); };
  const clearError = () => setError(null);

  const currentPlatform = platforms.find(p => p.id === selectedPlatform);
  const currentStyle = styles.find(s => s.id === selectedStyle);

  return (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-orange-950/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto p-6 lg:p-8 pt-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <span className="hover:text-neutral-400 cursor-pointer">Dashboard</span>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-300">Product Descriptions</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/20 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Product Descriptions</h1>
              <p className="text-neutral-500 text-sm">Create compelling product copy that converts on any platform.</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
              ${showHistory ? "border-orange-500/50 text-orange-400 bg-orange-500/10" : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800/50"}`}
          >
            <History className="w-4 h-4" />
            History {history.length > 0 && <span className="px-1.5 py-0.5 bg-neutral-800 rounded-md">{history.length}</span>}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className={`${showHistory ? "lg:col-span-2" : "lg:col-span-3"}`}>
            <form ref={formRef} onSubmit={onSubmitHandler} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-neutral-300">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Create Product Copy</span>
                </div>
                <span className="text-[10px] text-neutral-600 uppercase tracking-wider">⌘ + Enter to generate</span>
              </div>

              <div className="p-6 space-y-6">
                {/* Product Name */}
                <div>
                  <label className="text-xs text-neutral-500 mb-3 block">Product Name & Brief Description</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => { setProductName(e.target.value); setError(null); }}
                    placeholder="e.g., Wireless Bluetooth Headphones with Active Noise Cancellation"
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-orange-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all"
                  />
                </div>

                {/* Platform & Style Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Platform */}
                  <div>
                    <label className="text-xs text-neutral-500 mb-3 block">Platform</label>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((platform) => (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => setSelectedPlatform(platform.id)}
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all
                            ${selectedPlatform === platform.id
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "bg-neutral-800/50 text-neutral-400 border border-neutral-700 hover:bg-neutral-800"}`}
                        >
                          {platform.name}
                        </button>
                      ))}
                    </div>
                    {/* Platform Tip */}
                    <p className="mt-2 text-[10px] text-neutral-600">💡 {currentPlatform.tips}</p>
                  </div>

                  {/* Length */}
                  <div>
                    <label className="text-xs text-neutral-500 mb-3 block">Description Length</label>
                    <div className="flex gap-2">
                      {lengths.map((len) => (
                        <button
                          key={len.id}
                          type="button"
                          onClick={() => setSelectedLength(len.id)}
                          className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium transition-all text-center
                            ${selectedLength === len.id
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "bg-neutral-800/50 text-neutral-400 border border-neutral-700 hover:bg-neutral-800"}`}
                        >
                          <div>{len.name}</div>
                          <div className="text-[10px] opacity-60">{len.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Style */}
                <div>
                  <label className="text-xs text-neutral-500 mb-3 block">Writing Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
                        className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border text-center transition-all
                          ${selectedStyle === style.id
                            ? "border-orange-500/50 bg-orange-500/10"
                            : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50"}`}
                      >
                        <style.icon className={`w-5 h-5 ${selectedStyle === style.id ? style.color : "text-neutral-500"}`} />
                        <span className={`text-xs font-medium ${selectedStyle === style.id ? "text-white" : "text-neutral-400"}`}>{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-500 mb-2 block">Target Audience (optional)</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., Remote workers, gamers, audiophiles"
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-orange-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 mb-2 block">Price Point (optional)</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., $199, Premium, Budget-friendly"
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-orange-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="text-xs text-neutral-500 mb-3 block">Key Features (optional, one per line)</label>
                  <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="40-hour battery life&#10;Active noise cancellation&#10;Premium leather earcups&#10;Bluetooth 5.3 + wired option"
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-orange-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all resize-none"
                  />
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeBullets} onChange={(e) => setIncludeBullets(e.target.checked)} className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-orange-500 focus:ring-orange-500/20" />
                    <span className="text-xs text-neutral-400">• Include bullet points</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeSEO} onChange={(e) => setIncludeSEO(e.target.checked)} className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-orange-500 focus:ring-orange-500/20" />
                    <span className="text-xs text-neutral-400">🔍 SEO optimized</span>
                  </label>
                </div>

                {/* Quick Examples */}
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((ex, i) => (
                    <button key={i} type="button" onClick={() => useExample(ex)}
                      className="px-3 py-1.5 text-[10px] rounded-lg bg-neutral-800/50 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 border border-neutral-800 transition-all">
                      {ex}
                    </button>
                  ))}
                </div>

                {/* Progress */}
                {loading && (
                  <div className="space-y-2">
                    <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-neutral-500 text-center">Creating product copy... {Math.round(progress)}%</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !productName}
                  className="w-full py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white"
                >
                  {loading ? <><Zap className="w-4 h-4 animate-pulse" /> Generating...</> : <><Zap className="w-4 h-4" /> Generate Description</>}
                </button>
              </div>
            </form>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/30 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-400 mb-1">Generation Failed</h3>
                    <p className="text-xs text-red-400/70">{error}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => formRef.current?.requestSubmit()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10">
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                      <button onClick={clearError} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 border border-neutral-700 rounded-lg hover:bg-neutral-800">
                        <X className="w-3 h-3" /> Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Result - Beautiful Product Preview */}
            {content && !loading && (
              <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-r from-orange-500/5 to-amber-500/5">
                  <div className="flex items-center gap-3">
                    <currentStyle.icon className={`w-4 h-4 ${currentStyle.color}`} />
                    <span className="text-sm font-medium text-neutral-300">{currentPlatform.name} Listing</span>
                    <span className="text-xs text-neutral-600">• {currentStyle.name} style</span>
                  </div>
                  <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy All"}
                  </button>
                </div>
                
                {/* Product Description Preview */}
                <div className="p-6 text-neutral-200">
                  <div className="prose prose-invert prose-sm max-w-none
                    [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-0 [&_h1]:mb-4
                    [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-orange-400 [&_h2]:mt-6 [&_h2]:mb-3
                    [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2
                    [&_p]:text-neutral-200 [&_p]:leading-relaxed [&_p]:mb-3
                    [&_strong]:text-white [&_strong]:font-semibold
                    [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:text-neutral-200 [&_ul]:space-y-2 [&_ul]:my-4
                    [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:text-neutral-200 [&_ol]:space-y-2 [&_ol]:my-4
                    [&_li]:text-neutral-200 [&_li]:leading-relaxed
                    [&_blockquote]:border-l-2 [&_blockquote]:border-orange-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-400
                    [&_hr]:border-neutral-700 [&_hr]:my-6
                    [&_code]:bg-neutral-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-orange-400
                  ">
                    <Markdown>{content}</Markdown>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden h-fit">
              <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-medium text-neutral-300">History</h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-[10px] text-red-400 hover:text-red-300">Clear all</button>
                )}
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-xs text-neutral-600 text-center py-4">No history yet</p>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => useHistoryItem(item)}
                      className="w-full text-left p-3 rounded-xl bg-neutral-800/30 hover:bg-neutral-800/50 border border-neutral-800 transition-all"
                    >
                      <p className="text-xs text-neutral-300 truncate mb-1">{item.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-600">
                        <span className="capitalize">{item.platform}</span>
                        <span>•</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
