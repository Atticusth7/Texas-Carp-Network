"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/catches", label: "Catches" },
  { href: "/posts", label: "Posts" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎣</span>
            <span className="font-bold text-brand-800 text-lg leading-tight">
              Texas Carp<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Network
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname.startsWith(href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in" className="btn-secondary text-sm">
                Sign in
              </Link>
              <Link href="/sign-up" className="btn-primary text-sm">
                Join
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/catches/new" className="btn-primary text-sm hidden sm:inline-flex">
                + Log Catch
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Mobile nav */}
            <nav className="flex md:hidden items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    pathname.startsWith(href)
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
