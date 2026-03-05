"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/shared/ImageUpload";
import { CARP_SPECIES, GEAR_TYPES, CLARITY_OPTIONS, CURRENT_OPTIONS, WEATHER_OPTIONS } from "@/lib/utils";

type GearEntry = {
  type: string;
  brand: string;
  model: string;
  description: string;
};

export default function CatchForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const [gear, setGear] = useState<GearEntry[]>([]);

  function addGear() {
    setGear([...gear, { type: "Rod", brand: "", model: "", description: "" }]);
  }

  function updateGear(i: number, field: keyof GearEntry, val: string) {
    setGear(gear.map((g, idx) => (idx === i ? { ...g, [field]: val } : g)));
  }

  function removeGear(i: number) {
    setGear(gear.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const body = {
      title: data.title,
      description: data.description || null,
      species: data.species,
      weightLbs: data.weightLbs ? parseFloat(data.weightLbs as string) : null,
      lengthIn: data.lengthIn ? parseFloat(data.lengthIn as string) : null,
      location: data.location || null,
      caughtAt: data.caughtAt || new Date().toISOString(),
      photos,
      gear: gear.filter((g) => g.type),
      waterConditions: {
        tempF: data.tempF ? parseFloat(data.tempF as string) : null,
        airTempF: data.airTempF ? parseFloat(data.airTempF as string) : null,
        clarity: data.clarity || null,
        depthFt: data.depthFt ? parseFloat(data.depthFt as string) : null,
        currentSpeed: data.currentSpeed || null,
        weather: data.weather || null,
        windMph: data.windMph ? parseFloat(data.windMph as string) : null,
        notes: data.conditionNotes || null,
      },
    };

    const res = await fetch("/api/catches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    const created = await res.json();
    router.push(`/catches/${created.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Photos */}
      <section className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Photos</h2>
        <ImageUpload value={photos} onChange={setPhotos} />
      </section>

      {/* Catch Details */}
      <section className="card p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Catch Details</h2>

        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input id="title" name="title" required className="input" placeholder="e.g. Big mirror on Richland-Chambers" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="species">Species *</label>
            <select id="species" name="species" required className="input">
              {CARP_SPECIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="caughtAt">Date Caught</label>
            <input id="caughtAt" name="caughtAt" type="datetime-local" className="input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="weightLbs">Weight (lbs)</label>
            <input id="weightLbs" name="weightLbs" type="number" step="0.1" min="0" className="input" placeholder="e.g. 23.5" />
          </div>
          <div>
            <label className="label" htmlFor="lengthIn">Length (inches)</label>
            <input id="lengthIn" name="lengthIn" type="number" step="0.5" min="0" className="input" placeholder="e.g. 34" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="location">Location</label>
          <input id="location" name="location" className="input" placeholder="e.g. Richland-Chambers Reservoir, TX" />
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={3} className="input resize-none" placeholder="Tell the story of your catch..." />
        </div>
      </section>

      {/* Gear */}
      <section className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Gear Used</h2>
          <button type="button" onClick={addGear} className="btn-secondary text-xs px-3 py-1.5">
            + Add Gear
          </button>
        </div>

        {gear.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No gear added. Click &ldquo;Add Gear&rdquo; to log your setup.</p>
        ) : (
          <div className="space-y-4">
            {gear.map((g, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Gear #{i + 1}</span>
                  <button type="button" onClick={() => removeGear(i)} className="text-red-500 text-xs hover:text-red-700">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Type</label>
                    <select className="input" value={g.type} onChange={(e) => updateGear(i, "type", e.target.value)}>
                      {GEAR_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Brand</label>
                    <input className="input" value={g.brand} onChange={(e) => updateGear(i, "brand", e.target.value)} placeholder="e.g. Daiwa" />
                  </div>
                  <div>
                    <label className="label">Model</label>
                    <input className="input" value={g.model} onChange={(e) => updateGear(i, "model", e.target.value)} placeholder="e.g. Ninja 3000" />
                  </div>
                  <div>
                    <label className="label">Notes</label>
                    <input className="input" value={g.description} onChange={(e) => updateGear(i, "description", e.target.value)} placeholder="Optional details" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Water Conditions */}
      <section className="card p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Water Conditions</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="tempF">Water Temp (°F)</label>
            <input id="tempF" name="tempF" type="number" step="0.5" className="input" placeholder="e.g. 68" />
          </div>
          <div>
            <label className="label" htmlFor="airTempF">Air Temp (°F)</label>
            <input id="airTempF" name="airTempF" type="number" step="0.5" className="input" placeholder="e.g. 75" />
          </div>
          <div>
            <label className="label" htmlFor="clarity">Water Clarity</label>
            <select id="clarity" name="clarity" className="input">
              <option value="">Select clarity</option>
              {CLARITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="depthFt">Depth (ft)</label>
            <input id="depthFt" name="depthFt" type="number" step="0.5" min="0" className="input" placeholder="e.g. 8" />
          </div>
          <div>
            <label className="label" htmlFor="currentSpeed">Current</label>
            <select id="currentSpeed" name="currentSpeed" className="input">
              <option value="">Select current</option>
              {CURRENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="weather">Weather</label>
            <select id="weather" name="weather" className="input">
              <option value="">Select weather</option>
              {WEATHER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="windMph">Wind Speed (mph)</label>
            <input id="windMph" name="windMph" type="number" step="0.5" min="0" className="input" placeholder="e.g. 10" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="conditionNotes">Additional Notes</label>
          <textarea id="conditionNotes" name="conditionNotes" rows={2} className="input resize-none" placeholder="Any other observations..." />
        </div>
      </section>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? "Saving..." : "Log Catch"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
