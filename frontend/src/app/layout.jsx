import "./globals.css";
import { AuthProvider } from "@/store/AuthContext";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata = {
  title: "Complaint-Review — Real Experiences. Verified Trust.",
  description:
    "Read genuine customer reviews, report complaints, and discover top-rated, verified companies. The open and independent platform built on authentic trust.",
  keywords: [
    "reviews",
    "customer reviews",
    "complaints",
    "business ratings",
    "trust score",
    "company reviews",
    "verified reviews",
  ],
  authors: [{ name: "Complaint-Review Platform" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body
        className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900"
        suppressHydrationWarning
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
