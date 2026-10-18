import { internalMutation } from "./_generated/server";

export default internalMutation({
  args: {},
  handler: async (ctx) => {
    const teacherId = await ctx.db.insert("users", {
      name: "Sensei Vibe",
      email: "teacher@vibe.coding",
      role: "TEACHER",
    });

    await ctx.db.insert("users", {
      name: "Student Vibe",
      email: "student@vibe.coding",
      role: "STUDENT",
    });

    const courseId = await ctx.db.insert("courses", {
      title: "Vibe Coding dengan Next.js",
      description: "Belajar membangun aplikasi web modern dengan suasana santai namun hasil maksimal. Kita akan fokus pada flow, intuisi, dan kreativitas.",
      teacherId,
    });

    await ctx.db.insert("lessons", {
      courseId,
      title: "Filosofi Vibe Coding",
      content: "Vibe Coding adalah tentang masuk ke dalam 'flow state'. Lupakan stress, fokus pada apa yang ingin kamu bangun. Coding bukan cuma logika, tapi juga seni.",
      order: 1,
    });

    await ctx.db.insert("lessons", {
      courseId,
      title: "Setup Lingkungan Kerja yang Estetik",
      content: "Pilih font yang enak dilihat, tema VS Code yang menenangkan (seperti Tokyo Night atau Synthwave 84), dan siapkan playlist lo-fi favoritmu.",
      order: 2,
    });
  },
});
