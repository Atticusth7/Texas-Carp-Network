import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CatchCard from "@/components/catches/CatchCard";

export const revalidate = 60;

export default async function CatchesPage() {
  const catches = await prisma.catch.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      gear: true,
      waterConditions: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Catches</h1>
          <p className="text-gray-500 mt-1">{catches.length} catch{catches.length !== 1 ? "es" : ""} logged</p>
        </div>
        <Link href="/catches/new" className="btn-primary">
          + Log Catch
        </Link>
      </div>

      {catches.length === 0 ? (
        <div className="card p-16 text-center text-gray-500">
          <p className="text-5xl mb-4">🎣</p>
          <p className="text-lg font-medium mb-2">No catches yet</p>
          <p className="text-sm mb-6">Be the first to log a catch!</p>
          <Link href="/catches/new" className="btn-primary">Log a Catch</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {catches.map((c) => (
            <CatchCard key={c.id} catch={c as any} />
          ))}
        </div>
      )}
    </div>
  );
}
