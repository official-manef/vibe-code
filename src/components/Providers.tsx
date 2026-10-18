"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return null;
    try {
      return new ConvexReactClient(url);
    } catch {
      return null;
    }
  }, []);

  if (!convex) {
    return (
      <div role="status" className="max-w-2xl mx-auto p-8 text-gray-800">
        <h1 className="text-2xl font-bold mb-3">Backend belum dikonfigurasi</h1>
        <p>Pengelola perlu mengatur NEXT_PUBLIC_CONVEX_URL ke deployment Convex yang sesuai. Lihat petunjuk konfigurasi dan autentikasi di README.</p>
      </div>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
