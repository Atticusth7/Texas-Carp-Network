import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎣</span>
            <span className="font-semibold text-brand-800">Texas Carp Network</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/catches" className="hover:text-gray-900">Catches</Link>
            <Link href="/posts" className="hover:text-gray-900">Posts</Link>
          </nav>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Texas Carp Network
          </p>
        </div>
      </div>
    </footer>
  );
}
