import "./globals.css";
import type { Metadata } from "next";

import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Music/Video Downloader",
  description: "Download a video from a link!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
