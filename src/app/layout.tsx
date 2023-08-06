import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
