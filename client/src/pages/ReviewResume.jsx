import { FileText, Copy, CheckCircle2, Upload } from "lucide-react";
import React, { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef(null);

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(file);
      setFileName(file.name);
    }
  };

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
        toast.success("Resume analyzed!");
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
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      <div className="max-w-5xl mx-auto p-6 lg:p-8 pt-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-white">Review Resume</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-neutral-400" />
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Resume Review
            </h1>
          </div>
          <p className="text-neutral-500 text-sm">
            Get AI-powered feedback on your resume
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left - Form */}
          <form
            ref={formRef}
            onSubmit={onSubmitHandler}
            className="rounded-xl border border-neutral-800 p-5 h-fit"
          >
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Upload Resume (PDF)
            </label>
            
            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-neutral-800 rounded-lg cursor-pointer hover:border-neutral-700 transition-all">
              {fileName ? (
                <>
                  <FileText className="w-8 h-8 text-neutral-500 mb-2" />
                  <span className="text-sm text-white">{fileName}</span>
                  <span className="text-[10px] text-neutral-600 mt-1">Click to change file</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-neutral-600 mb-2" />
                  <span className="text-sm text-neutral-500">Click to upload PDF</span>
                  <span className="text-[10px] text-neutral-600 mt-1">PDF format only</span>
                </>
              )}
              <input
                onChange={handleFileChange}
                name="resume"
                type="file"
                accept="application/pdf"
                className="hidden"
                required
              />
            </label>

            <button
              disabled={loading || !input}
              type="submit"
              className="w-full flex justify-center items-center gap-2 
              border border-neutral-700 hover:border-neutral-600 text-white px-5 py-3 mt-5 rounded-lg text-sm font-medium
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-neutral-400 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Review Resume
                </>
              )}
            </button>
          </form>

          {/* Right - Result */}
          <div className="rounded-xl border border-neutral-800 overflow-hidden min-h-[400px] max-h-[600px] flex flex-col">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-500" />
                <h2 className="text-sm font-medium text-white">Analysis Result</h2>
              </div>
              {content && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 hover:border-neutral-700
                  text-neutral-400 hover:text-white rounded-lg text-xs font-medium transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                // Skeleton Loading
                <div className="space-y-4 animate-pulse">
                  <div className="h-5 bg-neutral-800 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-800 rounded w-full" />
                    <div className="h-3 bg-neutral-800 rounded w-5/6" />
                    <div className="h-3 bg-neutral-800 rounded w-4/5" />
                  </div>
                  <div className="h-5 bg-neutral-800 rounded w-2/5 mt-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-800 rounded w-full" />
                    <div className="h-3 bg-neutral-800 rounded w-3/4" />
                  </div>
                </div>
              ) : !content ? (
                <div className="h-full flex justify-center items-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto border border-neutral-800 rounded-full flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-neutral-600" />
                    </div>
                    <p className="text-xs text-neutral-500">
                      Upload resume to get AI feedback
                    </p>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm prose-invert max-w-none prose-headings:text-white prose-p:text-neutral-300 prose-strong:text-white prose-li:text-neutral-300">
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

export default ReviewResume;
