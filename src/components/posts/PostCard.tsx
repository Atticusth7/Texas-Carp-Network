import Link from "next/link";
import Image from "next/image";
import { PostWithUser } from "@/types";
import { formatDate } from "@/lib/utils";

export default function PostCard({ post }: { post: PostWithUser }) {
  return (
    <Link href={`/posts/${post.id}`} className="card overflow-hidden group hover:shadow-md transition-shadow block">
      {post.photos.length > 0 && (
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <Image
            src={post.photos[0]}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors line-clamp-2 mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3 mb-3">{post.content}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <Link
            href={`/profile/${post.user.username}`}
            className="hover:text-brand-700 font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {post.user.name ?? post.user.username}
          </Link>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
