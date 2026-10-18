export function AccessNotice({ teacher = false }: { teacher?: boolean }) {
  return (
    <div role="status" className="max-w-2xl mx-auto p-8 text-gray-800">
      <h1 className="text-2xl font-bold mb-3">{teacher ? "Akses guru diperlukan" : "Akses akun diperlukan"}</h1>
      <p>Gunakan sesi dari penyedia identitas yang dikonfigurasi dan akun yang telah didaftarkan administrator.</p>
      <p className="mt-3">Formulir masuk belum tersedia di aplikasi ini. Hubungi pengelola untuk menyiapkan autentikasi dan akses akun. Katalog kursus tetap dapat dibaca tanpa akun.</p>
    </div>
  );
}
