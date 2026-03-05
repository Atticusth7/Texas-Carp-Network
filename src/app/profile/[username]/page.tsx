import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import CatchCard from "@/components/catches/CatchCard";
import PostCard from "@/components/posts/PostCard";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      catches: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, username: true, name: true, avatarUrl: true } },
          gear: true,
          waterConditions: true,
        },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Profile header */}
      <div className="card p-6 mb-8 flex items-start gap-5">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name ?? user.username}
            width={80}
            height={80}
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-3xl shrink-0">
            🎣
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name ?? user.username}</h1>
          <p className="text-gray-500 text-sm">@{user.username}</p>
          {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
          <div className="flex gap-4 mt-3 text-sm">
            <span className="font-semibold text-gray-900">{user.catches.length}</span>
            <span className="text-gray-500">catches</span>
            <span className="font-semibold text-gray-900 ml-2">{user.posts.length}</span>
            <span className="text-gray-500">posts</span>
          </div>
        </div>
      </div>

      {/* Catches */}
      {user.catches.length > 0 && (
        <section className="mb-10">
          <h2 className="section-title mb-5">Catches</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {user.catches.map((c) => (
              <CatchCard key={c.id} catch={c as any} />
            ))}
          </div>
        </section>
      )}

      {/* Posts */}
      {user.posts.length > 0 && (
        <section>
          <h2 className="section-title mb-5">Posts</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {user.posts.map((p) => (
              <PostCard key={p.id} post={p as any} />
            ))}
          </div>
        </section>
      )}

      {user.catches.length === 0 && user.posts.length === 0 && (
        <div className="card p-12 text-center text-gray-500">
          <p className="text-4xl mb-3">🎣</p>
          <p>No catches or posts yet.</p>
        </div>
      )}
    </div>
  );
}
