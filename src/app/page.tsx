import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="py-20 px-8 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
          <Sparkles size={16} /> <span>Cara baru belajar coding</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-8">
          Code with <span className="text-blue-600 italic">Vibe.</span> Build with <span className="text-indigo-600">Soul.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Platform kursus gratis untuk kamu yang ingin menguasai Vibe Coding.
          Lupakan stress, nikmati prosesnya, dan bangun karya luar biasa.
        </p>
        <Link
          href="/courses"
          className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition flex items-center gap-2"
        >
          Mulai Belajar Sekarang <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
