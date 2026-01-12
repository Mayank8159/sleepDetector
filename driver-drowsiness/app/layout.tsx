// app/layout.tsx
import "./globals.css"; // ensure this exists

export const metadata = {
  title: "Driver Drowsiness Detection",
  description: "Real-time Vision Safety System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-black text-white antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
