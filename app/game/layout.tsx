"use client";

import { ReactNode } from "react";

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-gray-800 text-white p-4"></footer>
    </div>
  );
}
