import "./style.css"
import SearchBar from "./components/searchBar"
import PerfumeCard from "./components/perfumeCard"
import { useEffect, useState } from "react"

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white p-4 shadow-sm animate-pulse">
    <div className="flex gap-3">
      <div className="h-[72px] w-[72px] min-w-[72px] rounded-[20px] bg-stone-205 bg-stone-200" />
      <div className="flex-grow space-y-3 py-1">
        <div className="h-3 w-1/4 rounded bg-stone-200" />
        <div className="h-4 w-3/4 rounded bg-stone-200" />
        <div className="h-3 w-1/2 rounded bg-stone-200" />
      </div>
    </div>
  </div>
)

const ErrorState = ({ message, onRetry }) => (
  <div className="rounded-[24px] border border-red-200 bg-red-50 p-5 text-center shadow-sm">
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-105 bg-red-100 text-red-650 text-red-600">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <p className="mt-3 text-sm font-semibold text-red-800">Connection Failed</p>
    <p className="mt-1 text-xs text-red-500 leading-relaxed">
      {message || "Could not connect to the recommendation backend."}
    </p>
    <button
      onClick={onRetry}
      className="mt-4 w-full rounded-[16px] bg-stone-900 hover:bg-stone-800 px-4 py-2.5 text-xs font-semibold text-white transition active:scale-95">
      Try Reconnecting
    </button>
  </div>
)

function Popup() {
  const [search, setSearch] = useState("")
  const [amazonProduct, setAmazonProduct] = useState(null)
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Read Amazon product from chrome storage
  useEffect(() => {
    if (chrome?.storage?.local) {
      chrome.storage.local.get(["currentProduct"], (result) => {
        if (result.currentProduct) {
          const product = result.currentProduct
          setAmazonProduct(product)
          // Auto-fill search with the cleaned title
          setSearch(product.title || "")
        }
      })
    }
  }, [])

  const fetchResults = async (query) => {
    if (!query || !query.trim()) {
      setResults([])
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`)
      if (!res.ok) {
        throw new Error("Could not fetch recommendations. Ensure the backend server is running.")
      }
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error("Fetch recommendations failed:", err)
      setError(err.message || "Failed to fetch matches from server.")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch results with 300ms debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResults(search)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  return (
    <div className="w-[360px] overflow-hidden bg-stone-950 text-stone-50">
      {/* Hero Section */}
      <div className="relative border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.25),_transparent_38%),linear-gradient(135deg,_#1c1917,_#0c0a09_62%)] p-5">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-amber-300/10 blur-2xl" />

        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80 font-semibold">
            Perfume Match
          </p>

          <h1 className="mt-2 text-[26px] font-semibold leading-none tracking-[-0.04em]">
            Find the luxe dupe
          </h1>

          <p className="mt-2 max-w-[260px] text-sm leading-5 text-stone-300">
            Search a designer scent and get a cleaner, cheaper alternative fast.
          </p>

          {amazonProduct && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur transition-all duration-300 hover:bg-white/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/70 font-semibold">
                Detected Product
              </p>

              <div className="mt-2 flex gap-3">
                {amazonProduct.image && (
                  <img
                    src={amazonProduct.image}
                    alt={amazonProduct.title}
                    className="h-16 w-16 rounded-xl object-cover shadow-sm border border-white/10"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-200 font-medium leading-relaxed line-clamp-2">
                    {amazonProduct.title}
                  </p>
                  {amazonProduct.rawTitle && amazonProduct.rawTitle !== amazonProduct.title && (
                    <p className="text-[9px] text-stone-500 mt-1 truncate">
                      Original: {amazonProduct.rawTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-stone-100 to-stone-200 p-4 text-stone-900">
        <SearchBar search={search} setSearch={setSearch} />

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Results
          </p>

          {!isLoading && !error && (
            <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[11px] font-semibold text-stone-50 transition-all duration-300">
              {results.length}
            </span>
          )}
        </div>

        {/* Results Container */}
        <div className="mt-4 space-y-4">
          {isLoading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!isLoading && error && (
            <ErrorState message={error} onRetry={() => fetchResults(search)} />
          )}

          {!isLoading && !error && results.map((item) => (
            <PerfumeCard key={item.id} item={item} />
          ))}

          {/* Empty State / Search Guide */}
          {!isLoading && !error && results.length === 0 && (
            <div className="rounded-[24px] border border-stone-300 bg-white/80 p-5 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 animate-bounce">
                <span className="text-xl">✨</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-stone-800">
                {search.trim() ? "No dupe found yet" : "Enter a Fragrance"}
              </p>
              <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                {search.trim()
                  ? "Try searching by the original brand or scent name."
                  : "Type a designer scent above, or open an Amazon product page to discover matching luxury dupes instantly."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Popup