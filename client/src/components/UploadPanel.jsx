import { useRef, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { uploadTask } from "../lib/api";

export default function UploadPanel({ onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [priority, setPriority] = useState("low");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) return setMessage("Please choose a CSV file first.");

    try {
      setLoading(true);
      setMessage("");
      await uploadTask(file, priority);
      setMessage("File added to queue.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploaded?.();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">NEW JOB</p>
          <h2>Upload CSV</h2>
        </div>
        <FileSpreadsheet size={22} />
      </div>

      <label className="drop-zone">
        <Upload size={28} />
        <strong>{file ? file.name : "Choose a numeric CSV file"}</strong>
        <span>Rows and columns can vary in size</span>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      <p className="label">Processing priority</p>
      <div className="priority-selector">
        <button
          className={priority === "high" ? "selected" : ""}
          onClick={() => setPriority("high")}
        >
          High
        </button>
        <button
          className={priority === "low" ? "selected" : ""}
          onClick={() => setPriority("low")}
        >
          Low
        </button>
      </div>

      <button
        className="primary-button"
        disabled={loading}
        onClick={handleUpload}
      >
        {loading ? "Uploading..." : "Add to queue"}
      </button>

      {message && <p className="form-message">{message}</p>}
    </section>
  );
}
