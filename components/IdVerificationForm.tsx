"use client";

import { useState } from "react";

export default function IdVerificationForm({ userId }: { userId: number }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    try {
      const res = await fetch("/api/upload-id", { method: "POST", body: formData });
      const json = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert("Upload failed: " + (json?.error ?? res.statusText));
        return;
      }

      // Response contains verification result if auto-verified
      alert("Result: " + JSON.stringify(json));
    } catch (err) {
      setLoading(false);
      alert("Error uploading: " + String(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="hidden" name="userId" value={userId} />

      <div>
        <label>ID Front (required)</label>
        <input type="file" name="idFront" accept="image/*" required />
      </div>

      <div>
        <label>ID Back (optional)</label>
        <input type="file" name="idBack" accept="image/*" />
      </div>

      <div>
        <label>Selfie (required for auto verification)</label>
        <input type="file" name="selfie" accept="image/*" required />
      </div>

      <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Submit for verification"}</button>
    </form>
  );
}
