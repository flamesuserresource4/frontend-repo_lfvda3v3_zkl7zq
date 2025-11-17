import { Heart } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative text-center py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,#fda4af,transparent_35%),radial-gradient(circle_at_80%_-10%,#c4b5fd,transparent_35%)] opacity-60"></div>
      <div className="inline-flex items-center gap-3 mb-3">
        <span className="p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-lg text-rose-200">
          <Heart className="w-8 h-8" />
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400">
          Bizim Küçük Dünyamız
        </h1>
      </div>
      <p className="text-rose-50/90 max-w-xl mx-auto">
        Fotoğraflarımız, şarkılarımız, filmlerimiz ve günlük notlarımız için romantik ve eğlenceli bir alan.
      </p>
    </header>
  )
}
