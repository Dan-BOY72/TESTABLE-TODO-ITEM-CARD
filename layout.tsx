import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow - Stay Organized",
  description: "A clean, interactive task management application built with Next.js and React",
  keywords: ["todo", "task", "manager", "productivity", "organization"],
  openGraph: {
    title: "TaskFlow - Stay Organized",
    description: "Manage your tasks with elegance and boost your productivity",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}