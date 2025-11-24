import { FileText, Copy, CheckCircle2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success === true) {
        setContent(data.content);
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
    toast.success("Analysis copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="h-full overflow-y-scroll bg-[#0A0A0F] p-6 flex items-start flex-wrap gap-4">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      {/* {left col} */}
      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full max-w-lg p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Resume Review</h1>
        </div>
        <p className="mt-6 text-sm font-medium text-white">Upload Resume</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          name="resume"
          type="file"
          accept="application/pdf"
          className="w-full p-3 mt-2 outline-none text-sm rounded-xl border-2 border-white/10 bg-white/5 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20"
          required
        />

        <p className="text-xs text-gray-400 font-light mt-2">
          Support PDF Resume
        </p>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 
        bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-4 mt-6
        text-sm font-semibold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <FileText className="w-5" />
          )}
          Review Resume
        </button>
      </form>

      {/* Right col */}
      <div className="relative z-10 w-full max-w-2xl p-6 bg-white/5 backdrop-blur-sm rounded-2xl flex flex-col border border-white/10 min-h-[500px] max-h-[800px] animate-slideInRight">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-semibold text-white">Analysis Result</h1>
          </div>
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 
              text-white rounded-lg text-sm font-medium transition-all border border-white/20 hover:border-emerald-500/30"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
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

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <FileText className="w-8 h-8 opacity-50" />
              </div>
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-2 h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="prose prose-lg prose-invert max-w-none 
              prose-headings:text-white prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-strong:text-emerald-400 prose-strong:font-semibold
              prose-ul:text-gray-300 prose-li:marker:text-emerald-500
              prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-emerald-500 prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
