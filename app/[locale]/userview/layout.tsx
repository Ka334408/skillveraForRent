// app/[locale]/layout.tsx
import Footer from "@/app/components/footer";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}