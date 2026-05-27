const SearchBar=({ search, setSearch })=>{
  return (
    <div className="rounded-[24px] border border-stone-300 bg-white p-2 shadow-[0_12px_30px_rgba(28,25,23,0.08)]">
      <input
        type="text"
        placeholder="Search perfumes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-[18px] bg-stone-100 px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
      />
    </div>
  )
}

export default SearchBar
