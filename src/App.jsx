import Header from './components/Header'
import Sections from './components/Sections'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-fuchsia-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header />
        <Sections />
      </div>
    </div>
  )
}

export default App