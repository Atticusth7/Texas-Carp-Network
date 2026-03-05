import PostForm from "@/components/posts/PostForm";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="section-title mb-2">New Post</h1>
      <p className="text-gray-500 mb-8">Share tips, stories, or anything carp-related with the community.</p>
      <PostForm />
    </div>
  );
}
