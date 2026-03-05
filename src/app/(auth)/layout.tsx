export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-stone-50 py-12 px-4">
      {children}
    </div>
  );
}
