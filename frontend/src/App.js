import { useState, useRef } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext)) {
      setStatus("error");
      setMessage("Only .csv or .xlsx files are accepted.");
      return;
    }
    setFile(f);
    setStatus("idle");
    setMessage("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !email) {
      setStatus("error");
      setMessage("Please provide both a file and a recipient email.");
      return;
    }
    setStatus("loading");
    setMessage("");
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/upload`,
        {
          method: "POST",
          headers: {
            "x-api-key":
              process.env.REACT_APP_API_KEY || "rabbittai_secret_2026",
          },
          body: formData,
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setMessage(data.message);
      setSummary(data.summary);
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>🐇</span>
          <span style={styles.navName}>Rabbitt AI</span>
        </div>
        <span style={styles.navBadge}>Sales Insight Tool</span>
      </nav>

      {/* Main Content */}
      <div style={styles.container}>
        {/* Left Side */}
        <div style={styles.left}>
          <div style={styles.tagline}>Powered by</div>
          <h1 style={styles.heading}>
            Turn Raw Sales Data
            <br />
            into <span style={styles.highlight}>Executive Insights</span>
          </h1>
          <p style={styles.desc}>
            Upload your quarterly CSV or Excel file and let Rabbitt AI generate
            a professional executive summary — delivered straight to your inbox
            in seconds.
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>⚡ AI-Powered Analysis</div>
            <div style={styles.feature}>📧 Instant Email Delivery</div>
            <div style={styles.feature}>🔒 Secure & Private</div>
          </div>
        </div>

        {/* Right Side — Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Generate Your Report</h2>
          <p style={styles.cardSubtitle}>
            Upload a file and enter recipient email
          </p>

          {/* Drop Zone */}
          <div
            style={{
              ...styles.dropzone,
              ...(dragOver ? styles.dropzoneActive : {}),
              ...(file ? styles.dropzoneFilled : {}),
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <>
                <div style={styles.fileIconLarge}>📁</div>
                <p style={styles.fileName}>{file.name}</p>
                <p style={styles.fileSize}>
                  {(file.size / 1024).toFixed(1)} KB · click to change
                </p>
              </>
            ) : (
              <>
                <div style={styles.fileIconLarge}>☁️</div>
                <p style={styles.dropText}>
                  <strong>Drag & drop</strong> your file here
                </p>
                <p style={styles.dropSub}>CSV or XLSX · max 5MB</p>
                <div style={styles.browseBtn}>Browse File</div>
              </>
            )}
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>📬 Recipient Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="executive@rabbitt.ai"
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "#6c3bff")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            style={{
              ...styles.button,
              ...(status === "loading" ? styles.buttonLoading : {}),
            }}
          >
            {status === "loading" ? (
              <span>⏳ Generating Summary...</span>
            ) : (
              <span>🚀 Generate & Send Report</span>
            )}
          </button>

          {/* Success */}
          {status === "success" && (
            <div style={styles.successBox}>
              <p style={styles.successTitle}>✅ {message}</p>
              {summary && (
                <details>
                  <summary style={styles.summaryToggle}>
                    👁 Preview AI Summary
                  </summary>
                  <p style={styles.summaryText}>{summary}</p>
                </details>
              )}
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div style={styles.errorBox}>❌ {message}</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2026 Rabbitt AI · Built with Google Gemini · All rights reserved
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#fff",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  blob1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(108,59,255,0.25), transparent 70%)",
    top: "-100px",
    left: "-100px",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,59,148,0.15), transparent 70%)",
    bottom: "-50px",
    right: "-50px",
    pointerEvents: "none",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 48px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 10,
  },
  navBrand: { display: "flex", alignItems: "center", gap: "10px" },
  navLogo: { fontSize: "28px" },
  navName: { fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" },
  navBadge: {
    background: "rgba(108,59,255,0.2)",
    border: "1px solid rgba(108,59,255,0.4)",
    color: "#a78bfa",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "64px",
    padding: "60px 48px",
    flex: 1,
    position: "relative",
    zIndex: 10,
    flexWrap: "wrap",
  },
  left: { maxWidth: "460px" },
  tagline: {
    color: "#6c3bff",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  heading: {
    fontSize: "42px",
    fontWeight: "900",
    lineHeight: 1.2,
    margin: "0 0 20px",
    letterSpacing: "-1px",
  },
  highlight: {
    background: "linear-gradient(135deg, #6c3bff, #ff3b94)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  desc: {
    color: "#94a3b8",
    fontSize: "16px",
    lineHeight: 1.8,
    margin: "0 0 32px",
  },
  features: { display: "flex", flexDirection: "column", gap: "12px" },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#cbd5e1",
    fontSize: "15px",
    fontWeight: "500",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "460px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "800",
    margin: "0 0 6px",
    color: "#f1f5f9",
  },
  cardSubtitle: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0 0 28px",
  },
  dropzone: {
    border: "2px dashed rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "32px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "rgba(255,255,255,0.02)",
    marginBottom: "24px",
  },
  dropzoneActive: {
    borderColor: "#6c3bff",
    background: "rgba(108,59,255,0.08)",
  },
  dropzoneFilled: {
    borderColor: "#22c55e",
    background: "rgba(34,197,94,0.06)",
  },
  fileIconLarge: { fontSize: "40px", marginBottom: "10px" },
  fileName: {
    fontWeight: "700",
    color: "#f1f5f9",
    margin: "0 0 4px",
    fontSize: "15px",
  },
  fileSize: { color: "#64748b", margin: 0, fontSize: "13px" },
  dropText: { margin: "0 0 4px", color: "#94a3b8", fontSize: "15px" },
  dropSub: { margin: "0 0 16px", color: "#475569", fontSize: "13px" },
  browseBtn: {
    display: "inline-block",
    padding: "8px 20px",
    background: "rgba(108,59,255,0.2)",
    border: "1px solid rgba(108,59,255,0.4)",
    borderRadius: "8px",
    color: "#a78bfa",
    fontSize: "13px",
    fontWeight: "600",
  },
  inputGroup: { marginBottom: "20px" },
  label: {
    display: "block",
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: "8px",
    fontSize: "13px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.06)",
    color: "#f1f5f9",
    transition: "border-color 0.2s",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #6c3bff, #ff3b94)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s",
    letterSpacing: "0.3px",
  },
  buttonLoading: { opacity: 0.6, cursor: "not-allowed" },
  successBox: {
    marginTop: "20px",
    background: "rgba(34,197,94,0.08)",
    border: "1px solid rgba(34,197,94,0.3)",
    borderRadius: "12px",
    padding: "16px",
  },
  successTitle: {
    margin: "0 0 8px",
    color: "#4ade80",
    fontWeight: "600",
    fontSize: "14px",
  },
  summaryToggle: {
    cursor: "pointer",
    color: "#86efac",
    fontWeight: "600",
    fontSize: "13px",
  },
  summaryText: {
    marginTop: "12px",
    color: "#cbd5e1",
    lineHeight: 1.7,
    fontSize: "14px",
    whiteSpace: "pre-wrap",
  },
  errorBox: {
    marginTop: "20px",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "12px",
    padding: "16px",
    color: "#f87171",
    fontWeight: "600",
    fontSize: "14px",
  },
  footer: {
    textAlign: "center",
    padding: "24px",
    color: "#334155",
    fontSize: "13px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    position: "relative",
    zIndex: 10,
  },
};

export default App;
