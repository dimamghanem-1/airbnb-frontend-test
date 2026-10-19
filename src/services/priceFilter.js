// Shared price-range filtering for the property list, based on the
// `cost_per_day` field. Used by the search page; works the same for mock
// data and for API responses (the backend has no price parameters).

// Empty or non-numeric input means "no limit" on that side.
export const parsePriceBound = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const price = Number(value);
    return Number.isNaN(price) ? null : price;
};

export const isValidPriceRange = (minPrice, maxPrice) => {
    const min = parsePriceBound(minPrice);
    const max = parsePriceBound(maxPrice);
    return min === null || max === null || min <= max;
};

// Keeps properties with minPrice <= cost_per_day <= maxPrice (bounds are
// inclusive). An invalid range (min > max) returns the list unfiltered.
export const filterPropertiesByPrice = (properties, minPrice, maxPrice) => {
    if (!isValidPriceRange(minPrice, maxPrice)) return properties;
    const min = parsePriceBound(minPrice);
    const max = parsePriceBound(maxPrice);
    if (min === null && max === null) return properties;
    return properties.filter((property) => {
        const price = Number(property.cost_per_day);
        if (min !== null && price < min) return false;
        if (max !== null && price > max) return false;
        return true;
    });
};
