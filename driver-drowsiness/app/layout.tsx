// app/layout.tsx
import "./globals.css"; // ensure this exists
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Driver Drowsiness Detection",
  description: "Real-time Vision Safety System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-black text-white antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
