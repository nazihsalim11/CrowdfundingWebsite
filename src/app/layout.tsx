import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "SCMS | School Crowdfunding Management System",
  description: "Empowering schools through transparent crowdfunding and investment. Support infrastructure, digital education, scholarship programs, and track fund utilization in real-time.",
  keywords: ["school crowdfunding", "education investment", "financial transparency", "school funds", "SCMS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
