"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({ value, onChange, maxFiles = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    if (value.length + files.length > maxFiles) {
      setError(`Max ${maxFiles} photos allowed`);
      return;
    }
    setError(null);
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        setError("Upload failed. Try again.");
        setUploading(false);
        return;
      }
      const data = await res.json();
      uploaded.push(data.url);
    }

    onChange([...value, ...uploaded]);
    setUploading(false);
  }

  function removePhoto(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {value.map((url, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group">
              <Image src={url} alt={`Upload ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {value.length < maxFiles && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg py-6 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition disabled:opacity-50"
          >
            {uploading ? (
              <>
                <span className="animate-spin">⏳</span> Uploading...
              </>
            ) : (
              <>
                📷 Add Photos {value.length > 0 && `(${value.length}/${maxFiles})`}
              </>
            )}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
