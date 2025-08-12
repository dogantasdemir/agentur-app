import "./globals.css";
import React from "react";

export const metadata = {
  title: "Agentur WebApp",
  description: "MVP – Kundenrequests via Magic Link",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </body>
    </html>
  );
}
