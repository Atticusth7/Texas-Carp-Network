import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
    },
  });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <Link href="/posts" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        ← Back to Posts
      </Link>

      <div className="card overflow-hidden">
        {post.photos.length > 0 && (
          <div className={`grid gap-1 ${post.photos.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {post.photos.map((url, i) => (
              <div key={i} className="relative aspect-video bg-gray-100">
                <Image src={url} alt={`Post photo ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>

          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <Link href={`/profile/${post.user.username}`} className="font-medium text-brand-700 hover:underline">
              {post.user.name ?? post.user.username}
            </Link>
            <span>·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
