import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Toaster } from "sonner";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "DocMuse",
  description: "Project and document management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
      </head>
      <body className="font-inter">
        <Navbar />
        <main className="min-h-screen bg-background">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
