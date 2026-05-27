import "./style.css"
import perfumes from "./data/perfumes.json"
import SearchBar from "./components/searchBar"
import PerfumeCard from "./components/perfumeCard"

import { useEffect, useState } from "react"

function Popup() {
  const [search, setSearch] = useState("")
  const [amazonProduct, setAmazonProduct] =
    useState(null)

  // Stopwords for cleaner matching
  const stopWords = [
    "for",
    "men",
    "women",
    "eau",
    "de",
    "parfum",
    "perfume",
    "ml",
    "edp",
    "edt",
    "spray"
  ]

  // Read Amazon product from chrome storage
  useEffect(() => {
    if (chrome?.storage?.local) {
      chrome.storage.local.get(
        ["currentProduct"],
        (result) => {
          if (result.currentProduct) {
            const product =
              result.currentProduct

            setAmazonProduct(product)

            // Auto-fill search from title
            setSearch(product.title || "")
          }
        }
      )
    }
  }, [])

  // Smart filtering
  const filteredPerfumes = perfumes
    .map((item) => {
      const queryWords = search
        .toLowerCase()
        .split(" ")
        .filter(
          (word) =>
            word.length > 2 &&
            !stopWords.includes(word)
        )

      let score = 0

      queryWords.forEach((word) => {
        // Original perfume
        if (
          item.original
            .toLowerCase()
            .includes(word)
        ) {
          score += 5
        }

        // Dupe perfume
        if (
          item.dupe
            .toLowerCase()
            .includes(word)
        ) {
          score += 4
        }

        // Brand
        if (
          item.brand
            .toLowerCase()
            .includes(word)
        ) {
          score += 3
        }

        // Notes
        item.notes.forEach((note) => {
          if (
            note.toLowerCase().includes(word)
          ) {
            score += 2
          }
        })

        // Accords
        item.accords.forEach((accord) => {
          if (
            accord
              .toLowerCase()
              .includes(word)
          ) {
            score += 2
          }
        })

        // Mood
        item.mood?.forEach((mood) => {
          if (
            mood.toLowerCase().includes(word)
          ) {
            score += 1
          }
        })
      })

      return {
        ...item,
        score
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return (
    <div className="w-[360px] overflow-hidden bg-stone-950 text-stone-50">
      {/* Hero Section */}
      <div className="relative border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.25),_transparent_38%),linear-gradient(135deg,_#1c1917,_#0c0a09_62%)] p-5">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-amber-300/10 blur-2xl" />

        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">
            Perfume Match
          </p>

          <h1 className="mt-2 text-[26px] font-semibold leading-none tracking-[-0.04em]">
            Find the luxe dupe
          </h1>

          <p className="mt-2 max-w-[260px] text-sm leading-5 text-stone-300">
            Search a designer scent and get a cleaner,
            cheaper alternative fast.
          </p>

          {amazonProduct && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/70">
                Detected Product
              </p>

              <div className="mt-2 flex gap-3">
                {amazonProduct.image && (
                  <img
                    src={amazonProduct.image}
                    alt={amazonProduct.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                )}

                <div className="flex-1">
                  <p className="line-clamp-3 text-xs text-stone-200">
                    {amazonProduct.title}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-stone-100 to-stone-200 p-4 text-stone-900">
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
            Results
          </p>

          <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[11px] font-semibold text-stone-50">
            {filteredPerfumes.length}
          </span>
        </div>

        {/* Results */}
        <div className="mt-4 space-y-4">
          {filteredPerfumes.map((item) => (
            <PerfumeCard
              key={item.id}
              item={item}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPerfumes.length === 0 && (
          <div className="mt-4 rounded-[24px] border border-stone-300 bg-white/80 p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-stone-800">
              No dupe found yet
            </p>

            <p className="mt-1 text-xs text-stone-500">
              Try searching by the original perfume
              name.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Popup