import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatWeight, formatLength, formatTemp } from "@/lib/utils";

export default async function CatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const c = await prisma.catch.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      gear: true,
      waterConditions: true,
    },
  });

  if (!c) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      {/* Back */}
      <Link href="/catches" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        ← Back to Catches
      </Link>

      <div className="card overflow-hidden">
        {/* Photo gallery */}
        {c.photos.length > 0 && (
          <div className={`grid gap-1 ${c.photos.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {c.photos.map((url, i) => (
              <div key={i} className="relative aspect-video bg-gray-100">
                <Image src={url} alt={`${c.title} photo ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{c.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge-green">{c.species}</span>
                <span className="text-sm text-gray-500">{formatDate(c.caughtAt)}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Weight</p>
              <p className="font-semibold text-gray-900 mt-0.5">{formatWeight(c.weightLbs)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Length</p>
              <p className="font-semibold text-gray-900 mt-0.5">{formatLength(c.lengthIn)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
              <p className="font-semibold text-gray-900 mt-0.5 truncate">{c.location ?? "—"}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Angler</p>
              <Link href={`/profile/${c.user.username}`} className="font-semibold text-brand-700 hover:underline mt-0.5 block truncate">
                {c.user.name ?? c.user.username}
              </Link>
            </div>
          </div>

          {/* Description */}
          {c.description && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{c.description}</p>
            </div>
          )}

          {/* Gear */}
          {c.gear.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Gear Used</h2>
              <div className="space-y-2">
                {c.gear.map((g) => (
                  <div key={g.id} className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <span className="badge-blue shrink-0">{g.type}</span>
                    <div>
                      {(g.brand || g.model) && (
                        <p className="font-medium text-gray-900 text-sm">
                          {[g.brand, g.model].filter(Boolean).join(" ")}
                        </p>
                      )}
                      {g.description && <p className="text-sm text-gray-500 mt-0.5">{g.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Water Conditions */}
          {c.waterConditions && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Water Conditions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {c.waterConditions.tempF != null && (
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xs text-gray-500">Water Temp</p>
                    <p className="font-semibold mt-0.5">{formatTemp(c.waterConditions.tempF)}</p>
                  </div>
                )}
                {c.waterConditions.airTempF != null && (
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xs text-gray-500">Air Temp</p>
                    <p className="font-semibold mt-0.5">{formatTemp(c.waterConditions.airTempF)}</p>
                  </div>
                )}
                {c.waterConditions.clarity && (
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xs text-gray-500">Clarity</p>
                    <p className="font-semibold mt-0.5 capitalize">{c.waterConditions.clarity.replace(/_/g, " ")}</p>
                  </div>
                )}
                {c.waterConditions.depthFt != null && (
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xs text-gray-500">Depth</p>
                    <p className="font-semibold mt-0.5">{c.waterConditions.depthFt} ft</p>
                  </div>
                )}
                {c.waterConditions.currentSpeed && (
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xs text-gray-500">Current</p>
                    <p className="font-semibold mt-0.5 capitalize">{c.waterConditions.currentSpeed}</p>
                  </div>
                )}
                {c.waterConditions.weather && (
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xs text-gray-500">Weather</p>
                    <p className="font-semibold mt-0.5 capitalize">{c.waterConditions.weather.replace(/_/g, " ")}</p>
                  </div>
                )}
                {c.waterConditions.windMph != null && (
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xs text-gray-500">Wind</p>
                    <p className="font-semibold mt-0.5">{c.waterConditions.windMph} mph</p>
                  </div>
                )}
              </div>
              {c.waterConditions.notes && (
                <p className="mt-3 text-sm text-gray-600 bg-stone-50 rounded-lg p-3">{c.waterConditions.notes}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
