// app/layout.jsx (Server Component)
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from './components/Navbar';
import "./globals.css";
import Footer from "./components/Footer";
import SmoothScrolling from './components/SmoothScrolling';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Akbar Tax Store",
  description: "The Most trusted Financial and accounting services provider company.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <meta name="akbar-tax-store" content="Akbar Tax Store" />
      <body className="bg-white text-black">
        <SmoothScrolling />
        <Navbar />
        <main className="pt-16 md:pt-24 lg:pt-20">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}