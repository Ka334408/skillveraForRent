import LocaleSwitcher from "@/app/components/local-switcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div className="absolute top-4 left-4 z-50">
        <LocaleSwitcher />
      </div>

      <main >
        <div className="pt-16 sm:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
