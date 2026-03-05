import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CatchCard from "@/components/catches/CatchCard";
import PostCard from "@/components/posts/PostCard";

export const revalidate = 60;

export default async function HomePage() {
  const [recentCatches, recentPosts] = await Promise.all([
    prisma.catch.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        gear: true,
        waterConditions: true,
      },
    }),
    prisma.post.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      },
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-800 to-brand-950 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Texas Carp Network
          </h1>
          <p className="text-lg sm:text-xl text-brand-200 mb-8 max-w-2xl mx-auto">
            The go-to community for Texas carp anglers. Share your catches,
            gear setups, and water conditions with fellow fishermen.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/catches/new" className="btn-primary bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 text-base">
              Log a Catch
            </Link>
            <Link href="/catches" className="btn-secondary border-brand-600 text-white bg-brand-700/50 hover:bg-brand-700 px-6 py-3 text-base">
              Browse Catches
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {/* Recent Catches */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Recent Catches</h2>
            <Link href="/catches" className="text-sm font-medium text-brand-700 hover:underline">
              View all →
            </Link>
          </div>
          {recentCatches.length === 0 ? (
            <div className="card p-12 text-center text-gray-500">
              <p className="text-4xl mb-3">🎣</p>
              <p className="font-medium">No catches yet. Be the first to log one!</p>
              <Link href="/catches/new" className="btn-primary mt-4 inline-flex">
                Log a Catch
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentCatches.map((c) => (
                <CatchCard key={c.id} catch={c as any} />
              ))}
            </div>
          )}
        </section>

        {/* Recent Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Community Posts</h2>
            <Link href="/posts" className="text-sm font-medium text-brand-700 hover:underline">
              View all →
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="card p-12 text-center text-gray-500">
              <p className="text-4xl mb-3">📝</p>
              <p className="font-medium">No posts yet. Start the conversation!</p>
              <Link href="/posts/new" className="btn-primary mt-4 inline-flex">
                Create Post
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {recentPosts.map((p) => (
                <PostCard key={p.id} post={p as any} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
