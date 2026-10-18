import Link from "next/link";
import { LayoutDashboard, GraduationCap, Users } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-black text-xl tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">VC</div>
          VIBE CODING
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/courses" className="text-sm font-medium hover:text-blue-600 transition flex items-center gap-1">
            <GraduationCap size={18} /> Kursus
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600 transition flex items-center gap-1">
            <LayoutDashboard size={18} /> Murid
          </Link>
          <Link href="/teacher" className="text-sm font-medium hover:text-blue-600 transition flex items-center gap-1 text-gray-400 border-l pl-6">
            <Users size={18} /> Guru
          </Link>
        </div>
      </div>
    </nav>
  );
}
