import { Geist, Geist_Mono } from "next/font/google";
import { NavSidebar } from "@/frontend/components/NavSidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayoutView({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-zinc-200 h-full overflow-hidden flex antialiased`}
        suppressHydrationWarning
      >
        <NavSidebar />
        <div className="flex-1 h-full relative flex flex-col min-w-0 overflow-hidden pb-12 md:pb-0">
          {children}
        </div>
      </body>
    </html>
  );
}
