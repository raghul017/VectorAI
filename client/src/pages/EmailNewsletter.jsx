import { Mail, Copy, CheckCircle2, Zap, History, AlertCircle, RefreshCw, X, Sparkles, Send, FileText, Megaphone, Heart, Gift, Users, Calendar, Handshake, Bell, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = "vectorai_email_history";

const EmailNewsletter = () => {
  const emailTypes = [
    { id: "welcome", name: "Welcome", icon: Heart, desc: "Onboard new subscribers", color: "text-pink-400" },
    { id: "newsletter", name: "Newsletter", icon: FileText, desc: "Weekly/monthly updates", color: "text-blue-400" },
    { id: "promo", name: "Promotional", icon: Megaphone, desc: "Sales & offers", color: "text-orange-400" },
    { id: "launch", name: "Product Launch", icon: Gift, desc: "New product/feature", color: "text-purple-400" },
    { id: "followup", name: "Follow-up", icon: Send, desc: "Re-engage users", color: "text-cyan-400" },
    { id: "event", name: "Event Invite", icon: Calendar, desc: "Webinars & events", color: "text-emerald-400" },
    { id: "educational", name: "Educational", icon: BookOpen, desc: "Tips & tutorials", color: "text-yellow-400" },
    { id: "custom", name: "Custom", icon: Bell, desc: "Enter your own type", color: "text-neutral-400" },
  ];
  
  const tones = [
    { id: "professional", name: "Professional", emoji: "💼" },
    { id: "friendly", name: "Friendly", emoji: "😊" },
    { id: "urgent", name: "Urgent", emoji: "⚡" },
    { id: "casual", name: "Casual", emoji: "👋" },
    { id: "formal", name: "Formal", emoji: "📋" },
    { id: "enthusiastic", name: "Enthusiastic", emoji: "🎉" },
    { id: "empathetic", name: "Empathetic", emoji: "💙" },
    { id: "persuasive", name: "Persuasive", emoji: "🎯" },
  ];

  const examplePrompts = [
    "Launching our AI-powered analytics dashboard next week",
    "Weekly newsletter with top 5 productivity tips",
    "Black Friday 50% off sale announcement",
    "Re-engagement email for inactive users"
  ];

  const [selectedType, setSelectedType] = useState("newsletter");
  const [customType, setCustomType] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [input, setInput] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [includeSubjectLines, setIncludeSubjectLines] = useState(true);
  const [includePreheader, setIncludePreheader] = useState(true);
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

  const saveToHistory = (prompt, type, tone, result) => {
    const entry = { id: Date.now(), prompt, type, tone, result, timestamp: new Date().toISOString() };
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

  const getEmailTypePrompt = (type) => {
    const prompts = {
      welcome: `Create a warm, engaging welcome email that:
- Makes new subscribers feel valued and excited
- Sets expectations for what they'll receive
- Includes a personal touch from the founder/team
- Has a quick win or free resource as a bonus
- Creates anticipation for future emails`,

      newsletter: `Create an engaging newsletter email that:
- Has a compelling "what's inside" preview
- Uses clear sections with headers
- Balances value content with subtle promotion
- Includes links to featured content
- Ends with a teaser for next week`,

      promo: `Create a high-converting promotional email that:
- Opens with the biggest benefit, not the discount
- Creates urgency without being pushy
- Uses specific numbers (save $X, not "save money")
- Addresses objections preemptively
- Has a clear, single CTA`,

      launch: `Create an exciting product launch email that:
- Builds anticipation in the first line
- Highlights the problem it solves
- Shows 3 key benefits with brief explanations
- Includes social proof if available
- Creates FOMO with early-bird or limited offer`,

      followup: `Create a re-engagement email that:
- Acknowledges the silence without guilt-tripping
- Reminds them why they signed up
- Offers something of immediate value
- Gives an easy action to take
- Includes an option to update preferences`,

      event: `Create an event invitation email that:
- Hooks with the transformation/outcome
- Lists key speakers or topics (3-5 max)
- Creates urgency with limited spots or time
- Makes registration super easy
- Includes calendar add link suggestion`,

      educational: `Create an educational email that:
- Promises a specific outcome
- Delivers value immediately (not just a teaser)
- Uses numbered steps or tips
- Includes actionable takeaways
- Links to deeper resources`,

      custom: `Create a compelling email that matches the user's specific requirements.`
    };
    return prompts[type];
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      setProgress(0);
      const progressInterval = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 15, 90)), 500);
      
      const typeInfo = emailTypes.find(t => t.id === selectedType);
      const toneInfo = tones.find(t => t.id === selectedTone);
      const actualType = selectedType === "custom" ? customType : typeInfo.name;
      
      const prompt = `You are an expert email copywriter who writes emails that get opened, read, and clicked.

EMAIL TYPE: ${actualType}
TONE: ${toneInfo.name} ${toneInfo.emoji}
${companyName ? `COMPANY/BRAND: ${companyName}` : ""}
${ctaText ? `DESIRED CTA: ${ctaText}` : ""}

TOPIC/PURPOSE:
"${input}"

${getEmailTypePrompt(selectedType)}

WRITE THE EMAIL:

${includeSubjectLines ? `## 📬 Subject Lines (3 options)
Provide 3 subject lines optimized for open rates. Include emojis strategically.

` : ""}
${includePreheader ? `## 👀 Preheader Text
Write a compelling preheader (40-100 chars) that complements the subject.

` : ""}
## ✉️ Email Body

Write the complete email with:
- Personalized greeting (use [First Name] placeholder)
- Clear, scannable structure with short paragraphs
- Strategic use of **bold** for key points
- Bullet points where appropriate
- One clear call-to-action
- Warm signature

FORMAT GUIDELINES:
- Keep paragraphs to 2-3 sentences max
- Use line breaks for readability
- Include a P.S. if it adds value
- Total length: appropriate for email type (not too long!)`;
      
      const { data } = await axios.post("/api/ai/generate-article", { prompt }, { headers: { Authorization: `Bearer ${await getToken()}` } });
      clearInterval(progressInterval);
      setProgress(100);
      if (data.success) { setContent(data.content); saveToHistory(input, selectedType, selectedTone, data.content); toast.success("Generated!"); }
      else { setError(data.message || "Failed"); toast.error(data.message); }
    } catch (err) { const errMsg = err.response?.data?.message || err.message || "Network error"; setError(errMsg); toast.error(errMsg); }
    setLoading(false);
    setTimeout(() => setProgress(0), 500);
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(content); setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000); };
  const useExample = (example) => { setInput(example); setError(null); };
  const useHistoryItem = (item) => { setInput(item.prompt); setSelectedType(item.type); setSelectedTone(item.tone); setContent(item.result); setError(null); setShowHistory(false); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem(STORAGE_KEY); toast.success("Cleared"); };
  const clearError = () => setError(null);

  const currentType = emailTypes.find(t => t.id === selectedType);

  return (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-emerald-950/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto p-6 lg:p-8 pt-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <span className="hover:text-neutral-400 cursor-pointer">Dashboard</span>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-300">Email Newsletter</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Email Newsletter Writer</h1>
              <p className="text-neutral-500 text-sm">Create emails that get opened, read, and clicked.</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
              ${showHistory ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800/50"}`}
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
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Create Email</span>
                </div>
                <span className="text-[10px] text-neutral-600 uppercase tracking-wider">⌘ + Enter to generate</span>
              </div>

              <div className="p-6 space-y-6">
                {/* Email Type */}
                <div>
                  <label className="text-xs text-neutral-500 mb-3 block">Email Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {emailTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl border text-left transition-all
                          ${selectedType === type.id
                            ? "border-emerald-500/50 bg-emerald-500/10"
                            : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50"}`}
                      >
                        <div className="flex items-center gap-2">
                          <type.icon className={`w-4 h-4 ${selectedType === type.id ? type.color : "text-neutral-500"}`} />
                          <span className={`text-sm font-medium ${selectedType === type.id ? "text-white" : "text-neutral-400"}`}>{type.name}</span>
                        </div>
                        <span className="text-[10px] text-neutral-600">{type.desc}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Type Input */}
                  {selectedType === "custom" && (
                    <input
                      type="text"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      placeholder="Enter your custom email type..."
                      className="mt-3 w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-emerald-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all"
                    />
                  )}
                </div>

                {/* Tone */}
                <div>
                  <label className="text-xs text-neutral-500 mb-3 block">Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {tones.map((tone) => (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setSelectedTone(tone.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
                          ${selectedTone === tone.id
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-neutral-800/50 text-neutral-400 border border-neutral-700 hover:bg-neutral-800"}`}
                      >
                        <span>{tone.emoji}</span>
                        {tone.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company Name (optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-500 mb-2 block">Company/Brand Name (optional)</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., VectorAI"
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-emerald-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 mb-2 block">CTA Button Text (optional)</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="e.g., Start Free Trial"
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-emerald-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeSubjectLines} onChange={(e) => setIncludeSubjectLines(e.target.checked)} className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-emerald-500 focus:ring-emerald-500/20" />
                    <span className="text-xs text-neutral-400">📬 Include subject lines</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includePreheader} onChange={(e) => setIncludePreheader(e.target.checked)} className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-emerald-500 focus:ring-emerald-500/20" />
                    <span className="text-xs text-neutral-400">👀 Include preheader text</span>
                  </label>
                </div>

                {/* Input */}
                <div>
                  <label className="text-xs text-neutral-500 mb-3 block">What's this email about?</label>
                  <textarea
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(null); }}
                    placeholder="Describe the purpose, key message, and any specific details..."
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-emerald-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all resize-none"
                  />
                  <span className="text-[10px] text-neutral-600 mt-2 block">{input.length} characters</span>
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
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-neutral-500 text-center">Crafting your email... {Math.round(progress)}%</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !input || (selectedType === "custom" && !customType)}
                  className="w-full py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                >
                  {loading ? <><Zap className="w-4 h-4 animate-pulse" /> Generating...</> : <><Zap className="w-4 h-4" /> Generate Email</>}
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

            {/* Result - Beautiful Email Preview */}
            {content && !loading && (
              <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                  <div className="flex items-center gap-2">
                    <currentType.icon className={`w-4 h-4 ${currentType.color}`} />
                    <h3 className="text-sm font-medium text-neutral-300">{selectedType === "custom" ? customType : currentType.name} Email</h3>
                  </div>
                  <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy All"}
                  </button>
                </div>
                
                {/* Email Preview with styling */}
                <div className="p-6 text-neutral-200">
                  <div className="prose prose-invert prose-sm max-w-none
                    [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-0 [&_h1]:mb-4
                    [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-emerald-400 [&_h2]:mt-6 [&_h2]:mb-3
                    [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2
                    [&_p]:text-neutral-200 [&_p]:leading-relaxed [&_p]:mb-3
                    [&_strong]:text-white [&_strong]:font-semibold
                    [&_em]:text-neutral-400
                    [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:text-neutral-200 [&_ul]:space-y-1 [&_ul]:my-3
                    [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:text-neutral-200 [&_ol]:space-y-1 [&_ol]:my-3
                    [&_li]:text-neutral-200 [&_li]:leading-relaxed
                    [&_blockquote]:border-l-2 [&_blockquote]:border-emerald-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-400
                    [&_hr]:border-neutral-700 [&_hr]:my-6
                    [&_a]:text-emerald-400 [&_a]:underline
                    [&_code]:bg-neutral-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-emerald-400
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
                      <p className="text-xs text-neutral-300 truncate mb-1">{item.prompt}</p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-600">
                        <span className="capitalize">{item.type}</span>
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

export default EmailNewsletter;
