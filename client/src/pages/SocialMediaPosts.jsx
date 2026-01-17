import { Share2, Copy, CheckCircle2, Zap, History, AlertCircle, RefreshCw, X, Sparkles, Linkedin, Instagram, MessageCircle, AtSign, Video, Hash } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = "vectorai_social_history";

const SocialMediaPosts = () => {
  const platforms = [
    { id: "twitter", name: "Twitter/X", icon: AtSign, color: "text-sky-400", bgColor: "bg-sky-500/10", tips: "Keep it punchy. Use 1-2 hashtags. Threads work great." },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-400", bgColor: "bg-blue-500/10", tips: "Professional tone. Tell a story. Hook in first line." },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-400", bgColor: "bg-pink-500/10", tips: "Visual focus. Use line breaks. 20-30 hashtags work." },
    { id: "threads", name: "Threads", icon: MessageCircle, color: "text-neutral-300", bgColor: "bg-neutral-500/10", tips: "Conversational. Personal stories. Less formal." },
    { id: "tiktok", name: "TikTok", icon: Video, color: "text-rose-400", bgColor: "bg-rose-500/10", tips: "Hook in 2 seconds. Trendy. Gen-Z friendly language." },
  ];
  
  const tones = [
    { id: "professional", name: "Professional", emoji: "💼" },
    { id: "casual", name: "Casual", emoji: "😊" },
    { id: "witty", name: "Witty", emoji: "😏" },
    { id: "inspirational", name: "Inspirational", emoji: "✨" },
    { id: "educational", name: "Educational", emoji: "📚" },
    { id: "storytelling", name: "Storytelling", emoji: "📖" },
    { id: "provocative", name: "Provocative", emoji: "🔥" },
    { id: "humorous", name: "Humorous", emoji: "😂" },
  ];

  const lengths = [
    { id: "short", name: "Short", desc: "2-3 lines", words: "2-3 lines, around 30-50 words" },
    { id: "medium", name: "Medium", desc: "5-8 lines", words: "5-8 lines, around 80-150 words" },
    { id: "long", name: "Long", desc: "10-15 lines", words: "10-15 lines, around 200-300 words" },
    { id: "custom", name: "Custom", desc: "You define", words: "custom" },
  ];

  const examplePrompts = [
    "Launch of our new AI-powered writing tool",
    "5 productivity tips that changed my work life",
    "Behind the scenes of building a startup",
    "Lessons learned from 1000 customer interviews"
  ];

  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [input, setInput] = useState("");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [postCount, setPostCount] = useState(1);
  const [selectedLength, setSelectedLength] = useState("medium");
  const [customLines, setCustomLines] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);
  const formRef = useRef(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (prompt, platform, tone, result) => {
    const entry = { id: Date.now(), prompt, platform, tone, result, timestamp: new Date().toISOString() };
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

  const getLengthGuidance = () => {
    const lengthInfo = lengths.find(l => l.id === selectedLength);
    return lengthInfo?.words || "50-150 words";
  };

  const getPlatformPrompt = (platform) => {
    const lengthGuide = getLengthGuidance();
    const prompts = {
      twitter: `Write EXACTLY ${postCount} Twitter/X post${postCount > 1 ? 's' : ''}. Each should:
- Be ${selectedLength === 'short' ? 'under 100 characters' : selectedLength === 'medium' ? 'around 200 characters' : 'up to 280 characters (can use thread format for long)'}
- Start with a hook that stops the scroll
- Use short, punchy sentences
- ${includeHashtags ? "Include 1-3 relevant hashtags at the end" : "No hashtags"}
- ${includeEmojis ? "Use 1-2 strategic emojis" : "No emojis"}
- End with engagement bait (question, hot take, or CTA)`,

      linkedin: `Write EXACTLY ${postCount} LinkedIn post${postCount > 1 ? 's' : ''} (${lengthGuide}). Each should:
- Start with a powerful hook line (this appears before "...see more")
- Use line breaks every 1-2 sentences for readability
- ${selectedLength === 'short' ? 'Focus on one key insight, keep it brief' : selectedLength === 'long' ? 'Tell a complete story with multiple lessons' : 'Share a focused insight with context'}
- Include a clear takeaway or lesson
- End with a question or CTA to drive comments
- ${includeHashtags ? "Add 3-5 industry hashtags at the end" : "No hashtags"}
- ${includeEmojis ? "Use professional emojis sparingly (📈 💡 🚀 ✅)" : "No emojis"}`,

      instagram: `Write EXACTLY ${postCount} Instagram caption${postCount > 1 ? 's' : ''} (${lengthGuide}). Each should:
- Start with an attention-grabbing first line
- Use a conversational, authentic voice
- ${selectedLength === 'short' ? 'Keep it punchy and to the point' : selectedLength === 'long' ? 'Tell a deeper story, use multiple paragraphs' : 'Balance storytelling with brevity'}
- Include a clear call-to-action (save, share, comment)
- ${includeHashtags ? "Add 15-25 hashtags (mix of popular and niche) at the end, separated by dots" : "No hashtags"}
- ${includeEmojis ? "Use emojis throughout to add personality" : "No emojis"}`,

      threads: `Write EXACTLY ${postCount} Threads post${postCount > 1 ? 's' : ''} (${lengthGuide}). Each should:
- Be conversational and personal
- Feel like talking to a friend
- ${selectedLength === 'short' ? 'Quick hot take or observation' : selectedLength === 'long' ? 'Deeper dive into the topic' : 'Share a focused perspective'}
- ${includeHashtags ? "Use 1-2 hashtags only if relevant" : "No hashtags"}
- ${includeEmojis ? "Use emojis naturally" : "No emojis"}`,

      tiktok: `Write EXACTLY ${postCount} TikTok caption${postCount > 1 ? 's' : ''} / script hook${postCount > 1 ? 's' : ''}. Each should:
- Start with an irresistible hook (first 2-3 seconds matter most)
- Use Gen-Z friendly language and trends
- Be punchy, fast-paced, and entertaining
- ${selectedLength === 'short' ? 'Just the hook line' : selectedLength === 'long' ? 'Include full script outline with hook, content, CTA' : 'Hook + key talking points'}
- ${includeHashtags ? "Add 3-5 trending TikTok hashtags" : "No hashtags"}
- ${includeEmojis ? "Heavy emoji use is fine" : "No emojis"}`
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
      
      const platformInfo = platforms.find(p => p.id === selectedPlatform);
      const toneInfo = tones.find(t => t.id === selectedTone);
      
      const lengthInfo = lengths.find(l => l.id === selectedLength);
      const actualLength = selectedLength === 'custom' && customLines 
        ? customLines 
        : lengthInfo.words;
      const prompt = `You are a world-class social media copywriter. Your job is to write posts that GO VIRAL.

CRITICAL INSTRUCTION: The post MUST be specifically about the topic below. Do NOT write generic content. Every word should directly relate to what the user described.

=== USER'S SPECIFIC TOPIC ===
${input}
=== END TOPIC ===

PLATFORM: ${platformInfo.name}
TONE: ${toneInfo.name}
LENGTH: ${actualLength}
NUMBER OF POSTS: Exactly ${postCount}

REQUIREMENTS:
${getPlatformPrompt(selectedPlatform)}

CRITICAL RULES:
1. The post must DIRECTLY address "${input}" - mention the specific product/company/topic by name
2. Do NOT write generic motivational content
3. Include specific details, facts, or insights from the topic
4. The reader should know exactly what this post is about from reading it

${postCount === 1 ? `FORMAT:
📱 Post
[Write the complete post specifically about: ${input}]` : `FORMAT EACH POST CLEARLY:
---
📱 Post 1
[Content about: ${input}]

---
📱 Post 2
[Different angle on: ${input}]
${postCount > 2 ? '\n---\n(continue for all ' + postCount + ' posts)' : ''}`}

${postCount > 1 ? 'Each post should explore a DIFFERENT angle of the topic but all must be specifically about the user\'s input. ' : ''}Write content optimized for ${platformInfo.name}.`;
      
      const { data } = await axios.post("/api/ai/generate-article", { prompt }, { headers: { Authorization: `Bearer ${await getToken()}` } });
      clearInterval(progressInterval);
      setProgress(100);
      if (data.success) { setContent(data.content); saveToHistory(input, selectedPlatform, selectedTone, data.content); toast.success("Generated!"); }
      else { setError(data.message || "Failed"); toast.error(data.message); }
    } catch (err) { const errMsg = err.response?.data?.message || err.message || "Network error"; setError(errMsg); toast.error(errMsg); }
    setLoading(false);
    setTimeout(() => setProgress(0), 500);
  };

  const copyPost = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => { navigator.clipboard.writeText(content); toast.success("All posts copied!"); };
  const useExample = (example) => { setInput(example); setError(null); };
  const useHistoryItem = (item) => { setInput(item.prompt); setSelectedPlatform(item.platform); setSelectedTone(item.tone); setContent(item.result); setError(null); setShowHistory(false); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem(STORAGE_KEY); toast.success("Cleared"); };
  const clearError = () => setError(null);

  const currentPlatform = platforms.find(p => p.id === selectedPlatform);

  // Parse posts from content for individual copy
  const parsePosts = (text) => {
    if (!text) return [];
    const posts = text.split(/---/).filter(p => p.trim()).map(p => p.trim());
    return posts;
  };

  return (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto p-6 lg:p-8 pt-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <span className="hover:text-neutral-400 cursor-pointer">Dashboard</span>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-300">Social Media Posts</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Social Media Posts</h1>
              <p className="text-neutral-500 text-sm">Create viral, platform-optimized posts that drive engagement.</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
              ${showHistory ? "border-blue-500/50 text-blue-400 bg-blue-500/10" : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800/50"}`}
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
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Create Viral Posts</span>
                </div>
                <span className="text-[10px] text-neutral-600 uppercase tracking-wider">⌘ + Enter to generate</span>
              </div>

              <div className="p-6 space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="text-xs text-neutral-500 mb-3 block">Platform</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all
                          ${selectedPlatform === platform.id
                            ? `border-blue-500/50 ${platform.bgColor}`
                            : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50"}`}
                      >
                        <platform.icon className={`w-5 h-5 ${platform.color}`} />
                        <span className={selectedPlatform === platform.id ? "text-white" : "text-neutral-400"}>{platform.name}</span>
                      </button>
                    ))}
                  </div>
                  {/* Platform Tips */}
                  <div className={`mt-3 p-3 rounded-lg ${currentPlatform.bgColor} border border-neutral-800`}>
                    <p className="text-xs text-neutral-400"><span className="text-neutral-300 font-medium">💡 Pro tip:</span> {currentPlatform.tips}</p>
                  </div>
                </div>

                {/* Tone Selection */}
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
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-neutral-800/50 text-neutral-400 border border-neutral-700 hover:bg-neutral-800"}`}
                      >
                        <span>{tone.emoji}</span>
                        {tone.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Selection */}
                <div>
                  <label className="text-xs text-neutral-500 mb-3 block">Post Length</label>
                  <div className="flex gap-2">
                    {lengths.map((len) => (
                      <button
                        key={len.id}
                        type="button"
                        onClick={() => setSelectedLength(len.id)}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-xs font-medium transition-all text-center
                          ${selectedLength === len.id
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-neutral-800/50 text-neutral-400 border border-neutral-700 hover:bg-neutral-800"}`}
                      >
                        <div>{len.name}</div>
                        <div className="text-[10px] opacity-60 mt-0.5">{len.desc}</div>
                      </button>
                    ))}
                  </div>
                  {/* Custom length input */}
                  {selectedLength === 'custom' && (
                    <input
                      type="text"
                      value={customLines}
                      onChange={(e) => setCustomLines(e.target.value)}
                      placeholder="e.g., 4-5 lines, 100 words, 2 paragraphs"
                      className="mt-3 w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-blue-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all"
                    />
                  )}
                </div>

                {/* Options Row */}
                <div className="flex flex-wrap gap-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeHashtags} onChange={(e) => setIncludeHashtags(e.target.checked)} className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-blue-500 focus:ring-blue-500/20" />
                    <span className="text-xs text-neutral-400"># Hashtags</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeEmojis} onChange={(e) => setIncludeEmojis(e.target.checked)} className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-blue-500 focus:ring-blue-500/20" />
                    <span className="text-xs text-neutral-400">😊 Emojis</span>
                  </label>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-neutral-500">Number of posts:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPostCount(n)}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                            ${postCount === n
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-neutral-800/50 text-neutral-400 border border-neutral-700 hover:bg-neutral-800"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div>
                  <label className="text-xs text-neutral-500 mb-3 block">What's your post about?</label>
                  <textarea
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(null); }}
                    placeholder="Describe your topic, announcement, insight, or story..."
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 focus:border-blue-500/50 rounded-xl text-white text-sm placeholder-neutral-500 outline-none transition-all resize-none"
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
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-neutral-500 text-center">Creating viral posts... {Math.round(progress)}%</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !input}
                  className="w-full py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
                >
                  {loading ? <><Zap className="w-4 h-4 animate-pulse" /> Generating...</> : <><Zap className="w-4 h-4" /> Generate {postCount} {postCount === 1 ? 'Post' : 'Posts'}</>}
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

            {/* Results - Beautifully Formatted */}
            {content && !loading && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                    <currentPlatform.icon className={`w-4 h-4 ${currentPlatform.color}`} />
                    Generated for {currentPlatform.name}
                  </h3>
                  <button onClick={copyAll} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all">
                    <Copy className="w-3.5 h-3.5" /> Copy All
                  </button>
                </div>
                
                {parsePosts(content).map((post, idx) => (
                  <div key={idx} className={`rounded-2xl border border-neutral-800 ${currentPlatform.bgColor} backdrop-blur-sm overflow-hidden`}>
                    <div className="px-5 py-3 border-b border-neutral-800/50 flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-400">Post {idx + 1}</span>
                      <button 
                        onClick={() => copyPost(post.replace(/📱 Post \d+/g, '').trim(), idx)} 
                        className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors"
                      >
                        {copiedIndex === idx ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedIndex === idx ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-sm">{post.replace(/📱 Post \d+/g, '').trim()}</p>
                    </div>
                  </div>
                ))}
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
                        <span className="capitalize">{item.platform}</span>
                        <span>•</span>
                        <span className="capitalize">{item.tone}</span>
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

export default SocialMediaPosts;
