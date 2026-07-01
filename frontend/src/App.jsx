function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center font-sans">
      <div className="p-8 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl max-w-md text-center">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-3">
          MoonHaul
        </h1>
        <p className="text-lg text-slate-300 font-medium">
          Development Setup
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold text-purple-400 bg-purple-950/50 border border-purple-800 rounded-full">
            React + Vite
          </span>
          <span className="px-3 py-1 text-xs font-semibold text-pink-400 bg-pink-950/50 border border-pink-800 rounded-full">
            Tailwind CSS v4
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
