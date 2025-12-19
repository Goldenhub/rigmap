export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container py-24 max-w-screen-2xl mx-auto px-4 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
