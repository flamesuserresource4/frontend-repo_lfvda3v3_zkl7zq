import { useEffect, useState } from 'react'
import { Image, Music, Film, StickyNote, CalendarDays, Star } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function SectionCard({ title, icon: Icon, children, accent = 'rose' }) {
  const accentMap = {
    rose: 'from-rose-100/60 to-pink-100/50 border-rose-200',
    indigo: 'from-indigo-100/60 to-violet-100/50 border-indigo-200',
    amber: 'from-amber-100/60 to-orange-100/50 border-amber-200',
    emerald: 'from-emerald-100/60 to-teal-100/50 border-emerald-200',
    sky: 'from-sky-100/60 to-cyan-100/50 border-sky-200',
  }

  return (
    <div className={`bg-gradient-to-br ${accentMap[accent]} rounded-2xl p-5 border shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="p-2 rounded-xl bg-white/70 text-gray-800 border border-white/60 shadow">
          <Icon className="w-5 h-5" />
        </span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function Sections() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <PhotosSection />
      <FavoritesSection />
      <SongsSection />
      <MoviesSection />
      <NotesSection />
      <PlansSection />
    </div>
  )
}

function PhotosSection() {
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [items, setItems] = useState([])

  const load = async () => {
    const res = await fetch(`${API}/photos`)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const add = async (fav=false) => {
    if (!url) return
    await fetch(`${API}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploader: 'biz', caption, file_url: url, favorite: fav })
    })
    setUrl(''); setCaption('');
    await load()
  }

  return (
    <SectionCard title="Fotoğraflar" icon={Image} accent="rose">
      <div className="flex gap-2 mb-3">
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Fotoğraf URL'si" className="flex-1 px-3 py-2 rounded-lg border" />
        <input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Açıklama" className="flex-1 px-3 py-2 rounded-lg border" />
        <button onClick={()=>add(false)} className="px-3 py-2 rounded-lg bg-rose-500 text-white">Ekle</button>
        <button onClick={()=>add(true)} className="px-3 py-2 rounded-lg bg-pink-500 text-white">Favori</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map(p=> (
          <figure key={p.id} className="rounded-xl overflow-hidden bg-white/80 border">
            <img src={p.file_url} alt={p.caption||''} className="w-full h-24 object-cover" />
            {p.caption && <figcaption className="text-xs p-2 text-gray-700">{p.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </SectionCard>
  )
}

function FavoritesSection() {
  const [items, setItems] = useState([])
  const load = async () => {
    const res = await fetch(`${API}/photos?favorites=true`)
    const data = await res.json()
    setItems(data)
  }
  useEffect(()=>{ load() }, [])

  return (
    <SectionCard title="Favoriler" icon={Star} accent="amber">
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">Henüz favori yok. Fotoğraf eklerken Favori butonunu kullanın.</p>
      ) : (
        <div className="flex gap-2 overflow-auto">
          {items.map(p=> (
            <img key={p.id} src={p.file_url} alt={p.caption||''} className="h-24 w-24 object-cover rounded-lg border" />
          ))}
        </div>
      )}
    </SectionCard>
  )
}

function SongsSection() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [url, setUrl] = useState('')
  const [items, setItems] = useState([])

  const load = async () => {
    const res = await fetch(`${API}/songs`)
    setItems(await res.json())
  }
  useEffect(()=>{ load() }, [])

  const add = async () => {
    if (!title) return
    await fetch(`${API}/songs`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, artist, url, added_by: 'biz' })
    })
    setTitle(''); setArtist(''); setUrl('');
    await load()
  }

  return (
    <SectionCard title="Şarkılarımız" icon={Music} accent="indigo">
      <div className="flex gap-2 mb-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Şarkı adı" className="flex-1 px-3 py-2 rounded-lg border" />
        <input value={artist} onChange={e=>setArtist(e.target.value)} placeholder="Sanatçı" className="flex-1 px-3 py-2 rounded-lg border" />
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Link (opsiyonel)" className="flex-1 px-3 py-2 rounded-lg border" />
        <button onClick={add} className="px-3 py-2 rounded-lg bg-indigo-500 text-white">Ekle</button>
      </div>
      <ul className="space-y-2">
        {items.map(s => (
          <li key={s.id} className="p-2 bg-white/80 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{s.title}</p>
                <p className="text-xs text-gray-600">{s.artist}</p>
              </div>
              {s.url && <a href={s.url} target="_blank" className="text-indigo-600 text-sm underline">Dinle</a>}
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function MoviesSection() {
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [link, setLink] = useState('')
  const [items, setItems] = useState([])

  const load = async () => {
    const res = await fetch(`${API}/movies`)
    setItems(await res.json())
  }
  useEffect(()=>{ load() }, [])

  const add = async () => {
    if (!title) return
    await fetch(`${API}/movies`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, year: year? Number(year): undefined, link, planned_by: 'biz', watched: false })
    })
    setTitle(''); setYear(''); setLink('');
    await load()
  }

  return (
    <SectionCard title="Film Listemiz" icon={Film} accent="sky">
      <div className="flex gap-2 mb-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Film adı" className="flex-1 px-3 py-2 rounded-lg border" />
        <input value={year} onChange={e=>setYear(e.target.value)} placeholder="Yıl" className="w-28 px-3 py-2 rounded-lg border" />
        <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Link (opsiyonel)" className="flex-1 px-3 py-2 rounded-lg border" />
        <button onClick={add} className="px-3 py-2 rounded-lg bg-sky-500 text-white">Ekle</button>
      </div>
      <ul className="space-y-2">
        {items.map(m => (
          <li key={m.id} className="p-2 bg-white/80 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{m.title} {m.year && <span className="text-gray-500">({m.year})</span>}</p>
                {m.link && <a href={m.link} target="_blank" className="text-sm text-sky-600 underline">Bağlantı</a>}
              </div>
              <span className="text-xs text-gray-500">Planlayan: {m.planned_by || '—'}</span>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function NotesSection() {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [items, setItems] = useState([])

  const load = async () => {
    const res = await fetch(`${API}/notes`)
    setItems(await res.json())
  }
  useEffect(()=>{ load() }, [])

  const add = async () => {
    if (!content || !author) return
    await fetch(`${API}/notes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, author })
    })
    setContent(''); setAuthor('');
    await load()
  }

  return (
    <SectionCard title="Notlar" icon={StickyNote} accent="amber">
      <div className="flex gap-2 mb-3">
        <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Kimden" className="w-40 px-3 py-2 rounded-lg border" />
        <input value={content} onChange={e=>setContent(e.target.value)} placeholder="Mesajını yaz" className="flex-1 px-3 py-2 rounded-lg border" />
        <button onClick={add} className="px-3 py-2 rounded-lg bg-amber-500 text-white">Gönder</button>
      </div>
      <ul className="space-y-2">
        {items.map(n => (
          <li key={n.id} className="p-2 bg-white/80 rounded-lg border">
            <p className="text-gray-800">{n.content}</p>
            <p className="text-xs text-gray-500 mt-1">— {n.author}</p>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function PlansSection() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [details, setDetails] = useState('')
  const [author, setAuthor] = useState('')
  const [items, setItems] = useState([])

  const load = async () => {
    const res = await fetch(`${API}/plans`)
    setItems(await res.json())
  }
  useEffect(()=>{ load() }, [])

  const add = async () => {
    if (!title) return
    await fetch(`${API}/plans`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date, details, author })
    })
    setTitle(''); setDate(''); setDetails(''); setAuthor('');
    await load()
  }

  return (
    <SectionCard title="Planlarımız" icon={CalendarDays} accent="emerald">
      <div className="flex gap-2 mb-3 flex-wrap">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Başlık" className="flex-1 px-3 py-2 rounded-lg border" />
        <input value={date} onChange={e=>setDate(e.target.value)} placeholder="Tarih (YYYY-AA-GG)" className="w-44 px-3 py-2 rounded-lg border" />
        <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Kimden" className="w-40 px-3 py-2 rounded-lg border" />
        <input value={details} onChange={e=>setDetails(e.target.value)} placeholder="Detaylar" className="flex-1 px-3 py-2 rounded-lg border" />
        <button onClick={add} className="px-3 py-2 rounded-lg bg-emerald-500 text-white">Ekle</button>
      </div>
      <ul className="space-y-2">
        {items.map(p => (
          <li key={p.id} className="p-2 bg-white/80 rounded-lg border">
            <p className="font-medium text-gray-800">{p.title} {p.date && <span className="text-xs text-gray-500">({p.date})</span>}</p>
            {p.details && <p className="text-sm text-gray-600">{p.details}</p>}
            {p.author && <p className="text-xs text-gray-500">— {p.author}</p>}
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
