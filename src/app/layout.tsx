import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Kimfe - Document Management",
  description: "Corporate training and document management platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
