

const API_BASE = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api`;

export async function getTasks() {
  const response = await fetch(`${API_BASE}/tasks`);

  if (!response.ok) {
    throw new Error("Could not fetch tasks");
  }

  return response.json();
}

export async function uploadTask(file, priority) {
  const formData = new FormData();

  // "file" must match req.files.file in the Express backend.
  formData.append("file", file);
  formData.append("priority", priority);

  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
}