import SimilarityRing from "./similarityRing"

const PerfumeCard = ({ item }) => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-stone-300 bg-white shadow-[0_18px_40px_rgba(28,25,23,0.08)]">
      <div className="border-b border-stone-200 bg-[linear-gradient(135deg,_rgba(245,158,11,0.14),_rgba(255,255,255,0.9)_45%,_rgba(41,37,36,0.04))] p-4">
        <div className="flex gap-3">
          <img
            src={item.image}
            alt={item.original}
            className="rounded-[20px] object-cover shadow-sm"
            style={{
              width: "72px",
              height: "72px",
              minWidth: "72px",
              flexShrink: 0
            }}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Best Dupe
                </p>
                <h2 className="mt-1 text-[15px] font-semibold leading-5 text-stone-950">
                  {item.dupe}
                </h2>
              </div>

              <SimilarityRing similarity={item.similarity} />
            </div>

            <p className="mt-2 text-xs leading-5 text-stone-500">
              Inspired by <span className="font-medium text-stone-700">{item.original}</span>
            </p>

            <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-stone-950">
              {item.price}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {item.notes.map((note) => (
            <span
              key={note}
              className="rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600"
            >
              {note}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-2xl bg-stone-950 py-2.5 text-sm font-medium text-white">
            View Dupe
          </button>

          <a
            href={item.youtube}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-2xl border border-stone-300 bg-stone-50 py-2.5 text-center text-sm font-medium text-stone-700"
          >
            Review
          </a>
        </div>
      </div>
    </div>
  )
}

export default PerfumeCard
