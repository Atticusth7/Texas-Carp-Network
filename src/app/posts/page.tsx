import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/posts/PostCard";

export const revalidate = 60;

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Community Posts</h1>
          <p className="text-gray-500 mt-1">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/posts/new" className="btn-primary">
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card p-16 text-center text-gray-500">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-lg font-medium mb-2">No posts yet</p>
          <p className="text-sm mb-6">Start the community conversation!</p>
          <Link href="/posts/new" className="btn-primary">Create a Post</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.id} post={p as any} />
          ))}
        </div>
      )}
    </div>
  );
}
