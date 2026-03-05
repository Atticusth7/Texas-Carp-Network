"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/shared/ImageUpload";

export default function PostForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        photos,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    const created = await res.json();
    router.push(`/posts/${created.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Photos (optional)</h2>
        <ImageUpload value={photos} onChange={setPhotos} />
      </div>

      <div className="card p-5 space-y-4">
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input id="title" name="title" required className="input" placeholder="e.g. Best baits for summer carp in Texas" />
        </div>
        <div>
          <label className="label" htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            required
            rows={8}
            className="input resize-none"
            placeholder="Share your tips, stories, or questions..."
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? "Publishing..." : "Publish Post"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
