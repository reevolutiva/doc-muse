import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Navbar } from "@/components/navigation/navbar";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

export const metadata = {
  title: "Kimfe - Document Management",
  description: "Corporate training and document management platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
