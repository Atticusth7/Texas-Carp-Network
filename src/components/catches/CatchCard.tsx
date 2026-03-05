import Link from "next/link";
import Image from "next/image";
import { CatchWithRelations } from "@/types";
import { formatDate, formatWeight, formatLength } from "@/lib/utils";

export default function CatchCard({ catch: c }: { catch: CatchWithRelations }) {
  return (
    <Link href={`/catches/${c.id}`} className="card overflow-hidden group hover:shadow-md transition-shadow block">
      {/* Photo */}
      {c.photos.length > 0 ? (
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <Image
            src={c.photos[0]}
            alt={c.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-brand-50 flex items-center justify-center text-5xl">
          🎣
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors line-clamp-1">
            {c.title}
          </h3>
          <span className="badge-green shrink-0">{c.species}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          {c.weightLbs != null && <span>{formatWeight(c.weightLbs)}</span>}
          {c.lengthIn != null && <span>{formatLength(c.lengthIn)}</span>}
          {c.location && (
            <span className="truncate">📍 {c.location}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <Link
            href={`/profile/${c.user.username}`}
            className="hover:text-brand-700 font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {c.user.name ?? c.user.username}
          </Link>
          <span>{formatDate(c.caughtAt)}</span>
        </div>

        {c.gear.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {c.gear.slice(0, 3).map((g) => (
              <span key={g.id} className="badge-gray">{g.type}</span>
            ))}
            {c.gear.length > 3 && (
              <span className="badge-gray">+{c.gear.length - 3} more</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
