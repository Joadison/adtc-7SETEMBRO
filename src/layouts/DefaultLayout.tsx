import Footer from "@/components/footer";
import Header from "@/components/header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header />
      <>{children}</>
      <Footer />
    </div>
  );
}