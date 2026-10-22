const FilterSidebar = ({ category, minPrice, maxPrice, updateParam }) => {
  return (
    <div className="space-y-10 text-sm">

      <h2 className="text-lg font-semibold tracking-wide">
        Filters
      </h2>
 
      <div>
        <p className="mb-3 font-medium opacity-70">Category</p>
        {["shirts", "pants", "jackets"].map((c) => (
          <button
            key={c}
            onClick={() => updateParam("category", c)}
            className={`block mb-2 ${
              category === c ? "font-semibold underline" : "opacity-60"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
 
      <div>
        <p className="mb-3 font-medium opacity-70">Price Range</p>
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => updateParam("minPrice", e.target.value)}
          className="w-full mb-2 bg-transparent border-b border-black/20 dark:border-white/20 outline-none"
        />
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => updateParam("maxPrice", e.target.value)}
          className="w-full bg-transparent border-b border-black/20 dark:border-white/20 outline-none"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
