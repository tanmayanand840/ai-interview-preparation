import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import PageShell from "../components/PageShell";

const ResumeMatch = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeFile && !jdFile && (!resumeText || !jobDescription)) {
      toast.error("Add PDFs or paste both resume and job description");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      let res;

      if (resumeFile || jdFile) {
        const formData = new FormData();

        if (resumeFile) formData.append("resumePdf", resumeFile);
        if (jdFile) formData.append("jdPdf", jdFile);

        if (resumeText) formData.append("resumeText", resumeText);
        if (jobDescription) formData.append("jobDescription", jobDescription);

        res = await api.post("/interview/resume-match-upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/interview/resume-match", {
          resumeText,
          jobDescription,
        });
      }

      setResult(res.data);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to analyze resume and JD";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Resume & Job Match"
      subtitle="Compare your resume with the job description and get ATS-aware improvement suggestions."
      tag="Career"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="saas-card p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Your Resume</h2>
              <p className="text-xs text-textMuted">
                Upload a PDF or paste the text below.
              </p>
            </div>
            <label className="cursor-pointer text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition">
              <span>{resumeFile ? "Change PDF" : "Upload PDF"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setResumeFile(file || null);
                }}
              />
            </label>
          </div>

          {resumeFile && (
            <p className="text-xs text-textMuted">
              Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)}{" "}
              KB)
            </p>
          )}

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={14}
            className="saas-textarea min-h-[12rem] resize-y"
            placeholder="Paste your resume text here (you can export from PDF and paste)."
          />
        </div>

        <div className="saas-card p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Job Description</h2>
              <p className="text-xs text-textMuted">
                Optional: upload JD PDF or just paste text.
              </p>
            </div>
            <label className="cursor-pointer text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition">
              <span>{jdFile ? "Change PDF" : "Upload PDF"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setJdFile(file || null);
                }}
              />
            </label>
          </div>

          {jdFile && (
            <p className="text-xs text-textMuted">
              Selected: {jdFile.name} ({(jdFile.size / 1024).toFixed(1)} KB)
            </p>
          )}

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={14}
            className="saas-textarea min-h-[12rem] resize-y"
            placeholder="Paste the JD from the company careers page or job portal."
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="saas-btn-primary disabled:opacity-70"
      >
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      {result && (
        <div className="saas-card p-6 sm:p-7 space-y-4">
          {typeof result.ats_score === "number" &&
            !Number.isNaN(result.ats_score) && (
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl font-semibold">ATS Match Score</h2>
                <span className="text-2xl font-bold text-cyan-400">
                  {Math.round(result.ats_score)}%
                </span>
              </div>
            )}

          {result.summary && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p className="text-textMuted leading-relaxed">{result.summary}</p>
            </div>
          )}

          {Array.isArray(result.skill_gaps) && result.skill_gaps.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Skill Gaps</h2>
              <ul className="list-disc list-inside space-y-1 text-textMuted">
                {result.skill_gaps.map((gap, idx) => (
                  <li key={idx}>{gap}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(result.recommended_topics) &&
            result.recommended_topics.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Recommended Topics to Practice
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.recommended_topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-sm bg-background border border-white/10"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {Array.isArray(result.suggestions) &&
            result.suggestions.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Suggestions</h2>
                <ul className="list-disc list-inside space-y-1 text-textMuted">
                  {result.suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

          {result.raw && !result.summary && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Analysis</h2>
              <pre className="whitespace-pre-wrap text-textMuted">
                {result.raw}
              </pre>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
};

export default ResumeMatch;
